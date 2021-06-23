// Waiting fot the page to load first;
$('.container').addClass('d-none');

$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;

    $.getJSON('/assets/available-inventory.json', (products) => {
        const product = products.find(product => product.id === productId);

        // Validation if the product is not present in the list. Then redirecting to the list page.
        if (!product) {
            showError('Product with id '+ productId + ' not found');
            setTimeout(redirectToHome, 1500);
            return;
        }

        // Adding images in the carousel.
        $.each(product.images, (i, image) => {
            const carouselItem = $('.carousel-inner').find('.carousel-item').first().clone();
            carouselItem.find('img').attr('src', image);

            // Adding active class to the fist element to start the carousel. Without it, the carousel won't work
            if (i === 0) carouselItem.addClass('active');
            $('.carousel-inner').append(carouselItem);
        });

        // To remove the dummy img tag.
        $('.carousel-inner').find('.carousel-item').first().remove();

        // Adding the product detials in the page.
        $('#product-brand').text(product?.brandName || '');
        $('#product-name').text(product?.name || '');
        $('#mrp').text(product?.mrp || 0);
        $('.size').text(product?.size || '');
        $('#description').text(product?.description || '');
        $('#material').text(product?.material || '');
        $('#care').text(product?.care || '');

        // To add product along with the quantity in the cart.
        $('form').on('submit', (event) => {
            const quantity = Number($('#quantity').val());
            addToCart(product.id, quantity);
            return false;
        });

        // Showing the page when the page is completly loaded and filled with data.
        $('.container').removeClass('d-none');
    });
});
