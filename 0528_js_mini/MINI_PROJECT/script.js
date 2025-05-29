// ==== 꽃잎 배경 ====
let petals = [];

function setup() {
  const canvas = createCanvas(windowWidth, document.body.scrollHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  angleMode(DEGREES);
  for (let i = 0; i < 40; i++) {
    petals.push(new Petal());
  }
}

function draw() {
  background(255, 245, 250);
  const t = frameCount / 60;
  petals.forEach(p => {
    p.update(t);
    p.display();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Petal {
  constructor() {
    this.posX = random(width);
    this.posY = random(-height, 0);
    this.initialAngle = random(360);
    this.size = random(20, 30);
    this.radius = sqrt(random(pow(width / 2, 2)));
    this.rotation = random(360);
    this.windOffset = random(100);
  }

  update(t) {
    const angle = this.initialAngle + 20 * t;
    const wind = sin(t * 2 + this.windOffset) * 30;
    this.posX = width / 2 + this.radius * sin(angle) + wind;
    this.posY += 2;
    if (this.posY > height) {
      this.posY = -random(50, 150);
    }
    this.rotation += 0.5;
  }

  display() {
    push();
    translate(this.posX, this.posY);
    rotate(this.rotation);
    noStroke();
    fill(255, 182, 193, 200);
    beginShape();
    vertex(0, 0);
    bezierVertex(
      this.size / 2, -this.size,
      this.size, this.size / 2,
      0, this.size
    );
    bezierVertex(
      -this.size, this.size / 2,
      -this.size / 2, -this.size,
      0, 0
    );
    endShape(CLOSE);
    pop();
  }
}
