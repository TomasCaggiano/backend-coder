const Router = require('./router.js')
const {
    getProducts,
    getProduct,
    createProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller.js')

class ProductsRouter extends Router {
    init() {
        this.get('/', ['PUBLIC'], getProducts)
        this.get('/:id', ['PUBLIC'], getProduct)
        this.post('/', ['PUBLIC'], createProducts)
        this.put('/:id', ['PUBLIC'], updateProduct)
        this.delete('/:id', ['PUBLIC'], deleteProduct)
    }
}

module.exports = new ProductsRouter()