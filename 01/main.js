// ------------------------------
// 화면 전환 및 목표 출력 관련
// ------------------------------

// 각 화면 섹션 요소 선택
const introSection = document.getElementById("intro");
const wishInputSection = document.getElementById("wish-input");
const todoMainSection = document.getElementById("todo-main");

// 목표 입력 및 출력 요소
const startButton = document.getElementById("start-button");
const wishText = document.getElementById("wish-text");
const wishDisplay = document.getElementById("wish-display");

// 투두 입력 및 리스트 요소
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

// 인트로 → 목표 입력 화면 전환 함수
function goToWishInput() {
  introSection.style.display = "none";
  wishInputSection.style.display = "flex";
  wishInputSection.style.opacity = "1";
}

// 외부 파일(sketch.js)에서 호출할 수 있도록 전역 등록
window.goToWishInput = goToWishInput;

// 목표 입력 후 메인 화면으로 전환
startButton.addEventListener("click", () => {
  const wish = wishText.value.trim();

  if (wish === "") {
    alert("목표를 입력해주세요.");
    return;
  }

  wishDisplay.textContent = `🌠 ${wish}`;
  wishInputSection.style.display = "none";
  todoMainSection.style.display = "flex";
  todoMainSection.style.opacity = "1";
});

// ------------------------------
// 투두 항목 추가 및 완료 처리
// ------------------------------

function addTodo() {
  const task = todoInput.value.trim();
  if (task === "") return;

  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = task;
  span.className = "todo-text";

  // 완료 토글 처리
  span.addEventListener("click", () => {
    span.classList.toggle("completed");
    if (span.classList.contains("completed")) {
      addStarToJar();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn";

  // 삭제 처리
  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
  todoInput.value = "";
}

// 추가 버튼 클릭 시
addButton.addEventListener("click", addTodo);

// 엔터 입력 시 추가
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// ------------------------------
// 종이별 생성 및 레벨 확인
// ------------------------------

const starImages = [
  "images/star01.png",
  "images/star02.png",
  "images/star03.png",
  "images/star04.png"
];

let starCount = 0; // 별 개수 카운트
const jar = document.getElementById("jar");

// 완료 시 호출되는 종이별 추가 함수
function addStarToJar() {
  const img = document.createElement("img");
  img.src = getRandomStar();
  img.alt = "종이별";
  img.className = "jar-star";

  // 위치 및 스타일 지정
  img.style.width = "40px";
  img.style.position = "absolute";
  img.style.left = `${Math.random() * 800 + 100}px`;
  img.style.top = `${Math.random() * 400}px`;
  img.style.pointerEvents = "none";

  jar.appendChild(img);
  starCount++;

  checkLevelUp();
}

// 랜덤 이미지 반환
function getRandomStar() {
  const index = Math.floor(Math.random() * starImages.length);
  return starImages[index];
}

// 특정 개수마다 레벨 업 효과 (콘솔 로그용)
function checkLevelUp() {
  const levels = [1, 2, 3, 4, 5, 10];
  if (levels.includes(starCount)) {
    console.log(`레벨 업! 별 ${starCount}개`);
  }
}
