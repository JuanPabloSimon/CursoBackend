const fetch = require("cross-fetch");

async function getData() {
  try {
    let datos = await fetch(
      "http://localhost:8080/graphql?query={getProducts{nombre, descripcion, precio}}"
    );
    let data = datos.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
getData();
// console.log(datos);
