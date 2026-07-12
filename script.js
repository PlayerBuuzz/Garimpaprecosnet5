async function carregarProdutos(){

    const container = document.getElementById("produtos");


    if(!container){
        console.error("Elemento produtos não encontrado");
        return;
    }


    console.log("1 - iniciou");


    try{


        container.innerHTML = `
            <h3>Carregando produtos...</h3>
        `;


        console.log("2 - buscando Firestore");


        const resultado = await getDocs(
            collection(db,"produtos")
        );


        console.log("3 - retornou Firestore");


        console.log(
            "Quantidade:",
            resultado.size
        );



        produtos = resultado.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));



        console.log(
            "Produtos:",
            produtos
        );



        if(produtos.length === 0){


            container.innerHTML = `

            <h2>
            Nenhum produto cadastrado.
            </h2>

            `;

            return;

        }



        renderizarProdutos(produtos);



    }catch(error){


        console.error(
            "ERRO FIREBASE:",
            error
        );


        container.innerHTML = `

        <h2>
        Erro ao carregar produtos.
        </h2>

        `;


    }


}