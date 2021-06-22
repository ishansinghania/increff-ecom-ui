$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    $.getJSON('/assets/available-inventory.json', (products) => {
        const product = products.find(product => product.id === productId);

        $.each(product.images, (i, image) => {
            const entry = `
            <img src="`+ image + `"
                alt="Image not available" class="w-100 h-100 col-6 py-3">`;
            $('.image-list').append(entry);
        });

        $('#product-brand').text(product.brandName);
        $('#product-name').text(product.name);
        $('#mrp').text(product.mrp);
        $('.size').text(product.size);
        $('#description').text(product.description);
        $('#material').text(product.material);
        $('#care').text(product.care);

        $('form').on('submit', (event) => {
            event.preventDefault();
    
            const quantity = parseInt($('#quantity').val());
            addToCart(product, quantity);
            updateCartQuantity();

            showSuccess(void 0, 'Product added successfully');
        });
    });
});