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
        text: ["colaborador", "data_inicio", "data_fim", "funcao_id",'remuneracao'], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["continuo"], // campos marcaveis
    },
};


function readFields(inputs, prefix) {
    data = {};
    let fields = inputs.text.concat(inputs.select); // Junta os campos de texto e campos de seleção
    
    fields.forEach((field) => {
        val = $("#" + prefix + field).val();
        if (val != "") {
            data[field] = val;
        }
    })
    inputs.check.forEach((check) => {
        data[check] = $("#" + prefix + check).prop("checked");
    })
 
    return data;
}

class Loader {
    constructor() {
        this.object = ""; // nome da tabela do banco de dados
        this.type = ""; // [register, update, view]
        this.prefix = "";
        this.format = ""; // modal, form
        this.inputs = {};
        this.modal = "";
        this.old = undefined;
        this.id = undefined;
    }
    // Inicializa o carregador
    start(type, object, format) {
        if (this.old == this || this.old != undefined) {
            this.old = this
        }
        this.prefix = format.slice(0, 1).concat("_", object, "_");
        this.type = type;
        this.format = format;
        this.object = object;
        this.inputs = objFields[object];
        this.inputs_All = this.inputs.text.concat(this.inputs.select, this.inputs.check);
        this[type]();
    }

    load(id, type, object, format) {
        this.id = id;
        this.start(type, object, format);
    }

    // Registro
    register() {
        this.populateSelect().then(() => {
            if (this.format === "modal") {
                
                const myModal = document.getElementById(this.prefix.slice(0, -1));
                this.modal = new bootstrap.Modal(myModal);
                if (['equipe','funcao'].includes(this.object)) {
                    this.populateTable().then(() => {
                        this.modal.show();
                    });
                
                } else {
                    this.modal.show();
                }
                myModal.addEventListener("hidden.bs.modal", () => {
                });
            }
        });
    }
    addData() {

    }
    update() {
        this.populateData().then(() => {
            const myModal = document.getElementById(this.object);
            this.modal = new bootstrap.Modal(myModal);
            this.modal.show();
            let object = this.object
            let prefix = this.prefix 
            let inputs = this.inputs 
            $('#m_btn-save').click(function(){
                apiRequest.update("update", object, readFields(inputs,prefix));
            })
            myModal.addEventListener("hidden.bs.modal", () => {
                this.load(this.old.id, this.old.type, this.old.object, this.old.format)
            });
        })
    }

    view() {
        this.populateView();
    }

    refresh() {
        if (this.format === "modal") {
            this.populateTable();
        } else if (this.format === "form") {
            $("#table").bootstrapTable("refresh");
        }
    }

    // Funções de população
    async populateSelect() {
        try {
            const selectFields = this.inputs["select"];
            for (let field of selectFields) {
                const response = await apiRequest.get("get_list", "select", field);
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
        try {
            await this.populateSelect();
            const response = await apiRequest.get("get_data", this.object, this.id);
            const data = response[0];

            const textFields = this.inputs.text.concat(this.inputs.select);
            for (let field of textFields) {
                $("#" + this.prefix + field).val(data[field]);
            }

            for (let field of this.inputs.check) {
                $("#" + this.prefix + field).prop("checked", data[field]);
            }
        } catch (error) {
            console.error(error);
        }finally {
            this.inputs_All.forEach((field) => {
                $("#" + this.prefix + field).attr("disabled", false);
            });
        }
    }

    async populateView() {
        try {
            await this.populateSelect();
            const response = await apiRequest.get("get_data", this.object, this.id);
            const data = response[0];
            
            const fields = this.inputs.text.concat(this.inputs.select);
            fields.forEach((field) => {
                $("#" + this.prefix + field).val(data[field]);
            });

            this.inputs.check.forEach((field) => {
                $("#" + this.prefix + field).prop("checked", data[field]);
            });
        } catch (error) {
            console.error(error);
        } finally {
            this.inputs_All.forEach((field) => {
                $("#" + this.prefix + field).attr("disabled", true);
            });
        }
        
    }

    async populateTable() {
        try {
            const response = await apiRequest.get("get_list", "table", this.object);
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

                const thRemove = document.createElement("th");
                thRemove.textContent = "Ações";
                thead.appendChild(thRemove);

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

                    const removeCell = document.createElement("td");
                    const removeButton = document.createElement("img");
                    removeButton.src = "http://10.0.0.211:8001/static/icons/trash.svg";
                    removeButton.classList.add("btn-icon", "bg-danger");

                    removeButton.addEventListener("click", () => {
                        mani.delete(obj.id);
                    });

                    removeCell.appendChild(removeButton);
                    row.appendChild(removeCell);
                    tbody.appendChild(row);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
    
}

