// 벚꽃잎 이미지 변수
let flowerImg;

// 벚꽃잎 객체 배열
let flowers = [];

// 벚꽃잎 최대 개수
const MAX_FLOWERS = 100;

// 이미지 미리 로드
function preload() {
  flowerImg = loadImage("images/벚꽃잎.png"); // 경로와 파일명 정확히 확인 필요
}

// 캔버스 생성 및 설정
function setup() {
  const cnv = createCanvas(windowWidth, windowHeight); // 전체 화면 크기
  cnv.position(0, 0); // 좌상단 고정
  cnv.style('pointer-events', 'none'); // 마우스 이벤트 통과
  cnv.style('z-index', '9998'); // UI보다 아래
  noLoop(); // 기본은 비활성화 상태
}

// 프레임마다 반복
function draw() {
  clear(); // 배경 지움
  for (let flower of flowers) {
    flower.update(); // 위치 변경
    flower.display(); // 이미지 그리기
  }

  // 화면 밖으로 나간 꽃잎 제거
  flowers = flowers.filter(f => !f.isOffScreen());
}

// 꽃잎 클래스 정의
class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = random(1, 2); // 수직 속도
    this.vx = random(-0.5, 0.5); // 좌우 흔들림
    this.size = random(12, 24); // 크기
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
  }

  display() {
    image(flowerImg, this.x, this.y, this.size, this.size);
  }

  isOffScreen() {
    return this.y > height;
  }
}

// 외부에서 호출되는 함수 - 애니메이션 시작
function startFlowerEffect() {
  loop(); // draw() 재개
}

// 외부에서 호출되는 함수 - 애니메이션 정지
function stopFlowerEffect() {
  noLoop(); // draw() 정지
  clear(); // 화면 지우기
  flowers = []; // 객체 초기화
}

// 마우스 움직임마다 꽃잎 생성
function mouseMoved() {
  if (!isLooping()) return; // draw()가 동작 중일 때만
  if (flowers.length < MAX_FLOWERS) {
    flowers.push(new Flower(mouseX, mouseY));
  }
}
