const urlAPI = api + '/' + app +'/'
apiRequest.app = "reservas";
var loaded;

function reload(param) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let value = document.getElementById("data-picker").value;

    // Atualizar o valor do parâmetro
    params.set(param, value);

    // Atualizar a URL no navegador e recarregar a página
    window.location.href = `${url.pathname}?${params}`;
}

const horarios = [
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
];
function Reserva_rapida() {
    if (loaded != "reserva_rapida") {
        loaded = "reserva_rapida";
        for (let i = 0; i < horarios.length - 1; i++) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel1").append(opt);
        }
        for (let i = 1; i < horarios.length; i++) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel2").append(opt);
        }
    }
    $("#reserva_rapida-sel1").change(function () {
        $("#reserva_rapida-sel2").empty();
        let inicio = $("#reserva_rapida-sel1").val();
        inicio++;
        for (let i = inicio; i < horarios.length; i++) {
            let opt = document.createElement("option");
            opt.value = i;
            opt.text = horarios[i];
            $("#reserva_rapida-sel2").append(opt);
        }
    });
    $("#reserva_rapida-sala").change(function () {
        document.getElementById("reserva_rapida-img").src = `/static/image/Reservas/${$(
            "#reserva_rapida-sala"
        ).val()}.jpg`;
    });
    $("#reserva_rapida-submit").click(function () {
        const responsavel = $("#reserva_rapida-responsavel").val()
        const descricao = $("#reserva_rapida-descricao").val()
        const data = $("#reserva_rapida-data").val()
        if (responsavel == '' || data == '') {
            toasts('warning',{'method':'Reserva','message':'Falta alguma informação revise!!'})
            return
        }
        let reservas = [];
        let inicio = parseInt($("#reserva_rapida-sel1").val());
        let fim = parseInt($("#reserva_rapida-sel2").val());
        for (i = inicio; i < fim; i++) {
            reservas.push({
                hora: horarios[i],
                responsavel: responsavel,
                descricao: descricao,
            });
        }
        parametro = {
            reservas: JSON.stringify(reservas),
            data: $("#reserva_rapida-data").val(),
            sala: $("#reserva_rapida-sala").val(),
        };
        apiRequest.post("register", "reservar_sala", parametro, function(){
            load(false)
        });
    });
}

function reserva_simples(sala) {
    let reservas = [];
    let resp = null;
    let desc = "";
    for (i = 0; i < horarios.length; i++) {
        hora = horarios[i].replace(":", "\\:");
        if (
            $("#check" + hora).is(":checked") &&
            !$("#check" + hora).is(":disabled")
        ) {            
            if (resp == null && $("#responsavel" + hora).val() == "") {
                toasts('danger',{'method':'Reserva Sala','message':'O registro precisa ter um responsável!'})
                return;
            } else if ($("#responsavel" + hora).val() != "") {
                resp = $("#responsavel" + hora).val();
            }
            if ($("#descricao" + hora).val() != "") {
                desc = $("#descricao" + hora).val();
            }
            reservas.push({
                hora: hora.replace("\\:", ":"),
                responsavel: resp,
                descricao: desc,
            });
        }
    }
    parametro = {
        sala: sala,
        data: $("#data-picker").val(),
        reservas: JSON.stringify(reservas),
    };
    if (reservas.length == 0) {
        toasts('warning',{'method':'Reserva Sala','message':'Nenhuma reserva salva!!'})
        return;
    }
    // registarAJAX(parametro, 'reservar_sala');
    apiRequest.post("register", "reservar_sala", parametro, function(){
        load(true)
    });
}
async function loadReservas(sala, data) {
    manha = await apiRequest.get('agenda_sala',{'sala':sala,'data':data,'horario':'manha'})
    populateReservas(manha.dados, "manha");
    
    tarde = await apiRequest.get('agenda_sala',{'sala':sala,'data':data,'horario':'tarde'})
    populateReservas(tarde.dados, "tarde");
            // apiRequest.get(
            //     "get",
            //     sala,
            //     JSON.stringify({ data: data, horario: "manha" }),
            //     function (response) {
            //     }
            // );
            // apiRequest.get(
            //     "get",
            //     sala,
            //     JSON.stringify({ data: data, horario: "tarde" }),
            //     function (response) {
            //         populateReservas(response.dados, "tarde");
            //     }
            // );
        }
function populateReservas(response, horario) {
    tabela = $(`#tabela_${horario}`);
    tabela.empty();
    for (let x in response) {
        x = response[x];
        tabela.append(
            `<tr>` +
                `<th scope="row">` +
                `<input class="form-check-input" type="checkbox" id="check${x.hora}"${x.reservado}>` +
                `</th>` +
                `<th scope="row">` +
                `<p class="mb-0">${x.hora}</p>` +
                `</th>` +
                `<th scope="row">` +
                `<div class="input-group input-group-sm">` +
                `<input type="text" class="form-control" id="responsavel${x.hora}" value="${x.responsavel || ""}" placeholder="Responsável" ${x.reservado
                }>` +
                `</div>` +
                `</th>` +
                `<th scope="row">` +
                `<div class="input-group input-group-sm">` +
                `<input type="text" class="form-control" id="descricao${
                    x.hora
                }" value="${x.descricao || ""}" placeholder="Descrição" ${
                    x.reservado
                }>` +
                `</div>` +
                `</th>` +
                `</tr>`
        );
    }
}
