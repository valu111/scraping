function mostrarModal(oferta) {
  document.getElementById('modal-imagen').src = oferta.imagen;
  document.getElementById('modal-titulo').textContent = oferta.titulo;
  document.getElementById('modal-subtitulo').textContent = oferta.subtitulo;
  document.getElementById('modal-texto').textContent = oferta.texto;
  document.getElementById('modal-ubicacion').textContent = "Ubicación: " + (oferta.ubicacion || "No especificada");
  document.getElementById('modal-estado').textContent = "Tipo de empleo: " + (oferta.estadoEmpleo || "No especificado");
  document.getElementById('modal-enlace').href = oferta.enlace || "#";

  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}

function cerrarModal() {
  document.getElementById('modal').classList.add('hidden');
}


const tabsArray = Array.from(document.querySelectorAll('.select-tab'));
const contentArray = Array.from(document.querySelectorAll('.select-context'));

tabsArray.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabsArray.forEach(t => t.classList.remove('bg-blue-200'));
    tab.classList.add('bg-blue-200');

    contentArray.forEach((content, i) => {
      content.classList.toggle('hidden', i !== index);
    });
  });
});


function crearCard(oferta, tipo = "todas") {
  const div = document.createElement('div');
  div.className = `flex items-center gap-4 p-3 border rounded-lg hover:bg-${tipo === "mejor" ? 'green' : tipo === "peor" ? 'red' : 'gray'}-50 cursor-pointer`;
  div.innerHTML = `
    <img src="${oferta.imagen}" class="w-12 h-12 object-contain rounded" alt="logo" />
    <div>
      <p class="font-semibold">${oferta.titulo}</p>
      <p class="text-sm text-gray-600">${oferta.subtitulo}</p>
    </div>
  `;
  div.onclick = () => mostrarModal(oferta);
  return div;
}


fetch('empleos.json')
  .then(res => res.json())
  .then(ofertas => {
    const todasLista = document.getElementById('todas-lista');
    const mejoresLista = document.getElementById('mejores-lista');
    const peoresLista = document.getElementById('peores-lista');

    const mejores = [];
    const peores = [];

    ofertas.forEach(oferta => {
      const texto = (oferta.texto + ' ' + oferta.subtitulo + ' ' + oferta.estadoEmpleo).toLowerCase();
      const esPeor = texto.includes('sin paga') || texto.includes('sueldo oculto') || texto.includes('freelance') || texto.includes('20,000') || texto.includes('prácticas') || texto.includes('becario');

   
      todasLista.appendChild(crearCard(oferta));

 
      if (esPeor) peores.push(oferta);
      else mejores.push(oferta);
    });

    mejores.slice(0, 10).forEach(oferta => mejoresLista.appendChild(crearCard(oferta, "mejor")));
    peores.slice(0, 10).forEach(oferta => peoresLista.appendChild(crearCard(oferta, "peor")));
  })
  .catch(err => console.error("Error al cargar empleos.json:", err));