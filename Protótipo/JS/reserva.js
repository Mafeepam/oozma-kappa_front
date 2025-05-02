document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = 'http://localhost:8080/api';
  let reservas = [];

  // Função que carrega os dados de reservas do backend
  async function carregarReservas() {
    try {
      const response = await fetch(`${API_BASE}/reservas`);
      if (!response.ok) throw new Error("Erro ao carregar reservas.");
      
      // Aqui atribuímos o array completo de objetos de reservas
      reservas = await response.json();
      renderReservationList();
    } catch (error) {
      console.error('Erro ao carregar reservas do banco:', error);
    }
  }

  // Função para redirecionar para a tela de nova reserva
  function abrirFormularioReserva() {
    window.location.href = "nova_reserva.html";
  }

  // Função que renderiza os cards de reserva na tela
  function renderReservationList() {
    const container = document.getElementById("listaReservas");
    if (!container) {
      console.error("Elemento com id 'listaReservas' não encontrado.");
      return;
    }
    container.innerHTML = ""; // Limpa o container

    reservas.forEach(reserva => {
      const card = document.createElement("div");
      card.className = "reserva-card";

      // Converte a data para um formato legível (ex: "01/05/2025")
      const dataReserva = new Date(reserva.data);
      const dia = dataReserva.getDate().toString().padStart(2, '0');
      const mes = (dataReserva.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataReserva.getFullYear();
      const dateStr = `${dia}/${mes}/${ano}`;

      // Cria o conteúdo do card com data, horário e o nome do espaço reservado
      card.innerHTML = `
        <h4>${dateStr}</h4>
        <p>Horário: ${reserva.horaInicio} - ${reserva.horaFim}</p>
        <p>Espaço: ${reserva.espaco}</p>
      `;
      container.appendChild(card);
    });
  }

  await carregarReservas();

  // Expor a função para abrir a tela de nova reserva se necessário
  window.abrirFormularioReserva = abrirFormularioReserva;
});
