// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMlDsnSOJC5DNAd47SY6T0xije_IHNv88",
    authDomain: "garimpaprecos-eac4e.firebaseapp.com",
    projectId: "garimpaprecos-eac4e",
    storageBucket: "garimpaprecos-eac4e.firebasestorage.app",
    messagingSenderId: "268744385879",
    appId: "1:268744385879:web:de590dd22b713037ae4a12"
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos = [];

// Função para resumir descrição
function resumir(texto, tamanho = 120) {
    if (!texto) return "";
    if (texto.length <= tamanho) return texto;
    return texto.substring(0, tamanho) + "... Ver mais";
}

// Carrega produtos
async function carregarProdutos() {
    const container = document.getElementById("produtos");
    const contador = document.getElementById("contadorProdutos");

    if (!container) {
        console.error("Elemento #produtos não encontrado.");
        return;
    }

    try {
        container.innerHTML = `<div class="loading">Carregando produtos...</div>`;

        const resultado = await getDocs(collection(db, "produtos"));

        produtos = resultado.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (contador) {
            contador.textContent = `${produtos.length} produto(s) encontrado(s)`;
        }

        if (produtos.length === 0) {
            container.innerHTML = `<div class="loading">Nenhum produto cadastrado.</div>`;
            return;
        }

        renderizarProdutos(produtos);

    } catch (error) {
        console.error("ERRO FIREBASE:", error);
        container.innerHTML = `<div class="loading">Erro ao carregar produtos.</div>`;
    }
}

// Renderiza produtos
function renderizarProdutos(lista) {
    const container = document.getElementById("produtos");

    container.innerHTML = lista.map(produto => `
        <div class="card-produto">
            <div class="tagOferta">🔥 Oferta</div>

            <img
                src="${produto.imagem || 'https://placehold.co/500x500?text=Sem+Imagem'}"
                alt="${produto.nome}"
                loading="lazy">

            <div class="conteudo">
                <h2>${produto.nome}</h2>

                <p class="descricao">${resumir(produto.descricao)}</p>
        
                ${
                    produto.precoAntigo
                    ? `<span class="preco-antigo">R$ ${Number(produto.precoAntigo).toFixed(2)}</span>`
                    : ""
                }

                <h3>R$ ${Number(produto.preco).toFixed(2)}</h3>

                <a href="${produto.afiliado || "#"}" target="_blank">
                    <button class="btnOferta">🛒 Ver Oferta</button>
                </a>
            </div>
        </div>
    `).join("");
}

// Inicializa
carregarProdutos();
