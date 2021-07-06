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

    // Empty the table
    $('tbody').empty();

    // Parsing the data
    const tableBody = $('tbody');
    data.every((entry, index) => {
        return this.sanitizeRow(entry, index, tableBody);
    });

    // Showing the table
    $('#table-container').removeClass('d-none');
}

function sanitizeRow(row, index, tableBody) {
    const fields = ['id', 'brandName', 'name', 'clientSkuId', 'size', 'quantity', 'mrp', 'subtotal', 'gst', 'total'];

    // Sanity checks
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
        // Creating the table row and filling the data
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
