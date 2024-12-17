
<?php
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $connection;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";

        $this->connect();
    }

    private function connect() {
        $this->connection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        
        if ($this->connection->connect_error) {
            die("Error al conectar a la base de datos: " . $this->connection->connect_error);
        }
            
    }

    public function saveRecord($name, $lastname, $level, $time) {
        $stmt = $this->connection->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssds", $name, $lastname, $level, $time);

        if (!$stmt->execute()) {
            echo "Error al guardar el récord: " . $stmt->error;
        }
        $stmt->close();
    }

    public function getTopRecords($level) {
        // Preparar la consulta
        $stmt = $this->connection->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        
        if (!$stmt) {
            die("Error al preparar la consulta: " . $this->connection->error);
        }
    
        // Vincular parámetros
        $stmt->bind_param("d", $level);
    
        // Ejecutar la consulta
        $stmt->execute();
    
        // Obtener los resultados
        $resultado = $stmt->get_result();
    
        // Crear la salida en HTML
        echo "<section>";
        echo "<h2>Mejores 10 tiempos en la dificultad: {$level}</h2>";
        echo "<ol>";
        while ($fila = $resultado->fetch_assoc()) {
            // Acceder a los valores de cada fila
            echo "<li>Nombre: ".$fila['nombre'].", Apellidos: ".$fila['apellidos'].", Tiempo: ".$fila['tiempo']."</li>";
        }
        echo "</ol>";
        echo "</section>";
    
        // Cerrar la consulta y la conexión
        $stmt->close();
        $this->connection->close();
    }
}
    
?>


<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <title>F1 DESKTOP Juegos</title>
    <link rel ="icon" href="multimedia/imagenes/favicon.ico" />
    <meta name = "author" content = "Sergio García Santamarina" />
    <meta name = "description" content = "Documento para utilizar en otros módulos de la asignatura" />
    <meta charset="UTF-8" />
    <meta name = "keywords" content = "semaforo,reaccion,juego,f1" /> <!--CAMBIAR-->
    <meta name = "viewport" content = "width= device-width, initial-scale=1.0" />
     <!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel = "stylesheet" type="text/css" href= "estilo/semaforo_grid.css" />
    <script src="js/semaforo.js"></script>
</head>
<body>
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
    <p>Estás en: <a href="index.html">Inicio</a> > > Juegos > > Semáforo</p>
    <h2>Menu de Juegos Disponibles</h2>
    <nav>
        <a title="Memoria" href="memoria.html">Memoria</a>
        <a title="Tiempo de Reacción" href="semaforo.php">Tiempo de Reacción</a>
        <a title="Trivial F1" href="api.html">Trivial F1</a>
        <a title="librePhp" href="php/librePhp.php">Resultados GP Hungría</a>
    </nav>

    <main>
    </main>
    <script>
    var semaforo = new Semaforo();
    </script>
     <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST" && count($_POST) > 0) {
    // Crear el objeto Record
    $record = new Record();

    // Guardar el nuevo récord
    $record->saveRecord($_POST["nombre"], $_POST["apellidos"], $_POST["nivel"], $_POST["tiempo"]);

    // Mostrar el top 10
    $record->getTopRecords($_POST["nivel"]);
}
?>

        
</body>
</html>