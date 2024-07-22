const socket = io()

document.addEventListener('contentloaded', () => {
    const form = document.getElementById('addProductForm');
    const productsList = document.getElementById('productsList')

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const code = document.getElementById('code').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;

        socket.emit('addProduct', { title, code, price, stock })

        form.reset()
    })

    socket.on('updateProducts', (products) => {
        productsList.innerHTML = '',
            products.forEach(product => {
                const li = document.createElement('li')
                li.id = `product-${product.id}`;
                li.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
                <p>$${product.price}</p>
                `;
                productsList.appendChild(li)
            });
    })
})