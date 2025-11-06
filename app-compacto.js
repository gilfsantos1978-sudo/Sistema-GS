// Sistema do Dashboard Compacto GS AI
class DashboardCompacto {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 GS AI Dashboard Compacto - Iniciado');
        this.setupMenuNavigation();
        this.carregarDados();
    }

    setupMenuNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const contentBlocks = document.querySelectorAll('.content-block');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove 'active' de todos os itens do menu
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const contentId = item.getAttribute('data-content');

                // Esconde todos os blocos de conteúdo
                contentBlocks.forEach(block => {
                    block.style.display = 'none';
                });

                // Mostra o bloco de conteúdo alvo
                const targetBlock = document.getElementById(contentId);
                if (targetBlock) {
                    targetBlock.style.display = 'block';
                }
            });
        });
        
        // Garante que o primeiro bloco (Robôs) esteja visível ao carregar
        const primeiroBloco = document.getElementById('robos');
        if (primeiroBloco) {
            primeiroBloco.style.display = 'block';
        }
    }

    carregarDados() {
        // Busca os dados imediatamente e depois a cada 5 segundos
        this.atualizarMetricas();
        this.atualizarGanhos();

        setInterval(() => {
            this.atualizarMetricas();
            this.atualizarGanhos();
        }, 5000);
    }

    // Função que busca dados de ganhos da nova API
    async atualizarGanhos() {
        try {
            const response = await fetch('/api/ganhos');
            const data = await response.json();

            if (data.error) {
                console.error('Erro na API de Ganhos:', data.error);
                return;
            }

            // Função auxiliar para formatar moeda
            const formatarMoeda = (valor) => {
                // Se o valor for um objeto (como { valor: 100, tendencia: 10 }), pega o valor
                const valorNumerico = typeof valor === 'object' && valor !== null ? valor.valor : valor;
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorNumerico);
            };

            // Função auxiliar para pegar a tendência
            const getTendencia = (item) => {
                const tendencia = typeof item === 'object' && item !== null ? item.tendencia : 0;
                const cor = tendencia >= 0 ? 'bg-success' : 'bg-danger';
                return `<span class="badge ${cor}"> ${tendencia >= 0 ? '+' : ''}${tendencia}%</span>`;
            };

            // Atualiza os valores na Dashboard (usando os IDs/Classes do Bootstrap)
            
            // DIÁRIO
            document.querySelector('#ganhos .earning-card:nth-child(1) .card-text').innerHTML = 
                `${formatarMoeda(data.diario)} ${getTendencia(data.diario)}`;

            // SEMANAL
            document.querySelector('#ganhos .earning-card:nth-child(2) .card-text').innerHTML = 
                `${formatarMoeda(data.semanal)} ${getTendencia(data.semanal)}`;

            // QUINZENAL
            document.querySelector('#ganhos .earning-card:nth-child(3) .card-text').innerHTML = 
                `${formatarMoeda(data.quinzenal)} ${getTendencia(data.quinzenal)}`;

            // MENSAL
            document.querySelector('#ganhos .earning-card:nth-child(4) .card-text').innerHTML = 
                `${formatarMoeda(data.mensal)} ${getTendencia(data.mensal)}`;

            // PROJEÇÃO
            document.querySelector('#ganhos .projection h4 span').textContent = formatarMoeda(data.projecao);

        } catch (error) {
            console.error('Falha ao buscar dados de ganhos:', error);
        }
    }

    // Função de simulação de métricas (mantida)
    atualizarMetricas() {
        const totalRobos = document.getElementById('compact-total-robos');
        const totalAnalises = document.getElementById('compact-total-analises');

        if (totalRobos) {
            const current = parseInt(totalRobos.textContent);
            totalRobos.textContent = current + Math.floor(Math.random() * 2);
        }

        if (totalAnalises) {
            const current = parseInt(totalAnalises.textContent);
            totalAnalises.textContent = current + Math.floor(Math.random() * 3);
        }
    }
}

// Funções globais
function adicionarRobo(tipo) {
    alert(`🤖 Adicionando robô de ${tipo}...`);
    // Aqui você pode integrar com o sistema principal
}

function adicionarPlataforma() {
    const nomePlataforma = prompt("Digite o nome da nova plataforma:");
    if (nomePlataforma) {
        alert(`🌐 Plataforma ${nomePlataforma} adicionada (Simulação).`);
        // Aqui você faria a lógica real de integração com o Supabase
    }
}

function gerarRelatorio() {
    alert('📋 Gerando relatório...');
}

function fazerBackup() {
    alert('🔄 Fazendo backup do sistema...');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    new DashboardCompacto();
});
