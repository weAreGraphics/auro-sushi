// Archivo principal de la aplicación de la tienda en línea de sushi

// Carrito de compras
let cart = [];
const wsapp = '+56973761422';

const productsContainer = document.getElementById("products");
const cartItemsContainer = document.getElementById("cart-items");
const checkoutButton = document.getElementById("checkout");
const cartCount = document.getElementById("cart-count");

// Función para renderizar las categorías
function renderCategories() {
    const categoriesContainer = document.createElement("section");
    categoriesContainer.id = "categories";
    //categoriesContainer.style.display = "grid";
    //categoriesContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    //categoriesContainer.style.gap = "20px";
    //categoriesContainer.style.margin = "20px 0";

    // Cargar las categorías desde el archivo JSON
    fetch("data/categories.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar las categorías: ${response.statusText}`);
            }
            return response.json();
        })
        .then(categories => {
            categories.forEach(category => {
                const categoryElement = document.createElement("div");
                categoryElement.classList.add("category");
                //categoryElement.style.textAlign = "center";
                //categoryElement.style.border = "1px solid #ddd";
                //categoryElement.style.borderRadius = "8px";
                //categoryElement.style.padding = "10px";
                //categoryElement.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
                //categoryElement.style.cursor = "pointer";

                categoryElement.innerHTML = `
                    <a href="#products" class="category-link" data-id="${category.id}" style="text-decoration: none; color: inherit;">
                        
                        <h3>${category.name}</h3>
                    </a>
                `;

                categoriesContainer.appendChild(categoryElement);
            });

            // Agregar las categorías al contenedor principal
            const mainContainer = document.querySelector("main");
            mainContainer.insertBefore(categoriesContainer, mainContainer.firstChild);

            // Configurar el evento de scroll al hacer clic en una categoría
            setupCategoryLinks();
        })
        .catch(error => {
            console.error("Error al cargar las categorías:", error);
        });
}

// Función para configurar los enlaces de las categorías
function setupCategoryLinks() {
    const categoryLinks = document.querySelectorAll(".category-link");
    categoryLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
            const categoryId = parseInt(link.getAttribute("data-id"));
            renderProductsByCategory(categoryId); // Renderizar los productos de la categoría seleccionada

            // Hacer scroll suave hasta la sección de productos y dejarla en el top
            const productsSection = document.getElementById("products");
            productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

// Función para renderizar productos por categoría
function renderProductsByCategory(categoryId) {
    productsContainer.innerHTML = ""; // Limpiar los productos actuales

    // Cargar los productos desde un archivo JSON
    fetch("data/products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar los productos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(products => {
            // Filtrar los productos por categoría
            const filteredProducts = products.filter(product => product.categoryId === categoryId).slice(0, 10);

            // Renderizar los productos
            filteredProducts.forEach(product => {
                const productElement = document.createElement("div");
                productElement.classList.add("product");

                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Precio: $${parseInt(product.price)}</p>
                    <div class="quantity-controls">
                        <button class="decrease" data-id="${product.id}">-</button>
                        <span class="quantity" id="quantity-${product.id}">1</span>
                        <button class="increase" data-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">¡Lo llevo!</button>
                `;

                productsContainer.appendChild(productElement);
            });

            // Configurar los botones de cantidad y Lo llevo!
            setupQuantityButtons();
            setupAddToCartButtons(filteredProducts);
        })
        .catch(error => {
            console.error("Error al cargar los productos:", error);
        });
}

// Configurar botones para incrementar y decrementar la cantidad
function setupQuantityButtons() {
    const increaseButtons = document.querySelectorAll(".increase");
    const decreaseButtons = document.querySelectorAll(".decrease");

    increaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const quantityElement = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity < 10) {
                quantityElement.textContent = currentQuantity + 1; // Incrementar la cantidad
            }
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const quantityElement = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1; // Decrementar la cantidad
            }
        });
    });

    // Agregar un select con opciones de proteínas
   /*
    const productElements = document.querySelectorAll(".product");
    productElements.forEach(productElement => {
        const productId = productElement.querySelector(".add-to-cart").getAttribute("data-id");

        const proteinSelect = document.createElement("select");
        proteinSelect.id = `protein-${productId}`;
        proteinSelect.innerHTML = `
            <option value="pollo">Pollo</option>
            <option value="carne">Carne</option>
            <option value="tofu">Tofu</option>
            <option value="salmon">Salmón</option>
        `;
        proteinSelect.style.marginTop = "10px";

        productElement.appendChild(proteinSelect);
    });
   */


}

// Configurar botones para agregar productos al carrito
function setupAddToCartButtons(products) {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));
            addToCart(productId, products); // Llamar a la función para Lo llevo!
        });
    });
}

// Función para agregar productos al carrito con la cantidad seleccionada y la proteína
function addToCart(productId, products) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Obtener la cantidad seleccionada desde el elemento del DOM
        const quantityElement = document.getElementById(`quantity-${productId}`);
        const selectedQuantity = parseInt(quantityElement.textContent);

        if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
            alert("Por favor, selecciona una cantidad válida.");
            return;
        }

        // Obtener la proteína seleccionada desde el <select>
        const proteinSelect = document.getElementById(`protein-${productId}`);
        const selectedProtein = proteinSelect ? proteinSelect.value : null;

        if (!selectedProtein) {
            alert("Por favor, selecciona una proteína.");
            return;
        }

        // Verificar si el producto ya está en el carrito con la misma proteína
        const existingProduct = cart.find(item => item.id === productId && item.protein === selectedProtein);
        if (existingProduct) {
            existingProduct.quantity += selectedQuantity; // Incrementar la cantidad si ya está en el carrito
        } else {
            cart.push({ ...product, quantity: selectedQuantity, protein: selectedProtein }); // Agregar nuevo producto con la cantidad y proteína seleccionada
        }

        // Actualizar la interfaz del carrito
        updateCartUI();
    }
}

// Configurar botones para incrementar y decrementar la cantidad
function setupQuantityButtons() {
    const increaseButtons = document.querySelectorAll(".increase");
    const decreaseButtons = document.querySelectorAll(".decrease");

    increaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const quantityElement = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity < 10) {
                quantityElement.textContent = currentQuantity + 1; // Incrementar la cantidad
            }
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const quantityElement = document.getElementById(`quantity-${productId}`);
            let currentQuantity = parseInt(quantityElement.textContent);

            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1; // Decrementar la cantidad
            }
        });
    });

    // Agregar un select con opciones de proteínas
    const productElements = document.querySelectorAll(".product");
    productElements.forEach(productElement => {
        const productId = productElement.querySelector(".add-to-cart").getAttribute("data-id");

        const proteinSelect = document.createElement("select");
        proteinSelect.id = `protein-${productId}`;
        proteinSelect.innerHTML = `
            <option value="pollo">Pollo</option>
            <option value="carne">Carne</option>
            <option value="tofu">Tofu</option>
            <option value="salmon">Salmón</option>
        `;
        proteinSelect.style.marginTop = "10px";

        productElement.appendChild(proteinSelect);
    });
}

// Llamar a la función para renderizar las categorías
renderCategories();


// Función para enviar el pedido por WhatsApp
function sendOrder() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    // Generar los detalles del pedido
    const orderDetails = cart
        .map(item => `${item.name} (${item.protein}) x ${parseInt(item.quantity)} - $${(item.price * parseInt(item.quantity))}`)
        .join("\n");

    const total = cart.reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0);

    // Crear el mensaje para WhatsApp
    const message = `Hola, me gustaría realizar el siguiente pedido:\n\n${orderDetails}\n\nTotal: $${total}`;
    const whatsappUrl = `https://wa.me/${wsapp}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, "_blank");
}

// Asociar la función al botón de checkout
checkoutButton.addEventListener("click", sendOrder);

// Función para configurar los botones de edición del carrito
function setupCartEditButtons() {
    const increaseButtons = document.querySelectorAll(".increase-cart");
    const decreaseButtons = document.querySelectorAll(".decrease-cart");
    const removeButtons = document.querySelectorAll(".remove-cart");

    // Incrementar la cantidad de un producto en el carrito
    increaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));
            const product = cart.find(item => item.id === productId);
            if (product) {
                product.quantity += 1; // Incrementar la cantidad
                updateCartUI(); // Actualizar la interfaz del carrito
            }
        });
    });

    // Decrementar la cantidad de un producto en el carrito
    decreaseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));
            const product = cart.find(item => item.id === productId);
            if (product && product.quantity > 1) {
                product.quantity -= 1; // Decrementar la cantidad
                updateCartUI(); // Actualizar la interfaz del carrito
            } else if (product && product.quantity === 1) {
                // Si la cantidad es 1, eliminar el producto
                cart = cart.filter(item => item.id !== productId);
                updateCartUI(); // Actualizar la interfaz del carrito
            }
        });
    });

    // Eliminar un producto del carrito
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));
            cart = cart.filter(item => item.id !== productId); // Eliminar el producto del carrito
            updateCartUI(); // Actualizar la interfaz del carrito
        });
    });
}


// Función para actualizar la interfaz del carrito
function updateCartUI() {
    cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual del carrito

    if (cart.length === 0) {
        cartItemsContainer.style.display = "none"; // Ocultar el contenedor del carrito
        cartCount.textContent = 0; // Actualizar el contador del ícono del carrito
        checkoutButton.textContent = "Enviar Pedido por WhatsApp (0 items)";
        checkoutButton.disabled = true; // Deshabilitar el botón de checkout
        return;
    }

    cartItemsContainer.style.display = "block"; // Mostrar el contenedor del carrito si hay productos

    // Crear el contenedor del acordeón
    const accordion = document.createElement("div");
    accordion.classList.add("accordion");

    // Crear el encabezado del acordeón
    const accordionHeader = document.createElement("div");
    accordionHeader.classList.add("accordion-header");
    accordionHeader.textContent = `Productos en el carrito (${cart.length})`;
    accordionHeader.style.cursor = "pointer";

    // Crear el contenido del acordeón
    const accordionContent = document.createElement("div");
    accordionContent.classList.add("accordion-content");
    accordionContent.style.display = "none"; // Ocultar contenido por defecto

    let totalPurchase = 0; // Variable para almacenar el total de la compra

    // Agregar los productos al contenido del acordeón
    cart.forEach(item => {
        const totalProduct = parseInt(item.price )* parseInt(item.quantity); // Calcular el total por producto
        totalPurchase += totalProduct; // Sumar al total de la compra

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");

        cartItemElement.innerHTML = `
            <p>${item.name} (${item.protein}) - $${parseInt(item.price)} x ${parseInt(item.quantity)} = $${parseInt(totalProduct)}</p>
            <div class="cart-item-controls">
                <button class="decrease-cart" data-id="${item.id}" data-protein="${item.protein}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-cart" data-id="${item.id}" data-protein="${item.protein}">+</button>
                <button class="remove-cart" data-id="${item.id}" data-protein="${item.protein}">Eliminar</button>
            </div>
        `;

        accordionContent.appendChild(cartItemElement);
    });

    // Agregar el total de la compra al final del acordeón
    const totalElement = document.createElement("div");
    totalElement.classList.add("cart-total");
    totalElement.innerHTML = `<p><strong>Total de la compra:</strong> $${totalPurchase}</p>`;
    accordionContent.appendChild(totalElement);

    // Agregar funcionalidad para mostrar/ocultar el contenido del acordeón
    accordionHeader.addEventListener("click", () => {
        const isVisible = accordionContent.style.display === "block";
        accordionContent.style.display = isVisible ? "none" : "block";
    });

    // Agregar el encabezado y el contenido al acordeón
    accordion.appendChild(accordionHeader);
    accordion.appendChild(accordionContent);

    // Agregar el acordeón al contenedor del carrito
    cartItemsContainer.appendChild(accordion);

    // Mostrar la cantidad total de productos en el carrito
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems; // Actualizar el contador del ícono del carrito
    checkoutButton.textContent = `Enviar Pedido por WhatsApp (${totalItems} items)`;
    checkoutButton.disabled = false; // Habilitar el botón de checkout

    // Configurar los botones de edición del carrito
    setupCartEditButtons();
}




