

let apiLink = 'https://6784ca971ec630ca33a5a9a4.mockapi.io/products';

class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    render() {
        return `
            <div class="card" data-id="${this.id}">
                <img src="${this.image}" alt="">
                <h3>${this.title}</h3>
                <p>Price: $${this.price}</p>
                <p>${this.description}</p>
                <button class="update-btn" data-id="${this.id}">Update</button>
                <button class="delete-btn" data-id="${this.id}">Delete</button>
            </div>
        `;
    }
}

let container = document.getElementById('container');
let productsArray = []; 

function readData() {
    fetch(apiLink)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 
            productsArray = []; 

            data.forEach(productData => {
                let product = new Product(
                    productData.id,
                    productData.title,
                    productData.price,
                    productData.description,
                    productData.image
                );
                productsArray.push(product); 
                container.innerHTML += product.render(); 
            });

            addEventListeners(); 
        });
}


function addEventListeners() {

    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id'); 
            const product = productsArray.find(p => p.id == productId); 
            if (product) updateData(product); 
        });
    });


    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id'); 
            const product = productsArray.find(p => p.id == productId); 
            if (product) deleteData(product); 
        });
    });
}


function addData() {
    fetch(apiLink, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'New Product',
            price: '50jd',
            description: 'This is a new product',
            image: 'https://via.placeholder.com/150'
        })
    })
        .then(response => response.json())
        .then(() => readData()) 
        .catch(error => console.error('Error creating product:', error));
}


function updateData(product) {
    const newTitle = prompt('Enter new title:', product.title);
    if (newTitle  !== product.title) {
        fetch(`${apiLink}/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle 
            })
        })
            .then(response => response.json())
            .then(() => readData()) 
            .catch(error => console.error('Error updating product:', error));
    }
}

function deleteData(product) {
    const confirmed = confirm(`Are you sure you want to delete "${product.title}"?`);
    if (confirmed) {
        fetch(`${apiLink}/${product.id}`, { method: 'DELETE' })
            .then(() => readData()) 
            .catch(error => console.error('Error deleting product:', error));
    }
}

readData(); 
