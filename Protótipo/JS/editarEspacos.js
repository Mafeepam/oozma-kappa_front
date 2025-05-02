document.addEventListener("DOMContentLoaded", async () => {
  // Extrai o parâmetro 'id' da URL (ex: editarEspaco.html?id=3)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID do espaço não informado.");
    return;
  }

  try {
    // Use a URL absoluta para garantir
    const response = await fetch(`http://localhost:8080/api/espacos/${id}`);
    if (!response.ok) throw new Error("Espaço não encontrado.");
    const espaco = await response.json();

    // Preenche os inputs com os dados retornados
    document.getElementById("nome").value = espaco.nome;
    document.getElementById("tipo").value = espaco.tipo;
    document.getElementById("capacidade").value = espaco.capacidade;
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do espaço.");
  }
});

function salvarEspaco() {
  const nome = document.getElementById("nome").value.trim();
  const tipo = document.getElementById("tipo").value;
  const capacidade = parseInt(document.getElementById("capacidade").value, 10);

  if (!nome || isNaN(capacidade) || capacidade <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // Extrai o id novamente da URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  if (!id) {
    alert("Erro ao localizar espaço. Por favor, recarregue a página.");
    return;
  }

  const espacoAtualizado = { nome, tipo, capacidade };

  fetch(`http://localhost:8080/api/espacos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(espacoAtualizado)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Falha ao atualizar espaço.");
      }
      return response.json();
    })
    .then(data => {
      window.location.href = "espacosacademicos.html";
    })
    .catch(error => {
      console.error("Erro ao atualizar espaço:", error);
      alert("Erro ao atualizar o espaço.");
    });
}

function cancelarEdicao() {
  window.location.href = "espacosacademicos.html";
}
