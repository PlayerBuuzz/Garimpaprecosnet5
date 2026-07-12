import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMlDsnSOJC5DNAd47SY6T0xije_IHNv88",
  authDomain: "garimpaprecos-eac4e.firebaseapp.com",
  projectId: "garimpaprecos-eac4e",
  storageBucket: "garimpaprecos-eac4e.firebasestorage.app",
  messagingSenderId: "268744385879",
  appId: "1:268744385879:web:de590dd22b713037ae4a12"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase conectado");

// Captura o formulário
const form = document.getElementById("formProduto");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Pega os valores dos campos
  const produto = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    categoria: document.getElementById("categoria").value,
    loja: document.getElementById("loja").value,
    preco: parseFloat(document.getElementById("preco").value),
    precoAntigo: parseFloat(document.getElementById("precoAntigo").value) || null,
    imagem: document.getElementById("imagem").value,
    afiliado: document.getElementById("afiliado").value,
    destaque: document.getElementById("destaque").checked,
    criadoEm: new Date()
  };

  try {
    await addDoc(collection(db, "produtos"), produto);
    alert("✅ Produto cadastrado com sucesso!");
    form.reset();
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    alert("❌ Erro ao salvar produto. Veja o console.");
  }
});
