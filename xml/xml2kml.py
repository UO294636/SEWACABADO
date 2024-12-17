import xml.etree.ElementTree as ET

class KmlGenerator:
    def __init__(self, output_file):
        """
        Inicializa el generador KML con un archivo de salida.
        """
        self.output_file = output_file
        self.kml_root = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.document = ET.SubElement(self.kml_root, 'Document')

    def add_placemark(self, name, description, lon, lat, alt, altitude_mode="relativeToGround"):
        """
        Añade un marcador con las coordenadas proporcionadas.
        """
        placemark = ET.SubElement(self.document, 'Placemark')
        ET.SubElement(placemark, 'name').text = name
        ET.SubElement(placemark, 'description').text = description
        point = ET.SubElement(placemark, 'Point')
        ET.SubElement(point, 'coordinates').text = f"{lon},{lat},{alt}"
        ET.SubElement(point, 'altitudeMode').text = altitude_mode

    def add_line_string(self, name, coordinates, altitude_mode="relativeToGround"):
        """
        Añade una línea al KML con una lista de coordenadas.
        """
        placemark = ET.SubElement(self.document, 'Placemark')
        ET.SubElement(placemark, 'name').text = name
        line_string = ET.SubElement(placemark, 'LineString')
        ET.SubElement(line_string, 'coordinates').text = coordinates
        ET.SubElement(line_string, 'altitudeMode').text = altitude_mode

    def save(self):
        """
        Guarda el archivo KML generado.
        """
        tree = ET.ElementTree(self.kml_root)
        tree.write(self.output_file, encoding='utf-8', xml_declaration=True)

def process_circuito_xml(xml_file, kml_file):
    """
    Procesa el archivo circuitoEsquema.xml y genera un archivo KML.
    """
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Creo el generador KML
        kml = KmlGenerator(kml_file)

        # Proceso el circuito y los tramos
        for tramo in root.findall(".//{http://www.uniovi.es}tramo"):
            distancia = tramo.get("distancia", "0")
            unidad = tramo.get("unidadDistancia", "metros")
            sector = tramo.get("sector", "")

            lon = tramo.find("{http://www.uniovi.es}longitud").text
            lat = tramo.find("{http://www.uniovi.es}latitud").text
            alt = tramo.find("{http://www.uniovi.es}altitud").text

            kml.add_placemark(f"Tramo {sector}", f"Distancia: {distancia} {unidad}", lon, lat, alt)

        # Genero la  línea completa del circuito para cada uno de ellos
        coordinates = "\n".join(
            f"{tramo.find('{http://www.uniovi.es}longitud').text},"
            f"{tramo.find('{http://www.uniovi.es}latitud').text},"
            f"{tramo.find('{http://www.uniovi.es}altitud').text}"
            for tramo in root.findall(".//{http://www.uniovi.es}tramo")
        )

        kml.add_line_string("Circuito Completo", coordinates)

        # Guardo el archivo KML
        kml.save()
        print(f"Archivo KML generado: {kml_file}")

    except Exception as e:
        print(f"Error procesando el archivo XML: {e}")

if __name__ == "__main__":
    xml_input = "circuitoEsquema.xml"
    kml_output = "circuito.kml"

    process_circuito_xml(xml_input, kml_output)
    
