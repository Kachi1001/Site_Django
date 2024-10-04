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
};

function readFields() {
    data = {};
    let inputs = load.inputs;
    let fields = inputs["text"].concat(inputs["select"]); // Junta os campos de texto e campos de seleção
    for (i in fields) {
        val = $("#" + load.prefix + fields[i]).val()
        if (val != ''){
            data[fields[i]] = $("#" + load.prefix + fields[i]).val();
        }
    }
    for (i in inputs.check) {
        data[inputs.check[i]] = $("#" + load.prefix + inputs.check[i]).prop(
            "checked"
        );
    }
    return data;
}
var load = {
    object: "", // nome da tabela do banco de dado
    type: "", // [register, update, view]
    prefix: "",
    format: "", // modal, form
    inputs: {},
    modal: '',
    old: undefined,
    // Fazer o load inicial das informações
    // Faz o save do objeto, e passa para a função adequada
    Start: function (type, object, format) {
        this.old = load
        this.prefix = format.slice(0, 1).concat("_", object, "_");
        this.type = type;
        this.format = format;
        this.object = object;
        this.inputs = objFields[object];
        this.modal = ''
        load[type]();
    },
    // Carrega as informações necessaria para o registro
    register: function () {
        populate.Select();
        if (this.format === "modal") {
            const myModal = document.getElementById(this.prefix.slice(0, -1))
            this.modal = new bootstrap.Modal(myModal);
            populate.Table().then(() => {
                this.modal.show();
                myModal.addEventListener('hidden.bs.modal', event => {
                    load = this.old
                })
            });
        }

    },
    update: function () {
        populate.Data();
        $("#" + load.prefix + "btn").click(function () {
            mani.save();
        });
    },
    refresh: function(){
        if (this.format === 'modal'){
            populate.Table()
        } else if (this.format === 'form') {
            $("#table").bootstrapTable("refresh");
        }
    }
};

const mani = {
    register: function () {
        apiRequest.post("register", load.object, readFields(),function(){
            load.refresh()
        });
    },
    save: function () {
        apiRequest.post("update", load.object, readFields());
    },
    delete: function(id) {
        apiRequest.delete('delete',load.object, id, function(){
            load.refresh()
        })
    }
};

const populate = {
    Select: function () {
        return new Promise((resolve, reject) => {
            try {
                select = load.inputs["select"];
                for (x in select) {
                    // loop em todos os campos de seleção do Objeto carregado
                    let field = select[x];
                    apiRequest.get(
                        "get_list",
                        "select",
                        field,
                        function (response) {
                            // populate.AddOpt(load.prefix+field,response);
                            const selectElement = $("#" + load.prefix + field); // Seleciona o elemento <select> pelo ID

                            // Limpa as opções existentes (opcional)
                            selectElement.empty();

                            response.forEach((option) => {
                                let opt = document.createElement("option");
                                opt.value = option.value; // Define o valor da opção
                                opt.text = option.text || option.value; // Define o texto da opção
                                selectElement.append(opt); // Adiciona a opção ao select
                            });
                        }
                    );
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
        return new Promise((resolve, reject) => {
            try {
                apiRequest.get(
                    "get_list",
                    "table",
                    load.object,
                    function (response) {
                        const tabela = document.getElementById(
                            load.prefix + "table"
                        );
                        const thead = tabela.querySelector("thead tr");
                        thead.innerHTML = '';
                        const tbody = tabela.querySelector("tbody");
                        tbody.innerHTML = '';

                        if (response.length > 0) {
                            // Cria os cabeçalhos da tabela com base nas chaves dos objetos
                            const chaves = Object.keys(response[0]);
                            chaves.forEach((chave) => {
                                const th = document.createElement("th");
                                th.textContent =
                                    chave.charAt(0).toUpperCase() +
                                    chave.slice(1);
                                thead.appendChild(th);
                            });
                            const thRemover = document.createElement('th');
                            thRemover.textContent = 'Ações';
                            thead.appendChild(thRemover);
                            // Cria as linhas da tabela com base nos valores dos objetos
                            response.forEach((objeto) => {
                                const linha = document.createElement("tr");

                                chaves.forEach((chave) => {
                                    const celula = document.createElement("td");
                                    if (typeof objeto[chave] === 'boolean') {
                                        // Cria uma checkbox
                                        const checkbox = document.createElement('input');
                                        checkbox.cl
                                        checkbox.type = 'checkbox';
                                        checkbox.disabled = true;  // Desativa a edição
                                        checkbox.checked = objeto[chave];  // Marca ou desmarca conforme o valor
                                        celula.appendChild(checkbox);  // Adiciona o checkbox à célula
                                    } else {
                                        // Se não for booleano, insere o texto normal
                                        celula.textContent = objeto[chave];
                                    }
                                    linha.appendChild(celula);
                                });

                                // Cria a célula do botão de remoção
                                const celulaRemover = document.createElement('td');
                                const botaoRemover = document.createElement('img');
                                botaoRemover.textContent = '';
                                botaoRemover.src = 'http://10.0.0.211:8001/static/icons/trash.svg'
                                botaoRemover.classList.add('btn-icon');
                                botaoRemover.classList.add('bg-danger');

                                 // Adiciona o evento de remoção ao botão
                                botaoRemover.addEventListener('click', function() {
                                    mani.delete(objeto.id)
                                });
                                
                                celulaRemover.appendChild(botaoRemover);
                                linha.appendChild(celulaRemover);

                                tbody.appendChild(linha);
                            });
                        }

                        resolve();
                    }
                );
            } catch (error) {
                console.error(error);
                // toasts('danger',error)
                reject(error);
            }
        });
    },
};
