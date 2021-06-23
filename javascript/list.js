$('.container').addClass('d-none');

$(document).ready(() => {
    $.getJSON('/assets/available-inventory.json', (products) => {
        $.each(products, function (i, product) {
            // Cloning the first element to fill the product data inside it's elements
            const productElement = $('.product-container').first().clone();

            // Adding attributes and text in the child elements
            productElement.attr('id', i);
            productElement.find('img').attr('src', product?.image);
            productElement.find('.cart-section').attr('id', 'cart-section-' + i);
            productElement.find('input').attr('id', 'input' + i);
            productElement.find('button').attr('id', 'btn' + i);

            productElement.find('.product-brand').text(product?.brandName);
            productElement.find('.product-name').text(product?.name);
            productElement.find('.product-size').text(product?.size);
            productElement.find('.product-mrp').text(product?.mrp);

            // Appending the cloned element in the container
            $('#list-container').append(productElement);

            // Hiding the cart popup initially
            $('.cart-section').hide();

            // Stopping the event bubble
            $('.cart-section').click((event) => event.stopImmediatePropagation());

            // Attaching the event handlers to various mouse and click events on the product
            $('#' + i).on({
                'click': () => window.location.href = "/html/detail.html?id=" + (i + 1),
                'mouseenter': () => $('#cart-section-' + i).show(),
                'mouseleave': () => {
                    $('#cart-section-' + i).hide();
                    $('#input' + i).val('1')
                }
            })

            // To add the product in the cart.
            $('#btn' + i).bind('click', (event) => {
                const quantity = Number($('#input' + i).val());
                addToCart(product, quantity);
            })
        });

        // Removing the first dummy element from the product container.
        $('#list-container').find('.product-container').first().remove();

        // Showing the container once the list is populated.
        $('.container').removeClass('d-none');
    });
});
