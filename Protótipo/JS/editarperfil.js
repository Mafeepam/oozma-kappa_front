document.addEventListener("DOMContentLoaded", async function () {
    const id = sessionStorage.getItem("usuarioId");
    if (!id) {
        console.warn("Usuário não autenticado. Mantendo os valores padrão.");
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:8080/api/perfil/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
  
        const perfil = await response.json();
        console.log("Dados do perfil:", perfil);
  
        document.getElementById("nome").value = perfil.nome || "";
        document.getElementById("email").value = perfil.email || "";
        document.getElementById("telefone").value = perfil.telefone || "";
        document.getElementById("curso").value = perfil.curso || "";
    } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
        alert("Erro ao carregar perfil do usuário.");
    }
});
