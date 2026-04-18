const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("WebGL is not supported in this browser.");
}

const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = 5.0;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.12, 0.26, 0.72, 1.0);
  }
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(error || "Shader compilation failed.");
  }
  return shader;
}

const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program) || "Program linking failed.");
}

gl.useProgram(program);

function toClipX(x) {
  return (x / canvas.width) * 2 - 1;
}

function toClipY(y) {
  return 1 - (y / canvas.height) * 2;
}

function addSegmentPoints(target, x1, y1, x2, y2, steps = 40) {
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    target.push(toClipX(x), toClipY(y));
  }
}

function addQuadraticPoints(target, p0, p1, p2, steps = 60) {
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0];
    const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1];
    target.push(toClipX(x), toClipY(y));
  }
}

function addCubicPoints(target, p0, p1, p2, p3, steps = 80) {
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0[0] +
      3 * mt * mt * t * p1[0] +
      3 * mt * t * t * p2[0] +
      t * t * t * p3[0];
    const y =
      mt * mt * mt * p0[1] +
      3 * mt * mt * t * p1[1] +
      3 * mt * t * t * p2[1] +
      t * t * t * p3[1];
    target.push(toClipX(x), toClipY(y));
  }
}

const points = [];

// K
addSegmentPoints(points, 110, 45, 110, 255, 80);
addQuadraticPoints(points, [110, 150], [180, 100], [250, 45], 50);
addQuadraticPoints(points, [110, 150], [180, 205], [255, 255], 50);

// S
addCubicPoints(points, [540, 70], [490, 20], [380, 40], [380, 110], 70);
addCubicPoints(points, [380, 110], [380, 165], [485, 145], [530, 180], 70);
addCubicPoints(points, [530, 180], [580, 215], [540, 285], [440, 255], 70);
addCubicPoints(points, [440, 255], [395, 242], [380, 220], [372, 200], 40);

const vertices = new Float32Array(points);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
