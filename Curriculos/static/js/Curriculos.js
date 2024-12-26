const ocupacao = {
    text: ["id", "data_inicio", "data_fim", "remuneracao"], //campos que pode ser preencher
    select: ["equipe", "colaborador", "funcao"], // campos selecionavel
    check: ["continuo"], // campos marcaveis
};

const colaborador = {
    text: [
        "nome",
        "id",
        "cpf",
        "rg",
        "nascimento",
        "fone",
        "avaliacao_descricao",
    ], //campos que pode ser preencher
    select: ["avaliacao"], // campos selecionavel
    check: ["ativo", "avaliacao_recontratar"], // campos marcaveis
};

var loader;

class BaseLoader {
    constructor(object, type) {
        this.object = object; // Nome do objeto (colaborador, equipe, etc.)
        this.type = type; // Tipo do loader (post, view, update, etc...)
        this.prefix = object + "_"; // Prefixo para os campos (modal/form)
        this.id = undefined; // ID de registro, se necessário
    }
    async open(id = undefined) {
        this.id = id;
        this.inputs = await apiRequest.get(`resource/${this.object}`);
        loader = this;

        this[this.type](); // Registra ou atualiza conforme o tipo
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

    async populateTable(response, feature = undefined, not = []) {
        try {
            const tabela = document.getElementById(this.prefix + "table");
            console.log(tabela);
            const thead = tabela.querySelector("thead tr");
            thead.innerHTML = "";
            const tbody = tabela.querySelector("tbody");
            tbody.innerHTML = "";
            if (response.length > 0) {
                var keys = Object.keys(response[0]);
                console.log(keys);
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
                            if (cell.textContent.includes("-")) {
                                let data = cell.textContent.split("-");
                                cell.textContent = `${data[2]}/${data[1]}/${data[0]}`;
                            }
                        }
                        row.appendChild(cell);
                    });
                    if (feature) {
                        const extraBtn = document.createElement("td");
                        if (feature.includes("delete")) {
                            const removeButton = document.createElement("i");
                            removeButton.classList.add(
                                "btn-icon",
                                "bg-danger",
                                "bi-trash3",
                                "fs-6",
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
                                "fs-6",
                                "me-1"
                            );

                            editBtn.addEventListener("click", () => {
                                let modal = new Modal(this.object, "update");
                                modal.refresh = this.refresh;
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
}
var modal_open;
class Modal extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "m_" + this.type + "-" + this.prefix; // Prefixo de modal
        this.myModal = document.getElementById(this.prefix.slice(0, -1));
        console.log(this.prefix.slice(0, -1));
        this.modal = new bootstrap.Modal(this.myModal);
        this.loader = loader;
    }

    async register() {
        this.inputs.select.forEach(async (select) => {
            const data = await apiRequest.get(`select/${select}`);
            this.populateSelect(data, select);
        });
        const table = await apiRequest.get(this.object);
        this.populateTable(table, "delete", ["id"]).then(() => {
            this.modal.show();
        });

        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                loader.refresh = async () => {
                    const table = await apiRequest.get(loader.object);
                    loader.populateTable(table, undefined, ["id"]);
                };
                Submit.post(loader);
            });
    }
    async update() {
        try {
            const data = await apiRequest.get(this.object + "/" + this.id);
            this.populateData(data).then(() => {
                this.modal.show();

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
            this.populateTable(data, "delete", ["id", "candidato"]).then(() => {
                this.inputs.select.forEach(async (select) => {
                    const data = await apiRequest.get(`select/${select}`);
                    this.populateSelect(data, select);
                });
                this.modal.show();
                $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        Submit.post(this);
                    });
            });
            1;
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
            this.modal.show();

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
                console.log(filename);
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
                    let fields = Submit.readFields(loader);
                    Object.keys(fields).forEach((key) => {
                        data.append(key, fields[key]);
                    });
                    console.log(data);
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
                    apiRequest
                        .delete("anexos/"+data.id)
                        .then(this.refresh)
                });
        this.modal.show();
    }

    load() {
        if (typeof this.id == "object") {
            this.id.forEach((field) => {
                $("#" + this.prefix + field.key).val(field.value);
            });
        }
    }

    refresh() {
        // page.refresh();
    }
}

class Form extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "f_" + this.prefix; // Prefixo de modal
    }
    // Registro
    register() {
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

    refresh() {
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

Submit = {
    readFields: function (loader) {
        let data = {};
        const inputs = loader.inputs;
        const fields = inputs.text.concat(inputs.select); // Junta os campos de texto e campos de seleção

        fields.forEach((field) => {
            val = $("#" + loader.prefix + field).val();

            data[field] = val || null;
        });
        inputs.check.forEach((check) => {
            data[check] = $("#" + loader.prefix + check).prop("checked");
        });

        return data;
    },
    update: function (loader) {
        apiRequest
            .update(`${loader.object}/${loader.id}`, this.readFields(loader))
            .then(() => {
                loader.modal.hide();
                loader.refresh();
            });
    },
    post: function (loader) {
        try {
            apiRequest.post(loader.object, this.readFields(loader)).then(() => {
                loader.refresh();
            });
        } catch (error) {
            throw error;
        }
    },
    delete: function (loader) {
        console.log(loader);
        apiRequest
            .delete(loader.object + "/" + loader.id, this.readFields(loader))
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