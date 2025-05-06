let container = document.getElementById("container2");
let hot_sales_image = document.getElementById("hot_sales_image");
let hot_sales_title = document.getElementById("hot_sales_title");
let hot_sales_price = document.getElementById("hot_sales_price");

fetch("https://fakestoreapi.com/products")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then((result) => {
    console.log(result);
    loadData(result);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  function loadData(data) {
    for (let i in data) {
      let cards = document.createElement("div");
      cards.classList.add("cards");
  
      let v = Math.floor(Math.random() * 10) + 1;
  
      if (v && i == 0) {
        hot_sales_image.src = `${data[v].image}`;
        hot_sales_title.textContent = `${data[v].title}`;
        hot_sales_price.textContent = `Price: $${data[v].price}`;
      }
  
      let img = document.createElement("img");
      img.classList.add("img");
      img.src = `${data[i].image}`;
  
      let title = document.createElement("h1");
      title.classList.add("title");
      title.textContent = `${data[i].title}`;
  
      let price = document.createElement("h1");
      price.classList.add("price");
      price.textContent = `Price: $${data[i].price}`;
  
      let cart_btn = document.createElement("button");
      cart_btn.classList.add("cart_btn");
      cart_btn.textContent = "Add To Cart";
  
      cards.addEventListener("click", () => {
        window.location.href = `productDetail.html?title=${encodeURIComponent(data[i].title)}&image=${encodeURIComponent(data[i].image)}&price=${data[i].price}`;
      });
  
      cards.append(img, title, price, cart_btn);
      container.appendChild(cards);
    }
  }
  