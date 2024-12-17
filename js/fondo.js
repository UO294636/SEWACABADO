"use strict";

class Fondo{
    constructor(countryName,capitalName,nameOfTheCircuit){
        this.countryName = countryName;
        this.capitalName = capitalName;
        this.nameOfTheCircuit = nameOfTheCircuit;
    }

    imagenCircuito(){
    const varApiFlicker = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
    $.getJSON(varApiFlicker,{
        tags: this.nameOfTheCircuit,
        tagmode: "any",
        format: "json"
    }).done(function(data){
        let indiceFoto =Math.floor(Math.random() * data.items.length);
        let foto = data.items[indiceFoto];
        let fotoURL = foto.media.m;
        $('body').css('background-image','url('+fotoURL.replace('_m','_b')+')').css('background-size', 'cover').css('background-repeat', 'no-repeat').css('height', '100vh');

    }
    );
    }
}