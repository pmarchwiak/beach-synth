let osc, fft, isPlaying;
let beachImg, waterImg, godImg;
let freqSlider, noiseSlider, button, recty;

function preload() {
  beachImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/gaviota-beach.jpeg?v=1719335888122');
  waterImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/gaviota-water.jpeg?v=1719249473008');
  godImg = loadImage('https://cdn.glitch.global/d493e2da-9c90-41f0-ba2f-daedf41d4de7/amphitrite-subject.png?v=1719006696043');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  osc = new p5.SinOsc();
  osc.amp(0.05);
  noiseOsc = new p5.Noise();
  fft = new p5.FFT(1, 1024);
  isPlaying = false;
  
  waterImg.loadPixels();
  
  // setup controls
  let divy = createDiv();
  divy.id("controls")
  divy.position(width * 0.3, height * 0.67);
  
  let title = createElement('h1', '"wave queen"');
  title.parent(divy);
  
  let buttonDiv = createDiv();
  button = createButton("start/stop");
  button.size(width * 0.1, AUTO);
  button.mousePressed(startStop);
  // put button in a div to better center it?
  button.parent(buttonDiv);
  buttonDiv.parent(divy);
  
  createP("freq").parent(divy);
  freqSlider = createSlider(100, 1000, 300);
  freqSlider.size(80);
  freqSlider.parent(divy);

  createP("noise").parent(divy);
  noiseSlider = createSlider(0, 50, 5);
  noiseSlider.size(80);
  noiseSlider.parent(divy);
}

function draw() {
  // background image
  beachImg.resize(windowWidth, windowHeight)
  image(beachImg, 0, 0);
  
  // get waveform info
  let waveform = fft.waveform();
  
  // add randomness to wave stroke
  let shapeLength = noise(10);

  let lastX, lastY;
  for (let i = 0; i < waveform.length; i++) {
    if (i % shapeLength == 0) {
        beginShape(LINES);
    }
    
    // get random color from water image pixels
    let px = waterImg.pixels;
    let numPixels = 682*410; // size of the image
    let p = Math.floor(Math.random() * numPixels) * 4;
    let rgba = `rgba(${px[p]}, ${px[p+1]}, ${px[p+2]}, ${px[p+3]})`;
    stroke(rgba);
    
    strokeWeight(Math.ceil(Math.random() * 5));
    let x = map(i, 0, waveform.length, 0, width/2);
    let waveHeight = height * 0.55;
    let waveCenter = height * 0.56;
    let y = map(waveform[i], -1, 1,
                waveCenter + waveHeight,
                waveCenter - waveHeight);
    vertex(x, y);
    lastX = x;
    lastY = y;
    if ((i + 1) % shapeLength == 0) {
      endShape()
    }
  }
  endShape();
  
  // draw a line of increasing weight from the end of the
  // waveform (lastX, lastY) to the god (godX, godY)
  strokeWeight(3);  
  let prevX = lastX;
  let prevY = lastY;
  let godX = width * 0.78;
  let godY = height * 0.8;
  let weight = 2;  
  let amt = 0.05
  while (amt <= 1) {
    x = lerp(lastX, godX, amt);
    y = lerp(lastY, godY, amt);
    strokeWeight(weight);
    line(prevX, prevY, x, y);
    // console.log(`godX,godY=${godX},${godY}, x,y=${x},${y}`)
    amt += 0.1
    weight += 1;
    prevX = x;
    prevY = y;
  }

  // adjust oscillator frequency based on slider value
  let freqy = freqSlider.value();
  osc.freq(freqy);
  
  // change level of noise based on slider
  let noiseLevel = 10;
  let noiseScale = 0.01 * noiseSlider.value();

  // Scale the input coordinate.
  let f = frameCount % 300;
  let nx = noiseScale * f;

  // Compute the noise value. 
  let noiseAmp = (noiseLevel * noise(nx)) * noiseSlider.value() / 1000;
  // console.log(`x=framecount=${x}, nx=${nx}, noiseAmp=${noiseAmp} noiseSlider.value() ${noiseSlider.value()}`)
  noiseOsc.amp(noiseAmp);
  

  frameRate(8);
  
  // draw the sea queen
  godImg.resize(0, windowHeight*.9)
  image(godImg, 
        windowWidth - (windowWidth*.3), 
        windowHeight*.1);
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
