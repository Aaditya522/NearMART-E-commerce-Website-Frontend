(() => {
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-bar-button");

  function runSearch() {
    const query = searchBar.value.trim().toLowerCase();
    if (!query) {
      alert("Please enter something to search for.");
      return;
    }
    fetchAndShow(query);
  }

  searchBar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") runSearch();
  });

  searchButton.addEventListener("click", runSearch);

  function fetchAndShow(query) {
    fetch("https://fakestoreapi.com/products")
      .then(res => {
        if (!res.ok) throw new Error("Network error: " + res.statusText);
        return res.json();
      })
      .then(products => {
        const results = products.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
        showSearchModal(results, query);
      })
      .catch(err => {
        console.error(err);
        alert("Something went wrong while searching.");
      });
  }

  function showSearchModal(results, query){

    const existing = document.getElementById("searchOverlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "searchOverlay";

    // "Object.assign(modal.style, {...})" is the shortcut for assigning multiple inline styling on DOM Object;

    Object.assign(overlay.style, {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.remove();
    });

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      backgroundColor: "#fff",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "80%",
      overflowY: "auto",
      padding: "20px",
      position: "relative",
    });

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "10px",
      right: "15px",
      fontSize: "24px",
      cursor: "pointer",
    });
    closeBtn.addEventListener("click", () => overlay.remove());
    modal.appendChild(closeBtn);

    const title = document.createElement("h2");
    title.textContent = results.length
      ? `Results for "${query}"`
      : `No results for "${query}"`;
    modal.appendChild(title);

    if (results.length) {
      const grid = document.createElement("div");
      Object.assign(grid.style, {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginTop: "12px",
      });

      results.forEach(p => {
        const card = document.createElement("div");
        Object.assign(card.style, {
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "10px",
          textAlign: "center",
          cursor: "pointer"
        });

        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.title;
        Object.assign(img.style, {
          maxWidth: "100%",
          maxHeight: "100px",
          objectFit: "contain",
          marginBottom: "8px",
        });

        const name = document.createElement("div");
        name.textContent = p.title;
        Object.assign(name.style, {
          fontSize: "14px",
          marginBottom: "6px",
        });

        const price = document.createElement("div");
        price.textContent = `$${p.price.toFixed(2)}`;
        Object.assign(price.style, {
          fontWeight: "bold",
          color: "#007bff",
        });

        card.append(img, name, price);

        card.addEventListener("click", () => {
          const url = `productDetail.html?title=${encodeURIComponent(p.title)}&image=${encodeURIComponent(p.image)}&price=${encodeURIComponent(p.price)}&description=${encodeURIComponent(p.description)}`;
          window.location.href = url;
        });

        grid.appendChild(card);
      });

      modal.appendChild(grid);
    }

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }
})();
