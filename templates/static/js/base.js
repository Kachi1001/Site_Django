const True = true;
const False = false;
const date ={
    adicionarZero: function (value) {
        if (value <= 9)
            return "0" + value;
        else
            return value;
    }
}
const apiRequest = {
    baseUrl: api,
    createURL: function (endpoint) {
        return this.baseUrl + app + "/" + endpoint;
    },
    createDATA: function (metodo, parametro) {
        return {
            metodo: metodo,
            parametro: parametro,
            // user: user,
        };
    },
    get: function (endpoint, params = undefined, errorCallback) {
        console.log(this.createURL(endpoint));
        const url = new URL(this.createURL(endpoint));
        if (typeof params === "object") {
            Object.keys(params).forEach((key) =>
                url.searchParams.append(key, params[key])
            );
        }

        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw errorData; // Lança os dados de erro
                    });
                }
                return response.json(); // Converte a resposta em JSON se a requisição foi bem-sucedida
            })
            .catch((error) => {
                if (typeof errorCallback === "function") {
                    errorCallback(error); // Chama o callback de erro com os dados de erro
                } else {
                    console.error("Erro na requisição GET:", error, url);
                }
            });
    },
    post: function (endpoint, parametro, successCallback, errorCallback) {
        parametro.user = user
        return fetch(this.createURL(endpoint), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parametro),
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(() => {
                this.success({'method':'Registrado com êxito!','message':'Foi concluído com sucesso a operação.'}, successCallback);
            })
            .catch((error) => {
                this.error(error, errorCallback);
            });
    },
    update: function (endpoint, parametro, successCallback, errorCallback) {
        fetch(this.createURL(endpoint), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parametro),
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then((data) => {
                this.success({'method':'Atualizado com êxito!','message':'Seu registro foi atualizado com sucesso.'}, successCallback);
            })
            .catch((error) => {
                this.error(error, errorCallback);
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
                error = error.responseJSON
                Object.keys(error).forEach((key) => {
                    toasts("danger", {
                        method: "Registro",
                        message: `[${key.toLocaleUpperCase()}] ${
                            error[key]
                        }`,
                    });
                });
                // Verifica se o callback de erro foi passado e é uma função
                if (typeof errorCallback === "function") {
                    errorCallback(error);
                }
                // Chama o toast de erro
                console.error(error);
            },
        });
    },

    delete: function (endpoint, successCallback, errorCallback) {
        parametro = {'user': user}
        if (confirm("Tem certeza que deseja apagar esse registro?")) {
            fetch(this.createURL(endpoint), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parametro),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw response;
                    }
                    console.error(response);
                    this.success(
                        {
                            method: "Deletado com êxito!",
                            message: "Registro deletado com sucesso.",
                        },
                        successCallback
                    );
                })
                .catch((error) => {
                    console.error("Erro:", error);

                    this.error(error, errorCallback);
                });
        } else {
            toasts("warning", {
                method: "Operação cancelada",
                message: "Cancelada pelo usuário",
            });
        }
    },

    touch: function (endpoint, successCallback, errorCallback) {
        fetch(this.createURL(endpoint), {
            method: "POST",
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                console.error(response);
                this.success(
                    {
                        method: "Sucesso!",
                        message: "Função executada com sucesso.",
                    },
                    successCallback
                );
            })
            .catch((error) => {
                console.error("Erro:", error);

                this.error(error, errorCallback);
            });
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
        // toasts("danger", error);
        // Verifica se o callback de erro foi passado e é uma função
        if (typeof errorCallback === "function") {
            errorCallback(error);
        }
        // Chama o toast de erro
        console.error(error);

        error
            .json()
            .then((errMessage) => {
                console.error(errMessage);
                console.debug(Object.keys(errMessage));
                Object.keys(errMessage).forEach((key) => {
                    toasts("danger", {
                        method: "Registro",
                        message: `[${key.toLocaleUpperCase()}] ${
                            errMessage[key]
                        }`,
                    });
                });
            })
            .catch(() => {
                console.error("Erro ao interpretar a resposta de erro.");
                toasts("warning", {
                    method: "Ocorreu um erro inesperado!", 
                    message: "Erro ao interpretar a resposta de erro.",
                });
            });
    },
};

const page = {
    redirect: function (path, params) {
        queryString = "";
        if (typeof params != "undefined") {
            // Remove parâmetros com valores vazios, nulos ou indefinidos
            const filteredParams = Object.fromEntries(
                Object.entries(params).filter(
                    ([key, value]) =>
                        value !== "" && value !== null && value !== undefined
                )
            );

            // Constrói a query string com encodeURIComponent para lidar com espaços e caracteres especiais
            queryString = new URLSearchParams(
                Object.entries(filteredParams).map(([key, value]) => [
                    key,
                    encodeURIComponent(value),
                ])
            ).toString();
        }

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
    refresh: function () {
        location.reload();
    },

    // Exemplo de uso:
};

// const modal = {
//     open: function (name) {
//         let modal = new bootstrap.Modal(document.getElementById(name));
//         modal.show();
//     },
// };

const populate = {};
