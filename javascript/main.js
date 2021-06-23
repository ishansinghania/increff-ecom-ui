// To subscribe to the ajax requests even before the document is ready.
$(document)
    .bind("ajaxSend", () => $("#loader").show())
    .bind("ajaxComplete", () => $("#loader").hide())
    .bind("ajaxError", () => $("#loader").hide());

$(document).ready(function () {
    if (!isUserLoggedIn()) redirectToLogin();

    // Hiding the loader once the document is ready.
    $("#loader").hide();
    updateCartQuantity();
});

function addToCart(product, quantity) {
    if (!isUserLoggedIn()) {
        showError('User not logged in');
        setTimeout(redirectToLogin, 1500);
        return;
    }

    if (quantity < 1) {
        showError('Quantity should be atleast 1');
        return;
    }

    const productCopy = { ...product }; // Creating a new object to avoid changing of original product object
    const cartItems = JSON.parse(localStorage.getItem(getCartKey())) || [];

    if (cartItems.length) {
        const index = cartItems.findIndex(item => item.id === productCopy.id);
        if (index >= 0) {
            cartItems[index].quantity += quantity;
            localStorage.setItem(getCartKey(), JSON.stringify(cartItems));

            updateCartQuantity();
            showSuccess('Product added successfully');
            return;
        }
    }
    productCopy['quantity'] = quantity;
    cartItems.push(productCopy);
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));

    updateCartQuantity();
    showSuccess('Product added successfully');
}

function updateCartQuantity() {
    const cartItems = JSON.parse(localStorage.getItem(getCartKey())) || [];
    const productQuantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(productQuantity);
}

function logout() {
    localStorage.removeItem(getUserKey());
    redirectToLogin();
}

function getUserKey() {
    return 'user';
}

function getCartKey() {
    return 'cart_items';
}

function isUserLoggedIn() {
    const user = localStorage.getItem(getUserKey());
    return !!user;
}

function redirectToLogin() {
    window.location.href = '/html/login.html';
}

function redirectToHome() {
    window.location.href = '/';
}
