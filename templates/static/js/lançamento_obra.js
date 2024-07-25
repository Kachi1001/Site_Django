
function salvarData(metodo,parametro){
    $.ajax({
        url: "{% url 'cadastrar' %}",  // URL da sua API no Django
        type: 'POST',
        data: {
            'csrfmiddlewaretoken':"{{ csrf_token }}",
            'parametro': JSON.stringify(parametro),
            'metodo': metodo,
            'user': "{{ user }}",
        },
        success: function(Response) {
            if (confirm(Response.message+'\nClique em <OK> para recarregar a página.')){
                window.location.reload(true); 
            }
        },  
        error: function(xhr) {
            alert(xhr.responseJSON.message);
        }
    });
}
function salvar(metodo){
  if (metodo == 'funcao'){
    let parametro = {
      'funcao': document.getElementById('func_nome').value,
      'grupo' : document.getElementById('func_grupo').value,
    }
    salvarData('Funcao', parametro)
  } else if (metodo == 'super'){
    if (document.getElementById('super_ativo').checked){ativo = true} else {ativo =false}
    let parametro = {
      'supervisor': document.getElementById('super_nome').value,
      'ativo' : ativo,
    }
    salvarData('Supervisor', parametro)
  }
}
function loadTable(tableDB, tableHTML) {
  $.ajax({
      url: '{%url "get_table"%}', // URL da view Django que retorna os dados
      method: 'GET',
      data: {
          'csrfmiddlewaretoken':"{{ csrf_token }}",
          'tableDB': tableDB,
      },
      success: function(data) {
          buildTable(data, tableHTML);
      },
      error: function(error) {
          console.error('Erro ao buscar dados:', error);
      }
  });
}
  function buildTable(data, tableHTML) {
      let table = $('#'.concat(tableHTML)); // Assumindo que há uma tabela com id="myTable" no HTML

      // Construir as linhas da tabela com os dados
      if (tableHTML == 'func_table') {
          for (let i = 0; i < data.length; i++) {
              let row = '<tr>';
              row += `<td>${data[i].funcao}</td>`;
              if (data[i].grupo != null) {row += `<td>${data[i].grupo}</td>`;} 
              row += '</tr>';
              table.append(row);
          }
      }else if (tableHTML == 'super_table') {
          for (let i = 0; i < data.length; i++) {
              let checked
              let row = '<tr>';
              row += `<td>${data[i].supervisor}</td>`;
              if (data[i].ativo) {checked ='checked disabled'} else {checked='disabled'}
              row += `<td><input class="form-check-input" type="checkbox" ${checked}></td>`;
              row += '</tr>';
              table.append(row);
          }
      }
  };