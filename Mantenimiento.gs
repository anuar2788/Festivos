/**
 * @OnlyCurrentDoc
 * El nombre de la hoja donde se archivarán los registros antiguos.
 */
const HOJA_ARCHIVO = "Archivo";

/**
 * Busca registros disfrutados con más de un año de antigüedad, los copia
 * a la hoja de archivo y los elimina de la hoja de registro principal.
 */
function archivarRegistrosAntiguos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaRegistro = ss.getSheetByName("Registro");
  let hojaArchivo = ss.getSheetByName(HOJA_ARCHIVO);

  // Si la hoja de archivo no existe, la crea con las mismas cabeceras.
  if (!hojaArchivo) {
    hojaArchivo = ss.insertSheet(HOJA_ARCHIVO);
    const cabeceras = hojaRegistro.getRange(1, 1, 1, hojaRegistro.getLastColumn()).getValues();
    hojaArchivo.getRange(1, 1, 1, cabeceras[0].length).setValues(cabeceras);
  }

  const datos = hojaRegistro.getDataRange().getValues();
  const cabecerasOriginales = datos[0];
  const idxEstado = cabecerasOriginales.indexOf("Estado");
  const idxFechaDisfrute = cabecerasOriginales.indexOf("Fecha_Disfrute");
  const unAnoAtras = new Date();
  unAnoAtras.setFullYear(unAnoAtras.getFullYear() - 1);

  const filasParaArchivar = [];
  const indicesFilasParaBorrar = [];

  // Empezamos desde el final para no tener problemas al borrar filas
  for (let i = datos.length - 1; i > 0; i--) {
    const fila = datos[i];
    const estado = fila[idxEstado];
    const fechaDisfrute = new Date(fila[idxFechaDisfrute]);

    if (estado === "Disfrutado" && fechaDisfrute < unAnoAtras) {
      filasParaArchivar.push(fila);
      indicesFilasParaBorrar.push(i + 1); // Guardamos el número de fila real
    }
  }

  // Si encontramos filas para archivar, las procesamos
  if (filasParaArchivar.length > 0) {
    // Las añadimos a la hoja de archivo
    hojaArchivo.getRange(hojaArchivo.getLastRow() + 1, 1, filasParaArchivar.length, filasParaArchivar[0].length).setValues(filasParaArchivar.reverse());

    // Las borramos de la hoja de registro
    indicesFilasParaBorrar.forEach(indice => {
      hojaRegistro.deleteRow(indice);
    });
  }
}
