
function load_carro(carro) {
    $.ajax({
        url: getAPI()+"/get_data",  // URL da sua API no Django
        type: 'GET',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'id': carro,
            'metodo': 'Carro',
        },
        success: function (data) {
            $('#placa').val(data.placa)
            $('#modelo').val(data.modelo)
            $('#marca').val(data.marca)

            document.getElementById('modal-imagem').src = getAPI() + '/media/reservas/carros/' + data.placa + '.jpg'

        },
        error: function (xhr) {
            alert(xhr.responseJSON.message);
        }
    });
}


function reload(param) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let value = document.getElementById('data-picker').value;

    // Atualizar o valor do parâmetro
    params.set(param, value);

    // Atualizar a URL no navegador e recarregar a página
    window.location.href = `${url.pathname}?${params}`;
}

function cadastra() {
    let parametro = {
        'placa': $('#cadastro_placa').val(),
        'modelo': $('#cadastro_modelo').val(),
        'marca': $('#cadastro_marca').val(),
    }

    $.ajax({
        url: getAPI()+"/cadastrar",  // URL da sua API no Django
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'parametro': JSON.stringify(parametro),
            'metodo': 'Carro',
            'user': user,
        },
        success: function (response) {
            alert(response.message + '\nClique em <OK> para recarregar a página.');
            uploadFoto()
        },
        error: function (xhr) {
            alert(xhr.responseJSON.message);
        }
    });
}
function uploadFoto(){
    let fileInput = $('#arquivo')[0];
    let file = fileInput.files[0];
    
    if (!file) {
        alert("Por favor, selecione um arquivo primeiro.");
        return;
    }
    
    let formData = new FormData();
    formData.append('file', file);
    formData.append('placa', $('#cadastro_placa').val());

        $.ajax({
            url: getAPI()+'/upload/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                location.reload()
            },
            error: function(error) {
                console.error('Erro:', error);
                alert('Erro ao carregar o arquivo.');
            }
        });
}
const horarios = ['07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00']
function Reserva_rapida() {
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
        document.getElementById('reserva_rapida-img').src =`/static/image/${$("#reserva_rapida-sala").val()}.jpg`;
    });
    $("#reserva_rapida-submit").click(function () {
        let horas = []
        let inicio = parseInt($("#reserva_rapida-sel1").val())
        let fim = parseInt($("#reserva_rapida-sel2").val())
        for (i = inicio; i < fim ;i++){
            horas.push(horarios[i])
        }
        parametro = {
            'horarios': JSON.stringify(horas),
            'responsavel': $("#reserva_rapida-responsavel").val(),
            'data': $("#reserva_rapida-data").val(),
            'descricao': $("#reserva_rapida-descricao").val(),
            'sala': $("#reserva_rapida-sala").val(),
        }
        $.ajax({
            url: getAPI()+'/salas',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'parametro': JSON.stringify(parametro),
                'metodo': 'reservar_multi',
                'user': user,
            },
            success: function (response) {
                alert(response.message);
                location.reload()
            },
            error: function (error) {
                alert(error.responseJSON.message);
            }
        });
    })
  };

function reserva_simples(sala){
    let reservas = []
    let resp = null
    let desc = ''
    for (i = 0; i < horarios.length; i++){
        hora = horarios[i].replace(':', '\\:')
        if ($('#check' + hora).is(':checked') && !$('#check' + hora).is(':disabled')){
            if (resp == null && $('#responsavel'+ hora).val() == ''){
                alert('O primeiro registro necessita de um responsavel')
                return
            } else if ($('#responsavel' + hora).val() != '') {
                resp = $('#responsavel'+ hora).val() 
            }
            if (i != 0 && $('#descricao' + hora).val() != '') {
                desc = $('#descricao'+ hora).val() 
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
    $.ajax({
        url: getAPI()+'/salas',
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'user': user,
            'parametro': JSON.stringify(parametro),
            'metodo': 'reservar_simples',
        },
        success: function (response) {
            alert(response.message);
            location.reload()
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
  }
function ajax(url, type, parametro, metodo, functiosucess){

}