const True = true;
const False = false;
print = console.log
class KeyPressing{static k=[];static i(){document.addEventListener('keydown',(e)=>{const c=e.keyCode;if(KeyPressing.k.includes(c)==!1){KeyPressing.k.push(c)}}); document.addEventListener('keyup',(e)=>{const c=e.keyCode;if(KeyPressing.k.includes(c)==!0){const a=KeyPressing.k.indexOf(c);if(a!==-1){KeyPressing.k.splice(a,1)}}})} static isKeyPressed(c){return KeyPressing.k.includes(c)}}KeyPressing.i()
$(document).ready(() =>{
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}) 
function set_theme() {
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
    $('html').attr ('data-bs-theme', localStorage.getItem('theme'))
}
set_theme()
const date = {
    adicionarZero: function (value) {
        if (value <= 9) return "0" + value;
        else return value;
    },
};
const apiRequest = {
    baseUrl: api,
    createURL: function (endpoint) {
        return this.baseUrl + app + "/" + endpoint;
    },
    get: function (endpoint, params = undefined) {
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
                if (response.status === 401) {
                    page.to("login", {
                        login: user,
                        next: `${window.location.pathname}${window.location.search}`,
                    });
                } else if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw errorData; // Lança os dados de erro
                    });
                }
                return response.json(); // Converte a resposta em JSON se a requisição foi bem-sucedida
            })
            .catch((error) => {
                console.error("Erro na requisição GET:", error);
                throw error;
            });
    },
    post: function (endpoint, parametro) {
        return fetch(this.createURL(endpoint), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(parametro),
        })
            .then((response) => {
                if (response.status === 401) {
                    page.to("login", {
                        login: user,
                        next: window.location.pathname,
                    });
                } else if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(() => {
                this.success({
                    method: "Registrado com êxito!",
                    message: "Foi concluído com sucesso a operação.",
                });
            })
            .catch(this.error);
    },
    update: function (endpoint, parametro) {
        return fetch(this.createURL(endpoint), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify(parametro),
        })
            .then((response) => {
                if (response.status === 401) {
                    page.to("login", {
                        login: user,
                        next: window.location.pathname,
                    });
                } else if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(() => {
                this.success({
                    method: "Atualizado com êxito!",
                    message: "Seu registro foi atualizado com sucesso.",
                });
            })
            .catch(this.error);
    },
    upload: function (endpoint, formData) {
        return fetch(this.createURL(endpoint), {
            method: "POST",
            body: formData, // Use o FormData criado
            headers: {
                // O Content-Type é automaticamente configurado pelo FormData
                "X-CSRFToken": csrftoken, // Inclua o CSRF token, se necessário
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(() => {
                this.success({
                    method: "Registrado com êxito!",
                    message: "Foi concluído com sucesso a operação.",
                });
            })
            .catch(this.error);
    },

    delete: function (endpoint, parametro) {
        if (confirm("Tem certeza que deseja apagar esse registro?")) {
            return fetch(this.createURL(endpoint), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify(parametro),
            })
                .then((response) => {
                    if (response.status === 401) {
                        page.to("login", {
                            login: user,
                            next: window.location.pathname,
                        });
                    } else if (!response.ok) {
                        throw response;
                    }
                })
                .then(() =>{
                        this.success({
                            method: "Deletado com êxito!",
                            message: "Registro deletado com sucesso.",
                        });
                    })
                .catch(this.error);
        } else {
            toasts("warning", {
                method: "Operação cancelada",
                message: "Cancelada pelo usuário",
            });
        }
    },

    touch: function (endpoint) {
        fetch(this.createURL(endpoint), {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    page.to("login", {
                        login: user,
                        next: window.location.pathname,
                    });
                } else if (!response.ok) {
                    throw response;
                }
                this.success({
                    method: "Sucesso!",
                    message: "Função executada com sucesso.",
                });
            })
            .catch(this.error);
    },

    success: function (response) {
        toasts("success", response);

        // Chama o toast de sucesso
    },
    error: function (error) {
        // toasts("danger", error);
        // Verifica se o callback de erro foi passado e é uma função
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
                        message: `[${key.toLocaleUpperCase()}] ${errMessage[key]
                            }`,
                    });
                });
            })
            .catch(() => {
                console.error("Erro ao interpretar a resposta de erro.");
                toasts("warning", {
                    method: "Ocorreu um erro inesperado!",
                    message: "Tente atualizar seu navegador <Ctrl + F5>, caso erro persistir entre em contato WhatsApp encontrado no superior direito",
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
    setParam: function (param, value) {
        const params = new URLSearchParams(window.location.search); // Pega a query string da URL
        const values = {};

        // Itera sobre todos os parâmetros e armazena no objeto values
        result = '?'
        params.forEach((value, key) => {
            values[key] = value.replaceAll("%20", " ");
        });
        values[param] = value

        for (x in values) {
            result += `${x}=${values[x]}&`
        }
        console.log(result)


        location.search = result
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
    to: function (path, params) {
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
        const currentBaseUrl = window.location.origin; // Pega o domínio atual
        const newUrl = `${currentBaseUrl}/${path}?${queryString}`;

        // Redireciona para a nova URL
        window.location.href = newUrl;
    },
    new: function (url) {
        window.open(url, '_blank')
    }
    // Exemplo de uso:
};

// const modal = {
//     open: function (name) {
//         let modal = new bootstrap.Modal(document.getElementById(name));
//         modal.show();
//     },
// };

const populate = {};
function isValidDate(dateString) {
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(dateString);
}

function confirmarCheck(field) {
    campo = $('#'+field)
    if (campo.prop("checked")) {
        if (!confirm('Tem certeza da ação precedida??')) {
            campo.prop('checked', false);
        }
    }
}
function abrirWhats(id) {
    var number = $('#'+id).val()
    if (!number) {
        toasts('warning', {'method':'Sem número cadastrado!','message':'Cadastre um número antes de tentar chama-lo no whatsapp'})
    } else {
        number = number.replaceAll('(','').replaceAll(')','').replaceAll('-','').replaceAll(' ','').replaceAll('+','')
        url = `https://wa.me/${number}`
        page.new(url)
    }
}
function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function removeFromArray(array, value) {
    if (!Array.isArray(array)) {
        throw new Error("O primeiro argumento deve ser um array.");
    }

    const valuesToRemove = new Set(
        Array.isArray(value) ? value : [value]
    );

    return array.filter(item => !valuesToRemove.has(item));
}

const generic = {
    readFields: (loader) => {
        let data = {};
        const inputs = loader.inputs;
        const fields = inputs.text.concat(inputs.select); // Junta os campos de texto e campos de seleção

        fields.forEach((field) => {
            val = $("#" + loader.prefix + field).val();

            data[field] = val || null;
        });
        inputs.check.forEach((check) => {
            data[check] = $("#" + loader.prefix + check).prop("checked") || false;
        });

        return data;
    }
}