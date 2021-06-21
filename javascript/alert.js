function showSuccess(heading, message) {
    $('#toast .toast-header .heading').text(heading);
    $('#toast .toast-body').text(message);

    $('.toast').toast('show');
}