/**
 * @OnlyCurrentDoc
 * Mapeo de locales a los correos electrónicos de los responsables.
 * ¡IMPORTANTE! Debes rellenar esto con los datos reales de tus tiendas y managers.
 */
const EMAILS_RESPONSABLES = {
  "Tienda Centro": "manager.centro@tuempresa.com",
  "Tienda Norte": "manager.norte@tuempresa.com",
  "Tienda Sur": "manager.sur@tuempresa.com"
  // Añade aquí todos tus locales
};

/**
 * Recopila todos los festivos pendientes, los agrupa por local y envía
 * un correo de resumen a cada responsable de tienda.
 */
function enviarResumenSemanal() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registro");
  if (!hoja) return; // Si la hoja no existe, no hace nada.

  const datos = hoja.getDataRange().getValues();
  const cabeceras = datos.shift(); // Quita la fila de cabeceras

  // Buscamos los índices de las columnas que necesitamos (así no depende del orden)
  const idxNombre = cabeceras.indexOf("Nombre_Empleado");
  const idxLocal = cabeceras.indexOf("Nombre_Local");
  const idxFechaFestivo = cabeceras.indexOf("Fecha_Festivo_Trabajado");
  const idxEstado = cabeceras.indexOf("Estado");

  const pendientesPorLocal = {};

  // Recorremos todos los datos para encontrar los pendientes
  datos.forEach(fila => {
    if (fila[idxEstado] === "Pendiente") {
      const local = fila[idxLocal];
      if (!pendientesPorLocal[local]) {
        pendientesPorLocal[local] = []; // Si es el primer pendiente de este local, creamos su lista
      }
      pendientesPorLocal[local].push({
        empleado: fila[idxNombre],
        fecha: new Date(fila[idxFechaFestivo]).toLocaleDateString("es-ES")
      });
    }
  });

  // Ahora, enviamos un email por cada local que tenga pendientes
  for (const local in pendientesPorLocal) {
    const emailManager = EMAILS_RESPONSABLES[local];
    if (emailManager) {
      const asunto = `Resumen de Festivos Pendientes - ${local}`;
      let cuerpoEmail = `Hola,<br><br>Este es el resumen de días festivos pendientes de disfrutar en ${local}:<br><br>`;
      cuerpoEmail += "<table border='1' cellpadding='5'><tr><th>Empleado</th><th>Fecha del Festivo</th></tr>";

      pendientesPorLocal[local].forEach(pendiente => {
        cuerpoEmail += `<tr><td>${pendiente.empleado}</td><td>${pendiente.fecha}</td></tr>`;
      });

      cuerpoEmail += "</table><br>Por favor, planifica sus días de descanso correspondientes.<br><br>Saludos,<br>Sistema Automático de RRHH";

      // Envía el correo
      MailApp.sendEmail({
        to: emailManager,
        subject: asunto,
        htmlBody: cuerpoEmail
      });
    }
  }
}
