const fs = require('fs')

class ContainerArchivo {
    constructor(archivo) {
        this.archivo = archivo;
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

    editData(id, data) {
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
        } else {
            console.log('error');
        }

        let datosUpdated = datos.filter(elem => elem.id != id);
        datosUpdated.push(dato);
        this.save(datosUpdated);
        return dato;
    }
}

module.exports = { ContainerArchivo }




