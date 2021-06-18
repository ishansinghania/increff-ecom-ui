$('form').on('submit', function (event) {
    event.preventDefault();

    const email = $('input#email').val();
    const password = $('input#password').val();

    $.getJSON('/assets/users.json', (users) => {
        const user = users.find(user => email === user.email);
        if (!user || user.password !== password) {
            $('#error-message').removeClass('d-none');
        } else {
            $('#error-message').addClass('d-none');
            setUser(user);
        }
    })

    function setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href="/html/list.html";
    }
});