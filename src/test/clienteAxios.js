const axios = require("axios");
const util = require("util");

async function getProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/productos/");
    console.log(response.status);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function postProduct() {
  try {
    const response = await axios.post("http://localhost:8080/api/productos/", {
      nombre: "Parlante JBL",
      descripcion: "Parlante Bluethoot sumergible",
      codigo: 2653,
      urlIMG: "http://imagenes/imagen/3",
      precio: 10000,
      stock: 8,
    });
    console.log(response.status);
    console.log(response.data.product);
  } catch (error) {
    console.log(error);
  }
}

async function putProduct() {
  try {
    const response = await axios.put(
      "http://localhost:8080/api/productos/62961eaef8365f1e8dbcdf1e",
      {
        codigo: 5521,
      }
    );
    console.log(response.status);
    console.log(response.data);
  } catch (error) {
    console.log(response);
  }
}

async function deleteProduct() {
  try {
    const response = await axios.delete(
      "http://localhost:8080/api/productos/630634d5937d3d9052acef57"
    );
    console.log(response.status);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

getProducts();
postProduct();
putProduct();
deleteProduct();
