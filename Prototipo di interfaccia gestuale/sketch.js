//  ______  ____  ___  
//  __/ _ \/ __ \/ _ )
//  _/ , _/ /_/ / _  / 
//  /_/|_|\____/____/ 
//
// —
// Multimodal_Painting by Roberto Alesi [gesture based interface, 3d, lessinterface, handpose, painting]
// 2022
// Pittura con le mani usando Handsfree.js
// Twitter (me + handsfree.js): https://github.com/pixelfelt
// Twitter (just handsfree.js): https://github.com/handsfreejs


// Array che contiene il disegno
paint = [];

// Questo è come pmouseX e pmouseY... ma per ogni dito [pointer, middle, ring, pinky]
let prevPointer = [
  // Mano sinistra
  [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  // Mano destra
  [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
];

// Indici di riferimento per i polpastrelli [pointer, middle, ring, pinky]
// sono gli stessi per entrambe le mani
let fingertips = [8, 12, 16, 20];

let w;
let h;

///// Setup
function setup() {
  sketch = createCanvas((w = windowWidth), (h = windowHeight - 70));

  // Colore per ogni punta delle dita
  colorMap = [
    // Punta delle dita della mano sinistra
    [
      color(0, 0, 0),
      color(255, 0, 255),
      color(255, 177, 20),
      color(255, 255, 255),
    ],

    // Punta delle dita della mano destra
    [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)],
  ];

  // #1 Hand Tracking
  // https://handsfree.js.org/#quickstart-workflow
  handsfree = new Handsfree({
    //showDebug: true, // fa vedere la webcam
    hands: true,
  });
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
}

//- Scena

function draw() {
  background(0);
  drawSkeleton();
  drawHands();
  fingerPaint();
  mousePaint();
}

/////// #2 DISEGNO CON LE MANI
//// https://handsfree.js.org/ref/plugin/pinchers.html
////Ogni volta che si fa pinch e ci si sposta, vengono memorizzati i punti in un insieme di [x1, y1, handIndex, fingerIndex, size]
function fingerPaint() {
  let bounds = document.querySelector("canvas").getClientRects()[0];
  // Controlla la presenza di pinch e crea dei punti se viene fatto pinch
  const hands = handsfree.data?.hands;

  // Disegna con le dita
  if (hands?.pinchState) {
    // ripete per ogni mano
    hands.pinchState.forEach((hand, handIndex) => {
      //Ripete per ogni dito
      hand.forEach((state, finger) => {
        if (hands.landmarks?.[handIndex]?.[fingertips[finger]]) {
          // 
//I punti di riferimento sono in percentuale, quindi aumenta la scalabilità
          let x =
            sketch.width -
            hands.landmarks[handIndex][fingertips[finger]].x * sketch.width;
          let y =
            hands.landmarks[handIndex][fingertips[finger]].y * sketch.height;

          // Linea di partenza nel punto in cui si fa pinch
          if (state === "start") {
            prevPointer[handIndex][finger] = { x, y };

            // Aggiunge la linea all'array "paint"
          } else if (state === "held") {
            paint.push([
              prevPointer[handIndex][finger].x,
              prevPointer[handIndex][finger].y,
              x,
              y,
              colorMap[handIndex][finger],
            ]);
          }

          // Imposta l'ultima posizione
          prevPointer[handIndex][finger] = { x, y };
        }
      });
    });
  }

// pulisce tutto se viene fatto pinch con mignolo e pollice della mano sinistra
  // if (hands?.pinchState && hands.pinchState[0][3] === 'released') {
  //   paint = []
  // }

// Disegna il disegno
  paint.forEach((p) => {
    fill(p[4]);
    stroke(p[4]);
    strokeWeight(10);
    line(p[0], p[1], p[2], p[3]);
  });
}

// Disegna il mouse
function mousePaint() {
  if (mouseIsPressed === true) {
    fill(colorMap[1][0]);
    stroke(colorMap[1][0]);
    strokeWeight(10);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Disegna la Mano
function drawHands() {
  const hands = handsfree.data?.hands;

  // Ritenta se non vede la mano
  if (!hands?.landmarks) return;

  // Disegna i Keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // Imposta il colore
      // https://handsfree.js.org/ref/model/hands.html#data
      if (colorMap[handIndex]) {
        switch (landmarkIndex) {
          case 8:
            fill(colorMap[handIndex][0]);
            break;
          case 12:
            fill(colorMap[handIndex][1]);
            break;
          case 16:
            fill(colorMap[handIndex][2]);
            break;
          case 20:
            fill(colorMap[handIndex][3]);
            break;
          default:
            fill(color(255, 255, 255));
        }
      }
      // imposta lo Stroke
      if (handIndex === 0 && landmarkIndex === 8) {
        stroke(color(255, 255, 255));
        strokeWeight(2);
        circleSize = 15;
      } else {
        stroke(color(0, 0, 0));
        strokeWeight(0);
        circleSize = 8;
      }

      circle(
        // rifletti orizzontalmente
        sketch.width - landmark.x * sketch.width,
        landmark.y * sketch.height,
        circleSize
      );
    });
  });
}

//Disegna le linee delle dita
function drawSkeleton() {
  fill(0);
  strokeWeight(4);
  stroke(100);

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
