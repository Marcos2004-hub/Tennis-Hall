document.addEventListener("DOMContentLoaded", function () {
    const tabelaAlunos = document.querySelector("#tabela-alunos tbody");
    const adicionarAlunoBtn = document.getElementById("adicionar-aluno");
    const baixarPlanilhaBtn = document.getElementById("baixar-planilha");
    const removerTudoBtn = document.getElementById("remover-tudo");
    const importarPlanilhaInput = document.getElementById("importar-planilha");

    const camposPlanilha = [
        "NOME", "EMAIL", "TELEFONE", "DATA DE NASCIMENTO", "GÊNERO", "LOCAL DE ORIGEM",
        "ETIQUETAS", "OBSERVAÇÕES", "RESPONSÁVEL", "RESPONSÁVEL POR", "ALUNO", "LOCATÁRIO",
        "CLUBISTA", "RANKEADO", "COMPETIDOR", "MATRÍCULA", "CPF", "RG", "NOME DO PAI",
        "CPF DO PAI", "NOME DA MÃE", "CPF DA MÃE", "RG DA MÃE", "CEP", "ENDEREÇO",
        "NÚMERO DA RESIDÊNCIA", "COMPLEMENTO", "BAIRRO", "CIDADE", "ESTADO", "TAMANHO DA CAMISA",
        "NÍVEL", "ALTURA", "PESO", "ESTADO CIVIL", "ESCOLARIDADE", "PROFISSÃO", "MARCA DA RAQUETE",
        "MODELO DA RAQUETE", "MARCA DA BOLA", "MODELO DA BOLA", "ÓCULOS", "CALÇADO",
        "ATENDENTE RESPONSÁVEL", "CONTRATOS NÃO ASSINADOS", "PROFESSORES", "DATA DA CRIAÇÃO"
    ];

    function carregarAlunos() {
        const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
        tabelaAlunos.innerHTML = "";
        alunos.forEach(aluno => adicionarAluno(aluno, false));
    }

    function salvarAlunos() {
        const linhas = tabelaAlunos.querySelectorAll("tr");
        const alunos = Array.from(linhas).map(linha => {
            const colunas = linha.querySelectorAll("td");
            const aluno = {};
            camposPlanilha.forEach((campo, index) => {
                const chave = campo.toLowerCase().replace(/ /g, "_");
                aluno[chave] = colunas[index]?.textContent || "";
            });
            return aluno;
        });
        localStorage.setItem("alunos", JSON.stringify(alunos));
    }

    function adicionarAluno(aluno, salvar = true) {
        const novaLinha = tabelaAlunos.insertRow();
        camposPlanilha.forEach(campo => {
            const celula = novaLinha.insertCell();
            const chave = campo.toLowerCase().replace(/ /g, "_");
            celula.textContent = aluno[chave] || ""; 
        });

        const acoesCelula = novaLinha.insertCell();
        acoesCelula.innerHTML = `
            <button class="whatsapp-btn">WhatsApp</button>
            <button class="editar-btn">Editar</button>
            <button class="remover-btn">Remover</button>
        `;

        acoesCelula.querySelector(".whatsapp-btn").addEventListener("click", () => {
            enviarMensagem(aluno.nome, aluno.telefone);
        });

        acoesCelula.querySelector(".editar-btn").addEventListener("click", () => {
            editarAluno(novaLinha, aluno);
        });

        acoesCelula.querySelector(".remover-btn").addEventListener("click", () => {
            novaLinha.remove();
            salvarAlunos();
        });

        if (salvar) salvarAlunos();
    }

    function editarAluno(linha, aluno) {
        const colunas = linha.querySelectorAll("td");
        camposPlanilha.forEach((campo, index) => {
            const chave = campo.toLowerCase().replace(/ /g, "_");
            const novoValor = prompt(`Editar ${campo}:`, aluno[chave] || "");
            if (novoValor !== null) {
                colunas[index].textContent = novoValor;
                aluno[chave] = novoValor;
            }
        });
        salvarAlunos();
    }

    function enviarMensagem(nome, telefone) {
        if (!telefone) {
            alert("Número de telefone não informado.");
            return;
        }
        const mensagem = `Olá, ${nome}, como vai?`;
        const link = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(mensagem)}`;
        window.open(link, "_blank");
    }

    function criarEstilosPlanilha(sheet) {
        XLSX.utils.sheet_add_aoa(sheet, [camposPlanilha], { origin: "A1" });
        camposPlanilha.forEach((_, index) => {
            const cell = XLSX.utils.encode_cell({ r: 0, c: index });
            if (sheet[cell]) {
                sheet[cell].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "0000FF" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
        });
    }

    function ajustarTamanhosAutomaticamente(sheet) {
        const colWidths = camposPlanilha.map(() => ({ wch: 20 })); 
        const range = XLSX.utils.decode_range(sheet["!ref"]);
        for (let R = range.s.r + 1; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = sheet[cellAddress];
                if (cell && cell.v) {
                    const cellLength = String(cell.v).length;
                    colWidths[C] = { wch: Math.max(colWidths[C]?.wch || 20, cellLength + 5) };
                }
            }
        }
        sheet["!cols"] = colWidths;
    }

    function importarPlanilha(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const alunos = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const cabecalhos = alunos[0];
            const linhas = alunos.slice(1);

            linhas.forEach(linha => {
                const aluno = {};
                cabecalhos.forEach((cabecalho, index) => {
                    const campo = cabecalho ? cabecalho.toUpperCase() : null;
                    const mapeado = camposPlanilha.includes(campo) ? campo.toLowerCase().replace(/ /g, "_") : null;
                    if (mapeado) {
                        aluno[mapeado] = linha[index] !== undefined ? linha[index] : "";
                    }
                });
                adicionarAluno(aluno);
            });
        };
        reader.readAsArrayBuffer(file);
    }

    importarPlanilhaInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) {
            alert("Nenhum arquivo selecionado.");
            return;
        }
        importarPlanilha(file);
    });

    adicionarAlunoBtn.addEventListener("click", () => {
        const novoAluno = {};
        camposPlanilha.forEach(campo => {
            const chave = campo.toLowerCase().replace(/ /g, "_");
            novoAluno[chave] = prompt(`Informe ${campo}:`, "") || "";
        });
        adicionarAluno(novoAluno);
    });

    removerTudoBtn.addEventListener("click", () => {
        tabelaAlunos.innerHTML = "";
        localStorage.clear();
    });

    baixarPlanilhaBtn.addEventListener("click", () => {
        const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
        const worksheet = XLSX.utils.json_to_sheet(alunos);
        criarEstilosPlanilha(worksheet);
        ajustarTamanhosAutomaticamente(worksheet);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");
        XLSX.writeFile(workbook, "alunos_TennisHalll.xlsx");
    });

    carregarAlunos();
});
