// Define a URL base da API para facilitar a manutenção
const API_BASE = 'http://localhost:8080/api';

// Arrays com os nomes dos dias e dos meses
const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Para que o calendário comece com o mês corrente
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0 = Janeiro

// Variável global que armazenará os objetos completos de reservas
let reservas = [];

/**
 * Carrega as reservas do backend e armazena-as em 'reservas'
 */
async function carregarReservas() {
  try {
    const response = await fetch(`${API_BASE}/reservas`);
    if (!response.ok) throw new Error("Erro ao carregar reservas.");
    const data = await response.json();
    console.log("Reservas recebidas:", data);
    reservas = data; // Cada objeto deve ter pelo menos as propriedades: data, horaInicio, horaFim, espaco
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
  
  // Calcula o primeiro dia da semana e quantidade de dias do mês
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Adiciona espaços vazios se o mês não começar no primeiro dia da semana
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty');
    calendar.appendChild(emptyDiv);
  }
  
  // Para cada dia do mês, cria um elemento e marca como reservado se houver uma reserva.
  for (let d = 1; d <= daysInMonth; d++) {
    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    dateDiv.textContent = d;
    
    // Verifica se esse dia possui alguma reserva pelo menos
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
 * Atualiza o total de reservas exibido (por exemplo, no rodapé do calendário)
 */
function updateReservaCount() {
  const totalReservationsElement = document.getElementById('totalReservas');
  if (totalReservationsElement) {
    totalReservationsElement.textContent = reservas.length;
  }
}

/**
 * Renderiza os cards de reserva no container com id "listaReservas".
 * Cada card mostrará a data, o horário e o espaço reservado.
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
    
    // Define os detalhes da reserva (ajuste conforme a estrutura dos seus objetos)
    card.innerHTML = `
      <h4>${dateStr}</h4>
      <p>Horário: ${reserva.horaInicio} - ${reserva.horaFim}</p>
      <p>Espaço: ${reserva.espaco}</p>
    `;
    
    container.appendChild(card);
  });
}

/**
 * Permite navegar entre os meses do calendário.
 * @param {number} offset - Valor para incrementar ou decrementar o mês (ex.: -1 para mês anterior, 1 para próximo mês)
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
 * (Opcional) Reseta as reservas exibidas na interface.
 */
function resetarReservas() {
  reservas = [];
  renderCalendar();
  renderReservationList();
  updateReservaCount();
}

// Quando o DOM estiver carregado, carrega as reservas e renderiza o calendário e os cards
document.addEventListener('DOMContentLoaded', async () => {
  await carregarReservas();
  renderCalendar();
  renderReservationList();
  updateReservaCount();
});
