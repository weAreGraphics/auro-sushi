// Este archivo maneja la funcionalidad del carrito de compras.

let cart = [];
const wsapp = '+56973761422';

// Agregar un producto al carrito
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar la cantidad si ya existe
    } else {
        cart.push({ ...product, quantity: 1 }); // Agregar nuevo producto con cantidad inicial de 1
    }
    updateCartDisplay();
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Calcular el total del carrito
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Actualizar la visualización del carrito
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.textContent = 'El carrito está vacío.';
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.name} - $${item.price} x ${item.quantity}</span>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        cartContainer.appendChild(itemElement);
    });

    const totalElement = document.createElement('div');
    totalElement.classList.add('cart-total');
    totalElement.textContent = `Total: $${calculateTotal()}`;
    cartContainer.appendChild(totalElement);

    setupRemoveButtons(); // Configurar los botones de eliminar
}

// Configurar los botones para eliminar productos
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Enviar el pedido por WhatsApp
function sendOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de enviar el pedido.');
        return;
    }

    const total = calculateTotal();
    const message = `Pedido de Sushi:\n${cart
        .map(item => `${item.name} x${item.quantity}`)
        .join('\n')}\n\nTotal: $${total}`;
    const whatsappUrl = `https://wa.me/${wsapp}?text=${message}`;

    window.open(whatsappUrl, '_blank');
}