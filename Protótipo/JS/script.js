// Defina a URL base da API para facilitar a manutenção
const API_BASE = 'http://localhost:8080/api';

// Arrays para os nomes dos dias e meses
const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Utilize a data atual para definir o mês e o ano
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0 = Janeiro

// Variável global que armazenará os objetos completos de reservas
let reservas = [];

/**
 * Carrega as reservas do backend e armazena em 'reservas'
 */
async function carregarReservas() {
  try {
    const response = await fetch(`${API_BASE}/reservas`);
    if (!response.ok) throw new Error("Erro ao carregar reservas.");
    const data = await response.json();
    console.log("Reservas recebidas:", data);
    reservas = data; // Armazena os objetos completos de reservas
  } catch (error) {
    console.error('Erro ao carregar reservas do banco:', error);
  }
}

/**
 * Renderiza o calendário para o mês corrente e marca os dias que possuem reservas.
 */
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  if (!calendar) {
    console.error("Elemento 'calendar' não encontrado.");
    return;
  }
  calendar.innerHTML = ''; 

  const monthTitle = document.getElementById('monthTitle');
  if (monthTitle) {
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  }

  // Cria o cabeçalho dos dias da semana
  daysOfWeek.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.textContent = day;
    calendar.appendChild(dayDiv);
  });

  // Calcula o primeiro dia da semana e a quantidade de dias no mês
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Adiciona espaços vazios caso o mês não comece no primeiro dia da semana
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty');
    calendar.appendChild(emptyDiv);
  }

  // Para cada dia do mês, cria um elemento e, se houver reserva, marca-o
  for (let d = 1; d <= daysInMonth; d++) {
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.textContent = d;
    
    // Verifica se esse dia possui alguma reserva
    const isReserved = reservas.some(r => {
      const resDate = new Date(r.data);
      return (
        resDate.getFullYear() === currentYear &&
        resDate.getMonth() === currentMonth &&
        resDate.getDate() === d
      );
    });
    if (isReserved) {
      dateDiv.classList.add('reserved');
    }
    calendar.appendChild(dateDiv);
  }

  updateReservaCount();
}

/**
 * Atualiza o total de reservas exibido na interface.
 */
function updateReservaCount() {
  const totalReservationsElement = document.getElementById('totalReservas');
  if (totalReservationsElement) {
    totalReservationsElement.textContent = reservas.length;
  }
}

/**
 * Renderiza os cards de reserva, preenchendo o container com id "listaReservas".
 */
function renderReservationList() {
  const container = document.getElementById("listaReservas");
  if (!container) {
    console.error("Elemento com id 'listaReservas' não encontrado.");
    return;
  }
  container.innerHTML = ""; // Limpa o container

  reservas.forEach(reserva => {
    const card = document.createElement("div");
    card.classList.add("reserva-card");

    // Converte a data para um formato legível
    const resDate = new Date(reserva.data);
    const dateStr = `${resDate.getDate()}/${resDate.getMonth() + 1}/${resDate.getFullYear()}`;

    card.innerHTML = `
      <h4>${dateStr}</h4>
      <p>Horário: ${reserva.horaInicio} - ${reserva.horaFim}</p>
      <p>Espaço: ${reserva.espaco}</p>
    `;
    container.appendChild(card);
  });
}

/**
 * Altera o mês exibido no calendário.
 * @param {number} offset - O valor para incrementar ou decrementar o mês (ex.: -1 ou 1)
 */
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
  renderReservationList();
}

/**
 * Opcional: Reseta as reservas apenas na interface.
 */
function resetarReservas() {
  reservas = [];
  renderCalendar();
  renderReservationList();
  updateReservaCount();
}

// Inicializa o carregamento e renderização após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', async () => {
  await carregarReservas();
  renderCalendar();
  renderReservationList();
  updateReservaCount();
});
