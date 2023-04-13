document.addEventListener('DOMContentLoaded', function () {

  const email = {
    email: '',
    asunto: '',
    mensaje: ''
  }

  // Seleccionar los elementos de la interfaz
  const inputEmail = document.querySelector('#email');
  const inputAsunto = document.querySelector('#asunto');
  const textMensaje = document.querySelector('#mensaje');
  const formulario = document.querySelector('#formulario');
  const btnSubmit = document.querySelector('#formulario button[type="submit"]');
  const btnReset = document.querySelector('#formulario button[type="reset"]');
  const spinner = document.querySelector('#spinner');
  const inputCC = document.querySelector('#cc');

  // Asignar eventos
  inputEmail.addEventListener('blur', validar);
  inputAsunto.addEventListener('input', validar);
  textMensaje.addEventListener('input', validar);
  inputCC.addEventListener('blur', validar);

  formulario.addEventListener('submit', enviarEmail);

  btnReset.addEventListener('click', function (event) {
    event.preventDefault();

    resetFormulario();

  });

  function enviarEmail(event) {
    event.preventDefault()

    spinner.classList.add('flex');
    spinner.classList.remove('hidden');

    setTimeout(() => {
      spinner.classList.remove('flex');
      spinner.classList.add('hidden');

      resetFormulario();

      // Crear una alerta con scripting
      // const alertaExito = document.createElement('P');
      // alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase');
      // alertaExito.textContent = 'Mensaje enviado correctamente';
      // formulario.appendChild(alertaExito);
      // setTimeout(() => {
      //   alertaExito.remove();
      // }, 3000);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El email se ha enviado correctamente',
        timer: 2000
      })

    }, 3000);
  }

  function validar(event) {
    /* Añadiendo un AND y  el e.target.id !== 'cc' en los dos if evitamos que no nos de el error 
    "campo cc obligatorio" en caso que introduzcamos algo y luego lo eliminemos.
   */
    if (event.target.value.trim() == '' && (event.target.id !== 'cc')) {
      mostrarAlerta(`El campo ${event.target.id} es obligatorio`, event.target.parentElement);//event.targert... es la referencia de donde se va a hacer la alerta
      email[event.target.name] = '';

      comprobarEmail();
      return;
    }

    /* En este if  sustituimos el e.target.name  por e.target.type asi evalua los dos emails
      en caso de que se entre algun dato.
      (tanto el email como el CC  tienen el mismo type="email" en el html)
      En el caso que "cc" contenga un correo válido, creamos la propiedad "cc" en el objeto email
    */
    if (event.target.type === 'email' && !validarEmail(event.target.value) && event.target.value !== '') {
      mostrarAlerta('El email no es valido', event.target.parentElement);
      email[event.target.name] = '';
      comprobarEmail();
      return;
    }

    /*  Si se ha introducido un dato en "cc" y luego se ha borrado, este if elimina la alerta y la propiedad
     creada "cc" del objeto email activando el boton enviar  y pudiendo enviar el correo
    */
    if (event.target.id === 'cc' && (event.target.value === '')) {
      limpiarAlerta(event.target.parentElement);
      delete (email.cc);
      comprobarEmail();
      return;
    }

    if (event.target.id === 'email' && !validarEmail(event.target.value)) {
      email[event.target.name] = '';
      comprobarEmail();

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'El email no es valido',
        timer: 1500
      })
    }


    // le pasamos la misma referencia del div padre hacia el hijo donde se esta creando la alerta
    limpiarAlerta(event.target.parentElement);

    // Asiganamos valores
    email[event.target.name] = event.target.value.trim().toLowerCase();
    console.log(email);

    // Comprobar el objeto email
    comprobarEmail();
  }

  function mostrarAlerta(mensaje, referencia) {

    limpiarAlerta(referencia)

    // Generar HTML
    const error = document.createElement('p');
    error.textContent = mensaje;
    error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center', 'rounded-lg');

    // Inyectamos el error al formulario, tomando la referencia para que justo ahi meta el error
    referencia.appendChild(error);
  }

  // Referencia para que solo ahi elimine la alerta segun se requiera
  function limpiarAlerta(referencia) {

    // Comprueba si ya existe una alerta
    const alerta = referencia.querySelector('.bg-red-600');
    if (alerta) {
      alerta.remove();
    }
  }

  function validarEmail(email) {
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const resultado = regex.test(email);
    return resultado;
  }

  function comprobarEmail() {
    // if (Object.values(email).includes('')) {
    //   btnSubmit.classList.add('opacity-50');
    //   btnSubmit.disabled = true;
    // } else {
    //   btnSubmit.classList.remove('opacity-50');
    //   btnSubmit.disabled = false;
    // }

    if (Object.values(email).includes('')) {
      btnSubmit.classList.add('opacity-50');
      btnSubmit.disabled = true;
      return
    }
    btnSubmit.classList.remove('opacity-50');
    btnSubmit.disabled = false;
  }

  function resetFormulario() {
    // Reiniciamos el objeto
    email.email = '';
    email.asunto = '';
    email.mensaje = '';

    /*  Borramos la propiedad "cc"  del objeto en caso de haber introducido un correo opcional en el correo anterior */
    delete (email.cc);

    formulario.reset();
    comprobarEmail();
  }
})