$(document).ready(() => {
    $('button').click(() => $('input[type=file]').click());

    $('input[type=file]').on('change', function () {
        if(!checkSession()) return;

        const file = this.files[0];

        if (file) $("#loader").show();

        $(this).parse({
            config: {
                dynamicTyping: true,
                skipEmptyLines: true,
                header: true,
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
    $('#table-container').addClass('d-none');

    if (!data?.length) {
        showError('Empty file');
        return;
    }

    // const row = $('tbody').find('tr').first().empty().removeClass('d-none');

    // Empty the table
    $('tbody').empty();
    // $('thead').empty();

    // const fields = data[0];
    // const products = data.slice(1);

    const tableBody = $('tbody');

    // $.each(fields, (i, field) => {
    //     $('thead').append(`<th>`+field+`</th>`);
    // })

    data.every((entry, index) => {
        return this.sanitizeRow(entry, index, tableBody);
    });

    // $.each(products, (i, product) => {
    //     const entry = row.clone();

    //     // Adding only if the product has an id
    //     if (product?.length && product[0]) {
    //         product.map(value => entry.append(`<td>`+value+`</td>`));
    //         tableBody.append(entry);
    //     }
    // });
    // row.remove();

    $('#table-container').removeClass('d-none');
    // showSuccess('File uploaded successfully');
}

function sanitizeRow(row, index, tableBody) {
    const fields = ['id', 'brandName', 'name', 'clientSkuId', 'size', 'quantity', 'mrp', 'subtotal', 'gst', 'total'];

    if (fields.length !== Object.keys(row)?.length) {
        showError('Some columns are missing');
        return false;
    } else if(!row?.id || row?.id < 0) {
        showError(`ID should be greater than 0 at row index ${index + 1}`);
        return false;
    } else if(!row?.quantity) {
        showError(`Quantity should be atleast 1 at row index ${index + 1}`);
        return false
    } else {
        const tr = $('<tr></tr>');
        for (let field of fields) {
            if (row[field] === null || row[field] === void 0) {
                showError(`Some columns values missing at row index ${index + 1}`);
                return false;
            }
            const td = $('<td></td>').text(row[field]);
            tr.append(td);
        }
        tableBody.append(tr);
        return true;
    }
}
