let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('registerButton').style.display = 'none';
        document.getElementById('userMenu').style.display = 'inline';
        document.getElementById('welcomeMessage').innerText = `Bienvenido, ${currentUser.username}`;
    }
    updateCart();
});

function searchProducts() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    const products = document.querySelectorAll('.product');
    let searchResultsHTML = '';

    products.forEach(product => {
        const productName = product.querySelector('.name').innerText.trim().toLowerCase();
        if (productName.includes(searchText)) {
            searchResultsHTML += product.outerHTML;
        }
    });

    const encodedSearchResultsHTML = encodeURIComponent(searchResultsHTML);
    window.open(`productos.html?searchResults=${encodedSearchResultsHTML}`, '_blank');
}

function addToCart(id, name, price) {
    cart.push({ id, name, price });
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <span class="remove" onclick="removeFromCart(${index})">&times;</span>
        `;
        cartItems.appendChild(cartItem);
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function checkout() {
    if (currentUser) {
        alert('Procesando pago...');
        cart = [];
        updateCart();
    } else {
        alert('Debe iniciar sesión para proceder con el pago.');
    }
}

document.getElementById('loginButton').addEventListener('click', function() {
    openModal('loginModal');
});

document.getElementById('registerButton').addEventListener('click', function() {
    openModal('registerModal');
});

document.getElementById('logoutButton').addEventListener('click', function() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    alert('Sesión cerrada');
    document.getElementById('loginButton').style.display = 'inline';
    document.getElementById('registerButton').style.display = 'inline';
    document.getElementById('userMenu').style.display = 'none';
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert('Sesión iniciada');
        closeModal('loginModal');
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('registerButton').style.display = 'none';
        document.getElementById('userMenu').style.display = 'inline';
        document.getElementById('welcomeMessage').innerText = `Bienvenido, ${user.username}`;
    } else {
        alert('Correo o contraseña incorrectos');
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuario registrado');
    closeModal('registerModal');
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('registerButton').style.display = 'none';
    document.getElementById('userMenu').style.display = 'inline';
    document.getElementById('welcomeMessage').innerText = `Bienvenido, ${username}`;
});

function openModal(id) {
    document.getElementById(id).classList.add('show');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}
