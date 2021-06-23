$('.container').addClass('d-none');

$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    $.getJSON('/assets/available-inventory.json', (products) => {
        const product = products.find(product => product.id === productId);
        if (!product) {
            showError('Product with id '+ productId + ' not found');
            setTimeout(redirectToHome, 1500);
            return;
        }

        $.each(product.images, (i, image) => {
            const entry = `
            <img src="`+ image + `"
                alt="Image not available" class="w-100 h-100 col-6 py-3">`;
            $('.image-list').append(entry);
        });

        $('#product-brand').text(product?.brandName || '');
        $('#product-name').text(product?.name || '');
        $('#mrp').text(product?.mrp || 0);
        $('.size').text(product?.size || '');
        $('#description').text(product?.description || '');
        $('#material').text(product?.material || '');
        $('#care').text(product?.care || '');

        
        $('form').on('submit', (event) => {
            const quantity = Number($('#quantity').val());
            addToCart(product, quantity);
            return false;
        });
        $('.container').removeClass('d-none');
    });
});
