class GSAIPainel {
    constructor() {
        this.robos = {
            'marketing': { quantidade: 2, ativos: true },
            'vendas': { quantidade: 2, ativos: true },
            'analise': { quantidade: 2, ativos: true }
        };
        this.analisesRealizadas = 24;
        this.funisAtivos = 8;
        this.logCount = 3;
        this.comandos = {
            '/add-robo': this.adicionarRobo.bind(this),
            '/analise-tendencias': this.analisarTendencias.bind(this),
            '/criar-funil': this.criarFunil.bind(this),
            '/scan-mercado': this.scanMercado.bind(this),
            '/otimizar-campanhas': this.otimizarCampanhas.bind(this),
            '/status': this.mostrarStatus.bind(this),
            '/help': this.mostrarAjuda.bind(this)
        };
        this.init();
    }

    init() {
        console.log('🚀 GS AI Painel - Sistema de Automação Iniciado');
        this.atualizarInterface();
    }

    executarComando(comandoTexto) {
        const [comando, ...args] = comandoTexto.trim().split(' ');
        const acao = this.comandos[comando.toLowerCase()];
        
        if (acao) {
            this.registrarLog(`Executando: ${comandoTexto}`, 'AI');
            acao(args);
        } else {
            this.registrarLog(`Comando não reconhecido: ${comando}`, 'ERROR');
            this.mostrarAjuda();
        }
    }

    adicionarRobo([tipo]) {
        if (!tipo) {
            this.registrarLog('Uso: /add-robo [tipo] - Tipos: marketing, vendas, analise', 'WARNING');
            return;
        }

        if (!this.robos[tipo]) {
            this.robos[tipo] = { quantidade: 0, ativos: true };
        }

        this.robos[tipo].quantidade++;
        this.registrarLog(`✅ Robô de ${tipo} adicionado. Total: ${this.robos[tipo].quantidade}`, 'SUCCESS');
        this.atualizarInterface();
        
        setTimeout(() => {
            this.registrarLog(`🤖 Robô ${tipo} #${this.robos[tipo].quantidade} inicializado e coletando dados...`, 'AI');
        }, 1000);
    }

    analisarTendencias() {
        this.registrarLog('🔍 Iniciando análise de tendências de mercado...', 'AI');
        
        const tendencias = [
            '📈 Alta demanda por automação em e-commerce',
            '🎯 Nicho: SaaS para pequenas empresas',
            '🔥 Crescimento em conteúdo em vídeo',
            '💡 Oportunidade: Ferramentas de produtividade remota'
        ];

        tendencias.forEach((tendencia, index) => {
            setTimeout(() => {
                this.registrarLog(tendencia, 'AI');
                this.analisesRealizadas++;
            }, (index + 1) * 800);
        });

        setTimeout(() => {
            this.registrarLog('✅ Análise de tendências concluída!', 'SUCCESS');
            this.atualizarInterface();
        }, 4000);
    }

    criarFunil() {
        const funis = [
            'Funil de Captura → Conversão → Venda',
            'Funil de Educação → Confiança → Venda',
            'Funil de Trial → Upsell → Manutenção'
        ];

        const funilEscolhido = funis[Math.floor(Math.random() * funis.length)];
        this.funisAtivos++;
        
        this.registrarLog(`🛒 Criando funil: ${funilEscolhido}`, 'AI');
        
        setTimeout(() => {
            this.registrarLog('✅ Funil automatizado criado e ativado!', 'SUCCESS');
            this.atualizarInterface();
        }, 2000);
    }

    scanMercado() {
        this.registrarLog('🔍 Escaneando plataformas freelancer por oportunidades...', 'AI');

        const plataformas = ['Upwork', 'Fiverr', 'Freelancer.com', 'Workana'];
        plataformas.forEach((plataforma, index) => {
            setTimeout(() => {
                const oportunidades = Math.floor(Math.random() * 20) + 5;
                this.registrarLog(`💼 ${plataforma}: ${oportunidades} oportunidades identificadas`, 'AI');
            }, (index + 1) * 1000);
        });

        setTimeout(() => {
            this.registrarLog('✅ Scan de mercado concluído!', 'SUCCESS');
        }, 5000);
    }

    otimizarCampanhas() {
        this.registrarLog('🎯 Otimizando campanhas ativas...', 'AI');

        const melhorias = [
            '📊 Ajustando segmentação de público',
            '💬 Otimizando copywriting',
            '🎨 Melhorando design das páginas',
            '⚡ Aumentando velocidade de carregamento'
        ];

        melhorias.forEach((melhoria, index) => {
            setTimeout(() => {
                this.registrarLog(melhoria, 'AI');
            }, (index + 1) * 800);
        });

        setTimeout(() => {
            const melhoriaPercentual = (Math.random() * 30 + 10).toFixed(1);
            this.registrarLog(`✅ Campanhas otimizadas! Eficiência +${melhoriaPercentual}%`, 'SUCCESS');
        }, 4000);
    }

    mostrarStatus() {
        this.registrarLog('📊 STATUS DO SISTEMA:', 'AI');
        this.registrarLog(`🤖 Robôs ativos: ${this.calcularTotalRobos()}`, 'AI');
        this.registrarLog(`📊 Análises hoje: ${this.analisesRealizadas}`, 'AI');
        this.registrarLog(`🛒 Funis ativos: ${this.funisAtivos}`, 'AI');
    }

    mostrarAjuda() {
        const ajuda = [
            '🎮 COMANDOS DISPONÍVEIS:',
            '/add-robo [tipo] - Adicionar robô (marketing, vendas, analise)',
            '/analise-tendencias - Análise automática de tendências',
            '/criar-funil - Criar funil de vendas automatizado',
            '/scan-mercado - Scan em plataformas freelancer',
            '/otimizar-campanhas - Otimizar campanhas ativas',
            '/status - Mostrar status do sistema',
            '/help - Mostrar esta ajuda'
        ];

        ajuda.forEach(linha => this.registrarLog(linha, 'AI'));
    }

    calcularTotalRobos() {
        return Object.values(this.robos).reduce((total, robo) => total + robo.quantidade, 0);
    }

    atualizarInterface() {
        document.getElementById('total-robos').textContent = this.calcularTotalRobos();
        
        const robosList = Object.entries(this.robos)
            .map(([tipo, data]) => `${tipo}(${data.quantidade})`)
            .join(', ');
        document.getElementById('robos-list').textContent = robosList;
        
        document.getElementById('total-analises').textContent = this.analisesRealizadas;
        document.getElementById('total-funis').textContent = this.funisAtivos;
    }

    registrarLog(mensagem, tipo = 'INFO') {
        this.logCount++;
        const timestamp = new Date().toLocaleTimeString();
        const logsContainer = document.getElementById('logs-container');
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${tipo.toLowerCase()}`;
        logEntry.innerHTML = `<strong>[${tipo}]</strong> ${mensagem} - ${timestamp}`;
        
        logsContainer.insertBefore(logEntry, logsContainer.firstChild);
        
        if (logsContainer.children.length > 20) {
            logsContainer.removeChild(logsContainer.lastChild);
        }
    }

    limparLogs() {
        document.getElementById('logs-container').innerHTML = '';
        this.logCount = 0;
        this.registrarLog('Logs limpos pelo usuário', 'INFO');
    }

    exportLogs() {
        this.registrarLog('📤 Exportando logs do sistema...', 'INFO');
        setTimeout(() => {
            this.registrarLog('✅ Logs exportados com sucesso!', 'SUCCESS');
        }, 1500);
    }
}

const painel = new GSAIPainel();

function executarComando() {
    const input = document.getElementById('command-input');
    const comando = input.value.trim();
    
    if (comando) {
        painel.executarComando(comando);
        input.value = '';
    }
}

function executarComandoRapido(comando) {
    document.getElementById('command-input').value = comando;
    executarComando();
}

document.getElementById('command-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        executarComando();
    }
});

setTimeout(() => {
    painel.registrarLog('💡 Dica: Digite /help para ver todos os comandos', 'AI');
}, 3000);