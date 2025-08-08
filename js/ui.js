// // js/ui.js
// (function () {
//   function tarjetaHTML(j) {
//     const imagen = j.imagen || "imagen_por_defecto.jpg";
//     const titulo = j.titulo || "Título no disponible";
//     const subtitulo = j.subtitulo || "";
//     const texto = j.texto || "";
//     const ubicacion = j.ubicacion || "Ubicación no disponible";
//     const estado = j.estadoEmpleo || "Estado no disponible";
//     const enlace = j.enlace || "#";

//     return `
//       <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition duration-300">
//         <img src="${imagen}" alt="${titulo}" class="w-full h-40 object-cover rounded mb-4">
//         <h2 class="text-lg font-bold text-indigo-700 mb-1">${titulo}</h2>
//         ${subtitulo ? `<h3 class="text-md text-indigo-500 mb-2">${subtitulo}</h3>` : ""}
//         <p class="text-sm mb-2"><strong>Descripción:</strong> ${texto}</p>
//         <p class="text-sm mb-1"><strong>Ubicación:</strong> ${ubicacion}</p>
//         <p class="text-sm mb-3"><strong>Estado:</strong> ${estado}</p>
//         <a href="${enlace}" target="_blank" class="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Ver más</a>
//       </div>
//     `;
//   }

//   window.mostrarTarjetas = function (lista) {
//     const container =
//       document.getElementById("cards") ||
//       document.getElementById("todas-lista") ||
//       document.getElementById("mejores-lista") ||
//       document.getElementById("peores-lista");

//     if (!container) {
//       console.warn("mostrarTarjetas: no se encontró ningún contenedor para mostrar tarjetas.");
//       return;
//     }

//     if (!Array.isArray(lista) || lista.length === 0) {
//       container.className = "flex justify-center items-center min-h-[60vh] px-4";
//       container.innerHTML = `
//         <div class="bg-white p-6 rounded shadow text-center max-w-md">
//           <img src="potaxie.jpg" alt="Sin resultados" class="w-32 mx-auto mb-4">
//           <h2 class="text-xl font-semibold text-red-500">No se encontraron resultados</h2>
//           <h1>👁️👄👁️</h1>
//           <p class="mt-2">Intenta con otros términos de búsqueda.</p>
//         </div>`;
//       return;
//     }

//     // Si el contenedor es "todas-lista" o listas verticales
//     if (["todas-lista", "mejores-lista", "peores-lista"].includes(container.id)) {
//       container.className = "space-y-3";
//       container.innerHTML = lista
//         .map((j) => `
//           <div class="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
//             <img src="${j.imagen || 'imagen_por_defecto.jpg'}" class="w-12 h-12 object-cover rounded" alt="${j.titulo || ''}" />
//             <div>
//               <p class="font-semibold">${j.titulo || ""}</p>
//               <p class="text-sm text-gray-600">${j.subtitulo || ""}</p>
//             </div>
//           </div>
//         `)
//         .join("");
//       return;
//     }

//     // Por defecto: grid de tarjetas
//     container.className = "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
//     container.innerHTML = lista.map(tarjetaHTML).join("");
//   };
// })();
