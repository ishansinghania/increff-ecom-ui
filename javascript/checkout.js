$('.container').addClass('d-none');

$(document).ready(() => {
    const cartItems = localStorage.getItem(getCartKey()) ? JSON.parse(localStorage.getItem(getCartKey())) : [];

    const paymentInfo = {
        total: 0,
        gst: 0,
        subtotal: 0,
        productCount: 0,
    };

    // Getting all the products
    $.getJSON('/assets/available-inventory.json', (products) => {

        // Traversing through all the values of the cart
        $.each(cartItems, (i, cartItem) => {
            // Checking if the product id is still present in our inventory
            const product = products.find(value => value.id === cartItem.id);

            // Doing all the operations only if the product is present and the quantity is greater than 0
            if (product && cartItem?.quantity > 0) {
                const productEntry = $('.product').first().clone();

                // Adding the attributes and values of the product in the cloned element
                productEntry.find('img').attr('src', product?.image || '');
                productEntry.find('.product-brand').text(product?.brandName || '');
                productEntry.find('.product-name').text(product?.name || '');
                productEntry.find('.product-size').text(product?.size || '');
                productEntry.find('.product-mrp').text(product?.mrp || 0);
                productEntry.find('.product-quantity').text(cartItem?.quantity || 0);

                // Appnding the cloned element in the list
                $('#product-list').append(productEntry);

                // Calculating subtotal
                paymentInfo.subtotal += (product?.mrp || 0 * Number(cartItem?.quantity || 0));
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

        $('#place-order').click(() => {
            if (isUserLoggedIn()) downloadOrder(products, cartItems);
            else redirectToLogin();
            return;
        });

        // Showing the page when the page is completly loaded and filled with data.
        $('.container').removeClass('d-none');
    });

});

function downloadOrder(productsList, cartItems) {
    const fields = ["id", "brandName", "name", "clientSkuId", "size", "mrp"];

    // creating an array of products based on the fields.
    const products = cartItems.map(item => {
        const temp = {};
        const product = productsList.find(product => product.id === item.id);

        for (field of fields) temp[field] = product[field];

        temp.quantity = item.quantity;
        temp.subtotal = product.mrp * item.quantity;
        temp.gst = +(temp.subtotal * 0.14).toFixed(2);
        temp.total = +(temp.subtotal + temp.gst).toFixed(2);
        return temp;
    });

    // Sorting in ascending order
    products.sort((a, b) => a.id - b.id);

    // unparsing into csv
    const csv = Papa.unparse(products);

    // converting to a blob file
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
        csvURL = navigator.msSaveBlob(csvData, 'order.csv');
    } else {
        csvURL = window.URL.createObjectURL(csvData);
    }

    // creating a temporary element to mock a click and download the file.
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'order.csv');
    tempLink.click();
}
