const puppeteer = require("puppeteer");
const fs = require("fs");
const { Parser } = require("json2csv");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

(async () => {
  const navegador = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const pagina = await navegador.newPage();
  const empleosExtraidos = [];
  const totalPaginas = 4;

  try {
    for (let numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++) {
      const url = `https://hireline.io/mx/empleos?k=contador&l=&page=${numeroPagina}`;
      console.log(` Explorando página ${numeroPagina} de ${totalPaginas}`);

      await pagina.goto(url, { waitUntil: "networkidle2", timeout: 0 });
      await pagina.waitForSelector("a.hl-vacancy-card.vacancy-container", { timeout: 30000 });

      const empleosPagina = await pagina.evaluate(() => {
        return Array.from(document.querySelectorAll("a.hl-vacancy-card.vacancy-container")).map((elemento) => {
          const imagen = elemento.querySelector("div.enterprise-logo img")?.src || "No encontrada";
          const titulo = elemento.querySelector("p.vacancy-title")?.innerText.trim() || "Sin título";
          const subtitulo = elemento.querySelector("p.vacancy-subtitle")?.innerText.trim() || "Sin subtítulo";
          const texto = elemento.querySelector("p.vacancy-summary")?.innerText.trim() || "Sin texto";

          const footerItems = elemento.querySelectorAll("div.footer-item");
          let ubicacion = "No encontrada";
          let estadoEmpleo = "No encontrado";

          footerItems.forEach((item) => {
            const icono = item.querySelector("i");
            const textoItem = item.querySelector("p")?.innerText.trim();
            if (icono?.classList.contains("fa-map-marker-alt")) {
              ubicacion = textoItem || ubicacion;
            }
            if (icono?.classList.contains("fa-clock")) {
              estadoEmpleo = textoItem || estadoEmpleo;
            }
          });

          return {
            imagen,
            titulo,
            subtitulo,
            texto,
            ubicacion,
            estadoEmpleo,
            enlace: elemento.href || ""
          };
        });
      });

      empleosExtraidos.push(...empleosPagina);

      console.log(` Página ${numeroPagina} procesada. Empleos encontrados: ${empleosPagina.length}`);
    }

    
    fs.writeFileSync(
      "empleos.json",
      JSON.stringify(empleosExtraidos, null, 2),
      "utf-8"
    );
    console.log('Archivo JSON generado');

 
    const parser = new Parser();
    const contenidoCSV = parser.parse(empleosExtraidos);
    fs.writeFileSync("empleos.csv", contenidoCSV, "utf-8");
    console.log('Archivo CSV generado');


    const hoja = XLSX.utils.json_to_sheet(empleosExtraidos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Empleos");
    XLSX.writeFile(libro, "empleos.xlsx");
    console.log('Archivo Excel generado');

   
    const pdf = new PDFDocument();
    pdf.pipe(fs.createWriteStream("empleos.pdf"));
    pdf.fontSize(18).text("Empleos Hireline.io", { align: "center" }).moveDown();

    empleosExtraidos.forEach((item, index) => {
      pdf
        .fontSize(14)
        .text(`${index + 1}. ${item.titulo}`, { underline: true })
        .fontSize(12)
        .text(`Subtítulo: ${item.subtitulo}`)
        .fontSize(10)
        .text(`Imagen: ${item.imagen}`)
        .text(`Descripción: ${item.texto}`)
        .text(`Ubicación: ${item.ubicacion}`)
        .text(`Estado de empleo: ${item.estadoEmpleo}`)
        .text(`Enlace: ${item.enlace}`)
        .moveDown();
    });

    pdf.end();
    console.log('Archivo PDF generado');

   
    // let textoPlano = "Empleos Hireline.io\n\n";
    // empleosExtraidos.forEach((item, index) => {
    //   textoPlano += `${index + 1}. ${item.titulo}\n`;
    //   textoPlano += `Subtítulo: ${item.subtitulo}\n`;
    //   textoPlano += `Imagen: ${item.imagen}\n`;
    //   textoPlano += `Descripción: ${item.texto}\n`;
    //   textoPlano += `Ubicación: ${item.ubicacion}\n`;
    //   textoPlano += `Estado de empleo: ${item.estadoEmpleo}\n`;
    //   textoPlano += `Enlace: ${item.enlace}\n`;
    //   textoPlano += `\n-----------------------------\n\n`;
    // });
    // fs.writeFileSync("empleos.txt", textoPlano, "utf-8");
    // console.log('Archivo TXT generado');

    console.log(`\nProceso finalizado con éxito. Empleos obtenidos: ${empleosExtraidos.length}`);

  } catch (error) {
    console.error("Error durante el proceso:", error);
  } finally {
    await navegador.close();
  }
})();
