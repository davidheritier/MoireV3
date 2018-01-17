var music, amplitude, level, fft, spectrum;
var button;
var sound = '03 Nest of Queens.mp3';

// Background rotating square size
var grid = 0.05;

// Growing squares spacing
var step = 0.25;

var bckgrnd;

function toggleMusic() {
  if (music.isPlaying()) {
    music.pause();
  } else {
    music.play();
  }
}

function preload() {
  music = loadSound(sound);
}

function setup() {
  frameRate(25);
  createCanvas(windowWidth, windowHeight);
  music.play();
  button = createButton('Toggle music');
  button.mousePressed(toggleMusic);
  fft = new p5.FFT(0.5, 16);
  amplitude = new p5.Amplitude();
  fft.setInput(music)
  music.amp(0.75);
}

function draw() {
  level = amplitude.getLevel();
  spectrum = fft.analyze();

  // Background color change when amplitude > level
  if (level > 0.4) {
    bckgrnd = 255;
  } else {
    bckgrnd = 0;
  }

  // Background color change on frameCount#
  if (frameCount > 300 && frameCount < 305) {
    bckgrnd = 255;
  } else if (frameCount > 610 && frameCount < 615) {
    bckgrnd = 255;
  } else if (frameCount > 940 && frameCount < 945) {
    bckgrnd = 255;
  } else {
    bckgrnd = 0;
  }

  // Background alpha change on frameCount#
  if (frameCount < 300) {
    alpha = 255;
  } else if (frameCount > 1000 && frameCount < 2200) {
    alpha = 128;
  } else {
    alpha = 32;
  }

  background(bckgrnd, alpha);

  noFill();
  stroke(255);

  // Rotating squares background
  for (x = -width; x < width + grid + 1000; x += width * grid) {
    for (y = 0 - width; y < height + 1000; y += width * grid) {
      push();
      translate(x, y);
      rotSquares();
      pop();
    }
  }

  // Growing squares
  for (var x = 0; x <= width; x += width * step) {
    for (var y = 0; y <= height; y += width * step) {
      push();
      translate(x, y);
      sqr();
      pop();
    }
  }

  // Center polygon
  for (var x = width / 2; x < width; x += width / 2) {
    for (var y = height / 2; y < height; y += height / 2) {
      push();
      translate(x, y);
      poly();
      pop();
    }
  }

  // // Display spectrum visualization
  // for (var i = 0; i < spectrum.length; i++) {
  //   noFill();
  //   stroke(255, 0, 0);
  //   spectrum[i] = line(20 * i + 1, height, 20 * i + 1, height - spectrum[i]);
  //   noStroke();
  //   fill(255, 0, 0);
  //   text(i, 20 * i, height - 1);
  // }

  // // Display frameCount
  // fill(0, 255, 0);
  // text(frameCount, 1, height - 1);
}

// Rotating square function
function rotSquares() {
  var spectrum = fft.analyze();
  var shade = spectrum[7];

  stroke(shade);
  noFill();

  rotate(-radians(frameCount * 0.025));
  rectMode(CENTER);
  rect(0, 0, width * grid * 2, width * grid * 2);
}

// Growing square function
function sqr() {
  var spectrum = fft.analyze();
  level = amplitude.getLevel();

  // Size change with fft
  var size = map(spectrum[15], 0, 255, 0, width);
  var col = 255;

  // Color change on frameCount
  if (frameCount < 2200 && frameCount > 2600) {
    col = 0;
  } else {
    col = 255;
  }

  stroke(col);

  // Fill when amplitude > level
  if (level > 0.45) {
    fill(255);
  } else {
    noFill();
  }

  rectMode(CENTER);
  rect(0, 0, size, size);
}

// Center polygon function
function poly() {
  var spectrum = fft.analyze();
  level = amplitude.getLevel();

  // Size change with fft
  var size = map(spectrum[2], 0, 255, 0, height / 2);
  // Sides number change with fft
  var sides = floor(map(spectrum[12], 0, 255, 1, 20));
  var col;

  // Fill when amplitude > level
  if (level > 0.35) {
    fill(255);
  } else {
    noFill();
  }

  rotate(radians(frameCount));
  polygon(0, 0, size, sides);
}

// Polygon general function
function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}