const socket = io.connect();

function render(data) {
  let mensajes = data;
  const html = mensajes
    .map((elem) => {
      return `<div id="mensaje">
                <strong>${elem.email}: </strong>
                <em>${elem.mensaje}</em>
            </div>`;
    })
    .join(" ");

  document.getElementById("messages").innerHTML = html;
}

function addMessage(e) {
  let fecha = new Date();
  let hours = fecha.getHours();
  let minutes = fecha.getMinutes();
  let seconds = fecha.getSeconds();
  let dia = fecha.getDate();
  let anio = fecha.getFullYear();
  let mes = fecha.getMonth() + 1;
  const mensaje = {
    mensaje: document.getElementById("texto").value,
    fecha: `${dia}/${mes}/${anio}`,
    hora: `${hours}:${minutes}:${seconds}`,
  };
  socket.emit("new-message", mensaje);
  return false;
}

socket.on("messages", (data) => {
  render(data);
});
