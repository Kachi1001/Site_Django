function removeColumns(value) {
    if (value in columns.inputs) {
        columns.inputs.slice(columns.inputs.indexOf(value), 1);
    } else if (value in columns.checks) {
        columns.checks.slice(columns.checks.indexOf(value), 1);
    } else if (value in columns.select) {
        columns.select.slice(columns.select.indexOf(value), 1);
    }
}
var loaded = {'resource':'','reload':'function'}

$(document).ready(async () => {
    try {
        load();
    } catch {
        console.log("Tela sem inicializador");
    }
});

const generics = {
    populate: {
        select: async (id, data) => {
            const selectHTML = $("#".concat(id));
            console.log(selectHTML);
            selectHTML.empty();
            await data.forEach((element) => {
                let opt = document.createElement("option");
                opt.value = element.value || element.text;
                opt.text = element.text || element.value;
                selectHTML.append(opt);
            });
        },
        table: async (prefix, data, feature) => {
            try {
                const tabela = document.getElementById(prefix + "table");
                const thead = tabela.querySelector("thead tr");
                thead.innerHTML = "";
                const tbody = tabela.querySelector("tbody");
                tbody.innerHTML = "";
                if (data.length > 0) {
                    const keys = Object.keys(data[0]);

                    keys.forEach((key) => {
                        const th = document.createElement("th");
                        th.textContent =
                            key.charAt(0).toUpperCase() + key.slice(1);
                        thead.appendChild(th);
                    });
                    if (this.type != "table") {
                        const thRemove = document.createElement("th");
                        thRemove.textContent = "Ações";
                        thead.appendChild(thRemove);
                    }

                    data.forEach((obj) => {
                        const row = document.createElement("tr");
                        keys.forEach((key) => {
                            const cell = document.createElement("td");
                            if (typeof obj[key] === "boolean") {
                                const checkbox =
                                    document.createElement("input");
                                checkbox.type = "checkbox";
                                checkbox.disabled = true;
                                checkbox.checked = obj[key];
                                if (loaded.resource == 'supervisor') {
                                    checkbox.disabled = false;
                                    checkbox.addEventListener('click', () =>{
                                        apiRequest.update(`${loaded.resource}/${obj.id}`, {'id':obj.id, 'ativo':!obj[key]})
                                    })
                                }
                                cell.appendChild(checkbox);
                            } else {
                                cell.textContent = obj[key];
                            }
                            row.appendChild(cell);
                        });
                        if (feature) {
                            const extraCell = document.createElement("td");
                            extraCell.classList.add("d-flex");

                            const deleteButton = document.createElement("i");
                            deleteButton.classList.add(
                                "btn-icon",
                                "bg-danger",
                                "bi-trash3",
                                "fs-6",
                                "me-1"
                            );

                            deleteButton.addEventListener("click", () => {
                                // console.log(reload.open.carregar_table)
                                apiRequest.delete(`${loaded.resource}/${obj.id}`,()=>{
                                    loaded.reload()
                                });
                            });

                            const editButton = document.createElement("i");
                            editButton.classList.add(
                                "btn-icon",
                                "bg-primary",
                                "bi-pencil",
                                "fs-6",
                                "me-1"
                            );

                            editButton.addEventListener("click", () => {
                                // let modal = new Modal(
                                //     this.object.split("-")[1],
                                //     "update"
                                // );
                                // modal.open(obj.id);
                            });
                            if (feature.delete) {
                                extraCell.appendChild(deleteButton);
                            }
                            if (feature.edit) {
                                extraCell.appendChild(editButton);
                            }

                            row.appendChild(extraCell);
                        }
                        tbody.appendChild(row);
                    });
                }
            } catch (error) {
                throw error;
            }
        },
        data: async (resource, prefix, data) => {
            try {
                resource.text.forEach((field) => {
                    $("#" + prefix + field).val(data[field]);
                });

                resource.select.forEach((field) => {
                    apiRequest.get(`select/${field}`).then((selects) => {
                        generics.populate
                            .select(prefix + field, selects)
                            .then(() => {
                                $("#" + prefix + field).val(data[field]);
                            });
                    });
                });

                resource.check.forEach((field) => {
                    $("#" + prefix + field).prop("checked", data[field]);
                });
            } catch (error) {
                throw error;
            }
        },
    },
    load: {
        resource: function (type) {
            return apiRequest.get(`resource/${type}`);
        },
        register: async function (resource) {
            const resource_fields = await generics.load.resource(resource);

            const prefix = `form_${resource}_`;

            resource_fields.select.forEach(async (select) => {
                data = await apiRequest.get(`select/${select}`);
                this.populate.select(prefix + select, data);
            });

            $(`#${prefix}submit`).on("click", async () => {
                data = await this.reader.fields(resource_fields, prefix);
                apiRequest.post(resource, data).then(() => {
                    $("#table").bootstrapTable("refresh");
                });
            });
        },
    },
    reader: {
        fields: async (resource, prefix) => {
            var data = {};
            const fields = {}
            fields.text = resource.text || []
            fields.select = resource.select || []
            fields.check = resource.check || []

            text = fields.text.concat(fields.select)
            text.forEach((field) => {
                console.log("#" + prefix + field)
                val = $("#" + prefix + field).val() || null;
                data[field] = val;
            });

            fields.check.forEach((check) => {
                    data[check] = $("#" + prefix + check).prop("checked");
                });

            return data;
        },
    },
    submit: {
        simples: function () {
            console.log("num fiz ainda");
        },
    },
};
const modal = {
    open: async function (method, resource, id = undefined) {
        modal_name = `m_${method}-${resource}`;
        console.log(modal_name);
        const modal = new bootstrap.Modal(document.getElementById(modal_name));
        loaded.resource = resource
        const prefix = modal_name + "_";
        const resource_fields = await generics.load.resource(resource);
        switch (method) {
            case "register":
                if (resource_fields.select != undefined) {
                    resource_fields.select.forEach(async (select) => {
                        data = await apiRequest.get(`select/${select}`);
                        generics.populate.select(prefix + select, data);
                    });
                }
                async function carregar_table(){
                    table_data = await apiRequest.get(resource);
                    generics.populate
                        .table(prefix, table_data, { delete: true, edit: false })
                        .then(() => {
                            modal.show();
                        });
                }
                loaded.reload = carregar_table

                carregar_table()
                $(`#${prefix}submit`)
                    .off()
                    .on("click", async () => {
                        const data = await generics.reader.fields(resource_fields, prefix);
                        apiRequest.post(resource, data).then(() => {
                            carregar_table()
                        });
                    });
                break;
            case "update":
                const data = await apiRequest.get(resource + "/" + id);
                const endpoint = `${resource}/${id}`;
                generics.populate
                    .data(resource_fields, prefix, data)
                    .then(() => {
                        modal.show();
                    });
                $(`#${prefix}del`)
                    .off()
                    .on("click", async () => {
                        apiRequest.delete(endpoint, () => {
                            modal.hide();
                            $("#table").bootstrapTable("refresh");
                        });
                    });
                $(`#${prefix}save`)
                    .off()
                    .on("click", async () => {
                        new_data = await generics.reader.fields(
                            resource_fields,
                            prefix
                        );
                        apiRequest.update(endpoint, new_data, () => {
                            modal.hide();
                            $("#table").bootstrapTable("refresh");
                        });
                    });
                break;
            case "image":
                image = document.getElementById(`${prefix}imagem`);
                image.src = `http://10.0.0.139/media/Lancamento_obra/${resource}/${id}.jpeg`;
                modal.show();
        }
    },
};
