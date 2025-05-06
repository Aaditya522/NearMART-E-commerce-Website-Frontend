const cartItemList = document.getElementById('cart-item-list');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartSummary = document.getElementById('cart-summary');
const messageModal = document.getElementById('message-modal');
const messageModalClose = document.getElementById('message-modal-close');
const messageText = document.getElementById('message-text');
const cartItemsDiv = document.getElementById('cart-items');

const userId = 123;

async function fetchCartItems() {
    try {
        const response = await fetch(`/api/carts/${userId}`);
        if (!response.ok) {
            console.error(`Failed to fetch cart items: ${response.status}`);
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItemsDiv.style.display = 'none';
            showMessageModal("No products in the cart");
            return;
        }
        const cartData = await response.json();

        if (cartData.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItemsDiv.style.display = 'none';
            showMessageModal("No products in the cart");
            return;
        } else {
            emptyCartMessage.style.display = 'none';
            cartSummary.style.display = 'block';
            cartItemsDiv.style.display = 'block';
        }

        cartItemList.innerHTML = '';
        let total = 0;

        cartData.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = "flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-4 md:pb-6 last:border-0";

            const productInfoDiv = document.createElement('div');
            productInfoDiv.className = "flex items-start md:items-center gap-4 mb-2 md:mb-0";

            const image = document.createElement('img');
            image.src = item.product.imageUrl || 'https://via.placeholder.com/150';
            image.alt = item.product.name;
            image.className = "w-20 h-20 rounded-md object-cover";

            const detailsDiv = document.createElement('div');
            detailsDiv.className = "space-y-1";
            const name = document.createElement('h3');
            name.textContent = item.product.name;
            name.className = "text-lg font-semibold text-gray-800";

            const quantity = document.createElement('p');
            quantity.textContent = `Quantity: ${item.quantity}`;
            quantity.className = "text-gray-600";

            const price = document.createElement('p');
            price.textContent = `$${(item.product.price * item.quantity).toFixed(2)}`;
            price.className = "text-md font-bold text-blue-600";

            detailsDiv.appendChild(name);
            detailsDiv.appendChild(quantity);
            detailsDiv.appendChild(price);
            productInfoDiv.appendChild(image);
            productInfoDiv.appendChild(detailsDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = "bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out";
            removeButton.dataset.productId = item.product.id;
            removeButton.addEventListener('click', () => {
                removeItemFromCart(item.product.id);
            });

            cartItemDiv.appendChild(productInfoDiv);
            cartItemDiv.appendChild(removeButton);
            cartItemList.appendChild(cartItemDiv);

            total += item.product.price * item.quantity;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;

    } catch (error) {
        console.error("Error fetching cart items:", error);
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'none';
        cartItemsDiv.style.display = 'none';
        showMessageModal("No products in the cart");
    }
}

async function removeItemFromCart(productId) {
    try {
        const response = await fetch(`/api/carts/${userId}/items/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to remove item: ${response.status}`);
        }
        fetchCartItems();
    } catch (error) {
        console.error("Error removing item from cart:", error);
        alert(`Error removing item: ${error.message}`);
    }
}

checkoutButton.addEventListener('click', () => {
    alert('Proceeding to checkout...');
});

function showMessageModal(message) {
    messageText.textContent = message;
    messageModal.style.display = "flex";
}

function hideMessageModal() {
    messageModal.style.display = "none";
}

messageModalClose.addEventListener('click', hideMessageModal);

window.addEventListener('click', (event) => {
    if (event.target === messageModal) {
        hideMessageModal();
    }
});

fetchCartItems();