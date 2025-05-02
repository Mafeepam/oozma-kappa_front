document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:8080/api';

  let reservas = [];
  
  async function carregarReservas() {
    try {
      const response = await fetch(`${API_BASE}/reservas`);
      if (!response.ok) throw new Error("Erro ao carregar reservas.");
      const data = await response.json();
      // Mapeia para um array com formato [ano, mês, dia]
      reservas = data.map(r => {
        // Supondo que r.data esteja em formato ISO (yyyy-MM-dd)
        const dataReserva = new Date(r.data);
        return [
          dataReserva.getFullYear(),
          dataReserva.getMonth(),   // Note: getMonth() retorna de 0 (janeiro) a 11 (dezembro)
          dataReserva.getDate()
        ];
      });
      renderCalendar();
    } catch (error) {
      console.error('Erro ao carregar reservas do banco:', error);
    }
  }

  function abrirFormularioReserva() {
    window.location.href = "nova_reserva.html";
  }

  function renderCalendar() {
    const container = document.getElementById("listaReservas");
    if (!container) {
      console.error("Elemento com id 'listaReservas' não encontrado.");
      return;
    }
    container.innerHTML = "";
    reservas.forEach(([ano, mes, dia]) => {
      const card = document.createElement("div");
      card.className = "reserva-card";
      card.innerHTML = `
        <h4>${dia}/${mes + 1}/${ano}</h4>
        <p>Reserva confirmada</p>
      `;
      container.appendChild(card);
    });
  }

  carregarReservas();

  // Se necessário, exponha a função abrirFormularioReserva globalmente:
  window.abrirFormularioReserva = abrirFormularioReserva;
});
