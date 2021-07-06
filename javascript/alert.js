function showToaster(message, heading, type = 'danger' || 'success') {
    const toaster = `
        <div class="toast m-2 ml-auto  `+ type + `" role="alert" data-delay="5000">
            <div class="toast-header border-bottom">
                <strong class="mr-auto">`+ heading + `</strong>
                <button type="button" class="ml-2 close" data-dismiss="toast">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                `+ message + `
            </div>
        </div>`;

    // Attaching the message toasts dynamically
    $('.toast-container').append(toaster);

    // Remove the autohide functionality of the toasts for danger type toasts
    if (type === 'danger') $('.toast.danger').attr('data-autohide', false);

    $('.toast').toast('show');
}

// Tp show success toasts
function showSuccess(message = "Success message", heading = "Success",) {
    $('.toast').remove();
    this.showToaster(message, heading, 'success');
}

// To show error toasts
function showError(message = "Error message", heading = "Error") {
    $('.toast').remove();
    this.showToaster(message, heading, 'danger');
}
