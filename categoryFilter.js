document.addEventListener('DOMContentLoaded', () => {
  const categorySelect       = document.getElementById('lang');
  const categoryModal        = document.getElementById('categoryModal');
  const categoryModalTitle   = document.getElementById('categoryModalTitle');
  const categoryProductList  = document.getElementById('categoryProductList');
  const categoryModalLoading = document.getElementById('categoryModalLoading');
  const categoryModalError   = document.getElementById('categoryModalError');
  const categoryCloseButton  = document.getElementById('categoryCloseButton');

  categorySelect.addEventListener('change', async () => {
    const cat = categorySelect.value;
    categoryModal.style.display        = 'flex';
    categoryProductList.innerHTML      = '';
    categoryModalLoading.style.display = 'block';
    categoryModalError.style.display   = 'none';
    categoryModalTitle.textContent     = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Products`;

    try {
      const res = await fetch(`https://fakestoreapi.com/products/category/${cat}`);
      if (!res.ok) {
        let msg = `Failed to fetch ${cat}`;
        if (res.status === 404) msg += ": none found";
        else if (res.status >= 500) msg += ": server error";
        throw new Error(msg);
      }
      const products = await res.json();
      categoryModalLoading.style.display = 'none';
      if (!products.length) {
        categoryModalError.style.display = 'block';
        categoryModalError.textContent   = `No products in ${cat}.`;
        return;
      }
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';

        const img = document.createElement('img');
        img.src     = p.image;
        img.alt     = p.title;
        img.onerror = () => { img.src = 'placeholder.png'; };

        const name = document.createElement('h3');
        name.className = 'product-title';
        name.textContent = p.title;

        const price = document.createElement('p');
        price.className  = 'product-price';
        price.textContent = `$${p.price.toFixed(2)}`;

        card.append(img, name, price);

        // ✅ Add click event to redirect to productDetail.html
        card.addEventListener('click', () => {
          const url = `productDetail.html?title=${encodeURIComponent(p.title)}&image=${encodeURIComponent(p.image)}&price=${encodeURIComponent(p.price)}&description=${encodeURIComponent(p.description)}`;
          window.location.href = url;
        });

        categoryProductList.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      categoryModalLoading.style.display = 'none';
      categoryModalError.style.display   = 'block';
      categoryModalError.textContent     = err.message;
    }
  });

  // Close controls
  categoryCloseButton?.addEventListener('click', () => {
    categoryModal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === categoryModal) categoryModal.style.display = 'none';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') categoryModal.style.display = 'none';
  });
});
