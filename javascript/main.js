$(document).ready(function () {
    const user = localStorage.getItem('user');
    if (!user) window.location.href = '/html/login.html';

    $("#loader").hide();

    $(document).bind("ajaxSend", function () {
        $("#loader").show();
    }).bind("ajaxComplete", function () {
        $("#loader").hide();
    });

    updateCartQuantity();
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/html/login.html';
}

function updateCartQuantity() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const quantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(quantity);
}

function addToCart(product, quantity) {
    const productCopy = { ...product }; // Creating a new object to avoid changing of original product object
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartItems.length) {
        const index = cartItems.findIndex(item => item.id === productCopy.id);
        if (index >= 0) {
            cartItems[index].quantity += quantity;
        } else {
            productCopy['quantity'] = quantity;
            cartItems.push(productCopy);
        }
    } else {
        productCopy['quantity'] = quantity;
        cartItems.push(productCopy);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
