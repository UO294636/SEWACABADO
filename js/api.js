
class Trivial {
    constructor() {
        this.preguntas = [
            {
                pregunta: "¿Cual es el piloto que tiene mas campeonatos del mundo?",
                opciones: ["a) Lewis Hamilton", "b) Michael Schumacher", "c) Fernando Alonso", "d) Opcion a y b"],
                respuesta: "d"
            },
            {
                pregunta: "¿En qué año se celebró el primer Campeonato Mundial de Fórmula 1?",
                opciones: ["a) 1948", "b) 1950", "c) 1952", "d) 1955"],
                respuesta: "b"
            },
            {
                pregunta: "¿Qué escudería tiene el récord de más títulos de Constructores en la Fórmula 1?",
                opciones: ["a) McLaren", "b) Mercedes", "c) Ferrari", "d) Red Bull"],
                respuesta: "c"
            },
            {
                pregunta: "¿Qué circuito es conocido como 'El Templo de la Velocidad'?",
                opciones: ["a) Monza", "b) Silverstone", "c) Spa-Francorchamps", "d) Suzuka"],
                respuesta: "a"
            },
            {
                pregunta: "¿Quién ganó el Campeonato Mundial de Fórmula 1 en 2021?",
                opciones: ["a) Lewis Hamilton", "b) Max Verstappen", "c) Sebastian Vettel", "d) Charles Leclerc"],
                respuesta: "b"
            },
            {
                pregunta: "¿Qué Gran Premio se celebra en un principado europeo famoso por sus calles estrechas?",
                opciones: ["a) Gran Premio de Austria", "b) Gran Premio de Mónaco", "c) Gran Premio de Hungría", "d) Gran Premio de Italia"],
                respuesta: "b"
            },
            {
                pregunta: "¿Qué piloto tiene el récord de más poles position en la historia de la Fórmula 1?",
                opciones: ["a) Ayrton Senna", "b) Lewis Hamilton", "c) Michael Schumacher", "d) Nigel Mansell"],
                respuesta: "b"
            },
            {
                pregunta: "¿Quién fue el piloto más joven en ganar un Gran Premio de Fórmula 1?",
                opciones: ["a) Fernando Alonso", "b) Max Verstappen", "c) Sebastian Vettel", "d) Charles Leclerc"],
                respuesta: "b"
            },
            {
                pregunta: "¿Qué piloto ostenta el récord de más victorias en una sola temporada?",
                opciones: ["a) Lewis Hamilton", "b) Michael Schumacher", "c) Max Verstappen", "d) Sebastian Vettel"],
                respuesta: "c"
            },
            {
                pregunta: "¿Cúal fué la primera carrera nocturna de la historia?",
                opciones: ["a) Yas Marina (Abu Dabi)", "b) Marina Bay (Singapur)", "c) Suzuka (Japón)", "d) Circuito de Baréin"],
                respuesta: "b"
            }
        ];
        this.preguntaActual = 0;
        this.puntuacion = 0;
        this.audioContext = null;
        this.sonidoAcierto = null;
        this.sonidoFallo = null;

        // Recuperar el progreso del juego si existe
        this.cargarProgreso();
    }

    inicializarAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.cargarSonidos();
        }
    }

    cargarSonido(ruta, callback) {
        fetch(ruta)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => callback(audioBuffer))
            .catch(error => console.error(`Error al cargar sonido ${ruta}:`, error));
    }

    cargarSonidos() {
        this.cargarSonido('./multimedia/audio/respuestaCorrecta.mp3', buffer => { this.sonidoAcierto = buffer; });
        this.cargarSonido('./multimedia/audio/respuestaIncorrecta.mp3', buffer => { this.sonidoFallo = buffer; });
    }

    reproducirSonido(buffer) {
        if (!this.audioContext) return;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
    }

    barajarPreguntas() {
        for (let i = this.preguntas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.preguntas[i], this.preguntas[j]] = [this.preguntas[j], this.preguntas[i]];
        }
    }

    guardarProgreso() {
        const estado = {
            preguntaActual: this.preguntaActual,
            puntuacion: this.puntuacion
        };
        localStorage.setItem('trivialEstado', JSON.stringify(estado));
        history.replaceState(estado, '', `?pregunta=${this.preguntaActual}`);
    }

    cargarProgreso() {
        const estadoGuardado = localStorage.getItem('trivialEstado');
        if (estadoGuardado) {
            const { preguntaActual, puntuacion } = JSON.parse(estadoGuardado);
            this.preguntaActual = preguntaActual;
            this.puntuacion = puntuacion;
            document.querySelector('[data-type="score"]').textContent = `Tu puntuación es: ${this.puntuacion}/${this.preguntas.length}`;
        }
    }

    iniciar() {
        const startButton = document.querySelector('[data-action="start"]');
        const fullscreenButton = document.querySelector('[data-action="fullscreen"]');

        startButton.addEventListener('click', () => {
            this.inicializarAudio();
            this.mostrarPregunta();
            startButton.style.display = 'none';
        });
        startButton.addEventListener('touchstart', () => {
            this.inicializarAudio(); // También inicializa el contexto de audio al tocar
            this.mostrarPregunta();
            startButton.style.display = 'none';
        });

        fullscreenButton.addEventListener('click', () => {
            this.activarPantallaCompleta();
        });
        fullscreenButton.addEventListener('touchstart', () => {
            this.activarPantallaCompleta();
        });

    }

    activarPantallaCompleta() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar entrar en pantalla completa: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error(`Error al intentar salir de pantalla completa: ${err.message}`);
            });
        }
    }

    mostrarPregunta() {
        const questionElement = document.querySelector('[data-type="question"]');
        const optionsElement = document.querySelector('[data-type="options"]');
        const scoreElement = document.querySelector('[data-type="score"]');

        if (this.preguntaActual >= this.preguntas.length) {
            questionElement.textContent = "¡Trivial terminado!";
            optionsElement.innerHTML = '';
            scoreElement.textContent = `Tu puntuación es: ${this.puntuacion}/${this.preguntas.length}`;
            localStorage.removeItem('trivialEstado');
            return;
        }

        const pregunta = this.preguntas[this.preguntaActual];
        questionElement.textContent = pregunta.pregunta;
        optionsElement.innerHTML = '';

        pregunta.opciones.forEach(opcion => {
            const boton = document.createElement('button');
            boton.textContent = opcion;
            boton.onclick = () => this.verificarRespuesta(opcion);
            optionsElement.appendChild(boton);
        });

        this.guardarProgreso();
    }

    verificarRespuesta(opcionSeleccionada) {
        const pregunta = this.preguntas[this.preguntaActual];

        if (opcionSeleccionada.startsWith(pregunta.respuesta)) {
            this.puntuacion++;
            document.querySelector('[data-type="score"]').textContent = `Tu puntuación es: ${this.puntuacion}/${this.preguntas.length}`;
            if (this.sonidoAcierto) this.reproducirSonido(this.sonidoAcierto);
            this.preguntaActual++;
        } else {
            if (this.sonidoFallo) this.reproducirSonido(this.sonidoFallo);
            this.preguntaActual = 0;
            this.puntuacion = 0;
            this.barajarPreguntas(); // Mezclar preguntas al fallar
            document.querySelector('[data-type="score"]').textContent = `0`;
        }

        this.mostrarPregunta();
    }
}

