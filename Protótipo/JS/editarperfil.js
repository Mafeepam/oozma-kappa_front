document.addEventListener("DOMContentLoaded", async function () {
  const id = sessionStorage.getItem("usuarioId");
  if (!id) {
      alert("Usuário não autenticado.");
      window.location.href = "/login_1.html"; // Corrija o redirecionamento se necessário
      return;
  }

  try {
      // Ajuste a URL para seu endpoint real (por exemplo, /api/usuarios/{id})
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");

      const usuario = await response.json();

      document.getElementById("nome").value = usuario.nome || "";
      document.getElementById("email").value = usuario.email || "";
      document.getElementById("telefone").value = usuario.telefone || "";
      document.getElementById("curso").value = usuario.curso || "";
  } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
      alert("Erro ao carregar perfil do usuário.");
  }
});
