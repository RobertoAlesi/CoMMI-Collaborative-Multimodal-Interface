//  ______  ____  ___  
//  __/ _ \/ __ \/ _ )
//  _/ , _/ /_/ / _  / 
//  /_/|_|\____/____/ 
//
// —
// Voice_Painting by Roberto Alesi [voice, painting, lessinterface, voicecontrols]
// 2022

//speech recognition
let mySpeechRec = new p5.SpeechRec();
mySpeechRec.interimResults = true;
mySpeechRec.onResult = parseResult;
mySpeechRec.start();
mySpeechRec.onEnd = restartRec;
//voce
let computerVoice = new p5.Speech();

//posizione e velocità del pennello
let xloc = 0,
  yloc = 0,
  xspeed = 0,
  yspeed = 0;
size = 20;

let instruction =
  "Pronuncia rosso, verde, blu, giallo, rosa,\n celeste, viola, arancione per scegliere il colore.\n\n Pronuncia sopra, sotto, destra, sinistra per indicare \n la direzione del pennello";

//cose disegnate
let brushCol = 0;
let drawAry = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  //il pennello parte dal centro
  xloc = width / 2 - 350;
  yloc = height / 2 - 10;

  // impostazioni testo
  textAlign(CENTER, CENTER);
  textSize(16);
  noStroke();
  //testo informativo vocale
  computerVoice.speak(
    "Pronuncia il colore e la direzione del pennello per iniziare a disegnare!"
  );
}

function draw() {
  background(0);

  //posizione
  xloc += xspeed;
  yloc += yspeed;

  //aggiorna posizione e colore del pennello
  let drawingInfo = {
    x: xloc,
    y: yloc,
    s: size,
    col: brushCol,
  };

  //inserisci le informazioni nell'array del disegno
  drawAry.push(drawingInfo);

  noStroke();
  noFill();
  circle(xloc, yloc, size);

  for (let i = 0; i < drawAry.length; i++) {
    fill(drawAry[i].col);
    circle(drawAry[i].x, drawAry[i].y, drawAry[i].s);
  }
}

//gestisco le parole pronunciate
function parseResult() {
  let lowerStr = mySpeechRec.resultString.toLowerCase(); //tutto minuscolo
  let mostRecentWord = lowerStr.split(" ").pop();
  print(mostRecentWord);

//COLORI
  if (mostRecentWord == "rosso") {
    brushCol = color(255, 50, 50);
  } else if (mostRecentWord == "arancione") {
    brushCol = color(255, 128, 0);
  } else if (mostRecentWord == "giallo") {
    brushCol = color(255, 215, 0);
  } else if (mostRecentWord == "rosa") {
    brushCol = color(240, 128, 128);
  } else if (mostRecentWord == "blu") {
    brushCol = color(30, 144, 255);
  } else if (mostRecentWord == "verde") {
    brushCol = color(0, 255, 0);
  } else if (mostRecentWord == "viola") {
    brushCol = color(148, 0, 211);
  } else if (mostRecentWord == "celeste") {
    brushCol = color(0, 255, 255);
  } else if (mostRecentWord == "nero") {
    brushCol = color(0, 0, 0);
  } else if (mostRecentWord == "bianco") {
    brushCol = color(255, 255, 255);
  }

//Stop/Cancella
  if (mostRecentWord == "stop") {
    xspeed = 0;
    yspeed = 0;
  }
  if (mostRecentWord == "cancella") {
    drawAry = [];
  }
  
//Direzioni
  if (mostRecentWord == "su") {
    xspeed = 0;
    yspeed = -0.5;
  }
  if (mostRecentWord == "giù") {
    xspeed = 0;
    yspeed = 0.5;
  }
  if (mostRecentWord == "sinistra") {
    xspeed = -0.5;
    yspeed = 0;
  }
  if (mostRecentWord == "destra") {
    xspeed = 0.5;
    yspeed = 0;
  }


//Dimensioni
  if (mostRecentWord == "grande") {
    size += 3;
  }
  if (mostRecentWord == "piccolo") {
    size -= 3;
  }
}

function restartRec() {
  mySpeechRec.start();
}
