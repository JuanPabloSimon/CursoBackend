const fs = require('fs')

class Container {
    constructor(archivo) {
        this.archivo = archivo
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
}

module.exports = { Container }

