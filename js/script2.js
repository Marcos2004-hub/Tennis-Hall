document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("logo");
    const title = document.getElementById("site-title");
    const logoContainer = document.getElementById("logo-container");

    function adjustLayout() {
        const windowWidth = window.innerWidth;
        logo.style.maxWidth = windowWidth > 600 ? "80px" : "50px";
        title.style.fontSize = windowWidth > 600 ? "1.8rem" : "1.2rem";

        const containerHeight = logoContainer.offsetHeight;
        logoContainer.style.lineHeight = `${containerHeight}px`;
    }

    adjustLayout();
    window.addEventListener("resize", adjustLayout);

    // Corrigir redirecionamento para "finanças"
    const botaoFinancas = document.querySelector(".nav-button[href='#finanças']");
    if (botaoFinancas) {
        botaoFinancas.addEventListener("click", function (event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            window.location.href = "finanças.html"; // Redireciona para a página finanças.html
        });
    }

    // Manter o redirecionamento para "alunos"
    const botaoAlunos = document.querySelector(".nav-button[href='alunos.html']");
    if (botaoAlunos) {
        botaoAlunos.addEventListener("click", function (event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            window.location.href = "alunos.html"; // Redireciona para o novo HTML
        });
    }
});
