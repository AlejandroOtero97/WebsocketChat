const socket = io()

const usuariosTotal = document.getElementById('usuarios-total')

const contenedorMensajes = document.getElementById('contenedor-mensaje')
const inputNombre = document.getElementById('input-nombre')
const mensajeForm = document.getElementById('mensaje-form')
const inputMensaje = document.getElementById('mensaje-input')

mensajeForm.addEventListener('submit', (e) => {
  e.preventDefault()
  enviarMensaje()
})

socket.on('usuarios-total', (data) => {
  usuariosTotal.innerText = `Usuarios en total: ${data}`
})

function enviarMensaje() {
  if (inputMensaje.value === '') return
  const data = {
    nombre: inputNombre.value,
    message: inputMensaje.value,
    dateTime: new Date(),
  }
  socket.emit('message', data)
  addMessageToUI(true, data)
  inputMensaje.value = ''
}

socket.on('chat-message', (data) => {
  addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
  clearFeedback()
  const element = `
      <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
          ${data.message}
          <span>${data.nombre} ● ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
      `

  contenedorMensajes.innerHTML += element
  scrollToBottom()
}

function scrollToBottom() {
  contenedorMensajes.scrollTo(0, contenedorMensajes.scrollHeight)
}

inputMensaje.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
  contenedorMensajes.innerHTML += element
})

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element)
  })
}