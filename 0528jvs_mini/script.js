// ⭐ 전역 변수 추가
let starEffectEnabled = false;
let lastSpawnTime = 0;
let petalsSpawnedThisSession = false;
let pageHasLoaded = false;

// 로딩 화면 처리
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    setTimeout(() => {
      loadingScreen.style.display = "none";
      pageHasLoaded = true; // 🌸 이 시점부터 꽃잎 허용
    }, 500);
  }, 1500);
});

// 날짜 초기화
const year = 2025;
const month = 4;
const today = new Date();
let selectedDate = new Date(year, month, today.getDate());

// 달력 생성 함수
function generateCalendar(year, month) {
  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  let row = document.createElement("tr");

  for (let i = 0; i < startDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let date = 1; date <= lastDate; date++) {
    const cell = document.createElement("td");
    cell.textContent = date;
    const fullDate = new Date(year, month, date);

    if (fullDate.toDateString() === today.toDateString()) {
      cell.classList.add("today");
    }

    if (fullDate.toDateString() === selectedDate.toDateString()) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () => {
      selectedDate = fullDate;
      generateCalendar(year, month);
      resetPetalEffectIfNeeded();
      loadTodo();
    });

    row.appendChild(cell);

    if ((startDay + date) % 7 === 0) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }
  }

  if (row.children.length > 0) {
    calendarBody.appendChild(row);
  }
}

// 투두 요소 참조
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function saveTodo(dateKey, todos) {
  localStorage.setItem(dateKey, JSON.stringify(todos));
}

function loadTodo() {
  const dateKey = getDateKey(selectedDate);
  const saved = localStorage.getItem(dateKey);
  const todos = saved ? JSON.parse(saved) : [];
  todoList.innerHTML = "";

  todos.forEach((item, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      saveTodo(dateKey, todos);
      resetPetalEffectIfNeeded();
      loadTodo();
    });

    const span = document.createElement("span");
    span.textContent = item.text;
    if (item.done) span.style.textDecoration = "line-through";

    const editBtn = document.createElement("button");
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => {
      const newText = prompt("수정할 내용을 입력하세요:", item.text);
      if (newText !== null && newText.trim() !== "") {
        item.text = newText.trim();
        saveTodo(dateKey, todos);
        loadTodo();
      }
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodo(dateKey, todos);
      loadTodo();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });

  updateGrowth();
}

function updateGrowth() {
  const monthKeyPrefix = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  let completedCount = 0;

  for (let i = 1; i <= 31; i++) {
    const dayKey = `${monthKeyPrefix}-${String(i).padStart(2, '0')}`;
    const data = localStorage.getItem(dayKey);
    if (data) {
      const todos = JSON.parse(data);
      completedCount += todos.filter(todo => todo.done).length;
    }
  }

  const image = document.getElementById("growth-image");
  image.classList.remove("large");
  const countText = document.getElementById("completed-count");

  if (completedCount >= 30) {
    image.src = "images/벚나무.png";
    image.classList.add("large");
    starEffectEnabled = true;

    if (!petalsSpawnedThisSession && pageHasLoaded) {
      spawnPetals(80);
      petalsSpawnedThisSession = true;
    }
  } else if (completedCount >= 20) {
    image.src = "images/벚나무.png";
    image.classList.add("large");
    starEffectEnabled = false;
  } else if (completedCount >= 10) {
    image.src = "images/나무기둥.jpg";
    starEffectEnabled = false;
  } else {
    image.src = "images/새싹.png";
    starEffectEnabled = false;
  }

  countText.textContent = `완료한 목표: ${completedCount}개`;
}

function handleMouseMove(e) {
  if (!starEffectEnabled) return;
  const now = Date.now();
  if (now - lastSpawnTime < 100) return;
  lastSpawnTime = now;

  const star = document.createElement("div");
  star.className = "star";
  star.textContent = "✨";
  star.style.left = e.clientX + "px";
  star.style.top = e.clientY + "px";
  document.body.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 1500);
}

function spawnPetals(count = 30) {
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";

    const startX = Math.random() * window.innerWidth;
    const delay = Math.random() * 1.5;

    petal.style.left = `${startX}px`;
    petal.style.top = `-30px`;
    petal.style.position = "fixed";
    petal.style.animationDelay = `${delay}s`;

    document.body.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 10000);
  }
}

function resetPetalEffectIfNeeded() {
  petalsSpawnedThisSession = false;
}

document.addEventListener("mousemove", handleMouseMove);

addBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (text === "") return;

  const dateKey = getDateKey(selectedDate);
  const saved = localStorage.getItem(dateKey);
  const todos = saved ? JSON.parse(saved) : [];

  todos.push({ text, done: false });
  saveTodo(dateKey, todos);
  todoInput.value = "";
  resetPetalEffectIfNeeded();
  loadTodo();
});

generateCalendar(year, month);
loadTodo();