import { MAIN_PART, ASIDE_PART, FULL_PART } from "../app.js";
import { SUCCESS_TOAST, GOOD_TOAST, BAD_TOAST, ERROR_TOAST } from "../app.js";

let addProductBtn = document.getElementById('addProductButton');
let productElement = document.getElementById('product');
let reviewBtn = document.getElementById('review-btn');
let reviewProductForm = document.getElementById('review-product-form');


// add the `startLoading` method to the `HTMLButtonElement` prototype
HTMLButtonElement.prototype.startLoading = function() {
    // add the `loading` class to the button
    this.classList.add('loading');
}

// add the `start` method to the `HTMLButtonElement` prototype
HTMLButtonElement.prototype.stopLoading = function() {
    // remove the `loading` class to the button
    this.classList.remove('loading');
}
  
  /**
   * Method used to add the product with the given `productId` to the cart
   *
   * @param { Number } productId - The id of the product to add to the cart
   * @param { Element } productEl - The product element
   * @param { Element } addToCartButtonEl - The add to cart button element
   *
   */
  const addProductToCart = (productId, productEl, addToCartButtonEl) => {
    return new Promise((resolve, reject) => {

      // start loading the cart button
      addToCartButtonEl.startLoading();

      // after 1 second ...
      // Why? Because we want to see the loading animation for at least 1 seconds #LOL
      setTimeout(async() => {

        // Creating a request to add the product to the cart...
        
        const url = `cart/${productId}`;
         
        // create a PUT request to add the product to the cart
        const request = new Request(url, {method: 'PUT'});

        // send the request
        let response = await fetch(request);
        // get the response body
        let responseData = await response.json();

        // DEBUG [4dbsmaster]: tell me about it ;)
        console.log(`\x1b[30m[addProductToCart] (1): responseData =>  \x1b[0m`, responseData);

        // stop loading the cart button
        addToCartButtonEl.stopLoading();

        // if the response is successful
        if (responseData.success) { 
          // ...resolve the promise
          resolve(responseData);
        } else {
          // ...reject the promise
          reject(responseData);
        }

      }, 1000);
      
      
      // DEBUT [4dbsmaster]: tell me about it ;)
      console.log(`\x1b[30m[addProductToCart] (1): adding the product with the id ${productId} to cart...\x1b[0m`);
      console.log(`\x1b[30m[addProductToCart] (2): productEl =>  \x1b[0m`, productEl);
      console.log(`\x1b[30m[addProductToCart] (3): addToCartButtonEl =>  \x1b[0m`, addToCartButtonEl);
    });

  }


addProductBtn.addEventListener('click', (event) => {

    const productId = productElement.dataset.id; // ex. 12

    console.log('productId = ', productId);

    addProductToCart(productId, productElement, addProductBtn);
    
});









function resetForm(){
    let select = reviewProductForm.querySelector("select");
    let input = reviewProductForm.querySelector("input");
    input.value = "";
    select.value = "";
}

function addReview(data) {
    let reviewTemplate = `
    <div class="review">
 
        <h2>${data.firstname + " " + data.lastname}</h2>
        <span class="rating">${data.ratings}</span>
        <p class="review">${data.comment}</p>
        <span class="date">${data.created_at}</span>
        
    </div>
    `;
    let reviews = document.querySelector(".reviews");
    reviews.insertAdjacentHTML("afterbegin", reviewTemplate);
}


reviewProductForm.addEventListener('submit', async(ev) => {
    ev.preventDefault();

    let productId = ev.currentTarget.dataset.productId;
    let form = new FormData(ev.currentTarget);

    form.append('product-id', productId);

    let reviewInputValue = form.get("review-input");
    let url = "review";
    let request = new Request(url, {method: 'POST', body: form});
    let response = await fetch(request);
    let responseData = await response.json();

    if(responseData.success){
        resetForm();
        addReview(responseData.data);
        mbApp.showToast({message: "Votre review a bien été ajoutée !", part: ASIDE_PART, type: SUCCESS_TOAST }, 5, true);

    }

});


reviewBtn.addEventListener('click', () => !!mbApp.asideEl.hidden ? mbApp.openAside() : mbApp.closeAside());