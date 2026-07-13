let produtos = [];

function resumir(texto, tamanho = 120) {
    if (!texto) return "";
    if (texto.length <= tamanho) return texto;
    return texto.substring(0, tamanho) + "... Ver mais";
}

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

carregarProdutos();
