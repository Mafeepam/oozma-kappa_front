const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

let currentYear = 2025;
let currentMonth = 3; // Abril (0 = Janeiro, 3 = Abril)
let reservas = [];

async function carregarReservas() {
  try {
    const response = await fetch('/api/reservas'); 
    if (!response.ok) throw new Error("Erro ao carregar reservas.");
    const data = await response.json();

    // Mapeia cada reserva para um array [ano, mês, dia]
    reservas = data.map(r => {
      const d = new Date(r.data);
      return [d.getFullYear(), d.getMonth(), d.getDate()];
    });
  } catch (error) {
    console.error('Erro ao carregar reservas do banco:', error);
  }
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  if (!calendar) return; // Protege caso o elemento não exista
  calendar.innerHTML = ''; 

  const monthTitle = document.getElementById('monthTitle');
  if (monthTitle) {
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }

  // Adiciona o cabeçalho dos dias da semana
  daysOfWeek.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;
    calendar.appendChild(dayDiv);
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty'); // Adicione uma classe para estilização se desejar
    calendar.appendChild(emptyDiv);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.textContent = d;

    // Verifica se a data tem reserva
    const isReserved = reservas.some(r => r[0] === currentYear && r[1] === currentMonth && r[2] === d);
    if (isReserved) {
      dateDiv.classList.add('reserved');
    }
    calendar.appendChild(dateDiv);
  }

  updateReservaCount();
}

function updateReservaCount() {
  const totalGeral = reservas.length;
  const totalReservationsElement = document.getElementById('totalReservas');
  if (totalReservationsElement) {
    totalReservationsElement.textContent = totalGeral;
  }
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function resetarReservas() {
  // Se você pretende resetar apenas a interface:
  reservas = [];
  renderCalendar();
  // Se desejar, pode fazer uma chamada ao backend para limpar reservas.
}

// Inicia o carregamento e renderização após o DOM estar pronto
document.addEventListener('DOMContentLoaded', async () => {
  await carregarReservas();
  renderCalendar();
});
