function Formatter(value) {
    if (value != null) {
        return value
    } else {
        return ''
    }
}
function exibir_diaria(a, div) {
    if (a.options[a.selectedIndex].value == "Terceiro" || a == 'Terceiro') {
        div.style.display = "flex";
    } else {
        div.style.display = "none";
    }
}

function registerData(metodo, parametro) {
    $.ajax({
        url: getAPI() + '/cadastrar',  // URL da sua API no Django
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'user': user,
            'metodo': metodo,
            'parametro': JSON.stringify(parametro),
        },
        success: function (Response) {
            if (confirm(Response.message + '\nClique em <OK> para recarregar a página.')) {
                window.location.reload(true);
            }
        },
        error: function (xhr) {
            alert(xhr.responseJSON.message);
        }
    });
}
function deleteData(modal, id) {
    if (confirm('Tens certeza que deseja apagar essa linha')){
        $.ajax({
            url: getAPI() + '/deletar', // URL da view Django que deleta a obra
            method: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'user': user,
                'metodo': modal.split('_')[1],
                'parametro': id,
            },
            success: function (response) {
                alert(response.message);
                location.reload()
            },
            error: function (error) {
                console.error('Erro ao deletar dados:', error);
            }
        });
    }
}
function registerModal(modal) {
    let parametro
    let nameModal = modal.split('_')[1]
    if (nameModal == 'funcao') {
        parametro = {
            'funcao': $('#' + modal + '_nome').val(),
            'grupo': $('#' + modal + '_grupo').val(),
        }
    } else if (nameModal == 'supervisor') {
        if (document.getElementById(modal + '_ativo').checked) { ativo = true } else { ativo = false }
        parametro = {
            'supervisor': $('#' + modal + '_nome').val(),
            'ativo': ativo,
        }
    }
    registerData(nameModal, parametro)
}

var loaded
var inputs
function loadModal(modal, parametro) {
    nameModal = modal.split('_')
    if (nameModal[0] == 'update') {
        $.ajax({
            url: getAPI() + '/get_data',  // URL da sua API no Django
            type: "GET",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'metodo': nameModal[1],
                'parametro': parametro
            },
            success: function (data) {
                if (nameModal[1] == 'colaborador') {
                    if (loaded != modal) { loadSelect('selectFuncao', modal + '_funcao'); };
                    document.getElementById(modal + '_encarregado').checked = data.encarregado;
                    inputs = ['id', 'nome', 'admissao', 'demissao', 'contrato', 'diaria', 'observacao', 'funcao']

                };
                if (nameModal[1] == 'obra') {
                    if (loaded != modal) { loadSelect('selectSupervisor', modal + '_supervisor'); };

                    document.getElementById(modal + '_finalizada').checked = data.finalizada;
                    inputs = ['id', 'orcamento', 'empresa', 'cidade', 'descricao', 'indice', 'retrabalho', 'supervisor']

                };
                if (nameModal[1] == 'lancamento') {
                    if (loaded != modal) {
                        loadSelect('selectAtividade', modal + '_atividade');
                        loadSelect('selectColaborador', modal + '_colaborador');
                        loadSelect('selectObra', modal + '_obra');
                    };
                    inputs = ['id', 'dia', 'descricao', 'indice', 'horaini1', 'horafim1', 'horaini2', 'horafim2', 'horaini3', 'horafim3', 'obra', 'atividade', 'colaborador']

                };
                setTimeout(function () {
                    loaded = modal;
                    loadInput(modal, data);
                }, 100);


            },
            error: function (xhr) {
                alert(xhr.responseJSON.message);
            }
        });
    } else if (nameModal[0] == 'register') {
        if (loaded != modal) { loadTable(modal, nameModal[1]); };
        loaded = modal
    }
}
    function loadTable(modal, table) {
        $('#'.concat(modal+'_table')).empty()

        $.ajax({
            url: getAPI() + '/get_table', // URL da view Django que retorna os dados
            method: 'GET',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'metodo': 'table',
                'parametro': table,
            },
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    let row = '<tr>';
                    if (table == 'funcao') {
                        row += `<td>${data[i].funcao}</td>`;
                        if (data[i].grupo != null) { row += `<td>${data[i].grupo}</td>`; }
                        row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${modal}","${data[i].funcao}", function() { loadTable("funcao", "func_table"); })' style='background:lightcoral;'></td>`;
                    } else if (table == 'supervisor') {
                        let checked;
                        row += `<td>${data[i].supervisor}</td>`;
                        checked = data[i].ativo ? 'checked' : '';
                        row += `<td><input class="form-check-input" type="checkbox" ${checked} onclick="toggleAtivo('${data[i].supervisor}', '${!data[i].ativo}')"></td>`;
                        row += `<td><img src="${icon}/trash.svg" class="btn-icon" onclick='deleteData("${modal}","${data[i].supervisor}", function() { loadTable("supervisor", "super_table"); })' style='background:lightcoral;'></td>`;
                    } else { return alert('Nenhuma table encontrado') }
                    row += '</tr>';
                    $('#'.concat(modal+'_table')).append(row);
                }
            },
            error: function (error) {
                console.error('Erro ao buscar dados:', error);
            }
        });
    }
    function loadSelect(select, selectHTML) {
        $('#'.concat(selectHTML)).empty()
        $.ajax({
            url: getAPI() + '/get_table',  // URL da sua API no Django
            type: "GET",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'metodo': 'select',
                'parametro': select
            },
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    let value;
                    let text;
                    if (select == 'selectFuncao') {
                        value = data[i].funcao;
                        text = value;
                    } else if (select == 'selectObra') {
                        value = data[i].id;
                        text = value + '||' + data[i].empresa + '|' + data[i].cidade;
                    } else if (select == 'selectSupervisor') {
                        value = data[i].supervisor;
                        text = value;
                    } else if (select == 'selectAtividade') {
                        value = data[i].tipo;
                        text = value;
                    } else if (select == 'selectColaborador') {
                        value = data[i].nome;
                        text = value;
                    } else { return alert('Nenhum select encontrado') }

                    let opt = document.createElement('option');
                    opt.value = value;
                    opt.text = text;
                    $('#'.concat(selectHTML)).append(opt);
                }
            },
            error: function (xhr) {
                alert(xhr.responseJSON.message);
            }
        });
    }
    function loadInput(metodo, data) {
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i]
            $('#' + metodo + '_' + input).val(data[input]);
        }
    }
    function postgresGET(url, metodo, parametro) {
        $.ajax({
            url: url,  // URL da sua API no Django
            type: "GET",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'metodo': metodo,
                'parametro': parametro
            },
            success: function (data) {
                return data;
            },
            error: function (xhr) {
                alert(xhr.responseJSON.message);
                return NaN;
            }
        });
    }

    function alerts(type) {
        alert('hello world')
    }

    function saveModal(modal) {
        data = {}
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i]
            data[input] = $('#' + modal + '_' + input).val();
        }
        $.ajax({
            url: getAPI() + '/update', // URL da view Django que atualiza a obra
            method: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'user': user,
                'metodo': modal.split('_')[1],
                'parametro': JSON.stringify(data),
            },
            success: function (response) {
                location.reload();
            },
            error: function (error) {
                console.error('Erro ao atualizar dados:', error);
            }
        });
    }

    function deleteModal(modal) {
        deleteData(modal, $('#' + modal + '_id').val())
    }
