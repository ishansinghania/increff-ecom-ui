$('.container').addClass('d-none');

$(document).ready(function () {
    if (isUserLoggedIn()) redirectToHome();

    // Hiding the loader once the document is ready.
    $("#loader").hide();
    $('.container').removeClass('d-none');
});

$('form').on('submit', function (event) {
    event.preventDefault();

    const email = $('input#email').val();
    const password = $('input#password').val();

    if (!isUserLoggedIn())
        $.getJSON('/assets/users.json', (users) => {
            const user = users.filter(user => email === user.email && password === user.password);
            if (user?.length) {
                $('#error-message').addClass('d-none');
                setUser(user);
                showSuccess('Logged in successfully');

            } else {
                $('#error-message').removeClass('d-none');
            }
        });
    else {
        showError('User already logged in!');
        setTimeout(redirectToHome, 1500);
    }
});

function setUser(user) {
    localStorage.setItem(getUserKey(), JSON.stringify(user));
    window.location.href = "/";
}

function isUserLoggedIn() {
    const user = localStorage.getItem(getUserKey());
    return !!user;
}

function redirectToHome() {
    window.location.href = '/';
}

function getUserKey() {
    return 'user';
}
