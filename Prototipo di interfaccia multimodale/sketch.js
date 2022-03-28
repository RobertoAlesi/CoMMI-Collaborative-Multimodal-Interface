//  ______  ____  ___  
//  __/ _ \/ __ \/ _ )
//  _/ , _/ /_/ / _  / 
//  /_/|_|\____/____/ 
//
// —
// Multimodal_Painting by Roberto Alesi [spatial, being, 3d, lessinterface, handpose, voicecontrols]
// 2022

let istruzioni = "Pronuncia un colore e pizzica con la mano destra per disegnare. \n Usa la mano sinistra per regolare la dimensione." 

//Pronuncia cancella per pulire la tavola o salva per collezionare il disegno."


let pg;
let speechRec;
let parole = []


let colorMap = [255,0,0];
let disegna = false;



// Array che contiene il disegno
paint = [];

// Questo è come pmouseX e pmouseY... ma per ogni dito [pointer, middle, ring, pinky]
let prevPointer = [
  // Mano sinistra
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },],
  // Mano destra
  [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
];

// Indici di riferimento per i polpastrelli [pointer, middle, ring, pinky]
// sono gli stessi per entrambe le mani
let fingertips = [8, 12, 16, 20];

let w;
let h;




var sxpollicex = 0;
var sxpollicey = 0;
var sxindicex = 0;
var sxindicey = 0;
//media indice pollice mano sinistra
var distanza;
var sizepennello;
//distanza indice sinistra
var pinchsx;



var dxpollicex = 0;
var dxpollicey = 0;
var dxindicex = 0;
var dxindicey = 0;
//media indice pollice mano destra
var mdxx;
var mdxy;
//distanza indice pollice
var pinchdx;


///// Setup
function setup() {
  sketch = createCanvas((w = windowWidth), (h = windowHeight - 70));
  pg = createGraphics(w, h);
  pg.clear();
   

//comandi vocali
  var foo = new p5.Speech();
  speechRec = new p5.SpeechRec(gotSpeech);
  let continuous = true;
  let interimResults = true;
  speechRec.start(continuous, interimResults);
  //computer voice
  let computerVoice = new p5.Speech();
  function gotSpeech(speech) {
    if (speech.text.includes("verde") || speech.text.includes("Verde") ) coloreVerde(speech.text);
    if (speech.text.includes("rosso") || speech.text.includes("Rosso") ) coloreRosso(speech.text);
    if (speech.text.includes("blu") || speech.text.includes("Blu") || speech.text.includes("blue") || speech.text.includes("Blue")  ) coloreBlu(speech.text);
    if (speech.text.includes("viola" ) ||speech.text.includes("Viola")  ) coloreViola(speech.text);
    if (speech.text.includes("arancione") || speech.text.includes("Arancione")  || speech.text.includes("arancio") || speech.text.includes("Arancio")) coloreArancione(speech.text);
    if (speech.text.includes("giallo") || speech.text.includes("Giallo") ) coloreGiallo(speech.text);
    if (speech.text.includes("bianco") || speech.text.includes("Bianco")) coloreBianco(speech.text);
    if (speech.text.includes("nero") || speech.text.includes("Nero")) coloreNero(speech.text);

    if (speech.text.includes("rosa") || speech.text.includes("Rosa")) coloreRosa(speech.text);
    if (speech.text.includes("azzurro") || speech.text.includes("Azzurro")) coloreAzzurro(speech.text);
    
//     if (speech.text.includes("disegna") || speech.text.includes("disegno") || speech.text.includes("disegni")) disegna=true
//       if (speech.text.includes("stop") || speech.text.includes("Stop") ) disegna=false;
    
  if (speech.text.includes("salva") || speech.text.includes("Salva immagine")) saveImage();
    
  if (speech.text.includes("cancella") || speech.text.includes("Cancella")) pg.clear();;

  console.log(speech.text);
  }


  
  // #1 Hand Tracking
  handsfree = new Handsfree({ hands: true, });
  handsfree.enablePlugins("browser");
  handsfree.plugin.pinchScroll.disable();
  // Attiva la webcam
  buttonStart = createButton("Start Webcam");
  buttonStart.class("handsfree-show-when-stopped");
  buttonStart.class("handsfree-hide-when-loading");
  buttonStart.mousePressed(() => handsfree.start());
  // Bottone "loading..."
  buttonLoading = createButton("...loading...");
  buttonLoading.class("handsfree-show-when-loading");

  // Bottone di stop
  buttonStop = createButton("Stop Webcam");
  buttonStop.class("handsfree-show-when-started");
  buttonStop.mousePressed(() => handsfree.stop());
  
  
  
  computerVoice.speak(
    "Pronuncia un colore e pizzica con la mano destra per disegnare. Usa la mano sinistra per regolare la dimensione."
  );
}


//- Scena
function draw() {
  background(20,20,20);
  
  for (var j = 0; j < 2000; j += 2000 / 40) {
		for (var r = 0; r < 2000; r += 2000 / 40) {
			stroke(30,30,30);
			strokeWeight(1);
			line(j, 0, j, 2000);
			line(0, r, 2000, r);
		}
	}

  textAlign(CENTER, CENTER);
  textSize(35);
  
 if(frameCount<=450){
   fill(200)
  text(istruzioni, width / 2, height / 2);}
  drawSkeleton();
  drawHands();
  
//calcola media tra pollice e indice dx  
  mdxx = dxpollicex + ((dxindicex - dxpollicex)/2);
  mdxy = dxpollicey - ((dxpollicey - dxindicey)/2);
//calcola distanza indice pollice sx e la mappa sul pennello
  distanza = parseInt(dist(sxpollicex, sxpollicey, sxindicex, sxindicey));
  sizepennello = parseInt(map(distanza, 0, 250, 5, 50));
  //console.log(sizepennello);
  

  drawScene();   

  image(pg, 0, 0, w, h)  
}

   function coloreBlu() {colorMap = [0, 127, 255];}
   function coloreViola() {colorMap = [143, 0, 255];}
   function coloreRosso() {colorMap = [255, 20, 60];}
   function coloreGiallo() {colorMap = [255, 255, 50];}
   function coloreArancione() {colorMap = [255, 102, 0];}
   function coloreVerde() {colorMap = [0, 255, 127];}
   function coloreBianco() {colorMap = [255, 255, 255];}
   function coloreNero() {colorMap = [55, 55, 55];}
   function coloreAzzurro() {colorMap = [8, 232, 222];}
   function coloreRosa() {colorMap = [255, 192, 203];}

// Disegna la Mano
function drawHands() {
  const hands = handsfree.data?.hands;

  // Ritenta se non vede la mano
  if (!hands?.landmarks) return;
  
  

  // Disegna i Keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
              
      
      //estraggo i punti della mano sinistra
      if (handIndex === 0 && landmarkIndex === 8) {
        strokeWeight(3)  
        stroke(0)
        sxindicex = parseInt(sketch.width - landmark.x * sketch.width);
        sxindicey = parseInt(landmark.y * sketch.height);
              
      } else if (handIndex === 0 && landmarkIndex === 4) {
        strokeWeight(3)  
        stroke(0)
        sxpollicex = parseInt(sketch.width - landmark.x * sketch.width);
        sxpollicey = parseInt(landmark.y * sketch.height);
        
       //punto rosso in mezzo alle dita     
     // circle(msxx, msxy , circleSize);
      
      }
      
      //estraggo i punti della mano destra 
      else if (handIndex === 1 && landmarkIndex === 8) {
        fill(color(colorMap))
        circleSize = 15;
      
        dxindicex = parseInt(sketch.width - landmark.x * sketch.width);
        dxindicey = parseInt(landmark.y * sketch.height);
              
      } else if (handIndex === 1 && landmarkIndex === 4) {
        fill(color(colorMap))
        circleSize = 15;
      
        dxpollicex = parseInt(sketch.width - landmark.x * sketch.width);
        dxpollicey = parseInt(landmark.y * sketch.height);
        
       //punto rosso in mezzo alle dita    
       // console.log(mdxx, mdxy)
      circle(mdxx, mdxy , sizepennello);
      
      } else {fill(color(255, 255, 255))
      noStroke();
      circleSize = 10;}
       //console.log(pollicex +(indicex - pollicex))
      
      
      pinchdx = parseInt(dist(dxindicex, dxindicey, dxpollicex, dxpollicey))
     // console.log(pinchdx)
      
// tutti i punti bianchi
      circle(sketch.width - landmark.x * sketch.width, landmark.y * sketch.height, circleSize);
      

    });
  });
}

//Disegna le linee delle dita
function drawSkeleton() {
  fill(0);
  strokeWeight(4);
  stroke(20);

  if (handsfree.data.hands) {
    if (handsfree.data.hands.multiHandLandmarks) {
      var landmarks = handsfree.data.hands.multiHandLandmarks;
      var nHands = landmarks.length;

      for (var h = 0; h < nHands; h++) {
        for (var i = 0; i <= 20; i++) {
          var px0 = landmarks[h][0].x;
          var py0 = landmarks[h][0].y;

          var px1 = landmarks[h][1].x;
          var py1 = landmarks[h][1].y;

          var px2 = landmarks[h][2].x;
          var py2 = landmarks[h][2].y;

          var px3 = landmarks[h][3].x;
          var py3 = landmarks[h][3].y;

          var px4 = landmarks[h][4].x;
          var py4 = landmarks[h][4].y;

          var px5 = landmarks[h][5].x;
          var py5 = landmarks[h][5].y;

          var px6 = landmarks[h][6].x;
          var py6 = landmarks[h][6].y;

          var px7 = landmarks[h][7].x;
          var py7 = landmarks[h][7].y;

          var px8 = landmarks[h][8].x;
          var py8 = landmarks[h][8].y;

          var px9 = landmarks[h][9].x;
          var py9 = landmarks[h][9].y;

          var px10 = landmarks[h][10].x;
          var py10 = landmarks[h][10].y;

          var px11 = landmarks[h][11].x;
          var py11 = landmarks[h][11].y;

          var px12 = landmarks[h][12].x;
          var py12 = landmarks[h][12].y;

          var px13 = landmarks[h][13].x;
          var py13 = landmarks[h][13].y;

          var px14 = landmarks[h][14].x;
          var py14 = landmarks[h][14].y;

          var px15 = landmarks[h][15].x;
          var py15 = landmarks[h][15].y;

          var px16 = landmarks[h][16].x;
          var py16 = landmarks[h][16].y;

          var px17 = landmarks[h][17].x;
          var py17 = landmarks[h][17].y;

          var px18 = landmarks[h][18].x;
          var py18 = landmarks[h][18].y;

          var px19 = landmarks[h][19].x;
          var py19 = landmarks[h][19].y;

          var px20 = landmarks[h][20].x;
          var py20 = landmarks[h][20].y;

          px0 = map(landmarks[h][0].x, 0, 1, width, 0);
          py0 = map(landmarks[h][0].y, 0, 1, 0, height);
          px1 = map(landmarks[h][1].x, 0, 1, width, 0);
          py1 = map(landmarks[h][1].y, 0, 1, 0, height);
          px2 = map(landmarks[h][2].x, 0, 1, width, 0);
          py2 = map(landmarks[h][2].y, 0, 1, 0, height);
          px3 = map(landmarks[h][3].x, 0, 1, width, 0);
          py3 = map(landmarks[h][3].y, 0, 1, 0, height);
          px4 = map(landmarks[h][4].x, 0, 1, width, 0);
          py4 = map(landmarks[h][4].y, 0, 1, 0, height);
          px5 = map(landmarks[h][5].x, 0, 1, width, 0);
          py5 = map(landmarks[h][5].y, 0, 1, 0, height);
          px6 = map(landmarks[h][6].x, 0, 1, width, 0);
          py6 = map(landmarks[h][6].y, 0, 1, 0, height);
          px7 = map(landmarks[h][7].x, 0, 1, width, 0);
          py7 = map(landmarks[h][7].y, 0, 1, 0, height);
          px8 = map(landmarks[h][8].x, 0, 1, width, 0);
          py8 = map(landmarks[h][8].y, 0, 1, 0, height);
          px9 = map(landmarks[h][9].x, 0, 1, width, 0);
          py9 = map(landmarks[h][9].y, 0, 1, 0, height);
          px10 = map(landmarks[h][10].x, 0, 1, width, 0);
          py10 = map(landmarks[h][10].y, 0, 1, 0, height);
          px11 = map(landmarks[h][11].x, 0, 1, width, 0);
          py11 = map(landmarks[h][11].y, 0, 1, 0, height);
          px12 = map(landmarks[h][12].x, 0, 1, width, 0);
          py12 = map(landmarks[h][12].y, 0, 1, 0, height);
          px13 = map(landmarks[h][13].x, 0, 1, width, 0);
          py13 = map(landmarks[h][13].y, 0, 1, 0, height);
          px14 = map(landmarks[h][14].x, 0, 1, width, 0);
          py14 = map(landmarks[h][14].y, 0, 1, 0, height);
          px15 = map(landmarks[h][15].x, 0, 1, width, 0);
          py15 = map(landmarks[h][15].y, 0, 1, 0, height);
          px16 = map(landmarks[h][16].x, 0, 1, width, 0);
          py16 = map(landmarks[h][16].y, 0, 1, 0, height);
          px17 = map(landmarks[h][17].x, 0, 1, width, 0);
          py17 = map(landmarks[h][17].y, 0, 1, 0, height);
          px18 = map(landmarks[h][18].x, 0, 1, width, 0);
          py18 = map(landmarks[h][18].y, 0, 1, 0, height);
          px19 = map(landmarks[h][19].x, 0, 1, width, 0);
          py19 = map(landmarks[h][19].y, 0, 1, 0, height);
          px20 = map(landmarks[h][20].x, 0, 1, width, 0);
          py20 = map(landmarks[h][20].y, 0, 1, 0, height);

          //INDICE
          line(px8, py8, px7, py7);
          line(px7, py7, px6, py6);
          line(px6, py6, px5, py5);

          //MIGNOLO
          line(px20, py20, px19, py19);
          line(px19, py19, px18, py18);
          line(px18, py18, px17, py17);

          //MEDIO
          line(px12, py12, px11, py11);
          line(px11, py11, px10, py10);
          line(px10, py10, px9, py9);

          //ANULARE
          line(px16, py16, px15, py15);
          line(px15, py15, px14, py14);
          line(px14, py14, px13, py13);

          //POLLICE
          line(px0, py0, px1, py1);
          line(px1, py1, px2, py2);
          line(px2, py2, px3, py3);
          line(px3, py3, px4, py4);

          line(px5, py5, px1, py1);
          line(px9, py9, px5, py5);
          line(px9, py9, px13, py13);
          line(px17, py17, px13, py13);
          line(px17, py17, px0, py0);
        
        }
      }
    }
  }
}



function drawScene() {
     pg.noStroke();
    if (pinchdx <= 40){
 pg.fill(colorMap);
      pg.ellipse(mdxx, mdxy, sizepennello)
     }
  //console.log(mdxx);
}



function saveImage(){
  save("CoMMI.png");
}
