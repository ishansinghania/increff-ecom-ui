$(document).ready(() => {
    $('button').click(() => $('input[type=file]').click());

    $('input[type=file]').on('change', function () {
        if(!checkSession()) return;

        const file = this.files[0];

        if (file) $("#loader").show();

        $(this).parse({
            config: {
                complete: function(results, file) {
                    console.log("This file done:", file, results);
                    parseFile(results.data);
                },
                error: function(err, file, inputElem, reason)
                {
                    // executed if an error occurs while loading the file,
                    // or if before callback aborted for some reason
                    showError(reason);
                    $("#loader").hide();
                },
            },
            complete: () => {
                $("#loader").hide();

                // Clearing the input.
                $(this).val(null);
            },
        });
      });
});

function parseFile(data) {
    if (!data.length) {
        showError('Empty file');
        return;
    }

    const row = $('tbody').find('tr').first().empty().removeClass('d-none');

    // Empty the table
    $('tbody').empty();
    $('thead').empty();

    const fields = data[0];
    const products = data.slice(1);

    const tableBody = $('tbody');

    $.each(fields, (i, field) => {
        $('thead').append(`<th>`+field+`</th>`);
    })

    $.each(products, (i, product) => {
        const entry = row.clone();

        // Adding only if the product has an id
        if (product?.length && product[0]) {
            product.map(value => entry.append(`<td>`+value+`</td>`));
            tableBody.append(entry);
        }
    });
    row.remove();

    $('#table-container').removeClass('d-none');
    showSuccess('File uploaded successfully');
}