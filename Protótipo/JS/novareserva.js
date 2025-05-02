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
      
      // Garante que somente um espaço seja selecionado.
      card.onclick = () => {
        document.querySelectorAll('.espaco-card.selected')
          .forEach(el => el.classList.remove('selected'));
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

    // Validação de horário (o fim precisa ser após o início e a duração máxima é de 4 horas)
    const hInicio = parseInt(inicio.split(":")[0]);
    const hFim = parseInt(fim.split(":")[0]);
    if (hFim <= hInicio || hFim - hInicio > 4) {
      alert("A duração da reserva deve ser de no máximo 4 horas e o horário final deve ser após o inicial.");
      return;
    }
    
    const espacoSelecionado = document.querySelector('.espaco-card.selected');
    if (!espacoSelecionado) {
      alert("Selecione pelo menos um espaço.");
      return;
    }
    
    // Antes de enviar, busca todas as reservas para verificar duplicidade
    try {
      const resp = await fetch(`${API_BASE}/reservas`);
      if (!resp.ok) throw new Error("Erro ao carregar reservas para verificação.");
      const reservasExistentes = await resp.json();
      
      // Supondo que o backend envia 'data' no formato ISO "yyyy-MM-dd"
      // e que já estamos armazenando ou exibindo o nome do espaço
      const reservaDuplicada = reservasExistentes.find(r =>
        r.data === data &&
        r.horaInicio === inicio &&
        r.horaFim === fim &&
        r.espaco === espacoSelecionado.innerText
      );
      
      if (reservaDuplicada) {
        alert("Já existe uma reserva para esta data, horário e espaço.");
        return;
      }
    } catch (error) {
      console.error("Erro na verificação de reservas duplicadas:", error);
      alert("Não foi possível verificar reservas existentes.");
      return;
    }
    
    // Monta o objeto de dados a ser enviado; usamos innerText para enviar o nome do espaço
    const dados = {
      data: data,
      horaInicio: inicio,
      horaFim: fim,
      espaco: espacoSelecionado.innerText
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
      // Aqui você pode limpar o formulário ou redirecionar, se desejado.
    } catch (error) {
      console.error("Erro ao enviar a solicitação de reserva:", error);
      alert("Erro ao enviar a solicitação de reserva.");
    }
  });

  // Expor a função para voltar à página de reservas
  window.voltarParaReservas = voltarParaReservas;
});

function voltarParaReservas() {
  window.location.href = "reservas.html";
}
