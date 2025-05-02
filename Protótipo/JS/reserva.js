let reservas = [];

async function carregarReservas() {
  try {
    const response = await fetch('/api/reservas');
    if (!response.ok) throw new Error("Erro ao carregar reservas.");
    const data = await response.json();
    // Mapeia para um formato de array com [ano, mes, dia]
    reservas = data.map(r => {
      const dataReserva = new Date(r.data); // supondo que r.data venha em formato ISO
      return [
        dataReserva.getFullYear(),
        dataReserva.getMonth(), // getMonth() retorna de 0 a 11
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
