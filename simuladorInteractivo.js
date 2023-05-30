class Tasas {
  constructor(tna) {
    this.tna = tna;
    this.tnm = (this.tna * 30) / 365;
    this.tea = (1 + this.tna / 12) ** 12 - 1;
  }
}

let tasas = new Tasas(0.97);

let usuario = prompt('Ingrese su nombre o "Salir" para finalizar');
let usuariosPermitidos = ["Juan", "Pedro", "Maria", "Lucas", "Ana", "Carlos"];

if (usuario == "Salir") {
  console.log("Servicio finalizado");
} else if (!usuariosPermitidos.includes(usuario)) {
  while (!usuariosPermitidos.includes(usuario)) {
    console.log("El usuario no está permitido");
    usuario = prompt('Ingrese su nombre o "Salir" para finalizar');
  }
}
  
  
if (usuariosPermitidos.includes(usuario)) {
  let monto = parseInt(prompt("Ingrese el monto a invertir"));
  let plazo = parseInt(prompt("Ingrese el plazo fijo\n1) 30 días\n2) 60 días\n3) 90 días"));
  bienvenida(usuario);
  iniciarCalculoPlazoFijo(monto, plazo);
  despedida(usuario);
}

function iniciarCalculoPlazoFijo(monto, plazo) {
  if (esMontoYPlazoValidos(monto, plazo)) {
    datosPlazoFijo(monto, plazo);
  } else {
    console.log("Los datos ingresados son incorrectos");
  }
}

function datosPlazoFijo(monto, plazo) {
  console.log("\nDatos de la simulación");
  console.log("\nMonto a invertir: $" + monto);
  console.log("Plazo fijo:", obtenerPlazo(plazo) + " días");
  console.log(
    "Interés generado en el periodo: $" +
      calcularGananciaConInteres(monto, plazo).toFixed(2)
  );
  console.log(
    "Ganancia total: $" +
      (monto + calcularGananciaConInteres(monto, plazo)).toFixed(2)
  );
}

function calcularGananciaConInteres(monto, plazo) {
  return monto * interes(plazo);
}

function interes(plazo) {
  return tasas.tnm * plazo;
}

function obtenerPlazo(plazo) {
  return 30 * plazo;
}

function esMontoYPlazoValidos(monto, plazo) {
  return sonNumerosMontoYPlazo(monto, plazo) && plazoEsValido(plazo);
}

function sonNumerosMontoYPlazo(monto, plazo) {
  return sonNumeros(monto) && sonNumeros(plazo);
}

function sonNumeros(numero) {
  return typeof numero == "number";
}

function plazoEsValido(plazo) {
  return plazo == 1 || plazo == 2 || plazo == 3;
}

function bienvenida(user) {
  console.log(
    "Bienvenido " + user + ", al Simulador Interactivo de Plazo Fijo"
  );

  console.log(
    "TNA:",
    (tasas.tna * 100).toFixed(2) + "%,",
    "TNM: ",
    (tasas.tnm * 100).toFixed(2) + "%,",
    "TEA: ",
    (tasas.tea * 100).toFixed(2) + "%"
  );
}

function despedida(user) {
  if (user == "Salir") {
    console.log("\nGracias por utilizar el simulador ");
  } else {
    console.log("\nGracias por utilizar el simulador " + user);
  }
}
