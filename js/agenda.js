"use strict";

class Agenda{
    constructor(){
    this.urlCarreras = "https://ergast.com/api/f1/current";

    this.createElements();
    }


createElements(){
    const boton = document.querySelector('button');
    boton.addEventListener('click', this.clickToShowTheInfo.bind(this));
    const container = document.querySelector('body');
    //Creo el section donde van a ir cada uno de los elementos con la informacion de cada carrera
    const section = document.createElement('section');
    container.appendChild(section);
}

clickToShowTheInfo(){
    this.getRacesInfo();
}

getRacesInfo() {
    $.ajax({
        dataType: "xml",
        url: this.urlCarreras,
        method: 'GET',
        success: function(datos) {
            const section = document.querySelector('section');
            const cabecera = document.createElement('h2')
            cabecera.textContent = "Carreras";
            section.appendChild(cabecera);
            const races = $(datos).find('Race');
            
            races.each(function(index, race) {
                const article = document.createElement('article');

                // Usar namespace explícito para extraer información
                const raceName = $(race).find('RaceName').text();
                const circuitName = $(race).find('CircuitName').text();
                const location = $(race).find('Location');
                const lat = location.attr('lat');
                const long = location.attr('long');
                const date = $(race).find('Date').first().text();
                const time = $(race).find('Time').first().text();

                // Crear contenido del artículo
                let h3 = document.createElement('h3');
                h3.textContent = raceName;
                article.appendChild(h3);

                let parrafo = document.createElement('p');
                parrafo.textContent = "En: " + circuitName;
                article.appendChild(parrafo);

                parrafo = document.createElement('p');
                parrafo.textContent = `Ubicado en las coordenadas: ${lat}, ${long}`;
                article.appendChild(parrafo);

                parrafo = document.createElement('p');
                parrafo.textContent = `Fecha: ${date}, a las: ${time}`;
                article.appendChild(parrafo);

                section.appendChild(article);
            });
        },
        error: function() {
            $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://ergast.com/mrd/'>Ergast</a>");
        }
    });
}

}
