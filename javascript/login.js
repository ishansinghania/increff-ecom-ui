$('.container').addClass('d-none');

$(document).ready(function () {
    // Redirecting to home if user is already logged in
    if (isUserLoggedIn()) redirectToHome();

    // Hiding the loader once the document is ready.
    $("#loader").hide();
    $('.container').removeClass('d-none');
});

$('form').on('submit', function (event) {
    const email = $('input#email').val();
    const password = $('input#password').val();

    if (!isUserLoggedIn()) // This is for multiple login safe check
        $.getJSON('/assets/users.json', (users) => {
            const user = users.filter(user => email === user.email && password === user.password);
            // Setting user in localstorage

            if (user?.length) {
                $('#error-message').addClass('d-none');
                setUser(user);
                showSuccess('Logged in successfully');

            } else {
                // Showing error message in case of wrong user id or password
                $('#error-message').removeClass('d-none');
            }
        });
    else {
        // Multiple login error message
        showError('User already logged in!');
        setTimeout(redirectToHome, 1500);
    }
    return false;
});

// To set user in the localstorage
function setUser(user) {
    localStorage.setItem(getUserKey(), JSON.stringify(user));
    window.location.href = "/";
}

// checking if the user is logged in or not
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
