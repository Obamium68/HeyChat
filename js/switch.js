
$(document).ready(function() {
    let signUpButton = document.getElementById('signUp');
    let signInButton = document.getElementById('signIn');
    let container = document.getElementById("abcd");;

    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
});