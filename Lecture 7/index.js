const PORT = 8000; // Port we want to use
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

// Init express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))