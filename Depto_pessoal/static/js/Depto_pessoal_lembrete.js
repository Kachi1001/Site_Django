
function carregar() {
        apiRequest.get('lembrete/status',function(response){
            $("#" + 'f_painel_lembrete_online').prop("checked", response);
        })
}
$(document).ready(function(){
    carregar()
})



Submit = {
    update: function(loader){
            apiRequest.update('update',loader.object,this.readFields(loader),function(){
                loader.modal.hide();
            })
    },
    register: function(loader){
        try{
            apiRequest.post('register',loader.object,this.readFields(loader),function(){
                loader.refresh()
            })
        } catch {
            throw error
        }
    },
    funcao: function(loader){
        try{apiRequest.post('function',loader.object,this.readFields(loader),function(){
            loader.modal.hide();
            carregarDados()
        })} catch {
            throw error
        }
    },
    toggle: function(){
        apiRequest.touch('lembrete/toggle',function(){
            // recarregar pagina
        })
    }
}