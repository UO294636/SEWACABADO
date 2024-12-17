class Circuito {
    constructor() {
        this.xmlCreado = false;
        this.kmlCreado = false;
    }

    // Metodo que se encarga de leer los archivos, en este caso es 
    //de uso exclusivo para representar el html.
    readInputFile(archivos) {
        const archivo = archivos[0];
        const tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = (event) => {
                // Llamo al metodo para que cuando se calca el boton en este caso active el evento.
                this.crearInfoXml(event.target.result); 
            };
            lector.readAsText(archivo);
        } else {
            //Cambio el contenido del main para evitar que salga un alert.
            const main = document.querySelector("main");
            main.textContent = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }

    // Procesar el XML y generar HTML en el <main>
    crearInfoXml(archivoXml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(archivoXml, "application/xml");
        const main = document.querySelectorAll("section")[0];
        main.innerHTML = ""; // Limpiar contenido previo

        // Trato la información general con el DOMPARSER Información general
        const nombre = xmlDoc.querySelector("nombre").textContent;
        const longitud = xmlDoc.querySelector("longitud").textContent;
        const anchura = xmlDoc.querySelector("anchura").textContent;
        const fecha = xmlDoc.querySelector("fechaCarrera").textContent;
        const hora = xmlDoc.querySelector("horaInicio").textContent;
        const localidad = xmlDoc.querySelector("localidad").textContent;
        const pais = xmlDoc.querySelector("pais").textContent;

        main.innerHTML += `
            <h3>${nombre}</h3>
            <p>Longitud: ${longitud} metros</p>
            <p>Anchura: ${anchura} metros</p>
            <p>Fecha de Carrera: ${fecha}</p>
            <p>Hora de Inicio: ${hora}</p>
            <p>Localidad: ${localidad}, ${pais}</p>
        `;

        //Trato los enlaces que hay como referencias en el xml creando
        //en este caso una lista desordenada.
        const referencias = xmlDoc.querySelectorAll("referencia");
        if (referencias.length > 0) {
            const refList = document.createElement("ul");
            const refTitle = document.createElement("h3");
            refTitle.textContent = "Referencias:";
            main.appendChild(refTitle);

            referencias.forEach((ref) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = ref.textContent;
                a.textContent = ref.textContent;
                a.target = "_blank";
                li.appendChild(a);
                refList.appendChild(li);
            });
            main.appendChild(refList);
        }

        // Trato la galeria de fotos, simplemente las añado a la aplicación.
        const fotos = xmlDoc.querySelectorAll("fotografia");
        if (fotos.length > 0) {
            const photoGallery = document.createElement("section");
            const photoTitle = document.createElement("h3");
            photoTitle.textContent = "Galería de Fotos:";
            photoGallery.appendChild(photoTitle);

            fotos.forEach((foto) => {
                const img = document.createElement("img");
                img.src = "xml/"+foto.textContent; //ruta de la foto.
                img.alt = "Foto del circuito";
                img.style.width = "200px"; // PREGUNTAR.
                photoGallery.appendChild(img);
            });
            main.appendChild(photoGallery);
        }

        // Trato la Galería de Videos
        const videos = xmlDoc.querySelectorAll("video");
        if (videos.length > 0) {
            const videoGallery = document.createElement("section");
            const videoTitle = document.createElement("h3");
            videoTitle.textContent = "Galería de Videos:";
            videoGallery.appendChild(videoTitle);

            videos.forEach((video) => {
                const vid = document.createElement("video");
                vid.controls = true;
                vid.src = "xml/" + video.textContent;
                vid.style.width = "300px"; // PREGUNTAR
                videoGallery.appendChild(vid);
            });
            main.appendChild(videoGallery);
        }

        // Trato los tramos y cada una de los atributos del mismo.
    const tramos = xmlDoc.querySelectorAll("tramo");
    if (tramos.length > 0) {
        const tramoTable = document.createElement("table");
        tramoTable.setAttribute("id", "Tramos"); // ID único para la tabla

        // Añadir una descripción a la tabla
        const caption = document.createElement("caption");
        caption.textContent = "Detalles de los tramos del circuito";
        tramoTable.appendChild(caption);

    // Encabezados
        tramoTable.innerHTML += `
            <thead>
                <tr>
                    <th scope="col" id="distancia">Distancia</th>
                    <th scope="col" id="unidad">Unidad</th>
                    <th scope="col" id="sector">Sector</th>
                    <th scope="col" id="longitud">Longitud</th>
                    <th scope="col" id="latitud">Latitud</th>
                    <th scope="col" id="altitud">Altitud</th>
                </tr>
            </thead>
        <tbody></tbody>
    `;

    const tbody = tramoTable.querySelector("tbody");

    // Filas de datos
    tramos.forEach((tramo, index) => {
        const distancia = tramo.getAttribute("distancia");
        const unidad = tramo.getAttribute("unidadDistancia");
        const sector = tramo.getAttribute("sector");
        const longitud = tramo.querySelector("longitud").textContent;
        const latitud = tramo.querySelector("latitud").textContent;
        const altitud = tramo.querySelector("altitud").textContent;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td headers="distancia">${distancia}</td>
            <td headers="unidad">${unidad}</td>
            <td headers="sector">${sector}</td>
            <td headers="longitud">${longitud}</td>
            <td headers="latitud">${latitud}</td>
            <td headers="altitud">${altitud}</td>
        `;
        tbody.appendChild(row);
    });

    main.appendChild(tramoTable);
    this.xmlCreado = true;
}
}
    readKmlFile(archivos) {
        const archivo = archivos[0];
        const lector = new FileReader();
        lector.onload = (event) => {
            const contenidoKML = event.target.result;
            this.crearMapaDesdeKml(contenidoKML);
        };
        lector.readAsText(archivo);
    }

    // Crear mapa dinámico desde KML
    crearMapaDesdeKml(contenidoKML) {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(contenidoKML, 'application/xml');
        var section = null;
        if (this.xmlCreado){
            section = document.querySelectorAll('section')[3];
        }else{
            section = document.querySelectorAll('section')[1];
        }
        

        // Crear el contenedor del mapa si no existe
            const mapaDiv = document.createElement('div');
            mapaDiv.setAttribute("id","mapa");
            mapaDiv.style.height = '400px';
            mapaDiv.style.width = '50%';
            mapaDiv.style.marginTop = '20px';
            section.appendChild(mapaDiv);
        // Inicializar el mapa con Mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTQ2MzYiLCJhIjoiY200bjEyMmY2MDN1dDJpc2F4eHpwMnIyZiJ9.GIRQuHRBZBT0-lyzIsTF9w';
        const mapa = new mapboxgl.Map({
            container: 'mapa',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [19.2458, 47.5802], // Coordenadas iniciales
            zoom: 14 // Nivel de zoom inicial
        });

        // Procesar puntos individuales
        const puntos = kmlDoc.querySelectorAll('Placemark Point coordinates');
        puntos.forEach((coord) => {
            const [lng, lat] = coord.textContent.trim().split(','); // Extraer longitud y latitud
            new mapboxgl.Marker()
                .setLngLat([parseFloat(lng), parseFloat(lat)])
                .addTo(mapa);
        });

        // Procesar la línea completa (circuito)
        const lineString = kmlDoc.querySelector('Placemark LineString coordinates');
        if (lineString) {
            const coords = lineString.textContent.trim().split(/\s+/).map((coord) => {
                const [lng, lat] = coord.split(','); // Extraer longitud y latitud
                return [parseFloat(lng), parseFloat(lat)];
            });

            // Dibujar la línea en el mapa
            mapa.on('load', () => {
                mapa.addSource('circuito', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                });

                mapa.addLayer({
                    id: 'circuito-layer',
                    type: 'line',
                    source: 'circuito',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#FF0000',
                        'line-width': 4
                    }
                });
            });
        }
        this.kmlCreado = true;
    }
    readSvgFile(archivos) {
        const archivo = archivos[0];
        if (archivo.type === "image/svg+xml") { // Verificar que sea un archivo SVG
            const lector = new FileReader();
            lector.onload = (event) => {
                const contenidoSvg = event.target.result; // Contenido del archivo
                this.mostrarSvg(contenidoSvg); // Procesar y mostrar el SVG
            };
            lector.readAsText(archivo); // Leer el archivo como texto
        } else {
            alert("No es un archivo svg");
        }
    }
    mostrarSvg(svgString) {
        let section;
    
        // Determinar la sección adecuada según las banderas
        if (this.xmlCreado && this.kmlCreado) {
            section = document.querySelectorAll("section")[4];
        } else if (this.xmlCreado || this.kmlCreado) {
            section = document.querySelectorAll("section")[2];
        } else {
            section = document.querySelectorAll("section")[2];
        }
        section.innerHTML += svgString;

    }
    

}
