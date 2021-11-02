const PORT = 8000; // Port we want to use
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

// Get the data
const url = 'https://www.theguardian.com/international';
axios(url)
  .then(response => {
    const html = response.data;

    // Let's get some elements using Cheerio package
    // The use of the dollar sign means that it represents all of the HTML
    const $ = cheerio.load(html);

    // Create empty array to keep all the articles
    const articles = [];

    // Let's pick an element
    // We are looking for an HTML element with the class name
    $('.fc-item__title', html).each(function() {
      const title = $(this).text(); // Grab text
      const url = $(this).find('a').attr('href'); // First, find a elements
                                                  // Then grab the href attribute
      articles.push({
        title,
        url
      })
    })

    console.log(articles);
  }).catch(err => console.log(err));

// Init express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))