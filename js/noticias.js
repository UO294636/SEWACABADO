
class Noticia {
    constructor() {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            const inputFile = document.querySelector('#noticias');
            if (inputFile) {
                const mensaje = document.createElement('p');
                mensaje.textContent = "El navegador no soporta la API File. No puedes cargar archivos.";
                inputFile.parentNode.replaceChild(mensaje, inputFile);
            }
        }
        const boton = document.querySelector('button');
        boton.addEventListener('click', this.añadirNoticia.bind(this));

    }

    readInputFile(archivos) {
        const archivo = archivos[0];
        let textoArchivo = null;
        var claseNoticias = this;
        const tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = function () {
                textoArchivo = lector.result;
                const noticias = textoArchivo.split("\n");
                claseNoticias.crearNoticia(noticias);
            };
            lector.readAsText(archivo);
        } else {
            noticia.textContent = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }

    crearNoticia(noticias) {
        const main = document.querySelector("main");

        noticias.forEach((lineaNoticia) => {
            const [tituloTexto, textoNoticiaTexto, autorTexto] = lineaNoticia.split("_");

            const article = document.createElement("article");
            main.appendChild(article);
            
            const titulo = document.createElement('h3');
            titulo.textContent = tituloTexto;
            article.appendChild(titulo);

            const textoNoticia = document.createElement('p');
            textoNoticia.textContent = textoNoticiaTexto;
            article.appendChild(textoNoticia);

            const autor = document.createElement('p');
            autor.textContent = `Autor: ${autorTexto}`;
            article.appendChild(autor);
        });
    }
    añadirNoticia() {
        const inputs = document.querySelectorAll("input");
        const nuevaNoticia = [
            inputs[1].value,
            inputs[2].value,
            inputs[3].value,
        ].join("_");

        this.crearNoticia([nuevaNoticia]);
        inputs.forEach((input) =>{
            input.value = "";
        });
    }


    

    

    


}
