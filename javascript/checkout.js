$('.container').addClass('d-none');

$(document).ready(() => {
    const cartItems = JSON.parse(localStorage.getItem(getCartKey()));

    const paymentInfo = {
        mrp: 0,
        gst: 0,
        subtotal: 0,
        totalProducts: 0,
    };

    $.each(cartItems, (i, product) => {
        if (product.quantity) {
            const entry = `
            <div class="row m-0 p-2 border-bottom">
                <img class="img-fluid rounded img-thumbnail border-0"
                    src="`+ product.image + `"
                    alt="Image not Available" style="height: 10rem;">
                <div class="col py-2 d-flex justify-content-between mr-auto flex-wrap">
                    <div>
                        <h5 class="font-weight-bold">`+ product.brandName + `</h5>
                        <div class="text-secondary">`+ product.name + `</div>
                        <div>
                            <span class="text-secondary">Size:</span>&nbsp;
                            <span class="font-weight-bold">`+ product.size + `</span>
                        </div>
                    </div>
                    <div class="justify-items-end">
                        <div class="d-flex align-items-center justify-content-end font-weight-bold mb-2">
                            <i class="fas fa-rupee-sign fa-xs pr-1"></i>
                            <span>`+ product.mrp + `</span>
                        </div>
                        <div>
                            <span class="text-secondary">Quantity:</span>&nbsp;
                            <span>`+ product.quantity + `</span>
                        </div>
                    </div>
                </div>
            </div>`;
            $('#product-list').append(entry);
    
            paymentInfo.mrp += (product.mrp * Number(product.quantity));
            paymentInfo.totalProducts += 1;
        }
    });
    if (!paymentInfo.totalProducts) {
        $('#product-list').after('<h5 class="m-2">Add more products to place an order</h5>');
    }
    $('#total-items').text(paymentInfo.totalProducts);

    // Payment Calculation
    paymentInfo.gst = +(0.14 * paymentInfo.mrp).toFixed(2);
    paymentInfo.subtotal = paymentInfo.mrp + paymentInfo.gst;

    $('#mrp').append(paymentInfo.mrp);
    $('#gst').append(paymentInfo.gst);
    $('#subtotal').append(paymentInfo.subtotal);

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
