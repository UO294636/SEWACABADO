<?php
    class Carrusel{

        private $capital;
        private $pais;

        public function __construct($capital, $pais){
            $this->capital = $capital;
            $this->pais = $pais;
        }  

        public function obtenerImagenes(){
            $api_key = '92d11be22c54f916ffec91d6982a0bf7';
        $tags = urlencode("{$this->pais},{$this->capital}");
        $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={$api_key}&tags={$tags}&per_page=10&format=json&nojsoncallback=1";

        $respuesta = file_get_contents($url);
        if ($respuesta === false) {
            return [];
        }

        $datos = json_decode($respuesta, true);
        if (isset($datos['photos']['photo'])) {
            foreach ($datos['photos']['photo'] as $foto) {
                $farm_id = $foto['farm'];
                $server_id = $foto['server'];
                $photo_id = $foto['id'];
                $secret_id = $foto['secret'];

                $photo_url = "https://farm{$farm_id}.staticflickr.com/{$server_id}/{$photo_id}_{$secret_id}_m.jpg";
                $this->fotos[] = $photo_url;
            }
        }
        return $this->fotos;
        }
    }
    $carrusel = new Carrusel("Hungria", "Budapest");
    $fotos = $carrusel->obtenerImagenes();
    
    class Moneda {

private $monedaLocal;
private $monedaCambio;

public function __construct($monedaLocal, $monedaCambio){
    $this->monedaLocal = $monedaLocal;
    $this->monedaCambio = $monedaCambio;
}
public function obtenerCambio(){
    $api_key = 'aaf6680166311f89c8f40de1';

    $url = "https://v6.exchangerate-api.com/v6/".$api_key."/latest/".$this->monedaCambio;

    $response = file_get_contents($url);

    if ($response) {
        $data = json_decode($response, true);
        
        if (isset($data['conversion_rates']['HUF'])) {
            echo "<h3>Cambio de moneda</h3>";
            $exchange_rate = $data['conversion_rates']['HUF'];
            echo "<p>1 ".$this->monedaCambio." equivale a ".$exchange_rate." ".$this->monedaLocal;
        } else {
            echo "<h2>Hubo un error al transcribir el valor de la tasa.</h2>";
        }
    } else {
        echo "<h2>Error al obtener los datos desde la API.</h2>";
    }
}
}
?>



<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <title>F1 DESKTOP Viajes</title>
    <link rel ="icon" href="multimedia/imagenes/favicon.ico" />
    <meta name = "author" content = "Sergio García Santamarina" />
    <meta name = "description" content = "Documento para utilizar en otros módulos de la asignatura" />
    <meta charset="UTF-8" />
    <meta name = "keywords" content = "por cambiar" /> <!--CAMBIAR-->
    <meta name = "viewport" content = "width= device-width, initial-scale=1.0" />
     <!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <script src="js/viajes.js"></script>
</head>

<body>
<script src="https://code.jquery.com/jquery-3.7.1.min.js" async integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
    <h1>F1 Desktop</h1>
    <nav>
        <a href="index.html">Inicio</a> 
        <a href="piloto.html">Piloto</a> 
        <a href="noticias.html">Noticias</a> 
        <a href="calendario.html">Calendario</a> 
        <a href="meteorología.html">Meteorología</a> 
        <a href="circuito.html">Circuito</a> 
        <a href="viajes.php">Viajes</a> 
        <a href="juegos.html">Juegos</a> 
       </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> > > Viajes</p>
    <h2>Viajes</h2>
    <aside>
    <?php
    $moneda = new Moneda("HUF","EUR");
    $moneda->obtenerCambio();
    ?>
    
    </aside>
    <link rel="stylesheet" type="text/css" href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" rel="preload">
    <section>
        <button>Generar mapa estático</button>
        <button>Generar mapa dinámico</button>
        <div>
        </div>
    </section>
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js" async></script>
    <script src="https://unpkg.com/@mapbox/togeojson" async></script>
    <section data-type="carrusel">
    <h3>Carrusel de Imágenes</h3>
    <article>
    <?php foreach ($fotos as $foto): ?>
        <img src="<?= $foto ?>" alt="Imagen de Budapest,Hungria">
        <?php endforeach; ?>

        <!-- Control buttons -->
        <button data-action='next'> > </button>
        <button data-action='prev'> < </button>
    </article>
    </section>
    

    <script>
        var viajes = new Viajes();
    </script>
    
    
</body>
</html>