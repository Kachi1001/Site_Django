apiRequest.app = "TI/";

const objFields = {
    colaborador: {
        text: ["id", "cpf", "rg", "nascimento", "telefone"], //campos que pode ser preencher
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
    ferias_processadas: {
        text: [
            "id",
            "colaborador",
            "dias_processados",
            "data_inicio",
            "periodo_aquisitivo_id",
        ], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: [], // campos marcaveis
    },
    ferias_utilizadas: {
        text: [
            "id",
            "colaborador",
            "dias_utilizados",
            "data_inicio",
            "periodo_aquisitivo",
        ], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["antecipacao_periodo"], // campos marcaveis
    },
    periodo_aquisitivo: {
        text: ["colaborador", "adquirido_em", "periodo"], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["consumido"], // campos marcaveis
    },
    ocupacao: {
        text: [
            "colaborador",
            "data_inicio",
            "data_fim",
            "funcao_id",
            "remuneracao",
        ], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["continuo"], // campos marcaveis
    },
};

class BaseLoader {
    constructor(object, type) {
        this.object = object; // Nome do objeto (colaborador, equipe, etc.)
        this.type = type; // Tipo do loader (register, view, update, etc...)
        this.prefix = object + "_"; // Prefixo para os campos (modal/form)
        this.inputs = objFields[object]; // Campos associados ao objeto
        this.id = undefined; // ID de registro, se necessário
    }

    async populateSelect() {
        try {
            const selectFields = this.inputs["select"];
            for (let field of selectFields) {
                const response = await apiRequest.get(
                    "get_list",
                    "select",
                    field
                );
                const selectElement = $("#" + this.prefix + field);
                selectElement.empty();

                response.forEach((option) => {
                    let opt = document.createElement("option");
                    opt.value = option.value;
                    opt.text = option.text || option.value;
                    selectElement.append(opt);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async populateData() {
        const textFields = this.inputs.text.concat(this.inputs.select);
        try {
            await this.populateSelect();
            const response = await apiRequest.get(
                "get_data",
                this.object,
                this.id
            );
            const data = response[0];

            textFields.forEach((field) => {
                $("#" + this.prefix + field).val(data[field]);
            });
            this.inputs.check.forEach((field) => {
                $("#" + this.prefix + field).prop("checked", data[field]);
            });
        } catch (error) {
            throw error;
        } finally {
            let disabled = this.type == "view";
            textFields.concat(this.inputs.check).forEach((field) => {
                $("#" + this.prefix + field).attr("disabled", disabled);
            });
        }
    }

    async populateTable(endpoint, metodo, parametro) {
        try {
            const response = await apiRequest.get(endpoint, metodo, parametro);
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
                    if (this.type != "table") {
                        const removeCell = document.createElement("td");
                        const removeButton = document.createElement("img");
                        removeButton.src =
                            "http://10.0.0.211:8001/static/icons/trash.svg";
                        removeButton.classList.add("btn-icon", "bg-danger");

                        removeButton.addEventListener("click", () => {
                            mani.delete(obj.id);
                        });

                        removeCell.appendChild(removeButton);
                        row.appendChild(removeCell);
                    }
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            throw error;
        }
    }
    async readFields() {
        data = {};
        let fields = this.inputs.text.concat(this.inputs.select); // Junta os campos de texto e campos de seleção

        fields.forEach((field) => {
            val = $("#" + this.prefix + field).val();
            if (val != "") {
                data[field] = val;
            }
        });
        this.inputs.check.forEach((check) => {
            data[check] = $("#" + this.prefix + check).prop("checked");
        });

        return data;
    }
}

class Modal extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.modal = ""; // Para armazenar a instância do modal
        this.prefix = "m_" + this.prefix; // Prefixo de modal

        this.myModal = document.getElementById("m_" + this.object);
        this.modal = new bootstrap.Modal(this.myModal);
    }

    open(id = undefined) {
        this.id = id;

        this[this.type](); // Registra ou atualiza conforme o tipo
    }

    register() {
        this.populateSelect().then(() => {
            this.populateTable("get_list", "table", this.object).then(() => {
                this.modal.show();
            });
        });
    }

    update() {
        this.populateData().then(() => {
            this.modal.show();
        });
    }

    lanc(data = undefined) {
        this.populateSelect().then(() => {
            if (data !== undefined && data === "object") {
                data.forEach((field) => {
                    $("#" + this.prefix + field.key).val(field.value);
                });
            }
        });
    }
    table() {
        this.populateTable("get_data", this.object, this.id).then(() => {
            this.modal.show();
        });
    }
    submit() {
        if (this.type == 'update'){
            apiRequest.update()
        }
    }
}

class Form extends BaseLoader {
    constructor(object, type) {
        super(object, type); // Chama o construtor da classe DataManager
        this.prefix = "f_" + this.prefix; // Prefixo de modal
    }
    // Inicializa o carregador
    open(id = undefined) {
        this.id = id;

        this[this.type](); // Registra ou atualiza conforme o tipo
    }

    // Registro
    register() {
        this.populateSelect();
    }

    update() {
        this.populateData();
    }

    view() {
        this.populateData();
    }

    refresh() {
        $("#table").bootstrapTable("refresh");
    }
}
