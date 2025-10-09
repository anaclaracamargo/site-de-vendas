document.addEventListener('DOMContentLoaded', () => {
    // 1. Variáveis Globais e Inicialização
    let carrinho = JSON.parse(localStorage.getItem('carrinhoBellaAura')) || [];
    const btnAbrirCarrinho = document.getElementById('abrir-carrinho');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const spanFechar = document.getElementsByClassName('fechar-modal')[0];
    const listaCarrinho = document.getElementById('lista-carrinho');
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const valorTotalElement = document.getElementById('valor-total');
    const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
    
    // Função para salvar o carrinho no armazenamento local (para persistência)
    const salvarCarrinho = () => {
        localStorage.setItem('carrinhoBellaAura', JSON.stringify(carrinho));
    };

    // Função para atualizar o contador no ícone
    const atualizarContador = () => {
        const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);
        contadorCarrinho.textContent = totalItens;
    };

    // Função para renderizar os itens do carrinho no modal
    const renderizarCarrinho = () => {
        listaCarrinho.innerHTML = ''; // Limpa a lista
        let total = 0;

        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = '<li>O seu carrinho está vazio.</li>';
        } else {
            carrinho.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.nome} (${item.quantidade}x)</span>
                    <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                `;
                listaCarrinho.appendChild(li);
                total += item.preco * item.quantidade;
            });
        }
        
        valorTotalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        atualizarContador();
        salvarCarrinho();
    };

    // 2. Adicionar Produto ao Carrinho
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const nome = e.target.getAttribute('data-nome');
            const preco = parseFloat(e.target.getAttribute('data-preco'));

            const itemExistente = carrinho.find(item => item.id === id);

            if (itemExistente) {
                itemExistente.quantidade += 1;
            } else {
                carrinho.push({ id, nome, preco, quantidade: 1 });
            }

            alert(`${nome} adicionado ao carrinho!`);
            renderizarCarrinho();
        });
    });

    // 3. Funcionalidade do Modal (Abrir/Fechar)
    
    // Abrir modal
    btnAbrirCarrinho.onclick = function() {
        renderizarCarrinho(); // Garante que a lista esteja atualizada
        modalCarrinho.style.display = 'block';
    }

    // Fechar modal ao clicar no 'x'
    spanFechar.onclick = function() {
        modalCarrinho.style.display = 'none';
    }

    // Fechar modal ao clicar fora
    window.onclick = function(event) {
        if (event.target == modalCarrinho) {
            modalCarrinho.style.display = 'none';
        }
    }
    
    // 4. Finalizar Compra (Exemplo Básico)
    document.querySelector('.botao-finalizar').addEventListener('click', () => {
        if (carrinho.length > 0) {
            alert("Compra finalizada! Entraremos em contato para os detalhes de pagamento e envio. Total: " + valorTotalElement.textContent);
            carrinho = []; // Limpa o carrinho
            modalCarrinho.style.display = 'none';
            renderizarCarrinho();
        } else {
            alert("Seu carrinho está vazio. Adicione um produto!");
        }
    });

    // Inicializa o contador ao carregar a página
    atualizarContador();
});