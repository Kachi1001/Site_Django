function load_carro(carro) {
    $.ajax({
        url: getAPI()+"/api/get_data",  // URL da sua API no Django
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
    let value = document.getElementById('date').value;

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
        url: getAPI()+"/api/cadastrar",  // URL da sua API no Django
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
            url: getAPI()+'/api/upload/',
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