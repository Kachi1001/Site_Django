var loader;
var colab_ativo
class BaseLoader {
    constructor(object, type) {
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

    async populateTable(response) {
        try {
            const tabela = document.getElementById(this.prefix + "table");
            const thead = tabela.querySelector("thead tr");
            thead.innerHTML = "";
            const tbody = tabela.querySelector("tbody");
            tbody.innerHTML = "";
            if (response.length > 0) {
                const keys = Object.keys(response[0]);

                keys.forEach((key) => {
                    const th = document.createElement("th");
                    th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                    th.textContent = th.textContent.replace("_", " ");
                    thead.appendChild(th);
                });

                const thExtra = document.createElement("th");
                thExtra.textContent = "Ações";
                thead.appendChild(thExtra);

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
                            if (this.object == "funcao") {     
                                checkbox.disabled = false;
                                checkbox.addEventListener("click", () => {
                                    obj[key] = !obj[key]
                                    apiRequest.update(this.object + "/" + obj.id, obj).then(() =>{
                                        this.refresh();
                                    })
                                });
                            }
                        } else {
                            
                            cell.textContent = obj[key];
                            if (isValidDate(obj[key])) {
                                const data = new Date(obj[key]);
                                cell.textContent =
                                    data.toLocaleDateString("pt-BR", { timeZone: "UTC" });

                            }
                        }
                        row.appendChild(cell);
                    });

                    const extraBtn = document.createElement("td");
                    extraBtn.classList.add("d-inline-flex", "col-12");
                    if (this.type != "historico") {
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
                    if (
                        this.object != "periodo_aquisitivo" &&
                        this.object != "funcao" &&
                        this.object != "equipe" &&
                        this.object != "feriado" &&
                        this.object != "tipoavaliacao" &&
                        //this.object != "integracao_nr_tipo" &&
                        this.object != "insalubridade" &&
                        colab_ativo != false
                    ) {
                        const editBtn = document.createElement("i");
                        editBtn.classList.add(
                            "btn-icon",
                            "bg-primary",
                            "bi-pencil",
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
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            throw error;
        }
    }
    async set(field, value, locked = false) {
        const html = $("#" + this.prefix + field);
        print(html)
        html.val(value);
        html.attr("disabled", locked);
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
        this.populateTable(table).then(() => {
            this.modal.show();
        });

        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
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
            const data = await apiRequest.get(this.object, { id: this.id });
            this.populateData(data[0]).then(() => {
                this.modal.show();
                $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        this.object = this.object + "_" + this.type;
                        Submit.post(this);
                    });
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }
    async dissidio() {
        this.lanc();
    }
    async alterar() {
        this.lanc();
    }
    async lancamento() {
        this.inputs.select.forEach(async (field) => {
            const selects = await apiRequest.get(`select/${field}`);
            this.populateSelect(selects, field);
        });
        this.modal.show();
        $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        this.object = this.object;
                        Submit.post(this);
                    });
    }
    async processo() {
        try {
            apiRequest
                .get("periodo_aquisitivo", { colaborador: this.id.colaborador })
                .then((data) => {
                    this.populateSelect(data, "periodo_aquisitivo").then(() => {
                        $("#" + this.prefix + "periodo_aquisitivo").val(
                            this.id.periodo_aquisitivo
                        );
                    });
                });
            apiRequest.get("select/colaborador").then((data) => {
                this.populateSelect(data, "colaborador").then(() => {
                    $("#" + this.prefix + "colaborador").val(
                        this.id.colaborador
                    );
                });
            });
            this.modal.show();

            $("#" + this.prefix + "submit")
                .off()
                .on("click", () => {
                    Submit.post(this);
                });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    load() {
        if (typeof this.id == "object") {
            this.id.forEach((field) => {
                $("#" + this.prefix + field.key).val(field.value);
            });
        }
    }

    desligamento() {
        this.load();
        this.modal.show();
        let loader = this;
        this.id = this.id[0].value;
        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                if (
                    prompt("Digite o ID do colaborador para confirmar!!") ==
                    $("#m_desligamento-colaborador_colaborador").val()
                ) {
                    loader.refresh = function () {
                        page.redirect("");
                    };

                    apiRequest
                        .delete(loader.object + "/" + loader.id, { data: "" })
                        .then(() => {
                            loader.modal.hide();
                            loader.refresh();
                        });
                } else {
                    toasts("danger", {
                        method: "Desligamento",
                        message: "Operação cancelada, tente novamente!",
                    });
                }
            });
    }

    async historico() {
        try {
            const data = await apiRequest.get(this.object, {
                colaborador: this.id,
            });
            this.populateTable(data).then(() => {
                this.modal.show();
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    async import() {
        $("#" + this.prefix + "submit")
            .off()
            .on("click", () => {
                Submit.upload(this);
            });
    }
    async func() {
        if (this.inputs.select) {
            this.inputs.select.forEach(async (field) => {
                const selects = await apiRequest.get(`select/${field}`);
                this.populateSelect(selects, field);
            });
        }
        $("#" + this.prefix + "submit")
            .off()
            .on("click", () => {
                Submit.post(this);
            });
    }

    refresh() {
        // page.refresh();
        this.modal.hide();
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

    async filter() {
        try {
            const data = await apiRequest.get(this.object, this.id);
            this.populateData(data[0]);
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }
}

Submit = {
    readFields: function (loader) {
        console.log(loader);
        let data = {};
        const inputs = loader.inputs;
        const fields = inputs.text.concat(inputs.select); // Junta os campos de texto e campos de seleção

        fields.forEach((field) => {
            val = $("#" + loader.prefix + field).val();

            data[field] = val || null;
        });
        inputs.check.forEach((check) => {
            data[check] = $("#" + loader.prefix + check).prop("checked") || false;
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
            .delete(loader.object + "/" + loader.id, this.readFields(loader))
            .then(() => {
                loader.modal.hide();
                loader.refresh();
            });
    },  
    upload: function (loader) {
        console.log(loader);
        const file = $('#' + loader.prefix + 'file')[0].files[0]
        const formData = new FormData();
        formData.append('file',file)
        apiRequest.upload(loader.object +'_'+ loader.type , formData).then(() =>{
            loader.modal.hide()
            loader.refresh()
        })
    }
};
$(document).ready(async () => {
    try {
        load();
    } catch {
        console.log("Tela sem inicializador");
    }
});
