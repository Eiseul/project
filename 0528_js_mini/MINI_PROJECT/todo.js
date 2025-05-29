const STORAGE_KEY = 'petals_todos';
window.todos = window.todos || [];
selectedDate = new Date();

function renderAllTodos() {
  const todoListEl = document.getElementById('todoList');
  todoListEl.innerHTML = '';

  // selectedDate가 Date 객체라면 문자열로 변환 필요
  const filterDate = selectedDate instanceof Date
    ? selectedDate.toISOString().split('T')[0]
    : selectedDate; // 이미 문자열이면 그대로

  window.todos.forEach((todo, i) => {
    // due가 filterDate와 일치하는 것만 렌더링
    if (todo.due === filterDate) {
      renderTodo(todo, i);
    }
  });
}


function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  window.todos = raw ? JSON.parse(raw) : [];
  if (window.todos.length === 0 && !raw) {
    const today = new Date().toISOString().split('T')[0];
   saveTodos();
  }
  const todayDate = new Date().toISOString().split('T')[0];
  renderAllTodos(todayDate);

  updateGrowth();  // 페이지 로드 후 성장 이미지 갱신 호출
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.todos));
}

function renderTodo(todo, idx) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.idx = idx;

  // 체크 여부에 따라 checked 클래스 토글
  const checkedClass = todo.checked ? 'checked' : '';

  li.innerHTML = `
    <button class="check-btn">${todo.checked ? '✔' : ''}</button>
    <span class="todo-text ${checkedClass}">
      <strong>${todo.title}</strong>
      ${todo.desc ? `<br><span class="desc">${todo.desc}</span>` : ''}
      ${todo.due ? `<br><span class="due">마감: ${todo.due}</span>` : ''}
    </span>
    <div class="actions">
      <button class="edit-btn">수정</button>
      <button class="delete-btn">삭제</button>
    </div>
  `;
  document.getElementById('todoList').appendChild(li);
}

window.addEventListener('DOMContentLoaded', () => {
  loadTodos();
});

document.getElementById('addBtn').addEventListener('click', () => {
  const form = document.getElementById('todoForm');
  form.classList.toggle('show');
  if (form.classList.contains('show') && selectedDate) {
    document.getElementById('todoDue').value = selectedDate.toISOString().split('T')[0];
  } else {
    form.reset();
  }
});

document.getElementById('todoForm').addEventListener('submit', e => {
  e.preventDefault();
  const today = new Date().toISOString().split('T')[0];
  const title = document.getElementById('todoTitle').value.trim();
  const desc = document.getElementById('todoDesc').value.trim();
  const due = document.getElementById('todoDue').value;
  if (!title) return;
  if (due && due < today) {
    alert('⚠️ 과거 날짜에는 일정을 추가할 수 없습니다.');
    return;
  }
  window.todos.push({ title, desc, due, checked: false });
  saveTodos();
  renderAllTodos(today);  // 오늘 날짜 기준으로 렌더링

  updateGrowth();  // 이미지 갱신
  e.target.reset();
  e.target.classList.remove('show');
});

document.getElementById('todoList').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const i = Number(li.dataset.idx);

  if (e.target.classList.contains('check-btn')) {
    window.todos[i].checked = !window.todos[i].checked;
    saveTodos();
    const todayDate = new Date().toISOString().split('T')[0];
    renderAllTodos(todayDate);
    updateGrowth();
  }
  if (e.target.classList.contains('delete-btn')) {
    window.todos.splice(i, 1);
    saveTodos();
    const todayDate = new Date().toISOString().split('T')[0];
    renderAllTodos(todayDate);
    updateGrowth();
  }
  if (e.target.classList.contains('edit-btn')) {
    alert('수정 준비 중…');
  }
});
