$('.container').addClass('d-none');

$(document).ready(() => {
    $.getJSON('/assets/available-inventory.json', (products) => {
        const element = $('.product-container').first();

        $.each(products, function (i, product) {
            // Cloning the first element to fill the product data inside it's elements
            const clone = element.clone();

            // Adding attributes and text in the child elements
            clone.attr('id', i);
            clone.find('img').attr('src', product?.image);
            clone.find('.cart-section').attr('id', 'cart-section-' + i);
            clone.find('input').attr('id', 'input' + i);
            clone.find('button').attr('id', 'btn' + i);

            clone.find('.product-brand').text(product?.brandName);
            clone.find('.product-name').text(product?.name);
            clone.find('.product-size').text(product?.size);
            clone.find('.product-mrp').text(product?.mrp);

            // Appending the cloned element in the container
            $('#list-container').append(clone);

            // Hiding the cart popup initially
            $('.cart-section').hide().click((event) => event.stopImmediatePropagation());

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
                addToCart(product.id, quantity);
            })
        });

        // Removing the first dummy element from the product container.
        element.remove();

        // Showing the container once the list is populated.
        $('.container').removeClass('d-none');
    });
});
