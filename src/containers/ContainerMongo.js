const mongoose = require("mongoose");
const productoModel = require('../models/productos')

class ContainerMongo {
    constructor(modelo) {
        mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log('Conectado a la base de datos'))
        this.modelo = modelo
    }


    
    async save(data) {
        try {
            const documento = new productoModel.productos(data);
            let documentSave = await documento.save();
            console.log(documentSave);
        } catch(error) {
            console.log(error);
        }
    }
    
    async getContent(){
        try {
            console.log('Read all');
            let data = await productoModel.productos.find({});
            return data
        } catch(error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            console.log('Read by id');
            let data = await this.modelo.productos.find({_id: id});
            return data
        } catch(error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            let dataDelete = await model.usuarios.deleteOne(
                {_id: id}
            );
            console.log(dataDelete);
            return ({status: 'Producto eliminado'})
        } catch(error) {
            console.log(error);
        }
    }

    

    async editData(id, data) {
        try {
            let dataUpdated = await model.usuarios.updateOne(
                {_id: id},
                {data}
            );
            console.log(dataUpdated);
            return dataUpdated;
        } catch (error) {
            console.log(error);
        }
        
    }
}

module.exports =  { ContainerMongo }


let p = new ContainerMongo(productoModel)
p.getContent()