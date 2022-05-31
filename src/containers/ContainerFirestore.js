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

    async save(data) {
        let item = await this.collection.doc().create(data)
        return item;
    }

    async getContent() {
        let result = await this.collection.get()
        result = result.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))
        return result;
    }

    async getById(id) {
        let result = await this.collection.get()
        result = result.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }))
        let item = result.find(elem => elem.id == id)
        return item
    }

    async deleteById(id) {
        let doc = this.collection.doc(`${id}`)
        let item = await doc.delete()
        return ({status: 'Producto eliminado'})
    }

    async editData(id, data) {
        let doc = this.collection.doc(`${id}`)

        if (doc) { 
            let item = await doc.update(data)
            return item;
        } else {
            return ({Error: 'no se encontro el elemento'})
        }

    }
}

module.exports = { ContainerFirestore };