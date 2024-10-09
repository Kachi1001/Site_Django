const apiRequest = {
    baseUrl: api,
    createURL: function (endpoint) {
        return this.baseUrl + "/" + app + "/" + endpoint;
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
                // Verifica se o callback de erro foi passado e é uma função
                if (typeof errorCallback === "function") {
                    errorCallback(error);
                }
                // Chama o toast de erro
                console.error(error);

            toasts("warning", error.responseJSON);
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
         $.ajax({
            url: this.createURL(endpoint),
            method: "POST",
            data: this.createDATA(metodo, JSON.stringify(parametro)),
            success: (response) => {
                this.success(response, successCallback);
                return responseaa
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
        if (confirm("Tens certeza que deseja apagar esse registro??")) {
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
            toats("warning", {
                method: "Delete",
                message: "Operação cancelada com sucesso!!",
            });
        }
    },



    success: function (response, successCallback) {
        toasts("success", response);
        // Verifica se o callback de sucesso foi passado e é uma função
        if (typeof successCallback === "function") {
            successCallback(response);
        }
        // Chama o toast de sucesso
    },
    error: function (error, errorCallback) {
        toasts("danger", error.responseJSON);
        // Verifica se o callback de erro foi passado e é uma função
        if (typeof errorCallback === "function") {
            errorCallback(error);
        }
        // Chama o toast de erro
        console.error(error);

    },
};

const page = {
    redirect: function (path, params) {
        // Remove parâmetros com valores vazios, nulos ou indefinidos
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(
                ([key, value]) =>
                    value !== "" && value !== null && value !== undefined
            )
        );

        // Constrói a query string com encodeURIComponent para lidar com espaços e caracteres especiais
        const queryString = new URLSearchParams(
            Object.entries(filteredParams).map(([key, value]) => [
                key,
                encodeURIComponent(value),
            ])
        ).toString();

        // Constrói a nova URL com base no path informado e na URL atual
        const currentBaseUrl = window.location.origin; // Pega o domínio atual
        const newUrl = `${currentBaseUrl}/${app}/${path}?${queryString}`;

        // Redireciona para a nova URL
        window.location.href = newUrl;
    },
    getParam: function (param) {
        const params = new URLSearchParams(window.location.search); // Pega a query string da URL
        const values = {};

        // Itera sobre todos os parâmetros e armazena no objeto values
        params.forEach((value, key) => {
            values[key] = value.replaceAll("%20", " ");
        });

        return values[param];
    },

    // Exemplo de uso:
};

const modal = {
    open: function (name) {
        let myModal = document.getElementById(name);
        let modal = new bootstrap.Modal(myModal);
        modal.show();

    }
}