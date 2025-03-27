function showForgotPassword() {
    const loginContainer = document.getElementById('login-container');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');
    
    // Esconde o container de login e mostra o de redefinição de senha
    loginContainer.classList.remove('active');
    forgotPasswordContainer.classList.add('active');
}

function backToLogin() {
    const loginContainer = document.getElementById('login-container');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');
    
    // Esconde o container de redefinição de senha e mostra o de login
    forgotPasswordContainer.classList.remove('active');
    loginContainer.classList.add('active');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "TennisHall@gmail.com.br" && password === "35342932") {
        alert("Login bem-sucedido!");
        // Redirecionamento fictício
        window.location.href = "main.html";
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function resetPassword() {
    const resetUsername = document.getElementById('reset-username').value;
    const newPassword = document.getElementById('new-password').value;

    if (resetUsername === "user@example.com") {
        alert("Senha redefinida com sucesso!");
        backToLogin();
    } else {
        alert("Email incorreto! Por favor, tente novamente.");
    }
}
