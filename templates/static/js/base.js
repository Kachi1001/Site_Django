function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
const user = getUser();
const icon = '/static/icons'

function uploadImage(fileInput, parametro, metodo, url){
    let file = fileInput.files[0];
    
    if (!file) {
        alert("Por favor, selecione um arquivo primeiro.");
        return;
    }
    
    let formData = new FormData();
    formData.append('file', file);
    formData.append('parametro', parametro);
    formData.append('metodo', metodo);

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            success: function() {
                return true
            },
            error: function(error) {
                console.error('Erro:', error);
                alert('Erro ao carregar o arquivo.');
            }
        });
}