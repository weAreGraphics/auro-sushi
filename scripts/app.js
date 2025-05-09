document.addEventListener("DOMContentLoaded", () => {// Archivo principal de la aplicación de la tienda en línea de sushi

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
    
                    //<img src="${category.image}" alt="${category.name}" style="width: 100%; height: auto; border-radius: 8px;">
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
    
                // Remover la clase 'selected' de todas las categorías
                categoryLinks.forEach(link => link.classList.remove("selected"));
    
                // Agregar la clase 'selected' a la categoría seleccionada
                event.currentTarget.classList.add("selected");
    
                // Desplazar la sección de productos al tope de la página
                const productsSection = document.getElementById("products");
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    console.warn("The products section is not available in the DOM.");
                }
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
                        <p class="price">Precio: $${product.price}</p>
                        <div class="quantity-controls">
                            <button class="decrease" data-id="${product.id}">-</button>
                            <span class="quantity" id="quantity-${product.id}">1</span>
                            <button class="increase" data-id="${product.id}">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">¡Lo quiero!</button>
                    `;
    
                    productsContainer.appendChild(productElement);
                });
    
                // Configurar los botones de cantidad y ¡Lo quiero!
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
    }
    
    // Configurar botones para agregar productos al carrito
    function setupAddToCartButtons(products) {
        const buttons = document.querySelectorAll(".add-to-cart");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                addToCart(productId, products); // Llamar a la función para ¡Lo quiero!
            });
        });
    }
    
    // Función para agregar productos al carrito con la cantidad seleccionada
    function addToCart(productId, products) {
        const product = products.find(p => p.id === productId);
        if (product) {
            // Obtener la cantidad seleccionada desde el elemento del DOM
            const quantityElement = document.getElementById(`quantity-${productId}`);
            const selectedQuantity = parseInt(quantityElement.textContent);
    
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += selectedQuantity; // Incrementar la cantidad si ya está en el carrito
            } else {
                cart.push({ ...product, quantity: selectedQuantity }); // Agregar nuevo producto con la cantidad seleccionada
            }
    
            // Actualizar la interfaz del carrito
            updateCartUI();
        }
    }
    
    // Función para actualizar la interfaz del carrito
    function updateCartUI() {
        cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual del carrito
    
        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
    
            cartItemElement.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
            `;
    
            cartItemsContainer.appendChild(cartItemElement);
        });
    
        // Mostrar la cantidad total de productos en el carrito
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems; // Actualizar el contador del ícono del carrito
        checkoutButton.textContent = `Enviar Pedido por WhatsApp (${totalItems} items)`;
    }
    
    // Configurar botones para agregar productos al carrito
    function setupAddToCartButtons(products) {
        const buttons = document.querySelectorAll(".add-to-cart");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                addToCart(productId, products); // Llamar a la función para ¡Lo quiero!
            });
        });
    }
    
    // Llamar a la función para renderizar las categorías
    renderCategories();
    
    // Función para actualizar la interfaz del carrito con un acordeón
    // Función para actualizar la interfaz del carrito con un acordeón y controles de edición
    function updateCartUI() {
        cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual del carrito
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p>El carrito está vacío.</p>`;
            cartCount.textContent = 0; // Actualizar el contador del ícono del carrito
            checkoutButton.textContent = "Enviar Pedido por WhatsApp (0 items)";
            checkoutButton.disabled = true; // Deshabilitar el botón de checkout
            return;
        }
    
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
        accordionContent.style.display = "block"; // Mostrar contenido por defecto
    
        // Agregar los productos al contenido del acordeón
        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
    
            cartItemElement.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <div class="cart-item-controls">
                    <button class="decrease-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-cart" data-id="${item.id}">+</button>
                    <button class="remove-cart" data-id="${item.id}">Eliminar</button>
                </div>
            `;
    
            accordionContent.appendChild(cartItemElement);
        });
    
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
    
    // Función para enviar el pedido por WhatsApp
    function sendOrder() {
        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
            return;
        }
    
        // Generar los detalles del pedido
        const orderDetails = cart
            .map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity)}`)
            .join("\n");
    
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
        // Crear el mensaje para WhatsApp
        const message = `Hola, me gustaría realizar el siguiente pedido:\n\n${orderDetails}\n\nTotal: $${total}`;
        const whatsappUrl = `https://wa.me/${wsapp}?text=${encodeURIComponent(message)}`;
    
        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappUrl, "_blank");
    }
    
    // Asociar la función al botón de checkout
    checkoutButton.addEventListener("click", sendOrder);
    
    
    // Función para actualizar la interfaz del carrito con un acordeón y un div para edición
    function updateCartUI() {
        cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual del carrito
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p>El carrito está vacío.</p>`;
            return;
        }
    
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
    
        // Agregar los productos al contenido del acordeón
        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
    
            cartItemElement.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <div class="cart-item-controls">
                    <button class="decrease-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-cart" data-id="${item.id}">+</button>
                    <button class="remove-cart" data-id="${item.id}">Eliminar</button>
                </div>
            `;
    
            accordionContent.appendChild(cartItemElement);
        });
    
        // Agregar funcionalidad para mostrar/ocultar el contenido del acordeón
        accordionHeader.addEventListener("click", () => {
            const isVisible = accordionContent.style.display === "block";
            accordionContent.style.display = isVisible ? "none" : "block";
        });
    
        // Agregar el encabezado y el contenido al acordeón
        accordion.appendChild(accordionHeader);
        accordion.appendChild(accordionContent);
    
        // Crear un nuevo div para la edición del carrito
        const cartEditContainer = document.createElement("div");
        cartEditContainer.id = "cart-edit-container";
        cartEditContainer.innerHTML = `
            <h3>Editar Carrito</h3>
            <p>Usa los botones para modificar las cantidades o eliminar productos.</p>
        `;
        cartEditContainer.appendChild(accordion);
    
        // Agregar el contenedor de edición al carrito
        cartItemsContainer.appendChild(cartEditContainer);
    
        // Mostrar la cantidad total de productos en el carrito
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems; // Actualizar el contador del ícono del carrito
        checkoutButton.textContent = `Enviar Pedido por WhatsApp (${totalItems} items)`;
    
        // Configurar los botones de edición del carrito
        setupCartEditButtons();
    }
    
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
    
    // Función para actualizar la interfaz del carrito con un acordeón y controles de edición
    function updateCartUI() {
        cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual del carrito
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p>El carrito está vacío.</p>`;
            cartCount.textContent = 0; // Actualizar el contador del ícono del carrito
            checkoutButton.textContent = "Enviar Pedido por WhatsApp (0 items)";
            checkoutButton.disabled = true; // Deshabilitar el botón de checkout
            return;
        }
    
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
    
        // Agregar los productos al contenido del acordeón
        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
    
            cartItemElement.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <div class="cart-item-controls">
                    <button class="decrease-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-cart" data-id="${item.id}">+</button>
                    <button class="remove-cart" data-id="${item.id}">Eliminar</button>
                </div>
            `;
    
            accordionContent.appendChild(cartItemElement);
        });
    
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
        accordionContent.style.display = "block"; // Ocultar contenido por defecto
    
        // Agregar los productos al contenido del acordeón
        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
    
            cartItemElement.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <div class="cart-item-controls">
                    <button class="decrease-cart" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-cart" data-id="${item.id}">+</button>
                    <button class="remove-cart" data-id="${item.id}">Eliminar</button>
                </div>
            `;
    
            accordionContent.appendChild(cartItemElement);
        });
    
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
        //cartCount.textContent = totalItems; // Actualizar el contador del ícono del carrito
        checkoutButton.textContent = `Enviar Pedido por WhatsApp`;
        checkoutButton.disabled = false; // Habilitar el botón de checkout
    
        // Configurar los botones de edición del carrito
        setupCartEditButtons();
    }
    
    });



//swiper
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });