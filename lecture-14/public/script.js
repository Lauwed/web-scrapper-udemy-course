// Anonymous async function to be able to use the await keyword
(async () => {
  // Fetch the data from our API
  const response = await fetch('/api');
  const data = await response.json();

  // Get the HTML containers
  const containers = document.querySelectorAll('.container');
  // Loop on them to fill the data
  containers.forEach(container => {
    fillData(container, data[container.dataset.brand]);
  });

  // Hide the loader
  const loader = document.querySelector("#loading");
  loader.classList.add('opacity-0');
  loader.addEventListener('transitionend', () => {
    loader.classList.add('invisible');
  })
})();

function fillData(node, data) {
  // Get the areas to fill
  const logo = node.querySelector('.logo');
  const averagePrice = node.querySelector('.average-price');
  const countProducts = node.querySelector('.count-products');
  const productsList = node.querySelector('.products-list');

  // Fill the logo
  if(!data.logo.includes('<svg')) logo.innerHTML = `<img src="${data.logo}" alt="Logo d'une marque de vêtements" />`;
  else logo.innerHTML = data.logo;

  // Fill the numbers
  averagePrice.innerHTML = data.average;
  countProducts.innerHTML = data.count;

  // Fill the products list
  // reset the HTML of the list
  productsList.innerHTML = "";
  data.products.forEach(product => {
    // Li element
    const li = document.createElement('li');
    li.className = "w-25 flex flex-col items-center";
    // Img element
    const img = document.createElement('img');
    img.className = "rounded-full w-20 h-20 object-cover";
    img.src = product.img;
    // Title element
    const title = document.createElement('h4');
    title.className = "text-center text-sm mt-2";
    title.innerHTML = product.title;
    // Price element
    const price = document.createElement('p');
    price.className = "text-xs font-bold text-center m-0";
    price.innerHTML = product.price;

    // Append all the elements to the li
    li.appendChild(img);
    li.appendChild(title);
    li.appendChild(price);

    // Append the li to the list
    productsList.appendChild(li)
  })
}