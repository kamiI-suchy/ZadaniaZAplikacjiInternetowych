const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gradient = ctx.createLinearGradient(60, 40, 640, 260);
gradient.addColorStop(0, "#1565c0");
gradient.addColorStop(0.5, "#7b1fa2");
gradient.addColorStop(1, "#d81b60");

ctx.lineWidth = 14;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = gradient;

function drawK() {
  ctx.beginPath();
  ctx.moveTo(120, 50);
  ctx.quadraticCurveTo(116, 150, 120, 250);

  ctx.moveTo(120, 155);
  ctx.quadraticCurveTo(170, 115, 235, 60);

  ctx.moveTo(120, 155);
  ctx.quadraticCurveTo(180, 205, 245, 250);
  ctx.stroke();
}

function drawS() {
  ctx.beginPath();
  ctx.moveTo(520, 75);
  ctx.bezierCurveTo(470, 20, 365, 45, 370, 110);
  ctx.bezierCurveTo(375, 160, 470, 150, 520, 180);
  ctx.bezierCurveTo(570, 210, 550, 280, 450, 255);
  ctx.bezierCurveTo(395, 240, 375, 215, 370, 200);
  ctx.stroke();
}

drawK();
drawS();
