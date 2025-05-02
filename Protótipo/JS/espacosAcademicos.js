document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('http://localhost:8080/api/espacos');
    if (!response.ok) throw new Error("Não foi possível carregar os espaços.");
    const listaEspacos = await response.json();
    renderizarTabela(listaEspacos);
  } catch (error) {
    console.error("Erro ao buscar espaços:", error);
    alert("Erro ao carregar os espaços acadêmicos.");
  }
});

function renderizarTabela(lista) {
  const tbody = document.getElementById("tabela-espacos");
  tbody.innerHTML = "";
  
  lista.forEach((espaco) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${espaco.nome}</td>
      <td>${espaco.tipo}</td>
      <td>${espaco.capacidade}</td>
      <td>
        <button class="btn-editar" onclick="editarEspaco('${espaco.id}')">Editar</button>
        <button class="btn-excluir" onclick="excluirEspaco('${espaco.id}', '${espaco.nome}')">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


function editarEspaco(id) {
  // Aqui você pode redirecionar para a página de edição passando o id na URL ou armazenar em sessionStorage
  window.location.href = `editarEspaco.html?id=${id}`;
}

function excluirEspaco(id, nome) {
  if (confirm(`Deseja excluir o espaço "${nome}"?`)) {
    fetch(`http://localhost:8080/api/espacos/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir espaço.");
        // Recarrega os espaços após a exclusão
        return fetch('http://localhost:8080/api/espacos');
      })
      .then(response => response.json())
      .then(listaAtualizada => {
        renderizarTabela(listaAtualizada);
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao excluir o espaço.");
      });
  }
}

