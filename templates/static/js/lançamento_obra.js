const API = getAPI() + "/lancamento_obra/";

function Formatter(value) {
    if (value != null) {
        return value;
    } else {
        return "";
    }
}
function checkFormatter(value) {
    if (value) {
        return '<input class="form-check-input mt-0" type="checkbox" checked disabled>';
    } else {
        return '<input class="form-check-input mt-0" type="checkbox" disabled>';
    }
}
function dataFormatter(value) {
    if (value != null) {
        data = value.split("-");
        return data[2].concat("/", data[1], "/", data[0]);
    } else {
        return "";
    }
}
function realFormatter(value) {
    if (value != null) {
        return "R$ ".concat(value);
    }
}
function horaFormatter(value) {
    if (value != null) {
        return value.concat(" H");
    }
}
function intervalFormatter(value) {
    if (value != null) {
        let horatotal =
            parseInt(value.slice(4, 6)) + parseInt(value.charAt(1)) * 24 + "";
        let tempo = horatotal.concat(
            ":",
            value.slice(7, 9),
            ":",
            value.slice(10, 12)
        );
        return tempo;
    } else {
        return "00:00:00";
        4;
    }
}

function toggleDiaria() {
    diaria = $("#".concat(objLoaded.prefix, "diaria"));
    if ($("#".concat(objLoaded.prefix, "contrato")).val() == "Terceiro") {
        diaria.attr("disabled", false);
    } else {
        diaria.attr("disabled", true);
        diaria.val("");
    }
}

function registerData(metodo, parametro) {
    $.ajax({
        url: API + "register",
        type: "POST",
        data: {
            csrfmiddlewaretoken: csrftoken,
            user: user,
            metodo: metodo,
            parametro: JSON.stringify(parametro),
        },
        success: function (Response) {
            loadModal("register_" + metodo, metodo);
            toasts("Success", {
                method: "Registro",
                message: `${metodo} criado com sucesso!`,
            });
        },
        error: function (error) {
            alert(error.responseJSON.message);
        },
    });
}

function deleteData(id) {
    if (confirm("Tens certeza que deseja apagar essa linha")) {
        $.ajax({
            url: API + "deletar", // URL da view Django que deleta a obra
            method: "POST",
            data: {
                csrfmiddlewaretoken: csrftoken,
                user: user,
                metodo: objLoaded.name,
                parametro: id,
            },
            success: function (response) {
                toasts("Success", response);
                $("#table").bootstrapTable("refresh");
            },
            error: function (error) {
                console.error("Erro ao deletar dados:", error);
                toasts("Error", error.responseJSON);
            },
        });
    }
}
//Registro que é realizado via modal
function registerModal(modal) {
    submit("register");
    setTimeout(function () {
        loadTable(modal, modal.split("_")[1]);
    }, 100);
}
// Preenche as variaveis de dados de objetos do banco de dados
var objLoaded = { method: undefined, name: undefined, prefix: undefined };
var columns = {
    inputs: undefined,
    checks: undefined,
    obj: undefined,
    select: undefined,
};
var modalLoad;
function changeAtividade() {
    let obra = $("#" + objLoaded.prefix + "obra").val();
    const campos1 = [
        "horaini3",
        "horafim3",
        "diaseguinte",
        "meiadiaria",
        "atividade",
    ];
    const campos2 = ["supervisor", "motivo"];
    if (obra > 1 && obra < 5) {
        desativado = true;
    } else {
        desativado = false;
    }
    for (let X in campos1) {
        $("#" + objLoaded.prefix + campos1[X]).attr("disabled", desativado);
    }
    for (let X in campos2) {
        $("#" + objLoaded.prefix + campos2[X]).attr("disabled", !desativado);
    }
}
function changeObra() {
    const att = ['ATESTADO', 'DISPENSA', 'FALTA', 'FOLGA', 'FÉRIAS', 'TREINAMENTO', 'ATIVIDADE OBRA']

    let obra = $("#" + objLoaded.prefix + "obra").val();
    if (obra >= 7) {
        $("#" + objLoaded.prefix + "atividade").val(att[6]);
    } else {
        $("#" + objLoaded.prefix + "atividade").val(att[obra - 1]);
    }
    changeAtividade();
}
function removeColumns(value) {
    if (value in columns.inputs) {
        columns.inputs.slice(columns.inputs.indexOf(value), 1);
    } else if (value in columns.checks) {
        columns.checks.slice(columns.checks.indexOf(value), 1);
    } else if (value in columns.select) {
        columns.select.slice(columns.select.indexOf(value), 1);
    }
}
function loadColumns(oculto) {
    if (objLoaded != columns.obj) {
        let inputs = [];
        let checks = [];
        let select = [];
        if (objLoaded.name === "atividade") {
            inputs = [
                "dia",
                "descricao",
                "indice",
                "horaini1",
                "horafim1",
                "horaini2",
                "horafim2",
                "horaini3",
                "horafim3",
                "motivo",
            ];
            checks = ["diaseguinte", "meiadiaria"];
            select = ["obra_id", "atividade_id", "colaborador", "supervisor"];
        } else if (objLoaded.name === "colaborador") {
            inputs = [
                "nome",
                "admissao",
                "contrato",
                "diaria",
                "observacao",
                "demissao",
            ];
            checks = ["encarregado"];
            select = ["funcao"];
        } else if (objLoaded.name === "obra") {
            inputs = [
                "id",
                "orcamento",
                "empresa",
                "cidade",
                "descricao",
                "indice",
                "retrabalho",
                'tecnicon',
            ];
            checks = ["finalizada"];
            select = ["supervisor"];
        } else if (objLoaded.name === "diario") {
            inputs = [
                "indice",
                "data",
                "climamanha",
                "climatarde",
                "descricao",
            ];
            select = ["encarregado", "obra"];
        } else if (objLoaded.name === "supervisor") {
            inputs = ["supervisor"];
            checks = ["ativo"];
        } else if (objLoaded.name === "funcao") {
            inputs = ["funcao", "grupo"];
        } else if (objLoaded.name === "programacao") {
            inputs = ["observacao", "iniciosemana"];
            select = ["colaborador", "encarregado", "obra"];
        }
        columns = {
            inputs: inputs,
            checks: checks,
            select: select,
            obj: objLoaded,
        };
        for (i = 0; i < columns.select.length; i++) {
            loadSelect(columns.select[i], oculto);
        }
    }
}
// Faz um post na API para registrar oque estiver nos inputs, normalmente referente a um formulário
function submit(type) {
    data = {};
    values = columns.inputs.concat(columns.select);
    for (let i = 0; i < values.length; i++) {
        data[values[i]] = $("#" + objLoaded.prefix + values[i]).val() || NaN;
    }
    for (let i = 0; i < columns.checks.length; i++) {
        data[columns.checks[i]] = $(
            "#" + objLoaded.prefix + columns.checks[i]
        ).prop("checked");
    }
    $.ajax({
        url: API + type,
        method: "POST",
        data: {
            csrfmiddlewaretoken: csrftoken,
            user: user,
            metodo: objLoaded.name,
            parametro: JSON.stringify(data),
        },
        success: function (response) {
            toasts("Success", response);
            $("#table").bootstrapTable("refresh");
        },
        error: function (error) {
            toasts("Error", error.responseJSON);
            console.error(error);
        },
    });
}
function loadForm(name) {
    objLoaded = { method: "form", name: name, prefix: "form_" + name + "_" };
    loadColumns('oculto');
    $("#" + objLoaded.prefix + "btn").click(function () {
        submit("register");
    });
}
function toggleOculto(campo) {
    let element;
    let filtrar;
    if (campo == "colaborador") {
        element = $("#mostrar_demitidos");
    } else if (campo == "obra") {
        element = $("#mostrar_finalizadas");
    }
    let text = element.text().split(" ");
    if (text[0] == "exibir") {
        filtrar = false;
        element.text("ocultar ".concat(text[1]));
    } else {
        filtrar = true;
        element.text("exibir ".concat(text[1]));
    }
    if (!filtrar) {
        loadSelect(campo, "exibir");
    } else {
        loadSelect(campo, "oculto");
    }
}
//Preencher os campos de cada modal
function loadModal(modal, parametro) {
    let a = modal.split("_");
    let old_objLoaded = objLoaded;

    objLoaded = { method: a[0], name: a[1], prefix: modal + "_" };
    loadColumns('exibir');
    if (objLoaded.prefix != modalLoad) {
        $("#" + objLoaded.prefix + "btn").click(function () {
            submit(objLoaded.method);
        });
        $("#" + objLoaded.prefix + "del").click(function () {
            deleteData($("#" + objLoaded.prefix + "id").val());
        });
        modalLoad = objLoaded.prefix;
    }
    if (objLoaded.method == "update") {
        $.ajax({
            url: API + "get_data", // URL da sua API no Django
            type: "GET",
            data: {
                csrfmiddlewaretoken: csrftoken,
                metodo: a[1],
                parametro: parametro,
            },
            success: function (data) {
                data = data[0]
                columns.inputs.push("id");
                values = columns.inputs.concat(columns.select);
                if (values !== undefined) {
                    for (let i = 0; i < values.length; i++) {
                        let input = values[i];
                        $("#" + modal + "_" + input).val(data[input]);
                    }
                }
                if (columns.checks !== undefined) {
                    for (let i = 0; i < columns.checks.length; i++) {
                        let check = columns.checks[i];
                        $("#" + modal + "_" + check).prop(
                            "checked",
                            data[check]
                        );
                    }
                }

                if (a[1] == "colaborador") {
                    toggleDiaria();
                }
                if (a[1] == "atividade") {
                    changeObra();
                }
            },
            error: function (error) {
                console.error("Erro ao buscar dados:", error);
                alert(error.responseJSON.message);
                toasts("Error", error.responseJSON);
            },
        });
    } else if (objLoaded.method == "register") {
        loadTable(objLoaded.prefix, objLoaded.name);
        loadColumns();
        modalLoad = objLoaded.prefix;
    } else if (objLoaded.method == "view") {
        previewModal_img(getMedia(objLoaded.name) + parametro + ".jpg");
        
    }
    showModal(old_objLoaded);

}
function showModal(old_objLoaded) {
    let myModal = new bootstrap.Modal(
        document.getElementById(objLoaded.method + "_" + objLoaded.name)
    );
    myModal.show();

    let myModalEvent = document.getElementById(
        objLoaded.method + "_" + objLoaded.name
    );
    myModalEvent.addEventListener("hidden.bs.modal", (event) => {
        objLoaded = old_objLoaded;
        loadColumns();
    });
}
function toggleAtivo(supervisor, isActive) {
    $.ajax({
        url: API + "update", // URL da sua API no Django para atualizar o status
        type: "POST",
        data: {
            csrfmiddlewaretoken: csrftoken,
            metodo: "supervisor",
            parametro: JSON.stringify({
                ativo: isActive,
                supervisor: supervisor,
            }),
        },
        success: function () {
            toasts("Success", {
                method: "Edição",
                message: "Supervisor ativo com sucesso",
            });
        },
        error: function (error) {
            toasts("Alert", error.responseJSON.message);
        },
    });
}
function loadTable() {
    $("#".concat(objLoaded.prefix + "table")).empty();
    $.ajax({
        url: API + "get_table", // URL da view Django que retorna os dados
        method: "GET",
        data: {
            csrfmiddlewaretoken: csrftoken,
            metodo: "table",
            parametro: objLoaded.name,
        },
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let row = "<tr>";
                if (objLoaded.name == "funcao") {
                    row += `<td>${data[i].funcao}</td>`;
                    if (data[i].grupo != null) {
                        row += `<td>${data[i].grupo}</td>`;
                    }
                    row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${data[i].id}"); setTimeout(function() {loadTable();},200)' style='background:lightcoral;'></td>`;
                } else if (objLoaded.name == "supervisor") {
                    let checked;
                    row += `<td>${data[i].supervisor}</td>`;
                    checked = data[i].ativo ? "checked" : "";
                    row += `<td><input class="form-check-input" type="checkbox" ${checked} onclick="toggleAtivo('${
                        data[i].supervisor
                    }', ${!data[i].ativo})"></td>`;
                    row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${data[i].supervisor}"); setTimeout(function() {loadTable();},200)' style='background:lightcoral;'></td>`;
                } else {
                    return alert("Nenhuma table encontrado");
                }
                row += "</tr>";
                $("#".concat(objLoaded.prefix + "table")).append(row);
            }
        },
        error: function (error) {
            console.error("Erro ao buscar dados:", error);
            toasts("Error", error.responseJSON);
        },
    });
}
function loadSelect(select, filter) {
    let selectHTML = objLoaded.prefix + select;
    $("#".concat(selectHTML)).empty();
    $.ajax({
        url: API + "get_table", // URL da sua API no Django
        type: "GET",
        data: {
            csrfmiddlewaretoken: csrftoken,
            metodo: "select",
            parametro: select,
        },
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let value;
                let text;
                if (select == "funcao") {
                    value = data[i].funcao;
                } else if (select == "obra_id") {
                    if (filter == "oculto" && data[i].finalizada) {
                    } else {
                        value = data[i].id;
                        text =
                            value +
                            " || " +
                            data[i].empresa +
                            " | " +
                            data[i].cidade;
                    }
                } else if (select == "supervisor") {
                    value = data[i].supervisor;
                } else if (select == "atividade_id") {
                    value = data[i].tipo;
                    // text = data[i].tipo;
                } else if (select == "colaborador") {
                    if (filter == "oculto" && data[i].demissao != null) {
                    } else {
                        value = data[i].nome;
                    }
                } else if (select == "encarregado") {
                    value = data[i].nome;
                } else {
                    return alert("Nenhum select encontrado");
                }
                if (value != undefined) {
                    let opt = document.createElement("option");
                    opt.value = value;
                    opt.text = text || value;
                    $("#".concat(selectHTML)).append(opt);
                }
            }
        },
        error: function (error) {
            console.error("Erro ao buscar dados:", error);
            toasts("Error", error.responseJSON);
        },
    });
}

function postgresGET(url, metodo, parametro) {
    $.ajax({
        url: API + url, // URL da sua API no Django
        type: "GET",
        data: {
            csrfmiddlewaretoken: csrftoken,
            metodo: metodo,
            parametro: parametro,
        },
        success: function (data) {
            return data;
        },
        error: function (xhr) {
            toasts("Error", xhr.responseJSON);
            return NaN;
        },
    });
}

function toasts(type, response) {
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(
        document.getElementById("toast" + type)
    );
    if (response != undefined) {
        $("#toast" + type + "_method").text(response.method);
        $("#toast" + type + "_message").text(response.message);
    }
    toastBootstrap.show();
}

function previewModal_img(img) {
    image = document.getElementById("view_" + objLoaded.name + "_digitalizado");
    image.src = img;
}
