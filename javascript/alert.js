function showToaster(heading, message, type = 'danger' || 'success') {
    const toaster = `
        <div class="toast m-2 ml-auto  `+ type +`" role="alert" data-delay="1000">
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

    $('.toast-container').append(toaster);
    $('.toast').toast('show');
    $('.toast').on('hidden.bs.toast', function () {
        $(this).remove();
    });
}

function showSuccess(heading = "Success", message = "Success message") {
    this.showToaster(heading, message, 'success');
}

function showErrorToast(heading = "Error", message = "Error message") {
    this.showToaster(heading, message, 'danger');
}
