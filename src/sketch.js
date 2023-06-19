var font = [];
		font[0] = "Times New Roman";
		font[1] = "Arial";
		font[2] = "Helvetica";
		var fontType = ["Arial", "Times", "Helvetica"];

		function changeFont(element, name) {
			element.style.fontFamily = name;
		}

		let capture;
		let detector;

		const frasi = [
			"Fai attenzione a ciò che gli utenti fanno,\n non a ciò che dicono. - Jackob Nielsen -",
			"Progettare un prodotto è progettare una relazione. - Steve Rogers -",
			"Se pensi che un buon design sia costoso, dovresti considerare il costo di un cattivo design. - Ralf Speth -"
		];

		const fontStyles = [
			{ fontName: 'Roboto', phraseIndex: 0 },
			{ fontName: 'Helvetica', phraseIndex: 1 },
			{ fontName: 'Libre Baskerville', phraseIndex: 2 }
		];

		let miaFrase;

		async function setup() {
			createCanvas(1450, 800);
			capture = createCapture(VIDEO);
			capture.size(640, 480);
			capture.hide();
			console.log("Carico modello...");
			detector = await createDetector();
			console.log("Modello caricato.");
			background(10);

			// Imposta il font iniziale
			const fontStyle = fontStyles[0];
			const fontFamily = fontStyle.fontName;
			changeFont(document.body, fontFamily);
			miaFrase = frasi[0];
		}

		function draw() {
			fill(10);
			textSize(25);
			textAlign(CENTER);

			// Ottieni l'indice del font corrispondente alla frase corrente
			const fontStyle = fontStyles[frasi.indexOf(miaFrase)];
			const fontName = fontStyle.fontName;

			textFont(fontName); // Imposta il font corretto per la frase

			text(miaFrase, width / 2, height / 2);

			hand();
		}

		async function hand() {
			scale(windowWidth / 640);
			fill(200);
			if (detector && capture.loadedmetadata) {
				const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true });
				if (hands.length == 1) {
					const manoA = hands[0];
					const indice = manoA.keypoints[8];
					cerchio(indice.x, indice.y);
				}
			}
		}

		async function createDetector() {
			// Configurazione Media Pipe
			// https://google.github.io/mediapipe/solutions/hands
			const mediaPipeConfig = {
				runtime: "mediapipe",
				modelType: "full",
				maxHands: 2,
				solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
			};
			return window.handPoseDetection.createDetector(window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig);
		}

		function cerchio(x, y) {
			fill(300);
			ellipse(x, y, 50, 50);
			noStroke();
		}

		function mousePressed() {
			clear();
			background(10);
			const index = floor(random(0, frasi.length));
			miaFrase = frasi[index];
			const fontStyle = fontStyles[index];
			const fontFamily = fontStyle.fontName;
			changeFont(document.body, fontFamily);
		}
