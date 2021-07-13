$(document).ready(() => {
    $('button').click(() => $('input[type=file]').click());

    $('input[type=file]').on('change', function () {
        if (!checkSession()) return;

        const file = this.files[0];
        const errorList = [];

        if (file) $("#loader").show();
        $(this).parse({
            config: {
                dynamicTyping: true,
                skipEmptyLines: true,
                header: true,
                complete: function (results, file) {
                    parseFile(results.data, results.meta.fields, errorList, $(this));
                },
                error: function (err, file, inputElem, reason) {
                    // executed if an error occurs while loading the file,
                    // or if before callback aborted for some reason
                    errorList.push(reason);
                    stopParsing(errorList, $(this));
                },
            },
            complete: () => {
                stopParsing(errorList, $(this));
            },
        });
    });
});

function parseFile(uploadData, fieldList, errorList, file) {
    $('#table-container').addClass('d-none');
    $('#error-list').addClass('d-none');

    const uploadMap = {
        id: 0,
        brandName: "",
        name: "",
        clientSkuId: 0,
        size: "",
        quantity: 0,
        mrp: 0,
        subtotal: 0,
        gst: 0,
        total: 0,
    };

    const fields = Object.keys(uploadMap);
    let hasAllKeys = true;

    fieldList.forEach((field) => {
        if (!uploadMap.hasOwnProperty(field)) {
            errorList.push(`Extra column ${field} in the table`);
            hasAllKeys = false;
        }
    });

    // If extra columns are found, stop the parsing and show the errors
    if (!hasAllKeys) {
        // stopParsing(errorList, file);
        return;
    }

    if (!uploadData?.length) {
        errorList.push('Empty File');
        // stopParsing(errorList, file);
        return;
    }

    // Empty the table
    $('tbody').empty();

    // Parsing the data
    const tableBody = $('tbody');
    uploadData.forEach((entry, index) => {
        sanitizeRow(entry, index, tableBody, fields, errorList, uploadMap);
    });

    // Showing the table
    $('#table-container').removeClass('d-none');
}

function sanitizeRow(row, index, tableBody, fields, errorList, uploadMap) {

    let hasError = false;

    // Sanity checks
    if (fields.length !== Object.keys(row)?.length) {
        hasError = true;
        errorList.push('Some columns are missing');
    }
    if (!row?.id || row?.id < 0) {
        hasError = true;
        errorList.push(`ID should be greater than 0 at row index ${index + 1}`);
    }
    if (!row?.quantity || row?.quantity <= 0) {
        hasError = true;
        errorList.push(`Quantity should be atleast 1 at row index ${index + 1}`);
    }

    const tr = $('<tr></tr>');
    for (let field of fields) {
        // Checking for empty fields
        if (row[field] === null || row[field] === void 0) {
            hasError = true;
            errorList.push(`${field} value missing at row index ${index + 1}`);
        }

        if (typeof row[field] !== typeof uploadMap[field]) {
            hasError = true;
            errorList.push(`Expected ${typeof uploadMap[field]} for ${field} but got ${typeof row[field]} at row index ${index + 1}`)
        }
        const td = $('<td></td>').text(row[field]);
        tr.append(td);
    }
    if (!hasError) tableBody.append(tr);
}

function stopParsing(errorList, file) {
    if (errorList?.length) {
        const errorSection = $('#error-list');
        errorList.forEach(error => errorSection.append(`<span>${error}</span>`));
        errorSection.removeClass('d-none');
    }

    // Clearing the input.
    file.val(null);

    // Hiding loader
    $("#loader").hide();
}
