$('.container').addClass('d-none');

$(document).ready(() => {
    $.getJSON('/assets/available-inventory.json', (products) => {
        $.each(products, function (i, product) {
            const entry = `
            <div class="d-flex flex-column justify-content-between mx-3 my-2 product-container border rounded shadow-sm cursor-pointer col-3" style="width: 210px;" 
                    id="`+ i + `">
                <div class="mx-auto">
                    <img class="img-fluid rounded img-thumbnail border-0" src="`+ product.image + `"
                        alt="Image not Available">
                </div>
                <div class="product-detail my-1 px-2 position-relative">
                    <div class="cart-section p-2" id="cart-section-`+ i + `">
                        <input class="small py-1 px-2" value="1" min="1" type="number" id="input`+ i + `">
                        <button class="btn btn-outline-primary btn-sm" id="btn`+ i + `">+ Add</button>
                    </div>
                    <div class="font-weight-bold">`+ product.brandName + `</div>
                    <small class="text-secondary">`+ product.name + `</small>
                    <div class="d-flex align-items-center">
                        <span>MRP:</span>&nbsp;
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
                'click': () => window.location.href = "/html/detail.html?id=" + (i + 1),
                'mouseenter': () => $('#cart-section-' + i).show(),
                'mouseleave': () => {
                    $('#cart-section-' + i).hide();
                    $('#input' + i).val('1')
                }
            })

            $('#btn' + i).bind('click', (event) => {
                const quantity = Number($('#input' + i).val());
                addToCart(product, quantity);
            })
        });
        $('.container').removeClass('d-none');
    });
    updateCartQuantity();
});
