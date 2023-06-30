"use strict";

const deletedProduct = JSON.parse(localStorage.getItem('deletedProducts')) || []
const products = Object.values(
  JSON.parse(localStorage.getItem("products"))
).flat().filter(product => !deletedProduct.includes(product.id));

const userToken = localStorage.getItem("userToken");

function calculateRating(rating) {
  const roundedRating = Math.round(rating * 2) / 2;

  const fullStars = Math.floor(roundedRating);
  let halfStar = false;
  if (roundedRating - fullStars === 0.5) {
    halfStar = true;
  }
  const totalStars = fullStars + (halfStar ? 1 : 0);

  let stars = "";
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

function addProduct() {
  if(!deletedProduct.length) return

  deletedProduct.pop()
  localStorage.setItem('deletedProducts', JSON.stringify(deletedProduct))
  location.reload()
}

function deleteProduct(id) {
  const deletedProduct = JSON.parse(localStorage.getItem('deletedProducts')) || []
  fetch("https://dummyjson.com/products/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(product => {
      deletedProduct.push(product.id)
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProduct))
      location.reload()
    });
}

function populateCategory(products, category_container) {
  const container = document.getElementById(category_container);

  const children = products.map(
    (product) => `<div>
        ${
          userToken
            ? `<button class="deleteButton" onclick="deleteProduct(${product.id})">Delete</button>`
            : ""
        }
        <img src="${product.images[0]}" />
        <h4>${product.title}</h4>
        <div class="rating">
            ${calculateRating(product.rating)}
        </div>
        <p>$${product.price}</p>
      </div>`
  );

  let renderProducts = children.join("")
  
  if(userToken && deletedProduct.length)
    renderProducts += `<button class="add_product" onclick="addProduct()">Add product</button>`

  container.innerHTML = renderProducts;
}

function matchesFilters(product, formData) {
  let match = true;
  const searchValue = formData.get("search");
  const brands = formData.getAll("brand");

  if (searchValue)
    if (
      product.title.includes(searchValue) ||
      product.description.includes(searchValue) ||
      product.brand.includes(searchValue)
    )
      match = true;
    else return false;

  if (brands.length)
    if (brands.includes(product.brand)) match = true;
    else return false;

  return match;
}

function handleFilter(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const filteredProducts = products.filter((product) =>
    matchesFilters(product, formData)
  );
  populateCategory(filteredProducts, "products_container");
}

document.getElementById("filter").addEventListener("submit", handleFilter);
populateCategory(products, "products_container");
