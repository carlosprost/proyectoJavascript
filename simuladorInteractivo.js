let tna = 0.91;
let tnm = (tna * 30) / 365;
let tea = (1 + tna / 12) ** 12 - 1;

let usuario = prompt('Ingrese su nombre o "Salir" para finalizar');
while (usuario != "Salir") {
  let monto = parseInt(prompt("Ingrese el monto a invertir"));
  let plazo = parseInt(
    prompt("Ingrese el plazo fijo\n1) 30 días\n2) 60 días\n3) 90 días")
  );
  bienvenida(usuario);
  let edad = parseInt(prompt("Ingrese su edad"));

  if (edad >= 18) {
    iniciarCalculoPlazoFijo(monto, plazo);
    break;
  } else {
    console.log("La operación no puede hacerse, el usuario es menor de edad");
  }
}
despedida(usuario);

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
  return tnm * plazo;
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
    (tna * 100).toFixed(2) + "%,",
    "TNM: ",
    (tnm * 100).toFixed(2) + "%,",
    "TEA: ",
    (tea * 100).toFixed(2) + "%"
  );
}

function despedida(user) {
  console.log("\nGracias por utilizar el simulador " + user);
}
