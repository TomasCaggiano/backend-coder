import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = './Products.json';
        this.products = [];
        this.loadProducts();
    }
    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log(error)
        }
    }

    idIncrementable() {
        return this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
    }


    async addProduct(productData) {
        await this.loadProducts();
        const product = {
            id: this.idIncrementable(),
            title: productData.title,
            price: productData.price,
            thumbnail: productData.thumbnail,
            status: productData.status,
            code: productData.code,
            stock: productData.stock
        };

        this.products.push(product);

        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
            return product;
        } catch (error) {
            console.log(error)
        }
    }

    async getProductById(idProduct) {
        await this.loadProducts();
        const product = this.products.find((product) => product.id === idProduct);
        if (!product) return ('product does not exist')
        return `the product is ${product.title} ${product.thumbnail} ${product.stock} ${product.price}`
    }

    async deleteProduct(idProduct) {
        await this.loadProducts();
        const index = this.products.findIndex((product) => product.id === idProduct)
        if (index === -1) throw new error('does not exist')
        this.products.splice(index, 1);
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8')
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(idProduct, productUpdate) {
        await this.loadProducts();
        const index = this.products.findIndex((product) => product.id === idProduct)
        if (index === -1) throw new Error('does not exist')
        const productToUpdate = this.products[index];
        const updateProduct = {...productToUpdate, ...productUpdate }
        this.products[index] = updateProduct;
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8')
        } catch (error) {
            console.log(error)
        }
    }
}

export default ProductManager;