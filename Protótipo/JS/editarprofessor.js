document.addEventListener("DOMContentLoaded", async () => {
  // Vamos supor que você tenha o id do professor salvo ou passado como query parameter
  const professor = JSON.parse(localStorage.getItem('professorEditar'));
  
  if (professor) {
    document.getElementById("nome").value = professor.nome;
    document.getElementById("email").value = professor.email;
    document.getElementById("curso").value = professor.curso;
  }
  
  document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const curso = document.getElementById("curso").value;

    // Supondo que o objeto professor contenha o id
    try {
      const response = await fetch(`/api/professores/${professor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, curso })
      });
      
      if (!response.ok) {
        throw new Error("Erro ao atualizar professor.");
      }
      alert("Professor atualizado com sucesso!");
      window.location.href = "professores.html";
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o professor.");
    }
  });
});
  
function cancelar() {
  window.location.href = "professores.html";
}
  
function excluir() {
  const confirmacao = confirm("Tem certeza que deseja excluir este professor?");
  if (confirmacao) {
    // Chamada para endpoint DELETE, por exemplo:
    fetch(`/api/professores/${JSON.parse(localStorage.getItem('professorEditar')).id}`, {
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
