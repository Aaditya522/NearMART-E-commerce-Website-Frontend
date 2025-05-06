let products=document.getElementById("products");

fetch("https://testingapi-d1u3.onrender.com/product")

.then(response=>response.json())
.then(result=>{  
    console.log(result.data);
    productinfo(result.data);
})
.catch(error=>{
    console.log('Error:', error);
});

function productinfo(data){
    for(let element of data){

        let container=document.createElement('div');
        container.classList.add("container");
        products.appendChild(container);

        let productName=document.createElement('div');
        productName.textContent=`Name: ${element.productName}`;   

        let price=document.createElement('div');
        price.textContent=`Price:${element.price}`;

        let category=document.createElement('div');
        category.textContent=`Category:${element.category}`;

        let rating=document.createElement('div');
        rating.textContent=`Rating:${element.rating}`;


        container.append(productName);
        container.append(price);
        container.append(category);
        container.appendChild(rating);
    }
}