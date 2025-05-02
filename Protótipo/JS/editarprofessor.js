document.addEventListener("DOMContentLoaded", async () => {
  const professorJSON = sessionStorage.getItem('professorEditar');
  if (!professorJSON) {
    console.error("Nenhum professor encontrado para edição.");
    alert("Nenhum professor encontrado.");
    window.location.href = "professores.html";
    return;
  }

  const professor = JSON.parse(professorJSON);
  document.getElementById("nome").value = professor.nome;
  document.getElementById("email").value = professor.email;
  document.getElementById("curso").value = professor.curso;

  // Adiciona listener para atualização
  document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const curso = document.getElementById("curso").value;

    try {
      const response = await fetch(`/api/professores/${professor.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, curso })
      });

      if (!response.ok) throw new Error("Erro ao atualizar professor.");

      alert("Professor atualizado com sucesso!");
      window.location.href = "professores.html";
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      alert("Erro ao atualizar professor.");
    }
  });
});

function excluir() {
  const confirmacao = confirm("Tem certeza que deseja excluir este professor?");
  if (confirmacao) {
    fetch(`/api/professores/${JSON.parse(sessionStorage.getItem('professorEditar')).email}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) throw new Error("Erro ao excluir professor.");
        alert("Professor excluído!");
        window.location.href = "professores.html";
      })
      .catch(error => {
        console.error(error);
        alert("Erro ao excluir o professor.");
      });
  }
}
