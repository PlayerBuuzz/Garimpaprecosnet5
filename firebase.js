import { initializeApp } from 
"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


import { getFirestore } from 
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";



// CONFIGURAÇÃO FIREBASE

const firebaseConfig = {

    apiKey: "AIzaSyCMlDsnSOJC5DNAd47SY6T0xije_IHNv88",

    authDomain: "garimpaprecos-eac4e.firebaseapp.com",

    projectId: "garimpaprecos-eac4e",

    storageBucket: "garimpaprecos-eac4e.firebasestorage.app",

    messagingSenderId: "268744385879",

    appId: "1:268744385879:web:de590dd22b713037ae4a12"

};



// INICIALIZA FIREBASE

const app = initializeApp(firebaseConfig);


// BANCO FIRESTORE

const db = getFirestore(app);



console.log("🔥 Firebase conectado com sucesso");

console.log(
    "Projeto:",
    firebaseConfig.projectId
);



export { db };