<?php
        class Resultados{

            private $server;
            private $user;
            private $pass;
            private $dbname;

            public function __construct(){
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "F1Database";
            }

            public function crearBase(){
                $connexion = new mysqli($this->server, $this->user, $this->pass);

                // Verificar conexión
                if ($connexion->connect_error) {
                    die("Conexión fallida: " . $connexion->connect_error);
                }

                // Crear base de datos
                $sql = file_get_contents('F1Database.sql');
                if ($connexion->multi_query($sql) === TRUE) {
                    echo "<p>Base de datos creada correctamente</p>";
                } else {
                    echo "<p>Error al crear la base de datos: " . $connexion->error."</p>";
                }

                // Cerrar conexión
                $connexion->close();
            }

            public function cargarDatos($nombreArchivo){

                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $sql = "SELECT COUNT(*) as total FROM GranPremio";
                $result = $connexion->query($sql);

                if ($result) {
                    $row = $result->fetch_assoc();
                    $total_registros = $row['total'];
                
                    if ($total_registros == 0) {

                        $archivo = fopen($nombreArchivo, 'r');
        
                        $consultaGranPremio = "INSERT INTO GranPremio (GranPremioID, Nombre, NumeroDeRonda, Ubicacion) VALUES (?, ?, ?, ?)";
                        $consultaEquipos = "INSERT INTO Equipos (EquipoID, Nombre, Nacionalidad) VALUES (?, ?, ?)";
                        $consultaPilotos = "INSERT INTO Pilotos (PilotoID, Nombre, Apellidos, Numero, Nacionalidad, Edad, EquipoID) VALUES (?, ?, ?, ?, ?, ?, ?)";
                        $consultaClasificacion = "INSERT INTO Clasificacion (ClasificacionID, PilotoID, Tiempo) VALUES (?, ?, ?)";
                        $consultaCarrera = "INSERT INTO Carrera (CarreraID, PilotoID, Tiempo, Puntos) VALUES (?, ?, ?, ?)";


                        
                        $preparedStatementGranPremio = $connexion->prepare($consultaGranPremio);
                        $preparedStatementEquipos = $connexion->prepare($consultaEquipos);
                        $preparedStatementPilotos = $connexion->prepare($consultaPilotos);
                        $preparedStatementClasificacion = $connexion->prepare($consultaClasificacion);
                        $preparedStatementCarrera = $connexion->prepare($consultaCarrera);

                        $tabla = "GranPremio";
                        $cambioTabla = 0;
        
                        while (($data = fgetcsv($archivo, 1000, ",")) !== FALSE) {

                            if($cambioTabla === 1){
                                $cambioTabla = 0;
                            }

                            //cargamos la consulta para la tabla correspondiente
                            if($data[0] == "Equipos"){
                                $tabla = "Equipos";
                                $cambioTabla = 1;
                            }
                            if($data[0] == "Pilotos"){
                                $tabla = "Pilotos";
                                $cambioTabla = 1;
                            }
                            if($data[0] == "Clasificacion"){
                                $tabla = "Clasificacion";
                                $cambioTabla = 1;
                            }
                            if($data[0] == "Carrera"){
                                $tabla = "Carrera";
                                $cambioTabla = 1;
                            }

                            //insertamos los datos del gran premio
                            if($tabla === "GranPremio" && $cambioTabla === 0){
                                $preparedStatementGranPremio->bind_param("isis",$data[0],$data[1],$data[2],$data[3]);
                                if(!$preparedStatementGranPremio->execute()){
                                    echo "<p>Error al insertar los datos del gran premio: ". $connexion->error."</p>";
                                }
                            }

                            //insertamos los datos de los equipos
                            if($tabla === "Equipos" && $cambioTabla === 0){    
                                $preparedStatementEquipos->bind_param("iss",$data[0],$data[1],$data[2]);
                                if(!$preparedStatementEquipos->execute()){
                                    echo "<p>Error al insertar los datos de los equipos: ". $connexion->error."</p>";
                                }
                            }

                            //insertamos los datos de los pilotos
                            if($tabla === "Pilotos" && $cambioTabla === 0){
                                $preparedStatementPilotos->bind_param("isssssi",$data[0],$data[1],$data[2],$data[3],$data[4],$data[5],$data[6]);
                                if(!$preparedStatementPilotos->execute()){
                                    echo "<p>Error al insertar los datos de los pilotos: ". $connexion->error."</p>";
                                }    
                            }

                            //insertamos los datos de la clasificacion
                            if($tabla === "Clasificacion" && $cambioTabla === 0){    
                                $preparedStatementClasificacion->bind_param("iis",$data[0],$data[1],$data[2]);
                                if(!$preparedStatementClasificacion->execute()){
                                    echo "<p>Error al insertar los datos de la clasificacion: ". $connexion->error."</p>";
                                }    
                            }

                            //insertamos los datos de la carrera
                            if($tabla === "Carrera" && $cambioTabla === 0){
                                $preparedStatementCarrera->bind_param("iisi",$data[0],$data[1],$data[2],$data[3]);
                                if(!$preparedStatementCarrera->execute()){
                                    echo "<p>Error al insertar los datos de la carrera: ". $connexion->error."</p>";
                                }    
                            }

                        }
                        $preparedStatementGranPremio->close();
                        $preparedStatementEquipos->close();
                        $preparedStatementPilotos->close();
                        $preparedStatementClasificacion->close();
                        $preparedStatementCarrera->close();
                        fclose($archivo);

                    } else {
                        echo "<p>Datos ya cargados en la base de datos</p>";
                    }
                } else {
                    echo "<p>Error al ejecutar la consulta: " . $conn->error."</p>";
                }
                $connexion->close();
            }

            public function crearTablaPilotos(){

                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $consultaComprobar = "SELECT COUNT(*) as total FROM GranPremio";
                $resultadoComprobar = $connexion->query($consultaComprobar);
                $row = $resultadoComprobar->fetch_assoc();
                $total_registros = $row['total'];

                if ($total_registros > 0) {
                    $sql = "SELECT Nombre, NumeroDeRonda, Ubicacion FROM GranPremio";

                    $resultado = $connexion->query($sql);
                    $fila = $resultado->fetch_assoc();
    
                    //creacion cabecera de la tabla
                    echo "<main>";
                    echo "<h2>".$fila['Nombre']." ubicado en ".$fila['Ubicacion']."</h2>";
                    echo "<table>";
                    echo "<caption>Pilotos participantes del ".$fila['Nombre']."</caption>";
                    echo "<tr>";
                    echo "<th scope= 'col' id='indice'>Indice</th>";
                    echo "<th scope= 'col' id='nombre'>Nombre</th>";
                    echo "<th scope= 'col' id='apellidos'>Apellidos</th>";
                    echo "<th scope= 'col' id='numero'>Numero</th>";
                    echo "<th scope= 'col' id='nacionalidad'>Nacionalidad</th>";
                    echo "<th scope= 'col' id='edad'>Edad</th>";
                    echo "<th scope= 'col' id='equipo'>Equipo</th>";
                    echo "</tr>";
    
                    //cargamos los datos de los pilotos
                    $sql = "SELECT PilotoID, Nombre, Apellidos, Numero, Nacionalidad, Edad, EquipoID FROM Pilotos";
                    $consulta = "SELECT Nombre FROM Equipos WHERE EquipoID=?";
    
                    $resultado = $connexion->query($sql);
                    while ($fila = $resultado->fetch_assoc()) {
                        // Accede a los valores de cada fila
    
                        $preparedStatement = $connexion->prepare($consulta);
                        $preparedStatement->bind_param("i",$fila['EquipoID']);
                        $preparedStatement->execute();
    
                        $resultadoEquipo = $preparedStatement->get_result();
                        $filaEquipo = $resultadoEquipo->fetch_assoc();
    
                        $preparedStatement->close();
    
                        echo "<tr>";
                        echo "<th scope='row' id='".$fila['PilotoID']."' headers='indice'>".$fila['PilotoID']."</th>";
                        echo "<td headers='".$fila['PilotoID']." nombre'>".$fila['Nombre']."</td>";
                        echo "<td headers='".$fila['PilotoID']." apellidos'>".$fila['Apellidos']."</td>";
                        echo "<td headers='".$fila['PilotoID']." numero'>".$fila['Numero']."</td>";
                        echo "<td headers='".$fila['PilotoID']." nacionalidad'>".$fila['Nacionalidad']."</td>";
                        echo "<td headers='".$fila['PilotoID']." edad'>".$fila['Edad']."</td>";
                        echo "<td headers='".$fila['PilotoID']." edad'>".$filaEquipo['Nombre']."</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                    echo "</main>";    
                }else{
                    echo"<p>No hay datos cargados</p>";
                }
                $connexion->close();
            }

            public function crearTablaEquipos(){
                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $consultaComprobar = "SELECT COUNT(*) as total FROM GranPremio";
                $resultadoComprobar = $connexion->query($consultaComprobar);
                $row = $resultadoComprobar->fetch_assoc();
                $total_registros = $row['total'];

                if ($total_registros > 0) {
                    $sql = "SELECT Nombre, NumeroDeRonda, Ubicacion FROM GranPremio";

                    $resultado = $connexion->query($sql);
                    $fila = $resultado->fetch_assoc();
    
                    //creacion cabecera de la tabla
                    echo "<main>";
                    echo "<h2>".$fila['Nombre']." ronda nº:".$fila['NumeroDeRonda']." ubicado en ".$fila['Ubicacion']."</h2>";
                    echo "<table>";
                    echo "<caption>Equipos participantes del ".$fila['Nombre']."</caption>";
                    echo "<tr>";
                    echo "<th scope= 'col' id='indice'>Indice</th>";
                    echo "<th scope= 'col' id='nombre'>Nombre</th>";
                    echo "<th scope= 'col' id='nacionalidad'>Nacionalidad</th>";
                    echo "</tr>";
    
                    //cargamos los datos de los equipos
                    $sql = "SELECT EquipoID, Nombre, Nacionalidad FROM Equipos";
    
                    $resultado = $connexion->query($sql);
                    while ($fila = $resultado->fetch_assoc()) {
                        // Accede a los valores de cada fila
    
                        echo "<tr>";
                        echo "<th scope='row' id='".$fila['EquipoID']."' headers='indice'>".$fila['EquipoID']."</th>";
                        echo "<td headers='".$fila['EquipoID']." nombre'>".$fila['Nombre']."</td>";
                        echo "<td headers='".$fila['EquipoID']." nacionalidad'>".$fila['Nacionalidad']."</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                    echo "</main>";
    
                }else{
                    echo"<p>No hay datos cargados</p>";
                }
                $connexion->close();
            }

            public function crearTablaClasificacion() {
                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $consultaComprobar = "SELECT COUNT(*) as total FROM GranPremio";
                $resultadoComprobar = $connexion->query($consultaComprobar);
                $row = $resultadoComprobar->fetch_assoc();
                $total_registros = $row['total'];

                if ($total_registros > 0) {
                    $sql = "SELECT Nombre, NumeroDeRonda, Ubicacion FROM GranPremio";

                    $resultado = $connexion->query($sql);
                    $fila = $resultado->fetch_assoc();
    
                    //creacion cabecera de la tabla
                    echo "<main>";
                    echo "<h2>".$fila['Nombre']." ronda nº:".$fila['NumeroDeRonda']." ubicado en ".$fila['Ubicacion']."</h2>";
                    echo "<table>";
                    echo "<caption>Clasificacion del ".$fila['Nombre']."</caption>";
                    echo "<tr>";
                    echo "<th scope= 'col' id='indice'>Indice</th>";
                    echo "<th scope= 'col' id='piloto'>Piloto</th>";
                    echo "<th scope= 'col' id='tiempo'>Tiempo</th>";
                    echo "</tr>";
    
                    //cargamos los datos de la clasificacion
                    $sql = "SELECT ClasificacionID, PilotoID, Tiempo FROM Clasificacion";
                    $consulta = "SELECT Nombre, Apellidos FROM Pilotos WHERE PilotoID=?";
    
                    $resultado = $connexion->query($sql);
                    while ($fila = $resultado->fetch_assoc()) {
                        // Accede a los valores de cada fila
    
                        $preparedStatement = $connexion->prepare($consulta);
                        $preparedStatement->bind_param("i",$fila['PilotoID']);
                        $preparedStatement->execute();
    
                        $resultadoPiloto = $preparedStatement->get_result();
                        $filaPiloto = $resultadoPiloto->fetch_assoc();
    
                        $preparedStatement->close();
    
    
                        echo "<tr>";
                        echo "<th scope='row' id='".$fila['ClasificacionID']."' headers='indice'>".$fila['ClasificacionID']."</th>";
                        echo "<td headers='".$fila['ClasificacionID']." piloto'>".$filaPiloto['Nombre']." ".$filaPiloto['Apellidos']."</td>";
                        echo "<td headers='".$fila['ClasificacionID']." tiempo'>".$fila['Tiempo']."</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                    echo "</main>";    
                }else{
                    echo"<p>No hay datos cargados</p>";
                }
                $connexion->close();
            }

            public function crearTablaCarrera(){
                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $consultaComprobar = "SELECT COUNT(*) as total FROM GranPremio";
                $resultadoComprobar = $connexion->query($consultaComprobar);
                $row = $resultadoComprobar->fetch_assoc();
                $total_registros = $row['total'];

                if ($total_registros > 0) {
                    $sql = "SELECT Nombre, NumeroDeRonda, Ubicacion FROM GranPremio";

                    $resultado = $connexion->query($sql);
                    $fila = $resultado->fetch_assoc();
    
                    //creacion cabecera de la tabla
                    echo "<main>";
                    echo "<h2>".$fila['Nombre']." ronda nº:".$fila['NumeroDeRonda']." ubicado en ".$fila['Ubicacion']."</h2>";
                    echo "<table>";
                    echo "<caption>Carrera del ".$fila['Nombre']."</caption>";
                    echo "<tr>";
                    echo "<th scope= 'col' id='indice'>Indice</th>";
                    echo "<th scope= 'col' id='piloto'>Piloto</th>";
                    echo "<th scope= 'col' id='tiempo'>Tiempo</th>";
                    echo "<th scope= 'col' id='puntos'>Puntos</th>";
                    echo "</tr>";
    
                    //cargamos los datos de la carrera
                    $sql = "SELECT CarreraID, PilotoID, Tiempo, Puntos FROM Carrera";
                    $consulta = "SELECT Nombre, Apellidos FROM Pilotos WHERE PilotoID=?";
    
                    $resultado = $connexion->query($sql);
                    while ($fila = $resultado->fetch_assoc()) {
                        // Accede a los valores de cada fila
    
                        $preparedStatement = $connexion->prepare($consulta);
                        $preparedStatement->bind_param("i",$fila['PilotoID']);
                        $preparedStatement->execute();
    
                        $resultadoPiloto = $preparedStatement->get_result();
                        $filaPiloto = $resultadoPiloto->fetch_assoc();
    
                        $preparedStatement->close();
    
    
                        echo "<tr>";
                        echo "<th scope='row' id='".$fila['CarreraID']."' headers='indice'>".$fila['CarreraID']."</th>";
                        echo "<td headers='".$fila['CarreraID']." piloto'>".$filaPiloto['Nombre']." ".$filaPiloto['Apellidos']."</td>";
                        echo "<td headers='".$fila['CarreraID']." tiempo'>".$fila['Tiempo']."</td>";
                        echo "<td headers='".$fila['CarreraID']." puntos'>".$fila['Puntos']."</td>";
                        echo "</tr>";
                    }
                    echo "</table>";
                    echo "</main>";
    
                }else{
                    echo"<p>No hay datos cargados</p>";
                }
                $connexion->close();                
            }

            public function exportarCSV(){

                $tablas = array('Equipos','Pilotos','Clasificacion','Carrera');

                $tablas = array(
                    array('Equipos'),
                    array('Pilotos'),
                    array('Clasificacion'),
                    array('Carrera')
                );

                $nombreFichero = "GranPremio.csv";

                $connexion = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                $consultaGranPremio = "SELECT * FROM GranPremio";
                $consultaEquipos = "SELECT * FROM Equipos";
                $consultaPilotos = "SELECT * FROM Pilotos";
                $consultaClasificacion = "SELECT * FROM Clasificacion";
                $consultaCarrera = "SELECT * FROM Carrera";

                $resultadoGranPremio = $connexion->query($consultaGranPremio);
                $resultadoEquipos = $connexion->query($consultaEquipos);
                $resultadoPilotos = $connexion->query($consultaPilotos);
                $resultadoClasificacion = $connexion->query($consultaClasificacion);
                $resultadoCarrera = $connexion->query($consultaCarrera);

                $fichero = fopen($nombreFichero, "w");

                //exportamos tabla GranPremio
                foreach ($resultadoGranPremio as $fila) {
                    fputcsv($fichero, $fila);
                }

                //exportamos tabla Equipos
                fputcsv($fichero,$tablas[0]);
                foreach ($resultadoEquipos as $fila) {
                    fputcsv($fichero, $fila);
                }

                //exportamos tabla Pilotos
                fputcsv($fichero,$tablas[1]);
                foreach ($resultadoPilotos as $fila) {
                    fputcsv($fichero, $fila);
                }

                //exportamos tabla Clasificacion
                fputcsv($fichero,$tablas[2]);
                foreach ($resultadoClasificacion as $fila) {
                    fputcsv($fichero, $fila);
                }

                //exportamos tabla Carrera
                fputcsv($fichero,$tablas[3]);
                foreach ($resultadoCarrera as $fila) {
                    fputcsv($fichero, $fila);
                }

                fclose($fichero);

                $nombreDescarga = basename($nombreFichero);
                $filePath = "" . $nombreDescarga;
                if (!empty($nombreDescarga) && file_exists($filePath)) {
                    header("Cache-Control: public");
                    header("Content-Description: File Transfer");
                    header("Content-Disposition: attachment; filename=$nombreDescarga");
                    header("Content-Type: text/csv");
                    header("Content-Transfer-Encoding: binary");
                    readfile($filePath);
                }
            }
        }
    ?>


<!DOCTYPE HTML>
<html lang="es">
<head>
    <title>F1 DESKTOP Circuito</title>
    <link rel="icon" href="../multimedia/imagenes/favicon.ico">
    <meta name="author" content="Sergio García Santamarina">
    <meta name="description" content="Documento para utilizar en otros módulos de la asignatura">
    <meta charset="UTF-8">
    <meta name="keywords" content="por cambiar">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css">
    <link rel="stylesheet" type="text/css" href="../estilo/librePhp.css">
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    
<header>
    <h1>F1 Desktop</h1>
    <nav>
        <a href="../index.html">Inicio</a> 
        <a href="../piloto.html">Piloto</a> 
        <a href="../noticias.html">Noticias</a> 
        <a href="../calendario.html">Calendario</a> 
        <a href="../meteorología.html">Meteorología</a> 
        <a href="../circuito.html">Circuito</a> 
        <a href="../viajes.php">Viajes</a> 
        <a href="../juegos.html">Juegos</a> 
       </nav>
    </header>
    
    <p>Estás en: <a href="../index.html">Inicio</a> > > Juegos > > Resultados F1</p>
    <h2>Menu de Juegos Disponibles</h2>
    <nav>
        <a title="Memoria" href="../memoria.html">Memoria</a>
        <a title="Tiempo de Reacción" href="../semaforo.php">Tiempo de Reacción</a>
        <a title="Trivial" href="../api.html">Trivial</a>
        <a title="librePhp" href="librePhp.php">Resultados GP Hungría</a>
    </nav>

    <form action="#" method="post" enctype="multipart/form-data">
        <button type="submit" name="accion" value="crearBase">Crear base de datos</button>

        <label for="seleccionarArchivos">Selecciona los csv a importar:</label>
        <input type="file" id="seleccionarArchivos" name="archivoCSV" accept=".csv">

        <label for="ConfirmarCarga">Cargar csv seleccionados en la base de datos:</label>
        <input type="submit" id="ConfirmarCarga" value="Subir Archivos" name="submit">

        <button type="submit" name="accion" value="exportarCSV">Exportar CSV</button>
    </form>

    <?php
        $resultados = new Resultados();

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST["accion"])) {
                $accion = $_POST["accion"];
    
                if ($accion === "crearBase") {
                    $resultados->crearBase();
                }
                elseif($accion === "exportarCSV"){
                    $resultados->exportarCSV();
                }
                elseif ($accion === "cargarPilotos") {
                    $resultados->crearTablaPilotos();
                } 
                elseif ($accion === "cargarEquipos") {
                    $resultados->crearTablaEquipos();
                } 
                elseif ($accion === "cargarClasificacion") {
                    $resultados->crearTablaClasificacion();
                } 
                elseif ($accion === "cargarCarrera") {
                    $resultados->crearTablaCarrera();
                }
            }

            if (isset($_POST['submit'])) {
                if (isset($_FILES["archivoCSV"]) ) {

                    $nombre_temporal = $_FILES["archivoCSV"]["tmp_name"];
                    $resultados->cargarDatos($nombre_temporal);
                    $resultados->crearTablaPilotos();
                } else {
                    echo "<p>Por favor, selecciona un archivo para subir.</p>";
                }
            }
        }
    ?>

    <form action="#" method="post" name="botones">
        <button type="submit" name="accion" value="cargarPilotos">Mostrar Pilotos</button>
        <button type="submit" name="accion" value="cargarEquipos">Mostrar Equipos</button>
        <button type="submit" name="accion" value="cargarClasificacion">Mostrar Clasificacion</button>
        <button type="submit" name="accion" value="cargarCarrera">Mostrar Carrera</button>
    </form>

</body>
</html>