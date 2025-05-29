const calendarContainer = document.getElementById('calendar-container');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
// let selectedDate = null;

function renderCalendar(year, month) {
  calendarContainer.innerHTML = '';
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"];
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();
  const startDayIndex = firstDay.getDay();
  const today = new Date();

  // 헤더
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `
    <button id="prevMonth">&lt;</button>
    <span>${year}년 ${monthNames[month]}</span>
    <button id="nextMonth">&gt;</button>
  `;
  calendarContainer.appendChild(header);

  // 요일
  const weekDaysEl = document.createElement('div');
  weekDaysEl.className = 'calendar-weekdays';
  daysOfWeek.forEach(d => {
    const el = document.createElement('span');
    el.textContent = d;
    weekDaysEl.appendChild(el);
  });
  calendarContainer.appendChild(weekDaysEl);

  // 날짜 그리드
  const daysGrid = document.createElement('div');
  daysGrid.className = 'calendar-days';
  calendarContainer.appendChild(daysGrid);

  for (let i = 0; i < startDayIndex; i++) {
    daysGrid.appendChild(document.createElement('span'));
  }
  for (let d = 1; d <= numDays; d++) {
    const cell = document.createElement('span');
    cell.textContent = d;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cell.dataset.date = dateStr;
    if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
      cell.classList.add('today');
    }
    if (dateStr === selectedDate) {
      cell.classList.add('selected');
    }
    daysGrid.appendChild(cell);
  }

  // 월 이동
  document.getElementById('prevMonth').addEventListener('click', () => {
    if (--currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar(currentYear, currentMonth);
  });
  document.getElementById('nextMonth').addEventListener('click', () => {
    if (++currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar(currentYear, currentMonth);
  });

  // 날짜 클릭
  daysGrid.addEventListener('click', e => {
    if (e.target.tagName === 'SPAN' && e.target.dataset.date) {
      const d = e.target.dataset.date;
      selectedDate = (selectedDate === d ? null : d);
      renderCalendar(currentYear, currentMonth);
      // 필터링된 To-Do 다시 그리기
      if (typeof renderAllTodos === 'function') {
        renderAllTodos(selectedDate);
      }
    }
  });
}

// 초기 로드 시 2초 뒤 로딩 화면 감추고 달력 렌더링
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    renderCalendar(currentYear, currentMonth);
    loadTodos();
  }, 2000);
});

