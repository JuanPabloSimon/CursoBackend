var admin = require("firebase-admin");

var serviceAccount = require("../db/backend-coder-2c074-firebase-adminsdk-foedz-7cb5498cdc.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class ContainerFirestore {
    constructor(collection) {
        this.collection = db.collection(collection)
        console.log(`Base de datos conectada con la collection ${collection}`);
    }

    save(data) {
        fs.writeFileSync(this.archivo, JSON.stringify(data));
    }

    getContent() {
        let data = [];

        try {
            let info = fs.readFileSync(this.archivo, 'utf-8');
            data = JSON.parse(info);
        } catch (error) {
            this.save(data);
            console.log(`Se creó el archivo ${this.archivo}`);
        }

        return data;
    }

    getById(id) {
        let datos = this.getContent();
        let dato = null; 

        if (datos.length > 0) {
            let element = datos.find(elem => elem.id == id);
            if(element) {
                dato = element;
            }
        }

        return dato;
    }

    deleteById(id) {
        let datos = this.getContent();

        if (datos.length > 0) {
            let element = datos.find(elem => elem.id == id);
            if(element) {
                let datosUpdated = datos.filter(elem => elem.id != id)

                this.save(datosUpdated)
            } else {
                console.log('No se encontro el elemento');
            }
        }
    }

    editProd(id, data) {
        let datos = this.getAll();
        let dato = null; 

        if (datos.length > 0) {
            let element = datos.find(elem => elem.id == id);
            if(element) {
                dato = element;

                dato = { 
                    id: dato.id,
                    timestamp: dato.timestamp,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    codigo: data.codigo,
                    urlIMG: data.urlIMG,
                    precio: data.precio,
                    stock: data.stock
                }
            }
        }

        let datosUpdated = datos.filter(elem => elem.id != id);
        datosUpdated.push(dato);
        this.save(datosUpdated);
        return dato;
    }
}