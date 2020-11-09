const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const Product = require("./product");
const ProductJSONFormat = require("./productJSONFormat");

  // this function instantiates and returns the relevant Product object depending on whether there's a discount
function CreateProduct(hasDiscount, productTitle, imageURL, itemPrice, hasDiscount, oldPrice)
{
  // if the current product has a discount, instantiate a Product object with the relevant saving
  if (hasDiscount == true)
  {
    return (product = new Product(productTitle, imageURL, itemPrice, hasDiscount, oldPrice - itemPrice));
  }

  // otherwise instantiate a Product object with no saving
  else
  {
    return (product = new Product(productTitle, imageURL, itemPrice, hasDiscount, 0));
  }
}

// this function takes in the old price and the current price of the product
// sets the hasDiscount variable to true if a discount is found
function DetermineDiscount(oldPrice, itemPrice, hasDiscount)
{
  // if the oldPrice variable is NaN,
  // there was no oldPrice class found for this product
  if (!isNaN(oldPrice))
  {
    if (itemPrice < oldPrice)
    {
      return true;
    }
  }
}

// this function takes the JSON formatted string and outputs it to a file called output.json
function OutputToJSONFile(productJSONFormat)
{
  //Create and write to file
  fs.writeFile(path.join(__dirname, "/", "output.json"), productJSONFormat, (err) =>
  {
    if (err) throw err;
    console.log("File created at: " + path.join(__dirname, "/", "output.json"));
  });
}

request("https://cdn.adimo.co/clients/Adimo/test/index.html", function (error, response, body) 
{
  // Print the error if one occurred
  if (error)
  {
    console.error("error: ", error);
  }

  const $ = cheerio.load(body);
  const webPath = "https://cdn.adimo.co/clients/Adimo/test/";
  var numItems = 0;
  var totalPrice = 0;
  var itemPrice = 0;
  var imageURL = "";
  var productTitle = "";
  var hasDiscount = false;
  var oldPrice = 0;
  var products = [];

  // iterate over all divs with the class of "item"
  $("div.item").each(function (i, elem)
  {
    numItems++;
    itemPrice = parseFloat($(elem).children(".price").text().substring(1));
    oldPrice = parseFloat($(elem).children(".oldPrice").text().substring(1));
    totalPrice += itemPrice;
    imageURL = webPath + $(elem).children("img").attr("src");
    productTitle = $(elem).children("h1").text();

    if (DetermineDiscount(oldPrice, itemPrice, hasDiscount) == true)
    {
      hasDiscount = true;
    }

    CreateProduct(hasDiscount, productTitle, imageURL, itemPrice, hasDiscount, oldPrice);

    // add the current product object to products array
    products[i] = product;

    // reset hasDiscount for next iteration
    hasDiscount = false;
  });

  const productJSONFormat = new ProductJSONFormat(numItems, totalPrice / numItems, products);

  // output the result to output.json
  OutputToJSONFile(JSON.stringify(productJSONFormat, null, "\t"));
});