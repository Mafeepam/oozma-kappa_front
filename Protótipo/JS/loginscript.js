document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
  
    fetch('http://localhost:8080/api/login', { // Endpoint de autenticação
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    })
    .then(response => {
      if (!response.ok) throw new Error("Falha na autenticação");
      return response.json();
    })
    .then(data => {
      // Por exemplo, armazenar token ou id do usuário na sessionStorage
      sessionStorage.setItem("usuarioId", data.id);
      // Redireciona para a página apropriada com base na função do usuário
      if (data.funcao === "admin") {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'main.html';
      }
    })
    .catch(err => {
      alert('E-mail ou senha incorretos.');
      console.error(err);
    });
  });
  