document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = 'http://localhost:8080/api';
  
  // Carregar os espaços disponíveis na área de seleção
  const container = document.getElementById('espacos');
  if (!container) {
    console.error("Elemento com id 'espacos' não encontrado.");
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/espacos`);
    if (!response.ok) throw new Error("Erro ao carregar espaços.");
    const espacos = await response.json();
    
    espacos.forEach(espaco => {
      const card = document.createElement('div');
      card.classList.add('espaco-card');
      card.innerText = espaco.nome;
      card.dataset.id = espaco.id;  // para referência posterior
      
      // Ao clicar, remove a seleção de todos os cards e adiciona ao atual,
      // garantindo que apenas um seja selecionado por reserva.
      card.onclick = () => {
        // Remove a classe 'selected' de todos os cards
        document.querySelectorAll('.espaco-card.selected').forEach(element => {
          element.classList.remove('selected');
        });
        // Adiciona a classe 'selected' somente no card clicado
        card.classList.add('selected');
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
  if (!inicioSelect || !fimSelect) {
    console.error("Selects de horário não encontrados.");
    return;
  }
  
  for (let h = 7; h <= 22; h++) {
    const hora = h.toString().padStart(2, '0') + ":00:00";
    inicioSelect.add(new Option(hora, hora));
    fimSelect.add(new Option(hora, hora));
  }

  // Listener para o envio da reserva
  const formReserva = document.getElementById('formReserva');
  if (!formReserva) {
    console.error("Formulário de reserva não encontrado.");
    return;
  }
  
  formReserva.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = new FormData(this);
    const data = form.get('data');           // formato: yyyy-MM-dd
    const inicio = form.get("inicio");         // formato: HH:mm:ss
    const fim = form.get("fim");               // formato: HH:mm:ss

    // Validação simples de horário:
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
    
    // Monta o objeto que o backend espera. Aqui estamos assumindo que o campo "espaco"
    // armazena o ID do espaço.
    const dados = {
      data: data,
      horaInicio: inicio,
      horaFim: fim,
      espaco: espacoSelecionado.dataset.id
    };
    
    console.log("Dados da reserva:", dados);
    
    try {
      const resposta = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (!resposta.ok) throw new Error("Erro ao enviar a reserva.");
      const dataResp = await resposta.json();
      console.log("Reserva criada:", dataResp);
      alert("Reserva realizada com sucesso!");
      // Opcional: redirecionar ou limpar o formulário
    } catch (error) {
      console.error("Erro ao enviar a solicitação de reserva:", error);
      alert("Erro ao enviar a solicitação de reserva.");
    }
  });

  window.voltarParaReservas = voltarParaReservas;
});

function voltarParaReservas() {
  window.location.href = "reservas.html";
}
