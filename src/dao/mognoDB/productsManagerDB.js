// ProductManagerDB.js
import { productsModel } from "../../models/products.models.js";
import { cartsModel } from "../../models/carts.model.js";

class ProductManagerDB {
    constructor() {
        this.products = productsModel;
        this.carts = cartsModel;
    }

    async addProductToCart(cid, pid) {
        const cart = await this.carts.findById(cid);
        if (!cart) throw new Error('Cart not found');

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }

        await cart.save();
    }

    async getProducts({ filter = {}, limit = 10, numPage = 1, sort = '' } = {}) {
        const sortOptions = {};
        if (sort === 'asc') {
            sortOptions.price = 1;
        } else if (sort === 'desc') {
            sortOptions.price = -1;
        }

        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(numPage, 10),
            sort: sortOptions,
            lean: true
        };

        return await this.products.paginate(filter, options);
    }

    async getTotalProductsCount(filter = {}) {
        return await this.products.countDocuments(filter);
    }

    async getProductById(pid) {
        return await this.products.findById(pid);
    }

    async createProduct(productData) {
        return await this.products.create(productData);
    }

    async updateProduct(pid, productData) {
        return await this.products.findByIdAndUpdate(pid, productData, { new: true });
    }

    async deleteProduct(pid) {
        return await this.products.findByIdAndDelete(pid);
    }
}

export default ProductManagerDB;