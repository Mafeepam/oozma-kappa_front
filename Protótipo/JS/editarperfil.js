document.addEventListener("DOMContentLoaded", async function () {
    const id = sessionStorage.getItem("usuarioId");
    if (!id) {
        // Se não houver ID, mantenha os valores pre-estabelecidos no HTML.
        console.warn("Usuário não autenticado. Mantendo os valores padrão.");
        return;
    }
  
    try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
  
        const usuario = await response.json();
        console.log("Dados do usuário:", usuario);
  
        document.getElementById("nome").value = usuario.nome || "";
        document.getElementById("email").value = usuario.email || "";
        document.getElementById("telefone").value = usuario.telefone || "";
        document.getElementById("curso").value = usuario.curso || "";
    } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
        alert("Erro ao carregar perfil do usuário.");
    }
});
