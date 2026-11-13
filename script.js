// ===================== ELEMENTOS =====================
const crimeContainer = document.getElementById("crimeContainer");
const searchCrime = document.getElementById("searchCrime");
const calcularBtn = document.getElementById("calcularBtn");
const gerarRelatorio = document.getElementById("gerarRelatorio");

const checklistModal = document.getElementById("checklistModal");
const confirmarChecklist = document.getElementById("confirmarChecklist");
const cancelarChecklist = document.getElementById("cancelarChecklist");

const guarnicao = document.getElementById("guarnicao");
const boAuto = document.getElementById("boAuto");

// ===================== RESULTADO GLOBAL =====================
let resultadoFinal = {
  pena: 0,
  multa: 0,
  fianca: ""
};

// ===================== FORMATADOR DE MOEDA =====================
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR");
}

// ===================== DESCRIÇÃO ATENUANTES / AGRAVANTES =====================
const efeitosMapa = {
  // ATENUANTES
  advogado: "Redução de 30% na pena, multa e fiança",
  reup: "Redução de 10% na pena, multa e fiança",
  confesso: "Redução de 10% na pena, multa e fiança",
  delacao: "Redução de 50% na pena, multa e fiança (exige delegado)",
  delegado: "Habilita delação premiada",
  colaboracao: "Redução de 10% na pena, multa e fiança",
  porte_legal: "Redução de 10% na pena, multa e fiança",

  // AGRAVANTES
  reincidente: "Aumenta em 10% a pena, multa e fiança",
  resistencia: "Aumenta em 10% a pena, multa e fiança",
  fuga: "Aumenta em 10% a pena, multa e fiança",
  desacato: "Aumenta em 10% a pena, multa e fiança"
};

// ===================== BO AUTOMÁTICO =====================
const boCounters = {
  PF: 1, PRF: 1, PMU: 1, CHOQUE: 1, BOPE: 1, PC: 1, CORE: 1, EXERCITO: 1, GATE: 1
};
const boPrefixo = {
  PF:"PF", PRF: "PRF", PMU: "PMU", CHOQUE: "CHQ", BOPE: "BOPE", PC: "PC", CORE: "CORE", EXERCITO: "EB", GATE: "GATE"
};

function atualizarBO() {
  if (!guarnicao || !boAuto) return;
  const g = guarnicao.value;
  if (boPrefixo[g]) {
    boAuto.value = `${boPrefixo[g]}-${boCounters[g].toString().padStart(3, "0")}`;
    boCounters[g]++;
  }
}

if (guarnicao) {
  guarnicao.addEventListener("change", atualizarBO);
  atualizarBO();
}

// ===================== BASE COMPLETA DE CRIMES (ORIGINAL + CÓDIGO PENAL LOTUS GROUP) =====================
const crimeCategorias = [
  {
    titulo: "Crimes contra a Vida",
    gravidade: "altissima",
    icone: "☠️",
    crimes: [
      { artigo: "Art. 12", nome: "Homicídio Qualificado", meses: 70, multa: 60000, fianca: false },
      { artigo: "Art. 11", nome: "Homicídio Doloso", meses: 50, multa: 40000, fianca: false },
      { artigo: "Art. 09", nome: "Tentativa de Homicídio", meses: 40, multa: 30000, fianca: false },
      { artigo: "Art. 10", nome: "Homicídio Culposo", meses: 20, multa: 20000, fianca: 40000 },
      { artigo: "Art. 13", nome: "Latrocínio", meses: 80, multa: 70000, fianca: false },
      { artigo: "Art. 302 CTB", nome: "Homicídio Culposo no Trânsito", meses: 48, multa: 1500, fianca: 750 }
    ]
  },
  {
    titulo: "Crimes Violentos e Contra a Pessoa",
    gravidade: "alta",
    icone: "🔥",
    crimes: [
      { artigo: "Art. 26", nome: "Lesão Corporal", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 250", nome: "Incêndio", meses: 36, multa: 2000, fianca: 1000 },
      { artigo: "Art. 27", nome: "Sequestro", meses: 45, multa: 40000, fianca: false },
      { artigo: "Art. 148", nome: "Cárcere Privado", meses: 80, multa: 3000, fianca: 1500 },
      { artigo: "Art. 28", nome: "Tortura", meses: 50, multa: 45000, fianca: false },
      { artigo: "Art. 14", nome: "Assédio Moral", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 15", nome: "Calúnia", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 16", nome: "Difamação", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 17", nome: "Injúria", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 18", nome: "Importunação Sexual", meses: 35, multa: 30000, fianca: 60000 },
      { artigo: "Art. 20", nome: "Abandono de Incapaz", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 21", nome: "Adultério (Ilícito Civil)", meses: 0, multa: 5000, fianca: 10000 },
      { artigo: "Art. 22", nome: "Bigamia", meses: 10, multa: 10000, fianca: 20000 },
      { artigo: "Art. 23", nome: "Crime Sexual Intrafamiliar", meses: 60, multa: 50000, fianca: false }
    ]
  },
  {
    titulo: "Crimes contra o Patrimônio Veicular",
    gravidade: "media",
    icone: "🚗",
    crimes: [
      { artigo: "Art. 311", nome: "Desmanche de Veículos", meses: 60, multa: 2500, fianca: 1250 },
      { artigo: "Art. 155 §4º", nome: "Furto de Veículos", meses: 48, multa: 2000, fianca: 1000 },
      { artigo: "Art. 180", nome: "Receptação de Veículos", meses: 36, multa: 1800, fianca: 900 },
      { artigo: "Art. 157", nome: "Roubo/Assalto à Veículos", meses: 72, multa: 3500, fianca: 1750 }
    ]
  },
  {
    titulo: "Crimes contra o Patrimônio",
    gravidade: "media",
    icone: "💰",
    crimes: [
      { artigo: "Art. 34", nome: "Roubo", meses: 30, multa: 25000, fianca: 50000 },
      { artigo: "Art. 33", nome: "Furto", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 155 §4º", nome: "Furto a Caixa Eletrônico", meses: 30, multa: 2000, fianca: 1000 },
      { artigo: "Art. 25", nome: "Extorsão", meses: 30, multa: 25000, fianca: 50000 },
      { artigo: "Art. 31", nome: "Estelionato", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 30", nome: "Dano de Propriedade do Governo", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 29", nome: "Vandalismo", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 32", nome: "Invasão de Propriedade / Imóvel", meses: 20, multa: 15000, fianca: 30000 }
    ]
  },
  {
    titulo: "Porte, Posse, Tráfico de Armas e Equipamentos",
    gravidade: "media",
    icone: "🔫",
    crimes: [
      { artigo: "Art. 37", nome: "Posse de Peças de Armas (Apreensão)", meses: 0, multa: 20000, fianca: false },
      { artigo: "Art. 38", nome: "Posse de Cápsula (Apreensão)", meses: 0, multa: 15000, fianca: false },
      { artigo: "Art. 39", nome: "Porte de Arma Leve", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 40", nome: "Tráfico de Armas Leve (+3)", meses: 40, multa: 35000, fianca: false },
      { artigo: "Art. 41", nome: "Porte de Arma Pesada", meses: 35, multa: 30000, fianca: false },
      { artigo: "Art. 42", nome: "Tráfico de Armas Pesada (+3)", meses: 60, multa: 50000, fianca: false },
      { artigo: "Art. 43", nome: "Porte de Arma Branca (Apreensão)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 44", nome: "Porte de Munição (-100)", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 45", nome: "Tráfico de Munição (+100)", meses: 30, multa: 25000, fianca: false },
      { artigo: "Lei 10.826 Art.12", nome: "Posse de Arma Ilegal", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Lei 10.826 Art.15", nome: "Disparo de Arma de Fogo", meses: 24, multa: 2000, fianca: 1000 },
      { artigo: "Art. 74", nome: "Uso de Coldre", meses: 10, multa: 10000, fianca: 20000 },
      { artigo: "Art. 75", nome: "Uso de Colete (Roupa)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 76", nome: "Porte de Colete Balístico (1 a 3)", meses: 15, multa: 15000, fianca: 30000 },
      { artigo: "Art. 77", nome: "Tráfico de Colete Balístico (4 ou mais)", meses: 30, multa: 25000, fianca: false }
    ]
  },
  {
    titulo: "Drogas, Produtos Ilegais e Dinheiro Sujo",
    gravidade: "alta",
    icone: "💊",
    crimes: [
      { artigo: "Art. 47", nome: "Posse de Drogas (-100)", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 48", nome: "Tráfico de Drogas (+100)", meses: 40, multa: 35000, fianca: false },
      { artigo: "Lei 11.343 Art.33 §4º", nome: "Entrega de Drogas (aviãozinho)", meses: 48, multa: 2500, fianca: 1250 },
      { artigo: "Art. 46", nome: "Posse de Componentes Narcóticos (Apreensão)", meses: 0, multa: 15000, fianca: false },
      { artigo: "Lei 11.343 Art.35", nome: "Associação ao Tráfico", meses: 60, multa: 3500, fianca: false },
      { artigo: "Art. 35", nome: "Posse de Produtos Ilegais (1 a 5)", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 36", nome: "Tráfico de Produtos Ilegais (+6)", meses: 35, multa: 30000, fianca: false },
      { artigo: "Art. 49", nome: "Dinheiro Sujo Leve (10k a 150k)", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 50", nome: "Dinheiro Sujo Médio (150k a 500k)", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 51", nome: "Dinheiro Sujo Grave (+500k)", meses: 40, multa: 35000, fianca: false }
    ]
  },
  {
    titulo: "Ordem Pública",
    gravidade: "baixa",
    icone: "⚠️",
    crimes: [
      { artigo: "Art. 52", nome: "Apologia ao Crime", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 64", nome: "Tentativa de Suborno", meses: 25, multa: 20000, fianca: false },
      { artigo: "Art. 24", nome: "Ameaça", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 57", nome: "Falsa Comunicação de Crime", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 265", nome: "Uso Indevido do 190/192", meses: 12, multa: 600, fianca: 300 },
      { artigo: "Art. 55", nome: "Desobediência", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 233", nome: "Atentado ao Pudor", meses: 18, multa: 1500, fianca: 750 },
      { artigo: "Art. 73", nome: "Ocultação Facial / Uso de Máscara", meses: 10, multa: 10000, fianca: 20000 },
      { artigo: "Lei 10.826", nome: "Uso de Equipamentos Restritos", meses: 12, multa: 1000, fianca: 500 },
            { artigo: "Art. 53", nome: "Falsidade Ideológica", meses: 30, multa: 25000, fianca: 50000 },
      { artigo: "Art. 56", nome: "Exercício Ilegal de Profissão", meses: 30, multa: 25000, fianca: 50000 },
      { artigo: "Art. 60", nome: "Omissão de Socorro", meses: 15, multa: 10000, fianca: 20000 },
      { artigo: "Art. 61", nome: "Perturbação da Ordem", meses: 10, multa: 5000, fianca: 10000 },
      { artigo: "Art. 62", nome: "QRR Ilegal", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 54", nome: "Formação de Quadrilha", meses: 25, multa: 20000, fianca: false }
    ]
  },
  {
    titulo: "Crimes contra Autoridade e Administração",
    gravidade: "alta",
    icone: "🛑",
    crimes: [
      { artigo: "Art. 03", nome: "Desacato", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 329", nome: "Resistência à Prisão", meses: 24, multa: 1500, fianca: false },
      { artigo: "Art. 01", nome: "Abuso de Autoridade", meses: 30, multa: 30000, fianca: false },
      { artigo: "Art. 05", nome: "Prevaricação", meses: 30, multa: 25000, fianca: 50000 },
      { artigo: "Art. 58", nome: "Obstrução de Justiça", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 02", nome: "Corrupção Passiva e/ou Ativa", meses: 40, multa: 50000, fianca: false },
      { artigo: "Art. 04", nome: "Impedir Exercício Profissional", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 06", nome: "Prisão Disciplinar", meses: 20, multa: 15000, fianca: false },
      { artigo: "Art. 07", nome: "Tráfico de Influência", meses: 35, multa: 40000, fianca: 70000 },
      { artigo: "Art. 08", nome: "Uso irregular de Função Pública", meses: 50, multa: 60000, fianca: false },
      { artigo: "Art. 19", nome: "Perjúrio", meses: 25, multa: 20000, fianca: 40000 },
      { artigo: "Art. 59", nome: "Ocultação de Provas", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 80", nome: "Invasão a DP", meses: 50, multa: 50000, fianca: false }
    ]
  },
  {
    titulo: "Crimes de Trânsito",
    gravidade: "leve",
    icone: "🚦️",
    crimes: [
      { artigo: "Art. 63", nome: "Tentativa de Fuga", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 66", nome: "Condução Imprudente", meses: 10, multa: 10000, fianca: 20000 },
      { artigo: "Art. 67", nome: "Corridas Ilegais", meses: 20, multa: 15000, fianca: 30000 },
      { artigo: "Art. 68", nome: "Dirigir na Contramão (Infração)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 65", nome: "Alta Velocidade (Infração)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 69", nome: "Poluição Sonora (Infração)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 72", nome: "Uso Excessivo de Insulfilm (Infração)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 70", nome: "Veículo Muito Danificado (Infração)", meses: 0, multa: 5000, fianca: false },
      { artigo: "Art. 181 CTB", nome: "Veículo Irregular", meses: 12, multa: 800, fianca: 400 },
      { artigo: "Art. 71", nome: "Veículo Ilegalmente Estacionado (Infração)", meses: 0, multa: 3000, fianca: false },
      { artigo: "Art. 302 CTB", nome: "Tentativa de Homicídio no Trânsito", meses: 72, multa: 3500, fianca: false }
    ]
  }
];

// ===================== RENDERIZAÇÃO DOS CRIMES =====================
if (crimeContainer) {
  crimeCategorias.forEach(cat => {
    const bloco = document.createElement("div");
    bloco.className = "crime-bloco";
    const colCount = getComputedStyle(crimeContainer).gridTemplateColumns.split(" ").length || 3;
    const index = crimeContainer.children.length;
    bloco.dataset.coluna = index % colCount;

    const header = document.createElement("div");
    header.className = "crime-header open";
    header.innerHTML = `
      <span class="crime-icon">${cat.icone}</span>
      <span>${cat.titulo}</span>
    `;
    header.dataset.gravidade = cat.gravidade;

    const lista = document.createElement("div");
    lista.className = "crime-lista";

    cat.crimes.forEach(c => {
      const item = document.createElement("div");
      item.className = "crime-item";
      item.innerHTML = `
        <strong>${c.artigo}</strong><br>
        <span class="crime-nome">${c.nome}</span>
      `;

      item.dataset.meses = c.meses;
      item.dataset.multa = c.multa;
      item.dataset.fianca = typeof c.fianca === "number" ? c.fianca : "false";
      item.dataset.nome = c.nome;
      item.dataset.artigo = c.artigo;

      item.onclick = () => {
        item.classList.toggle("selected");
      };

      lista.appendChild(item);
    });

    header.onclick = () => {
      header.classList.toggle("open");
      lista.classList.toggle("hidden");
    };

    bloco.appendChild(header);
    bloco.appendChild(lista);
    crimeContainer.appendChild(bloco);
  });
}

// ===================== NORMALIZAR TEXTO (REMOVE ACENTOS) =====================
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===================== PESQUISA DE CRIMES =====================
if (searchCrime) {
  searchCrime.addEventListener("input", (e) => {
    const termo = normalizarTexto(e.target.value.trim());

    document.querySelectorAll("#crimeContainer .crime-bloco").forEach(bloco => {
      const header = bloco.querySelector(".crime-header");
      const lista = bloco.querySelector(".crime-lista");
      const itens = bloco.querySelectorAll(".crime-item");

      let encontrou = false;

      itens.forEach(item => {
        const texto = normalizarTexto(item.textContent);
        if (texto.includes(termo)) {
          item.style.display = "block";
          encontrou = true;
        } else {
          item.style.display = "none";
        }
      });

      if (termo === "") {
        header.classList.add("open");
        lista.classList.remove("hidden");
        itens.forEach(i => i.style.display = "block");
      } else if (encontrou) {
        header.classList.add("open");
        lista.classList.remove("hidden");
      } else {
        header.classList.remove("open");
        lista.classList.add("hidden");
      }
    });
  });
}

// ===================== ATENUANTES =====================
const atenuantesBtns = [...document.querySelectorAll("#atenuantesBtns .crime-item")];

function getAtenuantes() {
  return atenuantesBtns
    .filter(b => b.classList.contains("selected"))
    .map(b => b.dataset.value);
}

atenuantesBtns.forEach(btn => {
  btn.onclick = () => {
    const v = btn.dataset.value;
    const ativos = getAtenuantes();

    if (v === "delacao" && !ativos.includes("delegado")) {
      return alert("⚠️ Delação só pode ser aplicada com Delegado Presente.");
    }

    if ((v === "reup" || v === "confesso") && !ativos.includes("advogado")) {
      return alert("⚠️ Necessário advogado constituído.");
    }

    btn.classList.toggle("selected");
    atualizarCamposLegais();
  };
});

// ===================== CONTROLE ADVOGADO / DELEGADO =====================
const advogadoNome = document.getElementById("advogadoNome");
const advogadoPassaporte = document.getElementById("advogadoPassaporte");
const respNome = document.getElementById("respNome");
const respPassaporte = document.getElementById("respPassaporte");

function limparAdvogado() {
  if (!advogadoNome || !advogadoPassaporte) return;
  advogadoNome.value = "";
  advogadoPassaporte.value = "";
  advogadoNome.disabled = true;
  advogadoPassaporte.disabled = true;
}

function limparDelegado() {
  if (!respNome || !respPassaporte) return;
  respNome.value = "";
  respPassaporte.value = "";
  respNome.disabled = true;
  respPassaporte.disabled = true;
}

function atualizarCamposLegais() {
  const atenuantesSelecionados = getAtenuantes();

  if (advogadoNome && advogadoPassaporte) {
    if (atenuantesSelecionados.includes("advogado")) {
      advogadoNome.disabled = false;
      advogadoPassaporte.disabled = false;
    } else {
      limparAdvogado();
    }
  }

  if (respNome && respPassaporte) {
    if (atenuantesSelecionados.includes("delegado")) {
      respNome.disabled = false;
      respPassaporte.disabled = false;
    } else {
      limparDelegado();
    }
  }
}

atualizarCamposLegais();

// ===================== AGRAVANTES =====================
const agravantesBtns = [...document.querySelectorAll("#agravantesBtns .crime-item")];
agravantesBtns.forEach(btn => {
  btn.onclick = () => btn.classList.toggle("selected");
});

// ===================== CÁLCULO DE MODIFICADORES (SOMA / SUBTRAÇÃO DIRETA) =====================
function aplicarModificadores(valorBase) {
  const atenuantes = getAtenuantes();
  const agravantesQtd = document.querySelectorAll("#agravantesBtns .crime-item.selected").length;

  let percentual = 0;

  if (atenuantes.includes("advogado"))    percentual -= 0.30; // -30%
  if (atenuantes.includes("reup"))        percentual -= 0.10; // -10%
  if (atenuantes.includes("confesso"))    percentual -= 0.10; // -10%
  if (atenuantes.includes("delacao"))     percentual -= 0.50; // -50%
  if (atenuantes.includes("colaboracao")) percentual -= 0.10; // -10%
  if (atenuantes.includes("porte_legal")) percentual -= 0.10; // -10%

  percentual += (agravantesQtd * 0.10);

  const multiplicadorFinal = Math.max(0, 1 + percentual);
  return Math.floor(valorBase * multiplicadorFinal);
}

// ===================== CÁLCULO DAS PENALIDADES =====================
function calcularPenalidades() {
  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaBruta = 0;
  let fiancaPermitida = true;

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const meses = Number(i.dataset.meses) || 0;
    const multa = Number(i.dataset.multa) || 0;
    const fiancaRaw = i.dataset.fianca;

    penaBruta += meses;
    multaBruta += multa;

        if (fiancaRaw !== "false") {
      fiancaBruta += Number(fiancaRaw) || 0;
    } else {
      fiancaPermitida = false;
    }
  });

  const penaFinal = penaBruta > 0 ? Math.max(1, aplicarModificadores(penaBruta)) : 0;
  const multaFinal = aplicarModificadores(multaBruta);
  const fiancaFinal = fiancaPermitida
    ? `R$ ${formatarMoeda(aplicarModificadores(fiancaBruta))}`
    : "Não aplicável";

  resultadoFinal.pena = penaFinal;
  resultadoFinal.multa = multaFinal;
  resultadoFinal.fianca = fiancaFinal;
}

// ===================== BOTÃO CALCULAR =====================
if (calcularBtn) {
  calcularBtn.onclick = () => {
    calcularPenalidades();
    gerarBoletimConferencia();
    if (boletimModal) boletimModal.classList.remove("hidden");
    alert("✅ Penalidades calculadas.");
  };
}

// ===================== CHECKLIST =====================
const checklistItens = [...document.querySelectorAll(".check-item")];
if (confirmarChecklist) confirmarChecklist.disabled = true;

function atualizarBotaoChecklist() {
  if (!confirmarChecklist) return;
  const todosMarcados = checklistItens.every(i => i.classList.contains("done"));
  confirmarChecklist.disabled = !todosMarcados;
}

checklistItens.forEach(i => {
  i.addEventListener("click", () => {
    i.classList.toggle("done");
    atualizarBotaoChecklist();
  });
});

// ==================== RELATÓRIO PARA TABLET =====================
function gerarListaCompactaCrimes() {
  let lista = [];
  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const artigo = i.dataset.artigo;
    const nome = i.dataset.nome;
    lista.push(`${artigo} – ${nome}`);
  });
  return lista.join(", ");
}

const sistemaTablet = document.getElementById("sistemaTablet");
if (sistemaTablet) {
  sistemaTablet.onclick = () => {
    calcularPenalidades();
    const listaCompacta = gerarListaCompactaCrimes();

    if (!listaCompacta) {
      alert("⚠️ Nenhum crime selecionado.");
      return;
    }

    navigator.clipboard.writeText(listaCompacta)
      .then(() => alert("📋 Lista compacta copiada para o sistema do tablet!"));
  };
}

// ===================== RELATÓRIO =====================
if (gerarRelatorio) {
  gerarRelatorio.onclick = () => {
    calcularPenalidades();
    if (checklistModal) checklistModal.classList.remove("hidden");
  };
}

if (cancelarChecklist) {
  cancelarChecklist.onclick = () => {
    if (checklistModal) checklistModal.classList.add("hidden");
  };
}

if (confirmarChecklist) {
  confirmarChecklist.onclick = () => {
    if (checklistItens.some(i => !i.classList.contains("done"))) {
      alert("⚠️ Marque todos os itens do checklist antes de confirmar!");
      return;
    }

    calcularPenalidades();
    const atenuantes = getAtenuantes();

    if (atenuantes.includes("advogado")) {
      if (!advogadoNome?.value.trim() || !advogadoPassaporte?.value.trim()) {
        alert("⚠️ Preencha os dados do advogado.");
        return;
      }
    }

    if (atenuantes.includes("delegado")) {
      if (!respNome?.value.trim() || !respPassaporte?.value.trim()) {
        alert("⚠️ Preencha os dados do delegado.");
        return;
      }
    }

    navigator.clipboard.writeText(gerarFichaCriminalDiscord())
      .then(() => alert("📋 Relatório formatado para Discord copiado!"));

    if (checklistModal) checklistModal.classList.add("hidden");
  };
}

// ===================== BOLETIM DE CONFERÊNCIA =====================
const boletimModal = document.getElementById("boletimModal");
const boletimConteudo = document.getElementById("boletimConteudo");
const fecharBoletim = document.getElementById("fecharBoletim");

function gerarBoletimConferencia() {
  if (!boletimConteudo) return;
  let crimesTexto = "";
  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaBruta = 0;
  let fiancaPermitida = true;

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    crimesTexto += `• ${i.dataset.artigo} – ${i.dataset.nome}<br>`;
    penaBruta += Number(i.dataset.meses) || 0;
    multaBruta += Number(i.dataset.multa) || 0;

    if (i.dataset.fianca !== "false") {
      fiancaBruta += Number(i.dataset.fianca) || 0;
    } else {
      fiancaPermitida = false;
    }
  });

  boletimConteudo.innerHTML = `
    <div class="boletim-bloco">
      <h4>🚨 CRIMES IMPUTADOS</h4>
      <div class="boletim-lista">
        ${crimesTexto || "Nenhum crime selecionado."}
      </div>
    </div>

    <div class="boletim-bloco">
      <h4>📌 VALORES BRUTOS (ACUMULADOS)</h4>
      <ul>
        <li>⏳ Pena Bruta: <strong>${penaBruta}</strong> meses</li>
        <li>💰 Multa Bruta: <strong>R$ ${formatarMoeda(multaBruta)}</strong></li>
        <li>⚖️ Fiança Bruta: <strong>${fiancaPermitida ? "R$ " + formatarMoeda(fiancaBruta) : "Não aplicável"}</strong></li>
      </ul>
    </div>

    <div class="boletim-bloco boletim-destaque">
      <h4>⚖️ VALORES FINAIS (COM ATENUANTES / AGRAVANTES)</h4>
      <ul>
        <li>⏳ Pena Final: <strong>${resultadoFinal.pena}</strong> meses</li>
        <li>💰 Multa Final: <strong>R$ ${formatarMoeda(resultadoFinal.multa)}</strong></li>
        <li>⚖️ Fiança Final: <strong>${resultadoFinal.fianca}</strong></li>
      </ul>
    </div>
  `;
}

if (fecharBoletim) {
  fecharBoletim.onclick = () => {
    if (boletimModal) boletimModal.classList.add("hidden");
  };
}

// ===================== FICHA DISCORD =====================
function gerarFichaCriminalDiscord() {
  let crimesTexto = "";

  document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
    const artigo = i.dataset.artigo;
    const nome = i.dataset.nome;
    const meses = i.dataset.meses;
    const multa = Number(i.dataset.multa);
    const fiancaRaw = i.dataset.fianca;

    const fianca = fiancaRaw !== "false"
      ? `R$ ${formatarMoeda(fiancaRaw)}`
      : "Não aplicável";

    crimesTexto += `• **${artigo} – ${nome}**\n  ⏳ Pena: ${meses} Meses | 💰 Multa: R$ ${formatarMoeda(multa)} | ⚖️ Fiança: ${fianca}\n\n`;
  });

  if (!crimesTexto) crimesTexto = "_Nenhum crime selecionado._";

  const reuNomeVal = document.getElementById("reuNome")?.value || "";
  const reuPassaporteVal = document.getElementById("reuPassaporte")?.value || "";
  const oficialNomeVal = document.getElementById("oficialNome")?.value || "";
  const oficialPassaporteVal = document.getElementById("oficialPassaporte")?.value || "";
  const outrosOficiaisVal = document.getElementById("outrosOficiais")?.value || "Não informado";
  const guarnicaoVal = guarnicao?.value || "";
  const boAutoVal = boAuto?.value || "";
  const advogadoVal = advogadoNome?.value || "Não informado";
  const delegadoVal = respNome?.value || "Não informado";

  return `
📂 **FICHA CRIMINAL**

━━━━━━━━━━━━━━━━━━
👤 **DADOS DO RÉU**
━━━━━━━━━━━━━━━━━━
**Nome:** ${reuNomeVal}  
**Passaporte:** ${reuPassaporteVal}  

━━━━━━━━━━━━━━━━━━
🚨 **CRIMES COMETIDOS**
━━━━━━━━━━━━━━━━━━
${crimesTexto}
━━━━━━━━━━━━━━━━━━
⚖️ **PENALIDADES FINAIS**
━━━━━━━━━━━━━━━━━━
⏳ **Pena Total:** ${resultadoFinal.pena} meses  
💰 **Multa Total:** R$ ${formatarMoeda(resultadoFinal.multa)}  
⚖️ **Fiança Total:** ${resultadoFinal.fianca}  

━━━━━━━━━━━━━━━━━━
👮 **GUARNIÇÃO**
━━━━━━━━━━━━━━━━━━
**Corporação:** ${guarnicaoVal}  
**B.O.:** ${boAutoVal}  

**Oficial Responsável:**  
${oficialNomeVal} (${oficialPassaporteVal})  

**Policiais Envolvidos:**  
${outrosOficiaisVal}  

━━━━━━━━━━━━━━━━━━
⚖️ **JURÍDICO**
━━━━━━━━━━━━━━━━━━
**Advogado:** ${advogadoVal}  
**Delegado:** ${delegadoVal}  

━━━━━━━━━━━━━━━━━━
📝 **RELATÓRIO DA AÇÃO**
━━━━━━━━━━━━━━━━━━
(Descrever a ocorrência)
`;
}

// ===================== RESET APENAS CRIMES =====================
const resetCrimesBtn = document.getElementById("resetCrimes");

if (resetCrimesBtn) {
  resetCrimesBtn.onclick = () => {
    document.querySelectorAll("#crimeContainer .crime-item.selected")
      .forEach(item => item.classList.remove("selected"));

    document.querySelectorAll("#crimeContainer .crime-header")
      .forEach(h => h.classList.add("open"));

    document.querySelectorAll("#crimeContainer .crime-lista")
      .forEach(l => l.classList.remove("hidden"));

    resultadoFinal = {
      pena: 0,
      multa: 0,
      fianca: ""
    };

    alert("🔄 Crimes limpos com sucesso.");
  };
}

// ===================== TOOLTIP GLOBAL =====================
const tooltip = document.getElementById("tooltip");

if (tooltip) {
  document.addEventListener("mousemove", (e) => {
    const crime = e.target.closest("#crimeContainer .crime-item");
    const efeito = e.target.closest("#atenuantesBtns .crime-item, #agravantesBtns .crime-item");

    if (crime) {
      const fiancaRaw = crime.dataset.fianca;
      const textoFianca = fiancaRaw !== "false" ? `R$ ${formatarMoeda(fiancaRaw)}` : "Não aplicável";

      tooltip.innerHTML = `
        ⏳ Pena: <strong>${crime.dataset.meses} Meses</strong> | 
        💰 Multa: <strong>R$ ${formatarMoeda(crime.dataset.multa)}</strong> | 
        ⚖️ Fiança: <strong>${textoFianca}</strong>
      `;
      tooltip.style.opacity = "1";
    } else if (efeito) {
      const valor = efeito.dataset.value;
      tooltip.innerHTML = `
        ⚖️ Efeito:<br>
        <strong>${efeitosMapa[valor] || "Efeito não definido"}</strong>
      `;
      tooltip.style.opacity = "1";
    } else {
      tooltip.style.opacity = "0";
    }

    tooltip.style.left = e.clientX + 15 + "px";
    tooltip.style.top  = e.clientY + 15 + "px";
  });
}

// ===================== ABERTURA DE BLOCOS EXTERNOS =====================
document.querySelectorAll(
  ".crime-bloco:not(#crimeContainer .crime-bloco) .crime-header"
).forEach(header => {
  header.onclick = () => {
    header.classList.toggle("open");
    header.nextElementSibling.classList.toggle("hidden");
  };
});
