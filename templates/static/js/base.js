const apiRequest = {
    baseUrl: api,
    createURL: function (endpoint) {
        return this.baseUrl +'/'+ app +"/"+ endpoint;
    },
    createDATA: function (metodo, parametro) {
        return {
            metodo: metodo,
            parametro: parametro,
            user: user,
        };
    },
    get: function (
        endpoint,
        metodo,
        parametro,
        successCallback,
        errorCallback
    ) {
        return $.ajax({
            url: this.createURL(endpoint),
            method: "GET",
            data: this.createDATA(metodo, parametro),
            success: function (response) {
                if (typeof successCallback === "function") {
                    successCallback(response);
                }
            },
            error: (error) => {
                this.error(error, errorCallback);
            },
        });
    },

    post: function (
        endpoint,
        metodo,
        parametro,
        successCallback,
        errorCallback
    ) {
        return $.ajax({
            url: this.createURL(endpoint),
            method: "POST",
            data: this.createDATA(metodo, JSON.stringify(parametro)),
            success: (response) => {
                this.success(response, successCallback);
            },
            error: (error) => {
                this.error(error, errorCallback);
            },
        });
    },

    update: function (
        endpoint,
        metodo,
        parametro,
        successCallback,
        errorCallback
    ) {
        return $.ajax({
            url: this.createURL(endpoint),
            method: "PATCH",
            data: this.createDATA(metodo, JSON.stringify(parametro)),
            success: (response) => {
                this.success(response, successCallback);
            },
            error: (error) => {
                this.error(error, errorCallback);
            },
        });
    },

    upload: function (endpoint, formData, successCallback, errorCallback) {
        $.ajax({
            url: this.createURL(endpoint),
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,

            success: (response) => {
                this.success(response, successCallback);
            },
            error: (error) => {
                this.error(error, errorCallback);
            },
        });
    },

    delete: function (
        endpoint,
        metodo,
        parametro,
        successCallback,
        errorCallback
    ) {
        if (confirm('Tens certeza que deseja apagar esse registro??')){
            $.ajax({
                url: this.createURL(endpoint),
                method: "DELETE",
                data: this.createDATA(metodo, parametro),
                success: (response) => {
                    this.success(response, successCallback);
                },
                error: (error) => {
                    this.error(error, errorCallback);
                },
            });
        } else {
            toats('warning',{'method':'Delete','message':'Operação cancelada com sucesso!!'})
        }
    },

    success: function (response, successCallback) {
        // Verifica se o callback de sucesso foi passado e é uma função
        if (typeof successCallback === "function") {
            successCallback(response);
        }
        // Chama o toast de sucesso
        toasts("success", response);
    },
    error: function (error, errorCallback) {
        // Verifica se o callback de erro foi passado e é uma função
        if (typeof errorCallback === "function") {
            errorCallback(error);
        }
        // Chama o toast de erro
        console.error(error);
        if (error.status == 404) {
            error = {
                responseJSON: {
                    method: "404 - Not Found",
                    message: "Pagina não encontrada ou desativada",
                }
            };
        }
        toasts("danger", error.responseJSON);
    },
};
