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
                // Remove active de todos
                menuItems.forEach(i => i.classList.remove('active'));
                contentBlocks.forEach(b => b.classList.remove('active'));

                // Adiciona active no selecionado
                item.classList.add('active');
                const contentId = item.getAttribute('data-content');
                document.getElementById(contentId).classList.add('active');
            });
        });
    }

    carregarDados() {
        // Simula carregamento de dados em tempo real
        setInterval(() => {
            this.atualizarMetricas();
        }, 5000);
    }

    atualizarMetricas() {
        // Atualiza métricas em tempo real
        const totalRobos = document.getElementById('compact-total-robos');
        const totalAnalises = document.getElementById('compact-total-analises');

        // Simula pequenas variações
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
