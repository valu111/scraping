document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([23.6345, -102.5528], 5); // Centro de México

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  fetch("empleos.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((empleo) => {
        const ubicacion = empleo.ubicacion.toLowerCase();

        let coords = null;
        if (ubicacion.includes("guadalajara")) {
          coords = [20.6597, -103.3496];
        } else if (ubicacion.includes("cdmx") || ubicacion.includes("ciudad de méxico")) {
          coords = [19.4326, -99.1332];
        } else if (ubicacion.includes("monterrey")) {
          coords = [25.6866, -100.3161];
        } else if (ubicacion.includes("latam") || ubicacion.includes("remoto")) {
          coords = [19.4326, -99.1332]; // CDMX para remoto/latam
        } else {
          console.warn(`Ubicación no reconocida para el empleo: "${empleo.titulo}" - Ubicación: "${empleo.ubicacion}"`);
          // Asignamos CDMX por defecto para ubicaciones no reconocidas
          coords = [19.4326, -99.1332];
        }

        // Añadimos desplazamiento para no superponer marcadores
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        const newCoords = [coords[0] + offsetLat, coords[1] + offsetLng];

        L.marker(newCoords)
          .addTo(map)
          .bindPopup(`
            <img src="${empleo.imagen}" alt="${empleo.titulo}" style="width: 100px; height: auto; display: block; margin-bottom: 8px;" />
            <strong>${empleo.titulo}</strong><br/>
            ${empleo.subtitulo}<br/>
            <em>Estado: ${empleo.estadoEmpleo}</em><br/>
            <a href="${empleo.enlace}" target="_blank">Ver más</a>
          `);
      });
    })
    .catch((err) => {
      console.error("Error al cargar empleos.json", err);
    });
});
