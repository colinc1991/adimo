const Product = require('./product');

class ProductJSONFormat
{
    constructor(total_num_items, avg_price_of_items, products)
    {
        this.total_num_items = total_num_items; 
        this.avg_price_of_items = avg_price_of_items;
        this.products = products;
    }
}

module.exports = ProductJSONFormat;