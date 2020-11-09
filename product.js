class Product
{
    constructor(title, imageURL, price, hasDiscount, discountAmount)
    {
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.hasDiscount = hasDiscount;
        this.discountAmount = discountAmount;
    }
}

module.exports = Product;