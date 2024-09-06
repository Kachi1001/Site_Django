var API = getAPI() + '/reservas/'
var loaded
const toastLiveExample = document.getElementById('liveToast')

function reload(param) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let value = document.getElementById('data-picker').value;

    // Atualizar o valor do parâmetro
    params.set(param, value);

    // Atualizar a URL no navegador e recarregar a página
    window.location.href = `${url.pathname}?${params}`;
}
function loadModal(modal, parametro) {
    if (modal == 'reservar_carro') {
        $.ajax({
            url: API + "get",   // URL da sua API no Django
            type: 'GET',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'parametro': parametro,
                'metodo': 'carro',
            },
            success: function (data) {
                $('#placa').val(data.placa)
            $('#modelo').val(data.modelo)
                $('#marca').val(data.marca)

                document.getElementById('modal-imagem').src = getMedia('carros') + data.imagem

            },
            error: function (xhr) {
                alert(xhr.responseJSON.message);
            }
        });
    } else if (modal == 'cadastrar_carro') {
        if (loaded != modal) {
            loaded = modal;
            $('#cadastrar_carro_btn').click(function () {
                let file = $('#arquivo')[0].files[0];
                let filename = $('#arquivo').val().replace("C:\\fakepath\\", "").split(".")
                if (!file) {
                    alert("Por favor, selecione um arquivo primeiro.");
                    return;
                }
                let parametro = {
                    'placa': $('#cadastro_placa').val(),
                    'modelo': $('#cadastro_modelo').val(),
                    'marca': $('#cadastro_marca').val(),
                    'imagem': $('#cadastro_placa').val().concat('.', filename[(filename.length - 1)]),
                }
                let formData = new FormData();
                formData.append('file', file);
                formData.append('parametro', JSON.stringify(parametro));
                formData.append('metodo', 'carro');
                 
                $.ajax({
                    url: API + 'register',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,

                    success: function (response) {
                        toasts('Success')
                        location.reload()
                    },
                    error: function (error) {
                        console.error('Erro:', error);
                        alert('Erro ao carregar o arquivo.');
                    }
                });
            })
        }
    }

}




const horarios = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
function Reserva_rapida() {
    if (loaded != 'reserva_rapida') {
        loaded = 'reserva_rapida';
        for (let i = 0; i < horarios.length - 1; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel1").append(opt);
        }
        for (let i = 1; i < horarios.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel2").append(opt);
        }
    }
    $("#reserva_rapida-sel1").change(function () {
        $("#reserva_rapida-sel2").empty();
        let inicio = $("#reserva_rapida-sel1").val()
        inicio++
        for (let i = inicio; i < horarios.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel2").append(opt);
        }
    });
    $("#reserva_rapida-sala").change(function () {
        document.getElementById('reserva_rapida-img').src = `/static/image/${$("#reserva_rapida-sala").val()}.jpg`;
    });
    $("#reserva_rapida-submit").click(function () {
        let reservas = []
        let inicio = parseInt($("#reserva_rapida-sel1").val())
        let fim = parseInt($("#reserva_rapida-sel2").val())
        for (i = inicio; i < fim; i++) {
            reservas.push({
                'hora': horarios[i],
                'responsavel': $("#reserva_rapida-responsavel").val(),
                'descricao': $("#reserva_rapida-descricao").val()
            })
        }
        parametro = {
            'reservas': JSON.stringify(reservas),
            'data': $("#reserva_rapida-data").val(),
            'sala': $("#reserva_rapida-sala").val(),
        }
        registarAJAX(parametro, 'reservar_sala');
    })
};

function reserva_simples(sala) {
    let reservas = []
    let resp = null
    let desc = ''
    for (i = 0; i < horarios.length; i++) {
        hora = horarios[i].replace(':', '\\:')
        if ($('#check' + hora).is(':checked') && !$('#check' + hora).is(':disabled')) {
            if (resp == null && $('#responsavel' + hora).val() == '') {
                alert('O registro necessita de um responsável')
                return
            } else if ($('#responsavel' + hora).val() != '') {
                resp = $('#responsavel' + hora).val()
            }
            if ($('#descricao' + hora).val() != '') {
                desc = $('#descricao' + hora).val()
            }
            reservas.push({
                'hora': hora.replace('\\:', ':'),
                'responsavel': resp,
                'descricao': desc,
            })
        }
    }
    parametro = {
        'sala': sala,
        'data': $("#data-picker").val(),
        'reservas': JSON.stringify(reservas),
    }
    if (reservas.length == 0) {
        alert('Nenhum registro salvo')
        return
    }
    registarAJAX(parametro, 'reservar_sala');
}
function registarAJAX(parametro, metodo) {
    $.ajax({
        url: API + 'register',
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'parametro': JSON.stringify(parametro),
            'metodo': metodo,
            'user': user,
        },
        success: function (response) {
            alert(response.message);
            location.reload()
            return true
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
}
function toasts(type){
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast'+type))
    toastBootstrap.show()
}