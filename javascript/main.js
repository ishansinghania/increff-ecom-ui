$(document).ready(function () {
    const user = localStorage.getItem('user');
    if (!user) window.location.href = '/html/login.html';

    $("#loader").hide();

    $(document).bind("ajaxSend", function () {
        $("#loader").show();
    }).bind("ajaxComplete", function () {
        $("#loader").hide();
    });
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/html/login.html';
}

