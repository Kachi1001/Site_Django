var loader;
var loading_modal
class BaseLoader {
    constructor(object, type) {
        this.last = loader;
        this.object = object; // Nome do objeto (colaborador, equipe, etc.)
        this.type = type; // Tipo do loader (post, view, update, etc...)
        this.prefix = object + "_"; // Prefixo para os campos (modal/form)
        this.id = undefined; // ID de registro, se necessário
    }
    async open(id = undefined) {
        this.id = id;
        try {
            this.inputs = await apiRequest.get(`resource/${this.object}`);
        } catch (error) {
            console.log(error);
        }
        loader = this;
        return new Promise((resolve, reject) => {
            this[this.type]().then(() => {
                if (this.modal) {
                    this.modal.show();
                    loading_modal.hide()
                }
                resolve();
            });
        });
    }
    async populateSelect(data = [], field = "") {
        try {
            const selectElement = $("#" + this.prefix + field);
            selectElement.empty();
            data.forEach((option) => {
                let opt = document.createElement("option");
                opt.value = option.value || option.id;
                opt.text = option.text || opt.value;
                selectElement.append(opt);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async populateData(data = []) {
        try {
            this.inputs.text.forEach((field) => {
                $("#" + this.prefix + field).val(data[field]);
            });
            this.inputs.select.forEach(async (field) => {
                const selects = await apiRequest.get(`select/${field}`);
                this.populateSelect(selects, field);
                $("#" + this.prefix + field).val(data[field]);
            });

            this.inputs.check.forEach((field) => {
                $("#" + this.prefix + field).prop("checked", data[field]);
            });
        } catch (error) {
            throw error;
        } finally {
            this.inputs.text
                .concat(this.inputs.check, this.inputs.select)
                .forEach((field) => {
                    if (this.type == "view" || this.type == "filter") {
                        $("#" + this.prefix + field).attr("disabled", true);
                    }
                });
        }
    }

    async populateTable(
        response = [{ Tabelas: "Sem registro" }],
        feature = undefined,
        not = []
    ) {
        try {
            if (response.length == 0) {
                response = [{ Tabela: "Sem registro" }];
                feature = undefined;
            }
            const tabela = document.getElementById(this.prefix + "table");
            console.log(tabela);
            const thead = tabela.querySelector("thead tr");
            thead.innerHTML = "";
            const tbody = tabela.querySelector("tbody");
            tbody.innerHTML = "";
            var keys = Object.keys(response[0]);
            not.forEach((key) => {
                let index = keys.indexOf(key);
                if (index > -1) {
                    keys.splice(index, 1);
                }
            });
            keys.forEach((key) => {
                const th = document.createElement("th");
                th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                th.textContent = th.textContent.replace("_", " ");
                thead.appendChild(th);
            });
            if (feature) {
                const thExtra = document.createElement("th");
                thExtra.textContent = "Ações";
                thead.appendChild(thExtra);
            }

            response.forEach((obj) => {
                const row = document.createElement("tr");
                keys.forEach((key) => {
                    const cell = document.createElement("td");
                    if (typeof obj[key] === "boolean") {
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.disabled = true;
                        checkbox.checked = obj[key];
                        cell.appendChild(checkbox);
                    } else {
                        cell.textContent = obj[key];
                        if (isValidDate(obj[key])) {
                            const data = new Date(obj[key]);
                            cell.textContent = data.toLocaleDateString(
                                "pt-BR",
                                { timeZone: "UTC" }
                            );
                        }
                    }
                    row.appendChild(cell);
                });
                if (feature) {
                    const extraBtn = document.createElement("td");
                    extraBtn.classList.add("d-inline-flex", "col-12");
                    if (feature.includes("delete")) {
                        const removeButton = document.createElement("i");
                        removeButton.classList.add(
                            "btn-icon",
                            "bg-danger",
                            "bi-trash3",
                            "me-1"
                        );

                        removeButton.addEventListener("click", () => {
                            loader.id = obj.id;
                            Submit.delete(loader);
                        });
                        extraBtn.appendChild(removeButton);
                    }
                    if (feature.includes("edit")) {
                        const editBtn = document.createElement("i");
                        editBtn.classList.add(
                            "btn-icon",
                            "bg-primary",
                            "bi-pencil",
                            "me-1"
                        );

                        editBtn.addEventListener("click", () => {
                            this.modal.hide();
                            let modal = new Modal(this.object, "update");
                            modal.open(obj.id);
                        });
                        extraBtn.appendChild(editBtn);
                    }
                    if (feature.includes("view_ficha")) {
                        const editBtn = document.createElement("i");
                        editBtn.classList.add(
                            "btn-icon",
                            "bg-success",
                            "bi-file-earmark",
                            "me-1"
                        );

                        editBtn.addEventListener("click", () => {
                            this.modal.hide();
                            let modal = new Modal("ficha", "ficha");
                            modal.open(obj.id);
                        });
                        extraBtn.appendChild(editBtn);
                    }

                    row.appendChild(extraBtn);
                }
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error("Error ao criar tabela", error);
            throw error;
        }
    }
    async set(field, value, locked = false) {
        const html = $("#" + this.prefix + field);
        html.val(value);
        html.attr("disabled", locked);
    }
}
var modal_open;
class Modal extends BaseLoader {
    constructor(object, type) {
        loading_modal = new bootstrap.Modal('#carregando')
        loading_modal.show()
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "m_" + this.type + "-" + this.prefix; // Prefixo de modal
        this.myModal = document.getElementById(this.prefix.slice(0, -1));
        this.modal = new bootstrap.Modal(this.myModal);
        this.refresh;
        this.loader = loader;
    }

    async register() {
        this.inputs.select.forEach(async (select) => {
            const data = await apiRequest.get(`select/${select}`);
            this.populateSelect(data, select);
        });
        const table = await apiRequest.get(this.object);
        let feature = ["delete", "edit"];
        if (
            this.object == "ficha" ||
            this.object == "ficha_padrao" ||
            this.object == "erros"
        ) {
            feature = "delete";
        }
        this.populateTable(table, feature, ["id"]).then(() => {
            this.modal.show();
        });
        if (this.object in Pos_load) {
            Pos_load[this.object](loader);
        }

        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                if (loader.refresh == undefined) {
                    loader.refresh = async () => {
                        const table = await apiRequest.get(loader.object);
                        loader.populateTable(table, "delete", ["id"]);
                    };
                }
                Submit.post(loader);
            });
    }
    async update() {
        try {
            const data = await apiRequest.get(this.object + "/" + this.id);
            this.populateData(data).then(() => {
                if (
                    this.last.modal &&
                    this.last.object == this.object &&
                    this.last.type == "register"
                ) {
                    loader.myModal.addEventListener(
                        "hidden.bs.modal",
                        (event) => {
                            loader.modal.dispose();
                            const candidato = page.getParam("id");
                            let registro = new Modal(
                                loader.last.object,
                                this.last.type
                            );
                            registro.refresh = () => {
                                registro.open(candidato);
                            };
                            registro.open(candidato);
                            $("#" + registro.prefix + "candidato").val(
                                candidato
                            );
                        }
                    );
                }
                if (this.object in Pos_load) {
                    Pos_load[this.object](loader);
                }
                $("#" + this.prefix + "submit")
                    .off()
                    .click(function () {
                        Submit.update(loader);
                    });
                $("#" + this.prefix + "del")
                    .off()
                    .click(function () {
                        Submit.delete(loader);
                    });
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }
    async view() {
        const data = this.id;
        const imagem = document.getElementById(this.prefix + "imagem");
        const pdf = document.getElementById(this.prefix + "pdf");

        if (data.tipo == "pdf") {
            pdf.src = data.url;
            pdf.style.display = "block";
            imagem.style.display = "none";
        } else {
            imagem.src = data.url;
            imagem.style.display = "block";
            pdf.style.display = "none";
        }
        if (this.last != undefined && this.last.type == "historico") {
            loader.myModal.addEventListener("hidden.bs.modal", (event) => {
                loader.modal.dispose();
                let obj = new Modal(this.last.object, "historico");
                apiRequest
                    .get(this.last.object, {
                        colaborador: page.getParam("id"),
                    })
                    .then((data) => {
                        obj.open(data);
                    });
            });
        }
        this.modal.show();
    }
    async import() {
        const file = document.getElementById(this.prefix + "file");

        $("#" + this.prefix + "submit")
        .off()
        .on("click", () => {
            const data = new FormData();
            data.append("file", file.files[0]);
            data.append('user', user)
            apiRequest.upload(this.object + '_' + this.type, data).then(this.refresh)
        });
    }
}

class Form extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "f_" + this.prefix; // Prefixo de modal
    }
    // Registro
    async register() {
        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                Submit.post(loader);
            });
        this.inputs.select.forEach((field) => {
            apiRequest.get(`select/${field}`).then((data) => {
                this.populateSelect(data, field);
            });
        });
    }

    async view() {
        try {
            apiRequest.get(this.object + "/" + this.id).then((data) => {
                this.populateData(data);
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    async refresh() {
        $("#table").bootstrapTable("refresh");
        carregarDados();
    }

    async files() {
        try {
            const data = await apiRequest.get(this.object, {
                candidato: this.id,
            });
            console.log(data);
            const list = document.getElementById(this.prefix + "list");
            list.innerHTML = "";
            data.forEach((data) => {
                list.innerHTML += `<div class="card text-center mb-3 me-3 p-0" style="width: 150px;" onclick="abrirFile('${
                    data.id
                }')">
        <div class="card-body">
        ${
            data["tipo"] == "jpeg"
                ? '<i class="bi bi-filetype-jpg fs-1"></i>'
                : '<i class="bi bi-filetype-pdf fs-1"></i>'
        }
        </div>
        <div class="card-footer">
            <p class="mb-0">${data.nome.toUpperCase()}</p>
        </div>
    </div>`;
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }
}
Pos_load = {
    ficha: (loader) => {
        const colaborador = $("#" + loader.prefix + "colaborador");
        const pagina = $("#" + loader.prefix + "pagina");

        colaborador.on("change", getFicha);
        getFicha();
        const mudar = $("#" + loader.prefix + "mudar");
        mudar.off().on("click", () => {
            if (pagina.attr("disabled")) {
                if (
                    confirm(
                        "Não garantimos funcionalidade total ao alterar manualmente"
                    )
                ) {
                    pagina.attr("disabled", !pagina.attr("disabled"));
                    mudar.text("Deixar automático");
                }
            } else {
                pagina.attr("disabled", !pagina.attr("disabled"));
                mudar.text("Alterar manualmente");
                getFicha();
            }
        });
    },
};
Submit = {
    update: function (loader) {
        apiRequest
            .update(`${loader.object}/${loader.id}`, generic.readFields(loader))
            .then(() => {
                loader.modal.hide();
                loader.refresh();
            });
    },
    post: function (loader) {
        try {
            apiRequest.post(loader.object, generic.readFields(loader)).then(() => {
                loader.refresh();
            });
        } catch (error) {
            throw error;
        }
    },
    delete: function (loader) {
        console.log(loader);
        apiRequest
            .delete(loader.object + "/" + loader.id, generic.readFields(loader))
            .then(() => {
                loader.modal.hide();
                loader.refresh();
            });
    },
};
$(document).ready(() => {
    try {
        load();
    } catch (error) {
        console.log("Tela sem inicializador", error);
    }
});

modal = {
    open: function (type, object, id) {
        const obj = new Modal(object, type);
        obj.open(id);
    },
};
function abrir_site(ca) {
    page.new(`https://consultaca.com/${ca}`);
}
