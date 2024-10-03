apiRequest.app = "TI/";

const objFields = {
    maquina: {
        text: ["id", "aquisicao", "modelo", "serial_number", "descricao"], //campos que pode ser preencher
        select: ["tipo", "marca"], // campos selecionavel
        check: [], // campos marcaveis
    },
};

const load = {
    object: "", // nome da tabela do banco de dado
    type: "", // [register, update, view]
    prefix: "",
    format: "", // modal, form
    inputs: function () {
        return objFields[this.object]; // faz requisição na api
    },

    // Fazer o load inicial das informações
    // Faz o save do objeto, e passa para a função adequada
    Start: function (type, object) {
        this.prefix = object + "_";
        this.type = type;
        this.object = object;
        load[type]();
    },
    // Carrega as informações necessaria para o registro
    register: function () {
        populate.Select();
    },
};
const populate = {
    Select: function () {
        return new Promise((resolve, reject) => {
            try {
                select = load.inputs()["select"];
                for (x in select) {
                    // loop em todos os campos de seleção do Objeto carregado
                    let field = select[x];
                    apiRequest.get("select", field, "", function (response) {
                        // populate.AddOpt(load.prefix+field,response);
                        const selectElement = $("#" + load.prefix + field); // Seleciona o elemento <select> pelo ID

                        // Limpa as opções existentes (opcional)
                        selectElement.empty();

                        response.forEach((option) => {
                            let opt = document.createElement("option");
                            opt.value = option.value; // Define o valor da opção
                            opt.text = option.text; // Define o texto da opção
                            selectElement.append(opt); // Adiciona a opção ao select
                        });
                    });
                }
                resolve();
            } catch (error) {
                console.error(error);
                // toasts('danger',error)
                reject(error);
            }
        });
    },
    Data: function (id) {
        populate.Select().then(() => {
            apiRequest.get("data", objload.object, id, function (response) {
                data = response[0];
                for (x in load.inputs.text().concat(load.inputs.select())) {
                    $("#" + prefix + x).val(data[x]);
                }
                for (x in load.inputs.check()) {
                    $("#" + prefix + x).prop("checked", data[x]);
                }
            });
        });
    },
    Table: function () {
        return;
    },
};
