import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

const form = document.getElementById("formProduto");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produtos = document.querySelectorAll(".produto-item");

    try {

        for (const item of produtos) {

            const produto = {

                nome: item.querySelector('input[name="nome[]"]').value,

                descricao: item.querySelector('textarea[name="descricao[]"]').value,

                categoria: item.querySelector('input[name="categoria[]"]').value,

                loja: item.querySelector('input[name="loja[]"]').value,

                preco: parseFloat(
                    item.querySelector('input[name="preco[]"]').value
                ),

                precoAntigo:
                    parseFloat(
                        item.querySelector('input[name="precoAntigo[]"]').value
                    ) || null,

                imagem: item.querySelector('input[name="imagem[]"]').value,

                afiliado: item.querySelector('input[name="afiliado[]"]').value,

                destaque: item.querySelector('input[name="destaque[]"]').checked,

                criadoEm: new Date()

            };

            await addDoc(collection(db, "produtos"), produto);

        }

        alert(`✅ ${produtos.length} produto(s) cadastrado(s) com sucesso!`);

        location.reload();

    } catch (error) {

        console.error(error);

        alert("❌ Erro ao cadastrar os produtos.");

    }

});
