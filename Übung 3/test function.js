function calculateFinalPrice(basePrice, discount, quantity, taxRate) {
    let subtotal = basePrice * quantity;
    let totalWithDiscount = subtotal * (1 - discount);
    let tax = totalWithDiscount * taxRate;
    let finalPrice = totalWithDiscount + tax;
    return finalPrice;
}

console.log(calculateFinalPrice(7, 0.1, 9, 0.2))
