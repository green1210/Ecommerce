
const products = [
    { id: 1, name: "Product 1", price: "$10", image: "images/product1.jpg" },
    { id: 2, name: "Product 2", price: "$20", image: "images/product2.jpg" },
    { id: 3, name: "Product 3", price: "$30", image: "images/product3.jpg" }
];

const productList = document.querySelector('.product-list');

products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <button>Add to Cart</button>
    `;
    productList.appendChild(productElement);
});
