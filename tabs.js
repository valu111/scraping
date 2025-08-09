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

/* Variables globales */
let ofertas = [];
let rankingField = null;
let mejores = [];
let peores = [];
let listaActual = [];

/* Función para limpiar valores numéricos (quita comas, espacios, etc) */

/* Detecta un campo numérico para ordenar (si existe) */
function detectarCampoRanking(data) {
  const candidatos = ['score','rating','puntuacion','puntuación','salario','sueldo','salary', 'salarioBruto', 'salarioMensual'];

  for (const c of candidatos) {
    if (data.some(o => o && o[c] !== undefined && o[c] !== null && !isNaN(limpiarNumero(o[c])))) return c;
  }
  return null;
}

/* Divide la lista en mejores y peores según umbral salario >= 10,000 */
// Convierte valores como "$12,000", "12,000", "12000" a número entero 12000
function limpiarNumero(valor) {
  if (!valor) return 0;
  let numStr = String(valor).replace(/[^0-9.]/g, '');
  return parseFloat(numStr) || 0;
}

function dividirTopBottom(lista) {
  if (!lista || lista.length === 0) {
    mejores = [];
    peores = [];
    return;
  }

  console.log("Dividiendo lista de ofertas:", lista.length);
  lista.forEach(o => {
    console.log(`Oferta: ${o.titulo} - ${rankingField}: ${limpiarNumero(o[rankingField])}`);
  });

  if (rankingField) {
    mejores = lista.filter(oferta => limpiarNumero(oferta[rankingField]) >= 10000);
    peores = lista.filter(oferta => limpiarNumero(oferta[rankingField]) < 10000);

    console.log("Mejores antes de ordenar:", mejores.length);
    console.log("Peores antes de ordenar:", peores.length);

    mejores = mejores.sort((a, b) => limpiarNumero(b[rankingField]) - limpiarNumero(a[rankingField])).slice(0, 10);
    peores = peores.sort((a, b) => limpiarNumero(a[rankingField]) - limpiarNumero(b[rankingField])).slice(0, 10);

    console.log("Top 10 mejores:", mejores.map(o => limpiarNumero(o[rankingField])));
    console.log("Top 10 peores:", peores.map(o => limpiarNumero(o[rankingField])));
  } else {
    mejores = lista.slice(0, 10);
    peores = lista.slice(Math.max(lista.length - 10, 0));
  }
}



/* Muestra la cuadrícula principal (Todas) */
function mostrarTarjetas(lista) {
  const contenedor = document.getElementById("contenedor-todos");
  if (!contenedor) {
    console.error('No se encontró #contenedor-todos.');
    return;
  }
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No se encontraron resultados</h3>
        <p class="mt-1 text-gray-500">Intenta con otros términos de búsqueda</p>
      </div>
    `;
    return;
  }

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  lista.forEach(oferta => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-transform duration-200 hover:-translate-y-1";
    card.innerHTML = `
      <div class="p-5">
        <div class="flex items-start gap-4">
          <img src="${oferta.imagen || 'placeholder.jpg'}" alt="Logo" class="w-12 h-12 object-contain rounded-full border-2 border-white shadow">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-800 truncate">${oferta.titulo || 'Sin título'}</h3>
            <p class="text-sm text-gray-600 mt-1 truncate">${oferta.subtitulo || ''}</p>
          </div>
        </div>
        ${oferta.texto ? `<p class="mt-3 text-sm text-gray-500 line-clamp-2">${oferta.texto}</p>` : ''}
        <div class="mt-4 flex flex-wrap gap-2 items-center">
          ${oferta.ubicacion ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${oferta.ubicacion}</span>` : ''}
          ${oferta.estado ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">${oferta.estado}</span>` : ''}
          ${rankingField ? `<span class="ml-auto text-xs text-gray-600">${oferta[rankingField] ?? ''}</span>` : ''}
        </div>
      </div>
    `;
    card.onclick = () => {
      if (typeof mostrarModal === 'function') mostrarModal(oferta);
    };
    gridContainer.appendChild(card);
  });

  contenedor.appendChild(gridContainer);
}

/* Renderiza listas simples para mejores y peores ofertas */
function renderListaSimple(lista, containerId, tipo = '') {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = '';
  if (!lista || lista.length === 0) {
    cont.innerHTML = `<p class="text-center text-gray-500">Sin resultados</p>`;
    return;
  }

  lista.forEach((oferta, i) => {
    const orden = i + 1;
    const valorRanking = rankingField ? (oferta[rankingField] ?? '') : '';
    const item = document.createElement('div');
    item.className = "p-3 border rounded-md flex justify-between items-center hover:bg-gray-50";
    item.innerHTML = `
      <div>
        <div class="font-semibold">${orden}. ${oferta.titulo || 'Sin título'}</div>
        <div class="text-sm text-gray-500">${oferta.subtitulo || ''}</div>
      </div>
      <div class="text-right">
        ${ valorRanking !== '' ? `<div class="text-sm text-gray-700">${valorRanking}</div>` : '' }
        <button class="mt-2 text-xs text-indigo-600 hover:underline">Ver</button>
      </div>
    `;
    item.querySelector('button')?.addEventListener('click', () => {
      if (typeof mostrarModal === 'function') mostrarModal(oferta);
    });
    cont.appendChild(item);
  });
}

/* Procesa y muestra todas las listas */
// function procesarYMostrar(lista) {
//   listaActual = lista;
//   mejores = [];
//   peores = [];
//   // ...tu lógica de división

//   // Activa botones solo si hay datos
//   const habilitar = listaActual.length > 0;
//   btnCSV.disabled = !habilitar;
//   btnJSON.disabled = !habilitar;
//   btnXLSX.disabled = !habilitar;

//   mostrarTarjetas(lista);
//   renderListaSimple(mejores, 'mejores-lista', 'mejores');
//   renderListaSimple(peores, 'peores-lista', 'peores');
// }



/* Filtrado simple */
function filtrarOfertas(termino) {
  return ofertas.filter(oferta =>
    (oferta.titulo && oferta.titulo.toLowerCase().includes(termino.toLowerCase()))
  );

}

function dividirMejoresPeoresSimple(lista) {
  const peores = [];
  const mejores = [];

  lista.forEach(oferta => {
    const texto = ((oferta.texto || '') + ' ' + (oferta.subtitulo || '') + ' ' + (oferta.estadoEmpleo || '')).toLowerCase();

    const esPeor = texto.includes('sin paga') || texto.includes('sueldo oculto') || texto.includes('freelance') || texto.includes('20,000') || texto.includes('prácticas') || texto.includes('becario');

    if (esPeor) peores.push(oferta);
    else mejores.push(oferta);
  });

  return { mejores: mejores.slice(0, 10), peores: peores.slice(0, 10) };
}

function procesarYMostrar(lista) {
  listaActual = lista;
  mejores = [];
  peores = [];

  const { mejores: mejoresDiv, peores: peoresDiv } = dividirMejoresPeoresSimple(lista);

  mejores = mejoresDiv;
  peores = peoresDiv;

  mostrarTarjetas(lista);
  renderListaSimple(mejores, 'mejores-lista', 'mejores');
  renderListaSimple(peores, 'peores-lista', 'peores');

  // Comenta estas líneas temporalmente para descartar errores
  // btnCSV.disabled = !(listaActual.length > 0);
  // btnJSON.disabled = !(listaActual.length > 0);
  // btnXLSX.disabled = !(listaActual.length > 0);
}




/* DOM ready */
document.addEventListener("DOMContentLoaded", () => {
  const terminoGuardado = localStorage.getItem("terminoBusqueda") || "";

  fetch("empleos.json")
    .then(res => res.json())
    .then(data => {
      ofertas = data || [];
      rankingField = detectarCampoRanking(ofertas);
      console.log("Campo para ranking detectado:", rankingField);

      if (terminoGuardado) {
        const filtradas = filtrarOfertas(terminoGuardado);
        procesarYMostrar(filtradas);
      } else {
        procesarYMostrar(ofertas);
      }
    })
    .catch(err => {
      console.error('Error cargando empleos.json', err);
      const contenedor = document.getElementById("contenedor-todos");
      if (contenedor) contenedor.innerHTML = "<p class='text-red-500'>Error al cargar datos.</p>";
    });

  /* Manejo de pestañas */
  const tabs = document.querySelectorAll('.select-tab');
  const sections = document.querySelectorAll('.select-context');

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', function () {
      tabs.forEach(el => {
        el.classList.remove('active-tab', 'bg-blue-200', 'text-blue-800');
        el.classList.add('bg-gray-100', 'text-gray-700');
      });
      this.classList.add('active-tab', 'bg-blue-200', 'text-blue-800');
      this.classList.remove('bg-gray-100', 'text-gray-700');

      sections.forEach(s => s.classList.add('hidden'));
      if (idx < sections.length) {
        sections[idx].classList.remove('hidden');
      }
    });
  });
  document.getElementById("btn-csv").addEventListener("click", () => {
  console.log("listaActual al descargar CSV:", listaActual);
  if (!listaActual.length) {
    alert("No hay datos para exportar");
    return;
  }

  const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(listaActual[0]).join(",") + "\n"
      + listaActual.map(e => Object.values(e).join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "empleos.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


document.getElementById("btn-json").addEventListener("click", () => {
  if (!listaActual.length) return alert("No hay datos para exportar");

  const jsonContent = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listaActual, null, 2));
  const link = document.createElement("a");
  link.href = jsonContent;
  link.download = "empleos.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.getElementById("btn-xlsx").addEventListener("click", () => {
  if (!listaActual.length) return alert("No hay datos para exportar");

  const worksheet = XLSX.utils.json_to_sheet(listaActual);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Empleos");
  XLSX.writeFile(workbook, "empleos.xlsx");
});

    // Función para forzar descarga
    function descargarArchivo(url, nombre) {
        const a = document.createElement("a");
        a.href = url;
        a.download = nombre;
        a.click();
        URL.revokeObjectURL(url);
    }
});







// function crearCard(oferta, tipo = "todas") {
//   const div = document.createElement('div');
//   div.className = `flex items-center gap-4 p-3 border rounded-lg hover:bg-${tipo === "mejor" ? 'green' : tipo === "peor" ? 'red' : 'gray'}-50 cursor-pointer`;
//   div.innerHTML = `
//     <img src="${oferta.imagen}" class="w-12 h-12 object-contain rounded" alt="logo" />
//     <div>
//       <p class="font-semibold">${oferta.titulo}</p>
//       <p class="text-sm text-gray-600">${oferta.subtitulo}</p>
//     </div>
//   `;
//   div.onclick = () => mostrarModal(oferta);
//   return div;
// }


// fetch('empleos.json')
//   .then(res => res.json())
//   .then(ofertas => {
//     const todasLista = document.getElementById('todas-lista');
//     const mejoresLista = document.getElementById('mejores-lista');
//     const peoresLista = document.getElementById('peores-lista');

//     const mejores = [];
//     const peores = [];

//     ofertas.forEach(oferta => {
//       const texto = (oferta.texto + ' ' + oferta.subtitulo + ' ' + oferta.estadoEmpleo).toLowerCase();
//       const esPeor = texto.includes('sin paga') || texto.includes('sueldo oculto') || texto.includes('freelance') || texto.includes('20,000') || texto.includes('prácticas') || texto.includes('becario');

   
//       todasLista.appendChild(crearCard(oferta));

 
//       if (esPeor) peores.push(oferta);
//       else mejores.push(oferta);
//     });

//     mejores.slice(0, 10).forEach(oferta => mejoresLista.appendChild(crearCard(oferta, "mejor")));
//     peores.slice(0, 10).forEach(oferta => peoresLista.appendChild(crearCard(oferta, "peor")));
//   })
//   .catch(err => console.error("Error al cargar empleos.json:", err));