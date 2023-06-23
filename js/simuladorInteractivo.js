/* Clases */
class Banco {
  sucursal = "5023";
}
class Cuenta extends Banco {
  constructor(nroCuenta, cliente, saldo, user) {
    super();
    this.nroCuenta = this.sucursal + "-" + nroCuenta;
    this.cliente = cliente;
    this.saldo = saldo;
    this.user = user;
  }

  getNroCuenta() {
    return this.nroCuenta;
  }

  getCliente() {
    return this.cliente;
  }

  getSaldo() {
    return this.saldo;
  }

  getUser() {
    return this.user;
  }
}

class Tasas {
  constructor(tna) {
    this.tna = tna;
    this.tnm = (this.tna * 30) / 365;
    this.tea = (1 + this.tna / 12) ** 12 - 1;
  }

  getTna() {
    return this.tna;
  }

  getTnm() {
    return this.tnm;
  }

  getTea() {
    return this.tea;
  }
}

class Simulador {
  tasa = new Tasas(0.97);
  cliente;

  constructor(monto = 1000, plazo = 1) {
    this.monto = monto;
    this.plazo = plazo;
  }

  setMonto(monto) {
    this.monto = monto;
  }

  setCliente(cliente) {
    this.cliente = cliente;
  }

  setPlazo(plazo) {
    this.plazo = plazo;
  }

  getCliente() {
    return this.cliente;
  }

  getTasas() {
    return this.tasa;
  }

  calcularGananciaTotal() {
    return this.monto + this.calcularGananciaConInteres();
  }

  calcularGananciaConInteres() {
    return this.monto * this.interes();
  }

  interes() {
    return this.tasa.getTnm() * this.plazo;
  }

  obtenerPlazo() {
    return 30 * this.plazo;
  }

  esMontoYPlazoValidos() {
    return this.sonNumerosMontoYPlazo() && this.plazoEsValido();
  }

  sonNumerosMontoYPlazo() {
    return this.sonNumeros(this.monto) && this.sonNumeros(this.plazo);
  }

  sonNumeros(numero) {
    return typeof numero == "number";
  }

  plazoEsValido() {
    return this.plazo == 1 || this.plazo == 2 || this.plazo == 3;
  }
}
/* Fin Clases */

/* Variables globales */
const cuentas = [
  new Cuenta("607855", "Carlos Alberto Prost", 2000000, "Carlos"),
  new Cuenta("150223", "Gisele Vanesa Giometti", 3000000, "Gisele"),
  new Cuenta("123456", "Alejo Cayetano Albarracin", 400000, "Alejo"),
  new Cuenta("098765", "Miguel Agustín Albarracin", 100000, "Miguel"),
  new Cuenta("456789", "Maria Eugenia Prost", 98000, "MariaEugenia"),
];

const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element);

const seccionLogin = $("#seccion-login");
const form = $("#login");
const logout = $("#logout");

let simulador;

/* Style y Login */

/* Login */
function login() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let user = $("#user");

    if (userValido(user.value)) {
      let userActive = JSON.stringify({ user: user.value });
      window.localStorage.setItem("client", `${userActive}`);
      user.value = "";
      iniciarApp();
    } else {
      mensajeUserIncorrecto(user.value);
    }
  });

  logout.addEventListener("click", () => {
    ocultarLogin();
    window.localStorage.removeItem("client");
    window.location.reload();
  });
}

function iniciarApp() {
  ocultarLogin();
  generarSimulador();
  cuadroDeTasas();
  cuadroDolar();
  range();
  seleccionCuenta();
  saldoCuenta();
  simularPlazoFijo();
}

function userValido(user) {
  return cuentas.some((cuenta) => cuenta.user == user);
}

function ocultarLogin() {
  const div = $(".range-step");
  const datosTasa = $(".datosTasas");
  const datosDolar = $(".datosDolar");

  seccionLogin.classList.toggle("ocultar");
  div.classList.toggle("ocultar");
  datosTasa.classList.toggle("ocultar");
  datosDolar.classList.toggle("ocultar");
}

function mensajeUserIncorrecto(user) {
  let mensaje = $("#sub-mensaje");
  mensaje.classList.add("error");
  if (user != "") {
    mensaje.textContent = "Usuario incorrecto";
  } else {
    mensaje.textContent = "Debe ingresar un usuario";
  }
}

/* Range */
function range() {
  const div = $(".range-step");
  let el = div.querySelector("input[type='range']");
  el.oninput = function () {
    // colorear opciones
    div.querySelectorAll("option").forEach(function (opt) {
      if (opt.value <= el.valueAsNumber) opt.style.backgroundColor = "green";
      else opt.style.backgroundColor = "#aaa";
    });
    // colorear antes y después
    let valPercent =
      (el.valueAsNumber - parseInt(el.min)) /
      (parseInt(el.max) - parseInt(el.min));
    let style =
      "background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(" +
      valPercent +
      ", green), color-stop(" +
      valPercent +
      ", #aaa));";
    el.style = style;
  };
  el.oninput();
}

function seleccionCuenta() {
  let select = $("#cuentaSeleccion");

  let optionSelected = document.createElement("option");
  optionSelected.textContent = "Seleccione una cuenta";
  optionSelected.value = "0";
  optionSelected.selected = true;

  select.appendChild(optionSelected);

  let option = document.createElement("option");
  option.textContent = simulador.getCliente().getNroCuenta();
  option.value = simulador.getCliente().getSaldo();

  select.appendChild(option);
}

function saldoCuenta() {
  let saldo = $("#saldo");
  saldo.style.textAlign = "right";
  let cuenta = $("#cuentaSeleccion");
  saldo.value = 0;
  cuenta.addEventListener("change", () => {
    saldo.value = cuenta.value;
  });
}

/* Fin Style y Login */

/* Fetch */

async function dolarHoy() {
  const response = await fetch(
    "https://www.dolarsi.com/api/api.php?type=dolar"
  );
  const result = await response.text();
  const data = JSON.parse(result);
  return data;
}

/* Fin Fetch */

/* Simulador */
function generarSimulador() {
  simulador = new Simulador();
  let userActive = JSON.parse(window.localStorage.getItem("client"));
  simulador.setCliente(
    cuentas.find((cuenta) => cuenta.user == userActive.user)
  );
}

async function cuadroDolar() {
  let titulo = $(".tituloDolar");
  let cuadroDolar = $(".dolar");
  let dolar = await dolarHoy();

  let tituloDolar = document.createElement("h2");
  tituloDolar.textContent = `Dólar ${dolar[0].casa.nombre}`;
  titulo.appendChild(tituloDolar);

  let compra = textoDolar("Compra", dolar[0].casa.compra);
  cuadroDolar.appendChild(compra);

  let venta = textoDolar("Venta", dolar[0].casa.venta);
  cuadroDolar.appendChild(venta);
}

function textoDolar(nombreDolar, dolar) {
  let dolarTexto = document.createElement("p");
  let valor = dolar.replace(".", ",");
  dolarTexto.textContent = `${nombreDolar}: $${valor}`;
  return dolarTexto;
}

function cuadroDeTasas() {
  let titulo = $(".bienvenida");
  let cuadroTasas = $(".tasas");

  let tituloTasas = document.createElement("h2");
  tituloTasas.textContent = simulador.getCliente().getCliente();
  titulo.appendChild(tituloTasas);

  let TNA = textoTasa("TNA", simulador.getTasas().getTna());
  cuadroTasas.appendChild(TNA);

  let TNM = textoTasa("TNM", simulador.getTasas().getTnm());
  cuadroTasas.appendChild(TNM);

  let TEA = textoTasa("TEA", simulador.getTasas().getTea());
  cuadroTasas.appendChild(TEA);
}

function textoTasa(nombreTasa, tasa) {
  let tasaTexto = document.createElement("p");
  tasaTexto.textContent = nombreTasa + ": " + (tasa * 100).toFixed(2) + "%";
  return tasaTexto;
}

function simularPlazoFijo() {
  let monto = $("#monto");
  let plazo = $("#plazo");
  simulador.setMonto(parseInt(monto.value));
  simulador.setPlazo(plazo.value);

  let montoInicial = $("#montoInicial");
  montoInicial.innerText = new Intl.NumberFormat("es-AR").format(monto.value);
  let montoInteres = $("#montoInteres");
  montoInteres.innerText = new Intl.NumberFormat("es-AR").format(
    simulador.calcularGananciaConInteres().toFixed(2)
  );
  let montoNeto = $("#montoNeto");
  montoNeto.innerText = new Intl.NumberFormat("es-AR").format(
    simulador.calcularGananciaTotal().toFixed(2)
  );
  let plazoTotal = $("#plazoDias");
  plazoTotal.innerText = new Intl.NumberFormat("es-AR").format(
    simulador.obtenerPlazo()
  );

  monto.addEventListener("keyup", () => {
    simulador.setMonto(parseInt(monto.value));
    simulador.setPlazo(plazo.value);
    montoInicial.innerText = new Intl.NumberFormat("es-AR").format(monto.value);
    montoInteres.innerText = new Intl.NumberFormat("es-AR").format(
      simulador.calcularGananciaConInteres().toFixed(2)
    );
    montoNeto.innerText = new Intl.NumberFormat("es-AR").format(
      simulador.calcularGananciaTotal().toFixed(2)
    );
  });

  plazo.addEventListener("change", () => {
    simulador.setMonto(parseInt(monto.value));
    simulador.setPlazo(plazo.value);
    plazoTotal.innerText = simulador.obtenerPlazo();
    montoInteres.innerText = new Intl.NumberFormat("es-AR").format(
      simulador.calcularGananciaConInteres().toFixed(2)
    );
    montoNeto.innerText = new Intl.NumberFormat("es-AR").format(
      simulador.calcularGananciaTotal().toFixed(2)
    );
  });
}

function generarPlazoFijo() {
  let form = $("#simulador");
  let cuenta = $("#cuentaSeleccion");
  let saldo = $("#saldo");
  let monto = $("#monto");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cuenta.value == 0) {
      swal({
        title: "Seleccione una cuenta",
        text: "Debe seleccionar una cuenta para realizar esta operación",
        icon: "warning",
      });
    } else if (saldo.value < monto.value) {
      swal({
        title: "No tiene saldo suficiente",
        text: "Su saldo es insuficiente para realizar esta operación",
        icon: "error",
      });
    } else {
      swal({
        title: "Plazo fijo generado",
        text: "Su plazo fijo se generó correctamente",
        icon: "success",
      });
    }
  });
}
/* Fin Simulador */

login();
generarPlazoFijo();
