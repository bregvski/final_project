"use strict";

const API_URL = "https://dummyjson.com/";

(async () => {
  async function fetchProducts() {
    // Getting laptops from API
    const laptopsResponse = await fetch(API_URL + "products/category/laptops");
    const laptops = (await laptopsResponse.json()).products;

    // Getting smartphones from API
    const smartphonesResponse = await fetch(
      API_URL + "products/category/smartphones"
    );
    const smartphones = (await smartphonesResponse.json()).products;

    // Save products in localStorage
    localStorage.setItem("products", JSON.stringify({ laptops, smartphones }));
  }

  function calculateRating(rating) {
    const roundedRating = Math.round(rating * 2) / 2;

    const fullStars = Math.floor(roundedRating);
    let halfStar = false;
    if (roundedRating - fullStars === 0.5) {
        halfStar = true;
    }
    const totalStars = fullStars + (halfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
      stars += '<i class="fas fa-star-half-stroke"></i>';
    }

    for (var j = 0; j < 5 - totalStars; j++) {
        stars += '<i class="far fa-star"></i>';
      }

    return stars;
  }

  function populateCategory(products, category_container) {
    const container = document.getElementById(category_container);
    const slicedProducts = products.slice(0, 3);

    const children = slicedProducts.map(
      (product) => `<div class="col-3">
        <img src="${product.images[0]}" />
        <h4>${product.title}</h4>
        <div class="rating">
            ${calculateRating(product.rating)}
        </div>
        <p>$${product.price}</p>
      </div>`
    );
    container.innerHTML = children.join("");
  }

  async function populateProduct() {
    const products = JSON.parse(localStorage.getItem("products"));
    populateCategory(products.laptops, "laptops_container");
    populateCategory(products.smartphones, "smartphones_container");
  }

  //   If we don't have products yet, we fetch it <3
  if (!localStorage.getItem("products")) await fetchProducts();

  await populateProduct();
})();
