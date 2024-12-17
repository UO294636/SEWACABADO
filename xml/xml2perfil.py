import xml.etree.ElementTree as ET

def generar_altimetria(xml_file, svg_file):
    """
    Genera un archivo SVG con la altimetría del circuito a partir del archivo XML.
    """
    try:
        # Leer y parsear el archivo XML
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Extraer las distancias acumuladas y altitudes
        puntos = []
        distancia_acumulada = 0.0
        for tramo in root.findall(".//{http://www.uniovi.es}tramo"):
            distancia = tramo.get("distancia")
            altitud_elem = tramo.find("{http://www.uniovi.es}altitud")

            if distancia is not None and altitud_elem is not None and altitud_elem.text:
                try:
                    distancia_acumulada += float(distancia)
                    altitud = float(altitud_elem.text)
                    puntos.append((distancia_acumulada, altitud))
                except ValueError:
                    print(f"Error al convertir distancia o altitud en tramo: {tramo.attrib}")
            else:
                print(f"Tramo inválido: {tramo.attrib}")

        # Verificar los puntos extraídos
        if not puntos:
            print("No se encontraron puntos válidos para generar la altimetría.")
            return
        # Normalizo los puntos para ajustarlos al SVG
        max_distancia = max([p[0] for p in puntos], default=1)
        max_altitud = max([p[1] for p in puntos], default=1)
        min_altitud = min([p[1] for p in puntos], default=0)

        ancho_svg = 800 
        alto_svg = 400   
        margen_y = 20   

        escala_x = ancho_svg / max_distancia
        escala_y = (alto_svg - 2 * margen_y) / (max_altitud - min_altitud)

        # Genero los puntos para la polilínea
        polilinea_puntos = " ".join(
            f"{x * escala_x},{alto_svg - margen_y - (y - min_altitud) * escala_y}" for x, y in puntos
        )

        # Creo las etiquetas para los niveles
        etiquetas = ""
        for x, y in puntos:
            x_svg = x * escala_x
            y_svg = alto_svg - margen_y - (y - min_altitud) * escala_y
            etiquetas += f'<text x="{x_svg}" y="{y_svg - 5}" font-size="10" text-anchor="middle" fill="black">{int(y)}</text>'

        svg_contenido = f"""
        <svg xmlns="http://www.w3.org/2000/svg" width="{ancho_svg}" height="{alto_svg}">
            <polyline points="{polilinea_puntos}" 
                      fill="none" stroke="blue" stroke-width="2" />
            {etiquetas}
            <rect width="{ancho_svg}" height="{alto_svg}" fill="none" stroke="black" />
        </svg>
        """

        with open(svg_file, "w") as f:
            f.write(svg_contenido)

        print(f"Archivo SVG generado: {svg_file}")

    except Exception as e:
        print(f"Error al procesar el archivo XML: {e}")

if __name__ == "__main__":
    
    xml_input = "circuitoEsquema.xml"
    svg_output = "perfil.svg"

    generar_altimetria(xml_input, svg_output)