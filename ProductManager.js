class ProductManager{
    constructor () {
        this.products =[];
};

 getProducts(){
    return this.products;
 }

 addProduct(productData){
    const product =
    {id : this.idIncrementable(),
    title: productData.title,
    price: productData.price,
    thumbnail: productData.thumbnail,
    code : productData.code,
    stock: productData.stock};
 this.products.push(product);}

 idIncrementable(){
     if (this.products.legth === 0){
         return 1
     }
     const highestId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
     return highestId+1;
 }


 getProductById(idProduct){
    const product = this.products.find((product) => product.id === idProduct);
    if(!product){
        throw new error('not found product');
    }else{return `the product is ${product.title}`}
 }

 deleteProduct(idProduct){
    const index = this.products.findIndex((product) => product.id === idProduct);
    if (index === -1) {
        throw new error('product not found')
    }
    this.products.splice(index, 1);
    return `product with id ${idProduct} has been deleted`
 }
}



const manager = new ProductManager();
const product1 = {
    title: "Producto 1",
    price: 100,
    thumbnail: "/imagen1.jpg",
    code: "P001",
    stock: 10
};

const product2 = {
    title: "Producto 2",
    price: 150,
    thumbnail: "/imagen2.jpg",
    code: "P002",
    stock: 5
};
const product3 = {
    title: "Producto 3",
    price: 150,
    thumbnail: "/imagen3.jpg",
    code: "P003",
    stock: 5
};
const product4 = {
    title: "Producto 4",
    price: 150,
    thumbnail: "/imagen4.jpg",
    code: "P004",
    stock: 5
};
manager.addProduct(product1);
manager.addProduct(product2);
manager.addProduct(product3);
manager.addProduct(product4);

console.log("Todos los productos:", manager.getProducts());

try {
    const product = manager.getProductById(1);
    console.log("Producto encontrado:", product);
} catch (error) {
    console.error(error.message);
}


try {
    const product = manager.getProductById(3);  
    console.log("Producto encontrado:", product);
} catch (error) {
    console.error(error.message);
}

    try{
        const deleted = manager.deleteProduct(2);
        console.log('producto eliminado:', deleted)
    }catch(error){
        console.log(error.message)
    }

const product6 = {
        title: "Producto 6",
        price: 100,
        thumbnail: "/imagen6.jpg",
        code: "P006",
        stock: 10
    };

    manager.addProduct(product6);

    console.log("Productos después de eliminar:", manager.getProducts());

    
    