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
            
        ], //campos que pode ser preencher
        select: ["periodo_aquisitivo_id"], // campos selecionavel
        check: [], // campos marcaveis
    },
    ferias_utilizadas: {
        text: [
            "id",
            "colaborador",
            "dias_utilizados",
            "data_inicio",
            
        ], //campos que pode ser preencher
        select: ["periodo_aquisitivo_id",], // campos selecionavel
        check: ["antecipacao_periodo"], // campos marcaveis
    },
    periodo_aquisitivo: {
        text: ['id',"colaborador", "adquirido_em", "periodo"], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: ["consumido"], // campos marcaveis
    },
    ocupacao: {
        text: [
            'id',
            "data_inicio",
            "data_fim",
            "remuneracao",
        ], //campos que pode ser preencher
        select: ["colaborador","funcao_id",], // campos selecionavel
        check: ["continuo"], // campos marcaveis
    },
    dissidio: {
        text: [
            'id',
            "data_inicio",
            "data_fim",
            "remuneracao",
        ], //campos que pode ser preencher
        select: ["colaborador","funcao_id",], // campos selecionavel
        check: ["continuo"], // campos marcaveis
    },
    desligamento:{
        text: [
            'id',
            "data",
            'colaborador',
        ], //campos que pode ser preencher
        select: [], // campos selecionavel
        check: [], // campos marcaveis
    },
    lembrete:{
        text: [
            'id',
            'colaborador',
            "telefone",
        ], //campos que pode ser preencher
        select: ['padrao'], // campos selecionavel
        check: [], // campos marcaveis
    },
    editar_cargo: this.ocupacao
};
var loader
class BaseLoader {
    constructor(object, type) {
        this.object = object; // Nome do objeto (colaborador, equipe, etc.)
        this.type = type; // Tipo do loader (register, view, update, etc...)
        this.prefix = object + "_"; // Prefixo para os campos (modal/form)
        this.inputs = objFields[object]; // Campos associados ao objeto
        this.id = undefined; // ID de registro, se necessário
        loader = this
    }
    open(id = undefined) {
        
        this.id = id;
        
        this[this.type](); // Registra ou atualiza conforme o tipo
    }
    async populateSelect(filtrado = false) {
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
                    opt.value = option.value || option.id
                    opt.text = option.text || opt.value;
                    if (filtrado && opt.value.includes(this.id[0].value)) {
                        selectElement.append(opt);
                    } else if (!filtrado) {
                        selectElement.append(opt);
                    }
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
                if (field != 'id' || disabled){
                    $("#" + this.prefix + field).attr("disabled", disabled);
                }
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
                    console.debug(obj)
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
                        removeButton.src =
                            "/static/icons/trash.svg";
                        removeButton.classList.add("btn-icon", "bg-danger");

                        removeButton.addEventListener("click", () => {
                            Submit.delete(obj.id, loader)
                        });
                    } else {
                        removeButton.src =
                            "/static/icons/pencil-fill.svg";
                        removeButton.classList.add("btn-icon", "bg-primary");

                        removeButton.addEventListener("click", () => {
                            let modal = new Modal(this.object.split('_')[1],'update')
                            modal.open(obj.id)
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
        console.log(this)
    }

    

    register() {
        this.populateSelect().then(() => {
            this.load()
            if (typeof this.id == 'boolean' && this.id){
                this.populateTable("get_list", "table", this.object).then(() => {
                    this.modal.show();
                    
                });
                
            } else {
                this.modal.show();

            }

            let loader = this
            $("#"+ this.prefix + 'submit').off().click(function(){
                Submit.register(loader)
            })
        });
    }

    update() {
        this.populateData().then(() => {
            this.modal.show();
            let loader = this;
            $("#"+ this.prefix + 'submit').off().click(function(){
                Submit.update(loader)
            })
            
        });
        
    }
    
    lanc() {
        this.populateSelect().then(() => {
            this.load()
            this.modal.show();
            $("#"+ this.prefix + 'submit').off().on('click',() => {
                    Submit.funcao(this)
            })
        });
    }
    
    processo() {
        this.populateSelect(true).then(() => {
            this.load()
            this.modal.show();
            $("#"+ this.prefix + 'submit').off().on('click',() =>{
                    Submit.register(this)                
            })
        });
    }

    load(){
        if (this.id != undefined && typeof this.id == "object") {
            this.id.forEach((field) => {
                console.debug(field)
                $("#" + this.prefix + field.key).val(field.value);
            });
        }
    }

    desligamento(){
        let loader = this;
        this.load()
        this.modal.show();
        $("#"+ this.prefix + 'submit').off().click(function(){
            console.debug(loader.id)
            if (prompt('Digite o nome do colaborador para confirmar!!') == $("#m_desligamento_colaborador").val()) {
                Submit.funcao(loader).then(()=>{
                    page.redirect('')
                })
            } else {
                toasts('danger',{'method':'Desligamento','message':'Operação cancelada, tente novamente!'})
            }
        })
    }

    table() {
        this.populateTable("get_data", this.object, this.id).then(() => {
            this.modal.show();
        });
    }

    refresh() {
        this[this.type](); // Registra ou atualiza conforme o tipo
        carregarDados()
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

        $("#"+ this.prefix + 'submit').off().click(function(){
            console.debug(loader)
                Submit.register(loader)
           
        })
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

Submit = {
    readFields: function(loader) {
        let data = {};
        const inputs = loader.inputs 
        const fields = inputs.text.concat(inputs.select); // Junta os campos de texto e campos de seleção

        fields.forEach((field) => {
            val = $("#" + loader.prefix + field).val();
            if (val != "") {
                data[field] = val;
            }
        });
        inputs.check.forEach((check) => {
            data[check] = $("#" + loader.prefix + check).prop("checked");
        });

        return data;
    },
    update: function(loader){
            apiRequest.update('update',loader.object,this.readFields(loader),function(){
                loader.modal.hide();
            })
    },
    register: function(loader){
        try{
            apiRequest.post('register',loader.object,this.readFields(loader),function(){
                loader.refresh()
            })
        } catch {
            throw error
        }
    },
    funcao: function(loader){
        try{apiRequest.post('function',loader.object,this.readFields(loader),function(){
            loader.modal.hide();
            carregarDados()
        })} catch {
            throw error
        }
    },
    delete: function(id, loader){
        apiRequest.delete('delete',loader.object,id,function(){
            loader.refresh()
        
        })
    }
}