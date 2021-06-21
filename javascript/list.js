$(document).ready(() => {
    $.getJSON('/assets/available-inventory.json', (products) => {
        $.each(products, function (i, product) {
            const entry = `
            <div class="d-flex flex-column justify-content-between mx-3 my-2 product-container border rounded shadow-sm" style="width: 210px;" 
                    id="`+ i + `">
                <div class="mx-auto">
                    <img class="img-fluid rounded img-thumbnail border-0" src="`+ product.image + `"
                        alt="Image not Available">
                </div>
                <div class="product-detail my-1 px-2 position-relative">
                    <div class="cart-section p-2" id="cart-section-`+ i + `">
                        <input class="small py-1 px-2" value="1" type="number" id="input`+ i + `">
                        <button class="btn btn-outline-primary btn-sm" id="btn`+ i + `">+ Add</button>
                    </div>
                    <div class="font-weight-bold">`+ product.brandName + `</div>
                    <small class="text-secondary">`+ product.name + `</small>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="small">
                            <span class="text-muted pr-1">Size:</span>
                            <span class="font-weight-light text-dark">`+ product.size + `</span>
                        </div>
                        <div class="d-flex align-items-center font-weight-bold">
                            <i class="fas fa-rupee-sign fa-xs pr-1"></i>
                            <span>`+ product.mrp + `</span>
                        </div>
                    </div>
                </div>
            </div>`;

            $('#list-container').append(entry);

            $('.cart-section').hide();
            $('.cart-section').click((event) => event.stopImmediatePropagation());

            $('#' + i).on({
                'click': () => window.location.href = "/html/detail.html?id=" + i,
                'mouseenter': () => $('#cart-section-' + i).show(),
                'mouseleave': () => {
                    $('#cart-section-' + i).hide();
                    $('#input' + i).val('1')
                }
            })

            $('#btn' + i).bind('click', (event) => {
                const quantity = parseInt($('#input' + i).val());
                addToCart(product, quantity);
                updateCartQuantity();
            })
        });
    })
    updateCartQuantity();
});

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

function updateCartQuantity() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const quantity = cartItems.reduce((accr, curr) => accr += curr.quantity, 0);

    $('.cart-quantity').text(quantity);
}