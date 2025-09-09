/**
 * @OnlyCurrentDoc
 * El nombre de la hoja principal donde se registran los datos.
 */
const HOJA_REGISTRO = "Registro";

/**
 * Constantes para los nombres de las columnas.
 * ¡IMPORTANTE! Si cambias los nombres en la cabecera de tu Google Sheet,
 * debes actualizarlos aquí también.
 */
const COLUMNA_ESTADO = 7; // La columna G es la 7ª
const COLUMNA_FECHA_DISFRUTE = 8; // La columna H es la 8ª

/**
 * Se ejecuta automáticamente cada vez que un usuario edita la hoja de cálculo.
 * @param {Object} e El objeto de evento que trae la información sobre la edición.
 */
function onEdit(e) {
  const hojaActiva = e.source.getActiveSheet();
  const celdaEditada = e.range;

  // Nos aseguramos de que la edición ocurra en la hoja y columna correctas.
  if (hojaActiva.getName() === HOJA_REGISTRO && celdaEditada.getColumn() === COLUMNA_ESTADO) {
    const fila = celdaEditada.getRow();
    const valorEstado = e.value;
    const celdaFechaDisfrute = hojaActiva.getRange(fila, COLUMNA_FECHA_DISFRUTE);

    // Si el nuevo estado es "Disfrutado" pero la celda de fecha está vacía...
    if (valorEstado === "Disfrutado" && celdaFechaDisfrute.isBlank()) {
      // Pinta el fondo de rojo para llamar la atención.
      celdaFechaDisfrute.setBackground("#ff9999");
    } else {
      // Si no, quita cualquier color de fondo que tuviera.
      celdaFechaDisfrute.setBackground(null);
    }
  }
}
