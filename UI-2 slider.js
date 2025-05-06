      //Categories slider;
const categories = document.querySelector('.categories'); 
const leftArrow = document.querySelector('#left-arrow');
const rightArrow = document.querySelector('#right-arrow');

let scrollAmount = 1;
const scrollStep = 300;

    rightArrow.addEventListener('click', () => {
        categories.scrollBy({ left: scrollStep, behavior: 'smooth'});
    });

    leftArrow.addEventListener('click', () => {
        categories.scrollBy({ left: -scrollStep, behavior: 'smooth'});
    });


    // Search dynamic placeholder;
const searchBar = document.getElementById('search-bar');
const placeholderOptions = ["butter", "chocolate", "fruits", "vegetables", "snacks"];
let index = 0;

function changePlaceholder(){
    
    searchBar.placeholder = `Search for "${placeholderOptions[index]}"`;
    
    index++;
    if(index == placeholderOptions.length){
        index=0;
    }
}


setInterval(changePlaceholder, 2000);