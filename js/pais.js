"use strict";

class Pais{
    constructor(nameOfTheCountry,capitalName,numPoblacion){
        this.nameOfTheCountry = nameOfTheCountry;
        this.capitalName = capitalName;
        this.numPoblacion = numPoblacion;
        this.nameOfTheCircuit = "";
        this.government = "";
        this.finishCoordenates = "";
        this.religion ="";
    }

    completarPais(nameOfTheCircuit,government,finishCoordenates,religion){
        this.nameOfTheCircuit = nameOfTheCircuit;
        this.government = government;
        this.finishCoordenates = finishCoordenates;
        this.religion = religion;
    }
    getNombrePais(){
        return this.nameOfTheCountry;
    }
    getCapitalPais(){
        return this.capitalName;
    }

    getInformacionSecundaria(){
        return "<ul>\n<li>Tipo de Gobierno: "+this.government+"</li>\n<li>Religión del país:"+this.religion+"</li>\n<li>Población actual: "+this.numPoblacion+" millones </li>\n<li>Nombre del Circuito: "+this.nameOfTheCircuit + "</li>\n</ul>";
    }

    writeCoordinates(){
        document.write("<p>Coordenadas: " + this.finishCoordenates+"</p>");
    }

    meteorologiaDeLaSalida(){
        const latitud = this.finishCoordenates.split(",")[0];
        const longitud = this.finishCoordenates.split(",")[1];
        this.url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&mode=xml&lang=es&units=metric&appid=f0ac348a913d9d6e7bf1b5d7c1d3613d`;
        
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: function(datos){
                
                // Presentación de los datos contenidos en XML
                const container = document.querySelector('body');
                const section = document.createElement('section');
                container.appendChild(section);
    
                const h2Node = document.createElement('h2');
                h2Node.textContent = 'Previsión meteorológica';
                section.appendChild(h2Node);
    
                // Extrae los elementos <time> que contienen las previsiones diarias
                const listaDias = $(datos).find("time");
    
                let dia = 1;
    
                listaDias.each(function() {
                    const datosDia = $(this);
    
                    // Filtra para seleccionar solo los datos de mediodía (12:00:00)
                    const fechaCompleta = datosDia.attr("from");
                    const fechaHora = fechaCompleta.split("T");
    
                    if(fechaHora[1] === "12:00:00") {
                        const article = document.createElement('article');
    
                        let h3 = document.createElement('h3');
                        h3.textContent = "Previsión día " + dia;
                        article.appendChild(h3);
                        dia++;
    
                        let parrafo = document.createElement('p');
                        parrafo.textContent = "Fecha: " + fechaCompleta;
                        article.appendChild(parrafo);
    
                        // Extrae temperatura máxima y mínima
                        parrafo = document.createElement('p');
                        parrafo.textContent = "Temperatura máxima: " + datosDia.find("temperature").attr("max") + " °C";
                        article.appendChild(parrafo);
    
                        parrafo = document.createElement('p');
                        parrafo.textContent = "Temperatura mínima: " + datosDia.find("temperature").attr("min") + " °C";
                        article.appendChild(parrafo);
    
                        // Extrae la humedad
                        parrafo = document.createElement('p');
                        parrafo.textContent = "Humedad: " + datosDia.find("humidity").attr("value") + " %";
                        article.appendChild(parrafo);

                        //Extrae la lluvia
                        parrafo = document.createElement('p');
                        let lluvia  = datosDia.find("precipitation").attr("value");
                        if (lluvia >= 0){
                            parrafo.textContent = "Lluvia del día: " + lluvia + "%";
                        }else{
                            parrafo.textContent = "Lluvia del día: No hay lluvia esperada";
                        }
                        article.appendChild(parrafo);
    
                        // Extrae el icono del clima
                        const weatherIcon = datosDia.find("symbol").attr("var");
                        const imagen = document.createElement('img');
                        imagen.setAttribute('src', "https://openweathermap.org/img/w/" + weatherIcon + ".png");
                        imagen.setAttribute('alt', "Icono del tiempo");
                        article.appendChild(imagen);
    
                        section.appendChild(article);
                    }
                });
                
            },
            error: function() {
                $("h3").html("¡Tenemos problemas! No puedo obtener los datos XML de <a href='https://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
    
}