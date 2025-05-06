document.addEventListener('DOMContentLoaded', () => {
  const categoriesContainer = document.querySelector('.categories');
  const modal               = document.getElementById('productModal');
  const modalClose          = document.querySelector('.close-button');
  const modalProductName    = document.getElementById('modal-shop-name');
  const modalProductList    = document.getElementById('modal-product-list');
  const modalLoading        = document.getElementById('modal-loading');
  const modalError          = document.getElementById('modal-error');

  async function fetchNearestShops() {
    try {
      const response = await fetch('/api/nearest-shops');
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return await response.json();
    } catch (e) {
      console.error("Error fetching shops:", e);
      modalError.style.display = 'block';
      modalError.textContent   = "Failed to load shops.";
      return [];
    }
  }

  async function initializeCategories() {
    const shops = await fetchNearestShops();
    if (!shops.length) {
      categoriesContainer.innerHTML = '<p>No shops found nearby.</p>';
      return;
    }

    categoriesContainer.innerHTML = '';
    shops.forEach(shop => {
      const div = document.createElement('div');
      div.className                = 'category';
      div.dataset.retailerId       = shop.retailerId;
      div.textContent              = shop.shopName;
      div.role                     = 'button';
      div.addEventListener('click', () => {
        modalProductName.textContent = shop.shopName;
        openProductModal(shop.retailerId);
      });
      categoriesContainer.appendChild(div);
    });

    ['left','right'].forEach(dir => {
      const btn = document.createElement('button');
      btn.className = 'arrow';
      btn.id        = `${dir}-arrow`;
      btn.innerHTML = dir === 'left'
        ? '<i class="fas fa-chevron-left"></i>'
        : '<i class="fas fa-chevron-right"></i>';
      dir === 'left'
        ? categoriesContainer.parentElement.insertBefore(btn, categoriesContainer)
        : categoriesContainer.parentElement.appendChild(btn);
    });

  }

  initializeCategories();

  function openProductModal(retailerId) {
    modal.style.display        = 'flex';
    modalProductList.innerHTML = '';
    modalLoading.style.display = 'block';
    modalError.style.display   = 'none';
    fetchProductsByRetailer(retailerId);
  }

  function closeProductModal() {
    modal.style.display = 'none';
  }

  modalClose?.addEventListener('click', closeProductModal);
  window.addEventListener('click', e => {
    if (e.target === modal) closeProductModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductModal();
  });

  async function fetchProductsByRetailer(retailerId) {
    try {
      const res = await fetch(`/api/products?retailerId=${retailerId}`);
      if (!res.ok) {
        let msg = "Failed to fetch products";
        if (res.status === 404) msg += ": Not found";
        else if (res.status >= 500) msg += ": Server error";
        throw new Error(msg);
      }
      const data = await res.json();
      modalLoading.style.display = 'none';
      if (!data.length) {
        modalError.style.display = 'block';
        modalError.textContent   = "No products for this shop.";
        return;
      }
      data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.src        = p.imageUrl || 'placeholder.png';
        img.alt        = p.name;
        img.onerror    = () => { img.src = 'placeholder.png'; };

        const h3 = document.createElement('h3');
        h3.textContent = p.name;

        const price = document.createElement('p');
        price.className = 'product-price';
        price.textContent = `$${p.price}`;

        card.append(img, h3, price);
        modalProductList.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      modalLoading.style.display = 'none';
      modalError.style.display   = 'block';
      modalError.textContent     = err.message;
    }
  }
});
