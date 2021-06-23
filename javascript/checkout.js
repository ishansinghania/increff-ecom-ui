$('.container').addClass('d-none');

$(document).ready(() => {
    const cartItems = JSON.parse(localStorage.getItem(getCartKey()));

    const paymentInfo = {
        total: 0,
        gst: 0,
        subtotal: 0,
        productCount: 0,
    };

    // Traversing through all the values of the cart
    $.each(cartItems, (i, product) => {
        if (product.quantity) {
            const productEntry = $('.product').first().clone();

            // Adding the attributes and values of the product in the cloned element
            productEntry.find('img').attr('src', product?.image || '');
            productEntry.find('.product-brand').text(product?.brandName || '');
            productEntry.find('.product-name').text(product?.name || '');
            productEntry.find('.product-size').text(product?.size || '');
            productEntry.find('.product-mrp').text(product?.mrp || 0);
            productEntry.find('.product-quantity').text(product?.quantity || 0);

            // Appnding the cloned element in the list
            $('#product-list').append(productEntry);
    
            paymentInfo.subtotal += (product?.mrp || 0 * Number(product?.quantity || 0));
            paymentInfo.productCount += 1;
        }
    });

    // Removing the dummy element from the list
    $('#product-list').find('.product').first().remove();

    if (!paymentInfo.productCount) {
        $('#no-product').removeClass('d-none');
    }

    // Setting the total item value
    $('#total-items').text(paymentInfo.productCount);

    // Payment Calculation
    paymentInfo.gst = +(0.14 * paymentInfo.subtotal).toFixed(2);
    paymentInfo.total = (paymentInfo.subtotal + paymentInfo.gst).toFixed(2);

    // Adding the payment values in the view
    $('#subtotal').append(paymentInfo.subtotal);
    $('#gst').append(paymentInfo.gst);
    $('#total').append(paymentInfo.total);

    // Showing the page when the page is completly loaded and filled with data.
    $('.container').removeClass('d-none');

});

// function downloadOrder() {
//     var csv = Papa.unparse({
//         "fields": ["Column 1", "Column 2"],
//         "data": [
//             ["foo", "bar"],
//             ["abc", "def"]
//         ]
//     });

//     var tempLink = document.createElement('a');
//     tempLink.href = csvURL;
//     tempLink.setAttribute('download', 'order.csv');
//     tempLink.click();
// }
