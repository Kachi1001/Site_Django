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
        return "00:00:00";4
    }
}

function toggleDiaria() {
    diaria = $("#".concat(objLoaded.prefix, "_diaria"));
    if ($("#".concat(objLoaded.prefix, "_contrato")).val() == "Terceiro") {
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
            toasts("Success");
        },
        error: function (error) {
            alert(error.responseJSON.message);
        },
    });
}

function deleteData(modal, id) {
    if (confirm("Tens certeza que deseja apagar essa linha")) {
        $.ajax({
            url: API + "deletar", // URL da view Django que deleta a obra
            method: "POST",
            data: {
                csrfmiddlewaretoken: csrftoken,
                user: user,
                metodo: modal.split("_")[1],
                parametro: id,
            },
            success: function () {
                toasts("Success");
                $("#table").bootstrapTable("refresh");
            },
            error: function (error) {
                console.error("Erro ao deletar dados:", error);
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

function loadColumns() {
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
            ];
            checks = ["diaseguinte", "meiadiaria"];
            select = ["obra", "atividade", "colaborador"];
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
        }
        columns = {
            inputs: inputs,
            checks: checks,
            select: select,
            obj: objLoaded,
        };
    }
}
// Faz um post na API para registrar oque estiver nos inputs, normalmente referente a um formulário
function submit(type) {
    data = {};
    values = columns.inputs.concat(columns.select);
    for (let i = 0; i < values.length; i++) {
        data[values[i]] =
            $("#" + objLoaded.prefix + "_" + values[i]).val() || NaN;
    }
    for (let i = 0; i < columns.checks.length; i++) {
        data[columns.checks[i]] = $(
            "#" + objLoaded.prefix + "_" + columns.checks[i]
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
        success: function () {
            toasts("Success");
            $("#table").bootstrapTable("refresh");
        },
        error: function (error) {
            let msg = error.responseJSON.message.split("\n")[0];
            alert(msg);
            console.error(error);
        },
    });
}
function loadForm(name) {
    objLoaded = { method: "form", name: name, prefix: "form_" + name };
    loadColumns();
    for (i = 0; i < columns.select.length; i++) {
        loadSelect(columns.select[i], "oculto");
    }
    $("#" + objLoaded.prefix + "_btn").click(function () {
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
    objLoaded = { method: a[0], name: a[1], prefix: modal };
    if (objLoaded.prefix != modalLoad) {
        $("#" + objLoaded.prefix + "_btn").click(function () {
            submit(objLoaded.method);
        });
        $("#" + objLoaded.prefix + "_del").click(function () {
            deleteData(
                objLoaded.prefix,
                $("#" + objLoaded.prefix + "_id").val()
            );
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
                loadColumns();
                for (i = 0; i < columns.select.length; i++) {
                    loadSelect(columns.select[i], "exibir");
                }
                columns.inputs.push("id");
                setTimeout(function () {
                    values = columns.inputs.concat(columns.select);
                    if (values !== undefined) {
                        for (let i = 0; i < values.length; i++) {
                            let input = values[i];
                            $("#" + modal + "_" + input).val(data[input]);
                        }
                    }
                    if (a[1] == "colaborador") {
                        toggleDiaria();
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
                }, 100);
            },
            error: function (error) {
                console.error("Erro ao buscar dados:", error);
                alert(error.responseJSON.message);
            },
        });
    } else if (objLoaded.method == "register") {
        loadTable(objLoaded.prefix, objLoaded.name);
        loadColumns();
        modalLoad = objLoaded.prefix;
    } else if (objLoaded.method == "view") {
        $.ajax({
            url: API + "get_data", // URL da sua API no Django
            type: "GET",
            data: {
                csrfmiddlewaretoken: csrftoken,
                metodo: objLoaded.name,
                parametro: parametro,
            },
            success: function (data) {
                if (objLoaded.name == "diario") {
                    previewModal_img(getMedia("diarios") + data.imagem);
                }
            },
            error: function (error) {
                console.error("Erro ao buscar dados:", error);
                alert(error.responseJSON.message);
            },
        });
    }
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
            toasts("Success");
        },
        error: function (xhr) {
            alert(xhr.responseJSON.message);
        },
    });
}
function loadTable(modal, table) {
    $("#".concat(modal + "_table")).empty();
    $.ajax({
        url: API + "get_table", // URL da view Django que retorna os dados
        method: "GET",
        data: {
            csrfmiddlewaretoken: csrftoken,
            metodo: "table",
            parametro: table,
        },
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                let row = "<tr>";
                if (table == "funcao") {
                    row += `<td>${data[i].funcao}</td>`;
                    if (data[i].grupo != null) {
                        row += `<td>${data[i].grupo}</td>`;
                    }
                    row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${modal}","${data[i].id}"); setTimeout(function() {loadTable("register_funcao", "funcao");},200)' style='background:lightcoral;'></td>`;
                } else if (table == "supervisor") {
                    let checked;
                    row += `<td>${data[i].supervisor}</td>`;
                    checked = data[i].ativo ? "checked" : "";
                    row += `<td><input class="form-check-input" type="checkbox" ${checked} onclick="toggleAtivo('${
                        data[i].supervisor
                    }', ${!data[i].ativo})"></td>`;
                    row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${modal}","${data[i].supervisor}"); setTimeout(function() {loadTable("register_supervisor", "supervisor");},200)' style='background:lightcoral;'></td>`;
                } else {
                    return alert("Nenhuma table encontrado");
                }
                row += "</tr>";
                $("#".concat(modal + "_table")).append(row);
            }
        },
        error: function (error) {
            console.error("Erro ao buscar dados:", error);
            alert(error.responseJSON.message);
        },
    });
}
function loadSelect(select, filter) {
    let selectHTML = objLoaded.prefix + "_" + select;
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
                } else if (select == "obra") {
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
                } else if (select == "atividade") {
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
            alert(error.responseJSON.message);
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
            alert(xhr.responseJSON.message);
            return NaN;
        },
    });
}

function toasts(type, message) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(
        document.getElementById("toast" + type)
    );
    toastBootstrap.show();
}
function deleteModal(modal) {
    deleteData(modal, $("#" + modal + "_id").val());
}

function previewModal_img(img) {
    image = document.getElementById("modalDigitalizado");
    image.src = img;
    $("#modalLink").prop("href", img);
}
