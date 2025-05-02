document.getElementById('formEsqueciSenha').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('emailRecuperar').value;
    const mensagem = document.getElementById('mensagem');
  
    fetch('http://localhost:8080/api/enviar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
        mensagem.textContent = data.message || "Senha enviada com sucesso!";
        mensagem.style.color = 'green';
    })
    .catch(err => {
        mensagem.textContent = 'Erro ao enviar o e-mail.';
        mensagem.style.color = 'red';
        console.error(err);
    });
  });
  