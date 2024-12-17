"use strict";

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
    }

    createStructure() {
        const container = document.querySelector('main');
    
        const encabezado = document.createElement('h3');
        encabezado.textContent = 'Tiempo de Reacción: El Semáforo';
        container.appendChild(encabezado);
    
        for (let i = 0; i < this.lights; i++) {
            const luz = document.createElement('div');
            container.appendChild(luz);
        }
    
        const botonInicio = document.createElement('button');
        botonInicio.textContent = 'Arranque';
        botonInicio.addEventListener('click', () => this.initSequence(botonInicio, botonReaccion, reactionTime));
        container.appendChild(botonInicio);
    
        const botonReaccion = document.createElement('button');
        botonReaccion.textContent = 'Reacción';
        botonReaccion.disabled = true;
        botonReaccion.addEventListener('click', () => this.stopReaction(botonInicio, botonReaccion, reactionTime));
        container.appendChild(botonReaccion);
    
        const reactionTime = document.createElement('p');
        container.appendChild(reactionTime);
    
        // Guardar referencias para evitar búsquedas posteriores
        this.elements = { botonInicio, botonReaccion, reactionTime };
    }
    
    initSequence(botonInicio, botonReaccion, reactionTime) {
        const container = document.querySelector('main');
        container.classList.add('load');
        botonInicio.disabled = true;
    
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence(container, botonReaccion);
        }, 2000 + this.difficulty * 1000);
    }
    
    endSequence(container, botonReaccion) {
        container.classList.remove('load');
        container.classList.add('unload');
        botonReaccion.disabled = false;
    }
    
    stopReaction(botonInicio, botonReaccion, reactionTimeElement) {
        this.clic_moment = new Date();
        const reactionTimeValue = (this.clic_moment - this.unload_moment) / 1000;
        reactionTimeElement.textContent = `Tiempo de reacción: ${reactionTimeValue.toFixed(3)} segundos`;
    
        const container = document.querySelector('main');
        container.classList.remove('unload');
        botonReaccion.disabled = true;

        // Pasar el valor del tiempo de reacción en lugar del elemento
        this.createRecordForm(reactionTimeValue);
    }
    resetSemaforo(){
        botonInicio.disabled = false;
    }

    createRecordForm(reactionTimeValue) {
        const container = document.querySelector("main");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "semaforo.php";
        form.innerHTML = ''; // Limpia el contenido previo
        form.innerHTML = `
            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="nombre" required><br>

            <label for="apellidos">Apellidos:</label>
            <input type="text" name="apellidos" id="apellidos" required><br>

            <label for="nivel">Nivel:</label>
            <input type="text" name="nivel" id="nivel" value="${this.difficulty}" readonly><br>

            <label for="tiempo">Tiempo:</label>
            <input type="text" name="tiempo" id ="tiempo" value="${reactionTimeValue.toFixed(3)}" readonly><br>

            <button type="submit">Guardar récord</button>
        `;
        container.appendChild(form);
    }
}

