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
        this.inputs = await apiRequest.get(`resource/${this.object}`);
        loader = this;
        return new Promise((resolve, reject) => {
            this[this.type]().then(() => {
                if (this.modal) {
                    try {
                        customActions[this.type][this.object](this).then(() => {
                            this.modal.show();
                            loading_modal.hide()
                        });
                    } catch {
                        this.modal.show();
                        loading_modal.hide()
                    }
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
            const tabela = document.getElementById(this.prefix + "table");
            const thead = tabela.querySelector("thead tr");
            thead.innerHTML = "";
            const tbody = tabela.querySelector("tbody");
            tbody.innerHTML = "";
            if (response.length > 0) {
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
                    th.textContent = th.textContent
                        .replaceAll("_", " ")
                        .replaceAll("cao", "ção");
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
                                
                            removeButton.title = 'Deletar'
                            removeButton.addEventListener("click", () => {
                                loader.id = obj.id;
                                loader.refresh = () =>{$('#table').bootstrapTable('refresh')}
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
                            editBtn.title = 'Editar'
                            editBtn.addEventListener("click", () => {
                                this.modal.hide();
                                let modal = new Modal(this.object, "update");
                                modal.open(obj.id);
                            });
                            extraBtn.appendChild(editBtn);
                        }
                       

                        row.appendChild(extraBtn);
                    }
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error ao criar tabela", error);
            throw error;
        }
    }
    async set(field, value, locked = false) {
        const html = $("#" + this.prefix + field);
        print(value)
        html.val(value);
        html.attr("disabled", locked);
    }
}
var modal_open;
class Modal extends BaseLoader {
    constructor(object, type) {
        loading_modal = new bootstrap.Modal('#carregando')
        loading_modal.show()
        super(object, type);
        this.prefix = "m_" + this.type + "-" + this.prefix; // Prefixo de modal
        this.myModal = document.getElementById(this.prefix.slice(0, -1));
        console.log(this);
        this.modal = new bootstrap.Modal(this.myModal);
        loader = this;
        this.loader = loader;
    }

    async register() {
        this.inputs.select.forEach(async (select) => {
            const data = await apiRequest.get(`select/${select}`);
            this.populateSelect(data, select);
        });
        const table = await apiRequest.get(this.object);

        this.populateTable(table, ["delete"], ["id"]);
        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                loader.refresh = async () => {
                    const table = await apiRequest.get(loader.object);
                    loader.populateTable(table, "delete", ["id"]);
                };
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
                    this.last.type == "lanc"
                ) {
                    loader.myModal.addEventListener(
                        "hidden.bs.modal",
                        (event) => {
                            loader.modal.dispose();
                            const candidato = page.getParam("id");
                            let registro = new Modal(
                                loader.last.object,
                                "lanc"
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

                $("#" + this.prefix + "save")
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

    async lanc() {
        try {
            const data = await apiRequest.get(this.object, {
                candidato: this.id,
            });
            var feature = ["delete"];
            if (this.object == "experiencia" || this.object == "escolaridade") {
                feature.push("edit");
            }
            this.populateTable(data, feature, ["id", "candidato"]).then(() => {
                this.inputs.select.forEach(async (select) => {
                    const data = await apiRequest.get(`select/${select}`);
                    this.populateSelect(data, select);
                });
                $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        Submit.post(this);
                    });
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    async envio() {
        try {
            this.inputs.select.forEach(async (select) => {
                const data = await apiRequest.get(`select/${select}`);
                this.populateSelect(data, select);
            });

            const file = document.getElementById(this.prefix + "arquivo");

            const imagem = document.getElementById(
                this.prefix + "preview_imagem"
            );
            const pdf = document.getElementById(this.prefix + "preview_pdf");
            $("#" + this.prefix + "arquivo").change(function () {
                let reader = new FileReader();
                var filename = file.value
                    .replace("C:\\fakepath\\", "")
                    .split(".");
                reader.onload = () => {
                    if (filename[filename.length - 1] == "pdf") {
                        pdf.src = reader.result;
                        pdf.style.display = "block";
                        imagem.style.display = "none";
                    } else {
                        imagem.src = reader.result;
                        imagem.style.display = "block";
                        pdf.style.display = "none";
                    }
                };
                reader.readAsDataURL(file.files[0]);
            });
            $("#" + this.prefix + "submit")
                .off()
                .on("click", () => {
                    const data = new FormData();
                    data.append("file", file.files[0]);
                    let fields = generic.readFields(loader);
                    Object.keys(fields).forEach((key) => {
                        data.append(key, fields[key]);
                    });
                    apiRequest
                        .upload("anexos", data)
                        .then(this.refresh)
                        .then(() => {
                            document.getElementById(
                                this.prefix + "nome"
                            ).value = "";
                            document.getElementById(
                                this.prefix + "arquivo"
                            ).value = "";
                            pdf.style.display = "none";
                            imagem.style.display = "none";
                        });
                });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    async file_view() {
        const data = await apiRequest.get("anexos/" + this.id);
        const imagem = document.getElementById(this.prefix + "preview_imagem");
        const pdf = document.getElementById(this.prefix + "preview_pdf");
        $("#" + this.prefix + "nome").text(data.nome);

        if (data.tipo == "pdf") {
            pdf.src = data.link;
            pdf.style.display = "block";
            imagem.style.display = "none";
        } else {
            imagem.src = data.link;
            imagem.style.display = "block";
            pdf.style.display = "none";
        }
        $("#" + this.prefix + "delete")
            .off()
            .on("click", () => {
                apiRequest.delete("anexos/" + data.id).then(this.refresh);
            });
    }

    load() {
        if (typeof this.id == "object") {
            this.id.forEach((field) => {
                $("#" + this.prefix + field.key).val(field.value);
            });
        }
    }

    refresh() {
        this.modal.toggle();
        // page.refresh();
    }
}
const customActions = {
    register: {
        area_atuacao_sub: async function (loader) {
            console.log(loader);
            $("#" + loader.prefix + "area_atuacao").change(async function () {
                const data = await apiRequest.get("area_atuacao_sub", {
                    area_atuacao: this.value,
                });
                loader.populateTable(data, ["delete"], ["id"]);
            });
        },
    },
    lanc: {
        experiencia: async function (loader) {
            setTimeout(() => {
                chance_area(loader.prefix, 1);
            }, 300);
        },
    },
    update: {
        experiencia: async function (loader) {
            setTimeout(() => {
                chance_area(loader.prefix);
            }, 400);
        },
        candidato: async function (loader) {
            setTimeout(() => {
                chance_area(loader.prefix)
            }, 300);
        },
    },
};
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
async function chance_area(
    prefix,
    area = $("#" + prefix + "area_atuacao").val()
) {
    value = $("#" + prefix + "area_atuacao_sub").val()
    apiRequest
        .get("area_atuacao_sub", {
            area_atuacao: area,
        })
        .then((data) => {
            let select = document.getElementById(prefix + "area_atuacao_sub");
            select.innerHTML = "";
            data.forEach((sub_area) => {
                let option = document.createElement("option");
                option.value = sub_area.id;
                option.innerHTML = sub_area.sub_area;
                select.appendChild(option);
            });
            select.disabled = false;
            $("#" + prefix + "area_atuacao_sub").val(value) 
        });
}
