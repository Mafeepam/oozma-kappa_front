document.addEventListener('DOMContentLoaded', async () => {

  // Carregar os espaços disponíveis na área de seleção
  const container = document.getElementById('espacos');
  try {
    const response = await fetch('http://localhost:8080/api/espacos');  // Verifique este endpoint do seu backend
    if (!response.ok) throw new Error("Erro ao carregar espaços.");
    const espacos = await response.json();
    
    espacos.forEach(espaco => {
      const card = document.createElement('div');
      card.classList.add('espaco-card');
      card.innerText = espaco.nome;
      card.dataset.id = espaco.id;  // ou espaco.nome, conforme sua lógica
      card.onclick = () => {
        card.classList.toggle('selected');
      };
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar os espaços disponíveis.");
  }

  // Configurar os selects de horário
  const inicioSelect = document.getElementById('inicio');
  const fimSelect = document.getElementById('fim');
  for (let h = 7; h <= 22; h++) {
    const hora = h.toString().padStart(2, '0') + ":00:00";
    inicioSelect.add(new Option(hora, hora));
    fimSelect.add(new Option(hora, hora));
  }

  // Listener para o envio da reserva
  document.getElementById('formReserva').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = new FormData(this);
    const data = form.get('data');           // formato: yyyy-MM-dd
    const inicio = form.get("inicio");         // formato: HH:mm:ss
    const fim = form.get("fim");               // formato: HH:mm:ss

    // Aqui, adicione validações de horário se necessário, por exemplo..
    const h1 = parseInt(inicio.split(":")[0]);
    const h2 = parseInt(fim.split(":")[0]);
    if (h2 <= h1 || h2 - h1 > 4) {
      alert("A duração da reserva deve ser de no máximo 4 horas e o horário final deve ser após o inicial.");
      return;
    }
    
    const espacoSelecionado = document.querySelector('.espaco-card.selected');
    if (!espacoSelecionado) {
      alert("Selecione pelo menos um espaço.");
      return;
    }
    
    // Monte o objeto que o backend espera. Se você estiver armazenando o ID do espaço por exemplo:
    const dados = {
      data: data,
      horaInicio: inicio,
      horaFim: fim,
      espaco: espacoSelecionado.dataset.id
    };
    
    console.log("Dados da reserva:", dados);
    
    try {
      const resposta = await fetch('http://localhost:8080/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (!resposta.ok) throw new Error("Erro ao enviar a reserva.");
      const dataResp = await resposta.json();
      console.log("Reserva criada:", dataResp);
      alert("Reserva realizada com sucesso!");
      // Aqui você pode, por exemplo, redirecionar ou limpar o formulário
    } catch (error) {
      console.error("Erro ao enviar a solicitação de reserva:", error);
      alert("Erro ao enviar a solicitação de reserva.");
    }
  });
});
