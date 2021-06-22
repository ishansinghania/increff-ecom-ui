$(document).ready(function () {
    // Hiding the loader once the document is ready.
    $("#loader").hide();
});

$('form').on('submit', function (event) {
    event.preventDefault();

    const email = $('input#email').val();
    const password = $('input#password').val();

    $.getJSON('/assets/users.json', (users) => {
        const user = users.filter(user => email === user.email && password === user.password);
        if (user && user.length > 0) {
            $('#error-message').addClass('d-none');
            setUser(user);
            showSuccess(void 0, 'Logged in successfully');

        } else {
            $('#error-message').removeClass('d-none');
        }
    });
});

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = "/";
}
