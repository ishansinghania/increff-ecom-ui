// To subscribe to the ajax requests even before the document is ready.
$(document)
    .bind("ajaxSend", () => $("#loader").show())
    .bind("ajaxComplete", () => $("#loader").hide())
    .bind("ajaxError", () => $("#loader").hide());

$(document).ready(function () {
    if (!isUserLoggedIn()) redirectToLogin();

    // Hiding the loader once the document is ready.
    $("#loader").hide();

    // Initializing the cart quantity in the ui.
    updateCartQuantity();

    // Automatically update the date time in the footer every second
    setInterval(setDateTime, 1000);

    // Initializing the tooltip. Required for the tooltip to work
    $('[data-tooltip="tooltip"]').tooltip();
    setLoggedInUser();
});

function getUserKey() {
    return 'user';
}

function getCartKey() {
    return 'cart_items';
}

function getUser() {
    try {
        const user = JSON.parse(localStorage.getItem(getUserKey()));
        return user[0];
    } catch (err) {
        return void 0;
    }
}

function setLoggedInUser() {
    const user = getUser();
    $('#user-name').text(user.name).removeClass('d-none');
}

function isUserLoggedIn() {
    const user = getUser();
    return !!user;
}

function checkSession() {
    if (!isUserLoggedIn()) {
        showError('User not logged in');
        setTimeout(redirectToLogin, 1500);
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem(getUserKey());
    redirectToLogin();
}


function redirectToLogin() {
    window.location.href = '/html/login.html';
}

function redirectToHome() {
    window.location.href = '/';
}

// To set the current date-time
function setDateTime() {
    $('#date-time')
        .text(new Date().toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            year: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }));
}

function setCartItems(items) {
    const cartMap = getCartMap();
    const user = getUser();

    cartMap[user.id] = items;
    localStorage.setItem(getCartKey(), JSON.stringify(cartMap));
}

// returning the cart map or an empty map if lcoalstorage is empty
function getCartMap() {
    try {
        return JSON.parse(localStorage.getItem(getCartKey())) || {};
    } catch (err) { return {}; }
}

function getCartItems() {
    try {
        const itemMap = getCartMap();
        const user = getUser();
        return itemMap.hasOwnProperty(user.id) ? itemMap[user.id] : [];
    } catch (err) {
        return [];
    }
}

function updateCartQuantity() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(totalQuantity);
}

function addToCart(productId, quantity) {
    // Validation if user is not logged in then redirect to login
    if (!checkSession()) return;

    if (quantity < 1) {
        showError('Quantity should be atleast 1');
        return;
    }

    const cartItems = getCartItems();

    // Finding and adding the product if it exists in the cart.
    if (cartItems.length) {
        const index = cartItems.findIndex(item => item.id === productId);
        if (index >= 0) {
            cartItems[index].quantity += quantity;
            setCartItems(cartItems);

            updateCartQuantity();
            showSuccess('Product added successfully');
            return;
        }
    }
    // Adding in the cart if the product is not found in the cart
    cartItems.push({
        id: productId,
        quantity
    });
    setCartItems(cartItems);
    // localStorage.setItem(getCartKey(), JSON.stringify(cartItems));

    updateCartQuantity();
    showSuccess('Product added successfully');
}
