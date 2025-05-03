document.addEventListener("DOMContentLoaded", () => {
  const professorJSON = sessionStorage.getItem("professorEditar");
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

  document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const curso = document.getElementById("curso").value;
    
    try {
      const response = await fetch(`http://localhost:8080/api/professores/${professor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: professor.id, nome, email, curso })
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar professor, status: " + response.status);
      }
      alert("Professor atualizado com sucesso!");
      window.location.href = "professores.html";
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      alert("Erro ao atualizar professor.");
    }
  });
});

// Função para cancelar a edição e voltar para a listagem
function cancelar() {
  window.location.href = "professores.html";
}

// Função para excluir o professor a partir da página de edição
function excluir() {
  const professorJSON = sessionStorage.getItem("professorEditar");
  if (!professorJSON) {
    alert("Nenhum professor encontrado para exclusão.");
    return;
  }
  const professor = JSON.parse(professorJSON);
  
  if (confirm("Tem certeza que deseja excluir este professor?")) {
    fetch(`http://localhost:8080/api/professores/${professor.id}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao excluir professor, status: " + response.status);
        }
        alert("Professor excluído com sucesso!");
        window.location.href = "professores.html";
      })
      .catch(error => {
        console.error("Erro ao excluir professor:", error);
        alert("Erro ao excluir professor.");
      });
  }
}
