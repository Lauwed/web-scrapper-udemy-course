const PORT = 8000; // Port we want to use
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

function scrapeData(url, itemProductCssSelector, itemProductInfosCssSelector, itemProductTitleCssSelector, itemProductImageCssSelector, itemProductPriceCssSelector) {
  const obj = {};
  return axios(url)
    .then(response => {
      const html = response.data;

      // Let's get some elements using Cheerio package
      // The use of the dollar sign means that it represents all of the HTML
      const $ = cheerio.load(html);

      // Sum of all the prices for average of the price
      let sumOfPrices = 0;
      let countOfProducts = 0;

      // Create empty array for products
      obj.products = [];

      // Let's pick an element
      // We are looking for an HTML element with the class name
      $(itemProductCssSelector, html).each(function () {
        const infos = $(this).find(itemProductInfosCssSelector);

        const img = $(this).find(itemProductImageCssSelector).attr('src');
        const title = infos.find(itemProductTitleCssSelector).text()
        const price = infos.find(itemProductPriceCssSelector).text().trim();

        // Add the product to the array
        obj.products.push({
          img,
          title,
          price
        })

        sumOfPrices += price.includes('$') ? parseInt(price.replace('$', '')) : parseInt(price.replace('€', ''));
        countOfProducts++;
      })

      const average = sumOfPrices / countOfProducts;
      obj.average = average;
      obj.count = countOfProducts;

      return obj
    });
}

// Init express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

// Creating the API end point
// GET method and accessible a localhost:8000/api
app.get('/api/', async (req, res) => {
  /* GIRLFRIEND COLLECTIVE DATA */
  const girlfriendCollectiveUrl = 'https://girlfriend.com/collections/sweatshirts?colors=&size=';
  const girlfriendCollectiveData = await scrapeData(girlfriendCollectiveUrl, '.content-start .group.relative', 'h3', '.pr-3', 'img', '.text-right.text-gray-600').then(response => response);

  /* ORGANIC BASIC DATA */
  const organicBasicsUrl = 'https://organicbasics.com/collections/all-womens-products?filter=sweaters';
  const organicBasicsData = await scrapeData(organicBasicsUrl, '.product-grid-item-container[data-tags*=Sweater]', '.product__grid--text-container', 'a', 'img', '.product-price').then(response => response);

  return res.send({ girlfriendCollectiveData, organicBasicsData });
});