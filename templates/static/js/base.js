
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

const apiRequest = {
    baseUrl: getAPI(),
    app: null,

    get: function (endpoint, metodo, parametro, successCallback, errorCallback) {
        return $.ajax({
            url: this.baseUrl + this.app + endpoint,
            method: 'GET',
            data: {
                metodo: metodo,
                parametro: parametro,
                user: user,
                csrfmiddlewaretoken: csrftoken,
            },
            success: function (response) {
                if (typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            error: function(error) {
                if (typeof errorCallback === 'function') {
                    errorCallback(error);
                }
                toasts('danger',error.responseJSON)
            }
        });
    },

    post: function (endpoint, metodo, parametro, successCallback, errorCallback) {
        return $.ajax({
            url: this.baseUrl + this.app + endpoint,
            method: 'POST',
            data: {
                user: user,
                csrfmiddlewaretoken: csrftoken,
                metodo: metodo,
                parametro: JSON.stringify(parametro),
            },
            success: function (response) {
                if (typeof successCallback === 'function') {
                    successCallback(response);
                }
                toasts("success", response)
            },
            error: function(error) {
                if (typeof errorCallback === 'function') {
                    errorCallback(error);
                }
                toasts('danger',error.responseJSON)
            }
        });
    },

    upload: function(endpoint, formData, successCallback, errorCallback){
        $.ajax({
            url: this.baseUrl + this.app + endpoint,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,

            success: function (response) {
                if (typeof successCallback === 'function') {
                    successCallback(response);
                }
                toasts("success", response)
            },
            error: function(error) {
                if (typeof errorCallback === 'function') {
                    errorCallback(error);
                }
                toasts('danger',error.responseJSON)
            }
        });
    }
};