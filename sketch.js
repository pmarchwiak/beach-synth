let osc, fft, isPlaying;
let beachImg, waterImg, godImg;
let freqSlider, noiseSlider, button;

function preload() {
  beachImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/gaviota-beach.JPG?v=1718927469469');
  waterImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/gaviota-water.jpeg?v=1719249473008');
  godImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/amphitrite-subject.png?v=1719006696043');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  osc = new p5.SinOsc();
  osc.amp(0.5);

  fft = new p5.FFT(1, 1024);
  isPlaying = false;

  noiseOsc = new p5.Noise();
  
    
  freqSlider = createSlider(100, 1000, 300);
  freqSlider.position(width*.8, height*.9);
  freqSlider.size(80);
  
  noiseSlider = createSlider(0, 100, 10);
  noiseSlider.position(width*.8, height*.95);
  noiseSlider.size(80);
  
  button = createButton("start/stop");
  button.position(width * 0.1, height * 0.9);
  button.size(width * 0.1, AUTO);
  button.mousePressed(startStop);
}

function draw() {
  beachImg.resize(windowWidth, windowHeight)
  image(beachImg, 0, 0);
  
  godImg.resize(0, windowHeight*.9)
  image(godImg, 
        windowWidth - (windowWidth*.3), 
        windowHeight*.1);

  let waveform = fft.waveform();
  
  let shapeLength = noise(10);

  // beginShape(LINES);

  let lastX, lastY;
  for (let i = 0; i < waveform.length; i++) {
    if (i % shapeLength == 0) {
        beginShape(LINES);
    }
    stroke("DarkTurquoise");
    strokeWeight(Math.ceil(Math.random() * 5));
    let x = map(i, 0, waveform.length, 0, width/2);
    let y = map(waveform[i], -1, 1,
                (height / 2) + (height/10),
                (height / 2) - (height/100));
    vertex(x, y);
    lastX = x;
    lastY = y;
    if ((i + 1) % shapeLength == 0) {
      endShape()
    }
  }
  endShape();
  
  beginShape(LINES);
  strokeWeight(2);
  vertex(lastX, lastY);
  vertex(width * .89, height * .2);
  endShape();

  // change oscillator frequency based on slider
  let freqy = freqSlider.value();
  osc.freq(freqy);
  
  
  // change level of noise based on slider
  // Set the noise level and scale.
  let noiseLevel = 100;
  let noiseScale = 0.01 * noiseSlider.value();

  // Scale the input coordinate.
  let x = frameCount % 300;
  let nx = noiseScale * x;

  // Compute the noise value. 
  let noiseAmp = (noiseLevel * noise(nx)) * noiseSlider.value() / 1000;
  // let nt = noiseScale * frameCount;
  // let noiseAmp = noise(noiseSlider.value() * nt); // / 100 * n;
  console.log(`x=framecount=${x}, nx=${nx}, noiseAmp=${noiseAmp} noiseSlider.value() ${noiseSlider.value()}`)
  noiseOsc.amp(noiseAmp);
  

  // let amp = map(mouseY, 0, height, 1, 0.01);
  // let ampy = 3;
  osc.amp(1);
  frameRate(8);
}

function startStop() {
  if (!isPlaying) {
    osc.start();
    noiseOsc.start();
  }
  else {
    osc.stop(0.25);
    noiseOsc.stop(0.3);
  }
  isPlaying = !isPlaying;
}
