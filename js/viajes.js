class Viajes{
    constructor(){
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        this.longitud = null;
        this.latitud = null;
        this.mapaEstaticoCreado = false;
        this.mapaDinamicoCreado = false;
        this.eventosDeLosBotonesDeLosMapas();

        this.carruselImagenes();
    }

    getPosicion(posicion){
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
    }

    verErrores(error){
        switch(error.code){
            case error.PERMISSION_DENIED:
                alert("El usuario no ha dado permiso para acceder a la ubicación");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Informacion de la ubicación no disponible");
                break;
            case error.TIMEOUT:
                alert("Tiempo de espera excedido");
                break;
            case error.UNKNOWN_ERROR:
                alert("Error desconocido");
                break;
        }
    }

    eventosDeLosBotonesDeLosMapas(){
        const boton = document.querySelectorAll('button');
        boton[0].addEventListener('click', this.mapaEstatico.bind(this));
        boton[1].addEventListener('click', this.mapaDinamico.bind(this));
    }

    mapaEstatico(){
        if(!this.mapaEstaticoCreado){
            this.mapaEstaticoCreado = true;

            const allDivs = document.querySelectorAll("div");
            const divEstatico = allDivs[0];

            var apiKey = "pk.eyJ1IjoidW8yOTQ2MzYiLCJhIjoiY200bjEyMmY2MDN1dDJpc2F4eHpwMnIyZiJ9.GIRQuHRBZBT0-lyzIsTF9w";
    
            const username = "mapbox";
            const style_id = "streets-v12";
            const overlay = "pin-s+000("+Number.parseFloat(this.longitud)+","+Number.parseFloat(this.latitud)+")";
            const zoom ="12";
            const width = "600";
            const height = "600";
    
            const url = "https://api.mapbox.com/styles/v1/"+username+"/"+style_id+"/static/"+overlay+"/"+this.longitud+","+this.latitud+","+zoom+"/"+width+"x"+height+"?access_token="+apiKey;
    
            const img = document.createElement("img");
            img.setAttribute("src", url);
            img.setAttribute("alt", "mapa estático de mapbox");
            divEstatico.appendChild(img);
    
        }

    }
    mapaDinamico() {
        if (!this.mapaDinamicoCreado) {
            this.mapaDinamicoCreado = true;
    
            const section = document.querySelector("section");
    
            // Crear título del mapa dinámico
            const h3 = document.createElement("h3");
            h3.textContent = "Mapa Dinámico";
            section.appendChild(h3);
    
            // Crear el contenedor para el mapa
            const divMapa = document.createElement("div");
            divMapa.setAttribute("id", "mapa");
            divMapa.style.width = "30vw"; // Definir tamaño explícito
            divMapa.style.height = "40vh"; // Definir tamaño explícito
            divMapa.style.display = "block"; // Asegurar que sea visible
            divMapa.style.visibility = "visible";
            section.appendChild(divMapa);
    
            // Validar coordenadas
            if (this.latitud === null || this.longitud === null) {
                alert("Las coordenadas no están disponibles. Asegúrate de habilitar la geolocalización.");
                return;
            }
    
            // Inicializar MapBox
            mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTQ2MzYiLCJhIjoiY200bjEyMmY2MDN1dDJpc2F4eHpwMnIyZiJ9.GIRQuHRBZBT0-lyzIsTF9w';
            const map = new mapboxgl.Map({
                container: 'mapa',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [this.longitud, this.latitud],
                zoom: 9 
            });
    
            map.resize(); // Recalcular el tamaño del mapa
    
            // Forzar visibilidad de los elementos internos
            document.querySelectorAll('.mapboxgl-canary').forEach(el => {
                el.style.visibility = 'visible';
            });
    
            // Añadir el marcador en el centro del mapa
            new mapboxgl.Marker()
                .setLngLat([this.longitud, this.latitud])
                .addTo(map);
        }
    }


     carruselImagenes(){

        const slides = document.querySelectorAll("img");

        // select next slide button
        const nextSlide = document.querySelector("button[data-action='next']");

        // current slide counter
        let curSlide = 1;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // add event listener and navigation functionality
        nextSlide.addEventListener("click", function () {
        // check if current slide is the last and reset current slide
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        //   move slide by -100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
            });
        });

        // select next slide button
        const prevSlide = document.querySelector("button[data-action='prev']");

        // add event listener and navigation functionality
        prevSlide.addEventListener("click", function () {
        // check if current slide is the first and reset current slide to last
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        //   move slide by 100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });
    }
    


}