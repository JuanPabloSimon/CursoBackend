const assert = require("assert").strict;
const request = require("supertest")("http://localhost:8080");
const expect = require("chai").expect;

describe("test de rutas de productos", function () {
  describe("GET", () => {
    it("GetTodos - debería retornar un status 200", async function () {
      let response = await request.get("/api/productos/");
      expect(response.status).to.eql(200);
      let productos = response.body.productos;
      expect(productos.length).to.greaterThan(0);
    });
    it("GetByID - deberia retornar un status 200", async () => {
      let response = await request.get(
        "/api/productos/629634c4f671ea34b591fc6f"
      );
      expect(response.status).to.eql(200);
      let producto = response.body.producto;
      expect(producto).to.include.keys("nombre", "precio");
      expect(producto._id).to.eql("629634c4f671ea34b591fc6f");
    });
  });

  describe("POST", () => {
    it("debería incorporar un producto", async () => {
      let producto = {
        nombre: "Telefono Iphone",
        descripcion: "Iphone 12Plus",
        codigo: 2347,
        urlIMG: "http://imagenes/imagen/3",
        precio: 178000,
        stock: 10,
      };
      let response = await request.post("/api/productos/").send(producto);
      expect(response.status).to.eql(200);
      const product = response.body.product;
      expect(product).to.include.keys("nombre", "precio");
      expect(product.nombre).to.eql(producto.nombre);
      expect(product.precio).to.eql(producto.precio);
    });
  });
  describe("PUT", () => {
    it("debería modificar un producto", async () => {
      let cambio = {
        codigo: 33666,
      };
      let response = await request
        .put("/api/productos/6306b6cf639f414e554bc827")
        .send(cambio);
      expect(response.status).to.eql(200);
      const response2 = await request.get(
        "/api/productos/6306b6cf639f414e554bc827"
      );
      let product = response2.body.producto;
      expect(product).to.include.keys("nombre", "precio");
      expect(product.codigo).to.eql(cambio.codigo);
    });
  });
  describe("DELETE", () => {
    it("debería eliminar un producto", async () => {
      let response = await request.delete(
        "/api/productos/6306b5fc639f414e554bc81d"
      );
      expect(response.status).to.eql(200);
    });
  });
});
