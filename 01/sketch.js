// 종이학의 현재 위치를 나타내는 변수
let paperX = 50; // 종이학의 X좌표 (왼쪽에서 시작)
let paperY = 200; // 종이학의 Y좌표 (세로 가운데)

// 별들의 정보를 저장할 배열 (위치와 먹혔는지 여부)
let stars = [];

function setup() {
  // 600x400 크기의 p5.js 캔버스를 생성
  const canvas = createCanvas(600, 400);

  // 이 캔버스를 index.html 내의 'canvas-container' div에 삽입
  canvas.parent('canvas-container');

  // 별 3개를 일정 간격으로 화면 중앙에 배치
  for (let i = 0; i < 3; i++) {
    stars.push({
      x: 200 + i * 100, // 별의 X좌표
      y: 200,           // 별의 Y좌표
      eaten: false      // 아직 먹히지 않은 상태
    });
  }
}

function draw() {
  // 이전 프레임을 지워서 잔상이 남지 않도록 처리
  clear();

  // 배경은 투명하게 유지 (배경 이미지가 보이도록)
  background(0, 0, 0, 0);

  // 테두리 없이 도형을 그림
  noStroke();

  // 남아 있는 별들을 그리는 반복문
  for (let star of stars) {
    if (!star.eaten) {
      // 아직 먹히지 않은 별이면 별을 그림
      drawStar(star.x, star.y, 10, 20, 5); // 별 위치와 크기 지정
    }
  }

  // 종이학을 현재 좌표에 그림
  drawPaperCrane(paperX, paperY);

  // 종이학을 오른쪽으로 조금씩 이동
  paperX += 2;

  // 종이학이 각 별에 닿았는지 확인
  for (let star of stars) {
    let d = dist(paperX, paperY, star.x, star.y); // 종이학과 별 사이 거리 계산
    if (d < 25 && !star.eaten) {
      star.eaten = true; // 가까우면 별이 먹힌 것으로 처리
    }
  }

  // 종이학이 화면 오른쪽 끝을 넘었을 경우
  if (paperX > width + 40) {
    noLoop(); // p5.js 애니메이션 루프 종료

    // 0.5초 후 소망 입력 화면으로 전환 (main.js의 함수 호출)
    setTimeout(() => {
      goToWishInput();
    }, 500);
  }
}

// 별을 그리는 함수
// x, y: 중심 좌표 / radius1: 안쪽 반지름 / radius2: 바깥쪽 반지름 / npoints: 꼭짓점 개수
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints; // 각 꼭짓점 사이 각도
  let halfAngle = angle / 2.0;  // 안쪽 꼭짓점 각도

  // 별 색상 (파스텔톤 연보라색)
  fill(255, 215, 250);

  beginShape(); // 다각형 그리기 시작
  for (let a = 0; a < TWO_PI; a += angle) {
    // 바깥쪽 꼭짓점 좌표 계산
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy); // 꼭짓점 추가

    // 안쪽 꼭짓점 좌표 계산
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy); // 꼭짓점 추가
  }
  endShape(CLOSE); // 도형 닫기
}

// 종이학을 진한 회색 실루엣으로 그리는 함수
function drawPaperCrane(x, y) {
  push(); // 이전 스타일 설정 저장

  translate(x, y); // 종이학을 지정 위치로 이동
  scale(1.5); // 크기를 확대해서 잘 보이게 함

  fill(50); // 진한 회색으로 내부 채움 (흰 배경에서도 잘 보임)
  stroke(255); // 흰색 테두리 선 설정
  strokeWeight(1.2); // 테두리 선 굵기 설정

  beginShape(); // 도형 그리기 시작
  vertex(0, 0);
  vertex(-20, 7);
  vertex(0, -15);
  vertex(20, 7);
  vertex(0, 0);
  vertex(0, 15);
  vertex(-10, 25);
  vertex(0, 10);
  vertex(10, 25);
  vertex(0, 15);
  endShape(); // 도형 그리기 종료

  pop(); // 스타일 복원
}
