const ocupacao = {
text: ["id", "data_inicio", "data_fim", "remuneracao"], //campos que pode ser preencher
select: ["colaborador", "funcao"], // campos selecionavel
check: ["continuo"], // campos marcaveis
}

const objFields = {
    colaborador: {
        text: ["nome", "id", "cpf", "rg", "nascimento", "fone"], //campos que pode ser preencher
        select: ["equipe"], // campos selecionavel
        check: ["ativo"], // campos marcaveis
    },
    funcao: {
        text: ["id"], //campos que pode ser preencher
        select: ["categoria"], // campos selecionavel
        check: ["insalubridade"], // campos marcaveis
    },
    equipe: {
        text: ["id"], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: [], // campos marcaveis
    },
    feriasprocessadas: {
        text: ["id", "dias_processados", "data_inicio"], //campos que pode ser preencher
        select: ["colaborador","periodo_aquisitivo"], // campos selecionavel
        check: ["consumido"], // campos marcaveis
    },
    feriasutilizadas: {
        text: ["id", "dias_utilizados", "data_inicio"], //campos que pode ser preencher
        select: [ "colaborador", "periodo_aquisitivo"], // campos selecionavel
        check: ["antecipacao_periodo","consumido"], // campos marcaveis
    },
    periodo_aquisitivo: {
        text: ["id", "colaborador", "adquirido_em", "periodo"], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["consumido"], // campos marcaveis
    },
    ocupacao: ocupacao,
    ocupacao_dissidio: ocupacao,
    ocupacao_alterar: ocupacao,
    desligamento: {
        text: ["id", "data", "colaborador"], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: [], // campos marcaveis
    },
    lembrete: {
        text: ["id", "colaborador", "telefone"], //campos que pode ser preencher
        select: ["padrao"], // campos selecionavel
        check: [], // campos marcaveis
    },
};
var loader;
class BaseLoader {
    constructor(object, type) {
        this.object = object; // Nome do objeto (colaborador, equipe, etc.)
        this.type = type; // Tipo do loader (register, view, update, etc...)
        this.prefix = object + "_"; // Prefixo para os campos (modal/form)
        this.inputs = objFields[object]; // Campos associados ao objeto
        this.id = undefined; // ID de registro, se necessário
        loader = this;
    }
    open(id = undefined) {
        this.id = id;

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
                    if (this.type == "view") {
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
                    thead.appendChild(th);
                });
                if (this.type != "table") {
                    const thRemove = document.createElement("th");
                    thRemove.textContent = "Ações";
                    thead.appendChild(thRemove);
                }

                response.forEach((obj) => {
                    const row = document.createElement("tr");
                    console.debug(obj);
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
                        }
                        row.appendChild(cell);
                    });
                    const removeCell = document.createElement("td");
                    const removeButton = document.createElement("img");
                    if (this.type != "table") {
                        removeButton.src = "/static/icons/trash.svg";
                        removeButton.classList.add("btn-icon", "bg-danger");

                        removeButton.addEventListener("click", () => {
                            Submit.delete(obj.id, loader);
                        });
                    } else if (this.object != 'historico_periodoaquisitivo'){
                        removeButton.src = "/static/icons/pencil-fill.svg";
                        removeButton.classList.add("btn-icon", "bg-primary");

                        removeButton.addEventListener("click", () => {
                            let modal = new Modal(
                                this.object.split("-")[1],
                                "update"
                            );
                            modal.open(obj.id);
                        });
                    }
                    removeCell.appendChild(removeButton);
                    row.appendChild(removeCell);
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

class Modal extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.modal = ""; // Para armazenar a instância do modal
        this.prefix = "m_" + this.prefix; // Prefixo de modal
        this.myModal = document.getElementById("m_" + this.object);
        this.modal = new bootstrap.Modal(this.myModal);
        console.log(this);
    }

    register() {
        this.populateSelect(apiRequest.get()).then(() => {
            this.load();
            if (typeof this.id == "boolean" && this.id) {
                this.populateTable(this.object).then(() => {
                    this.modal.show();
                });
            } else {
                this.modal.show();
            }

            let loader = this;
            $("#" + this.prefix + "submit")
                .off()
                .click(function () {
                    Submit.register(loader);
                });
        });
    }
    async update() {
        try {
            const data = await apiRequest.get(this.object + "/" + this.id);
            this.populateData(data).then(() => {
                this.modal.show();
                let loader = this;
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

    async lanc() {
        try {
            const data = await apiRequest.get(this.object, {'id':this.id});
            this.populateData(data).then(() => {
                this.modal.show();
                $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        Submit.register(this);
                    });
            });
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    async processo() {
        try {
                apiRequest.get('periodo_aquisitivo', {'colaborador':this.id.colaborador}).then((data)=>{
                    this.populateSelect(data, 'periodo_aquisitivo').then(()=>{
                        $("#" + this.prefix + 'periodo_aquisitivo').val(this.id.periodo_aquisitivo);
                    })
                })
                apiRequest.get('select/colaborador').then((data)=>{
                    this.populateSelect(data, 'colaborador').then(()=>{
                        $("#" + this.prefix + 'colaborador').val(this.id.colaborador);
                    })  
                })
            this.modal.show();

                $("#" + this.prefix + "submit")
                    .off()
                    .on("click", () => {
                        Submit.register(this);
                    });
        } catch (error) {
            console.error("Error ao carregar", error);
        }

    }

    load() {
        if (typeof this.id == "object") {
            this.id.forEach((field) => {
                console.debug(field);
                $("#" + this.prefix + field.key).val(field.value);
            });
        }
    }

    desligamento() {
        let loader = this;
        this.load();
        this.modal.show();
        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                console.debug(loader.id);
                if (
                    prompt("Digite o nome do colaborador para confirmar!!") ==
                    $("#m_desligamento_colaborador").val()
                ) {
                    Submit.funcao(loader).then(() => {
                        page.redirect("");
                    });
                } else {
                    toasts("danger", {
                        method: "Desligamento",
                        message: "Operação cancelada, tente novamente!",
                    });
                }
            });
    }

    async table() {
            try {
                const data = await apiRequest.get(this.object.split('-')[1], {'colaborador': this.id});
                this.populateTable(data).then(() => {
                    this.modal.show();
                });
            } catch (error) {
                console.error("Error ao carregar", error);
            }
        }

    refresh() {
        // this[this.type](); // Registra ou atualiza conforme o tipo
        carregarDados();
    }
}

class Form extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "f_" + this.prefix; // Prefixo de modal
    }

    // Inicializa o carregador

    // Registro
    register() {
        let loader = this;

        $("#" + this.prefix + "submit")
            .off()
            .click(function () {
                Submit.register(loader);
            });
        this.inputs.select.forEach((field) =>{
            apiRequest.get(`select/${field}`).then((data)=>{
                this.populateSelect(data,field);
            })
        })
    }

    update() {
        this.populateData();
    }

    async view() {
        try {
            const data = await apiRequest.get(this.object + "/" + this.id);
            this.populateData(data);
        } catch (error) {
            console.error("Error ao carregar", error);
        }
    }

    refresh() {
        $("#table").bootstrapTable("refresh");
        carregarDados();
    }

    async filter(filtro) {
        try {
            const data = await apiRequest.get(this.object, filtro);
            this.populateData(data[0]);
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
        apiRequest.update(
            `${loader.object}/${loader.id}`,
            this.readFields(loader),
            function () {
                loader.modal.hide();
                loader.refresh();

            }
        );
    },
    register: function (loader) {
        try {
            apiRequest.post(loader.object, this.readFields(loader), function () {
                loader.refresh();
            });
        } catch {
            throw "error";
        }
    },
    funcao: function (loader) {
        try {
            apiRequest.post(
                "function",
                loader.object,
                this.readFields(loader),
                function () {
                    loader.modal.hide();
                    loader.refresh();

                }
            );
        } catch {
            throw error;
        }
    },
    delete: function (loader) {
        apiRequest.delete(loader.object + "/" + loader.id, ()=>{
            loader.modal.hide();
            loader.refresh()
        });
    },
};
