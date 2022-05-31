const mongoose = require("mongoose");

class ContainerMongo {
    constructor(modelo) {
        mongoose.connect('mongodb://localhost:27017/ecommerce', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log('Conectado a la base de datos'));
        this.modelo = modelo
    }


    
    async save(data) {
        try {
            // const documento = new this.modelo.productos(data);
            let documentSave = await new this.modelo(data).save();
            console.log(documentSave);
            return documentSave;
        } catch(error) {
            console.log(error);
        }
    }
    
    async getContent(){
        try {
            console.log('Read all');
            let data = await this.modelo.find({});
            return data
        } catch(error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            console.log('Read by id');
            let data = await this.modelo.find({_id: id});
            let objeto = data.find(element => element.id == id)
            console.log(objeto);
            return objeto
        } catch(error) {
            console.log(error);
        }
    }

    async deleteById(id) {
        try {
            let dataDelete = await this.modelo.deleteOne(
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
            let dataUpdated = await this.modelo.updateOne(
                {_id: id},
                {$set: data}
            );
            console.log(dataUpdated);
            return dataUpdated;
        } catch (error) {
            console.log(error);
        }
        
    }
}

module.exports =  { ContainerMongo }

