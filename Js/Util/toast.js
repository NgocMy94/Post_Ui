import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`

      style: {
        background: '#42a5f5',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },

  success(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`

      style: {
        background: '#4caf50',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },

  error(message) {
    Toastify({
      text: message,
      duration: 5000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`

      style: {
        background: '#ef5350',
      },
      onClick: function () {}, // Callback after click
    }).showToast()
  },
}
