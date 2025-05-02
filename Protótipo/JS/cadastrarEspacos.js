document.getElementById('cadastroForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const tipo = document.getElementById('tipo').value;  // Agora, esse valor será "sala", "laboratorio" ou "auditorio"
  const capacidade = parseInt(document.getElementById('capacidade').value, 10);

  const novoEspaco = { nome, tipo, capacidade };
  
  console.log("Dados enviados:", novoEspaco); // Verifique os dados no console

  fetch('http://localhost:8080/api/espacos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoEspaco)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Falha no cadastro do espaço.");
      }
      return response.json();
    })
    .then(data => {
      console.log("Espaço cadastrado:", data);
      window.location.href = "espacosacademicos.html";
    })
    .catch(err => {
      console.error("Erro ao cadastrar espaço:", err);
      alert("Erro ao cadastrar espaço. Verifique os dados e tente novamente.");
    });
});

function cancelarCadastro() {
  window.location.href = "espacosacademicos.html";
}
