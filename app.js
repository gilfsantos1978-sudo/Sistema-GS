// Configuração do Supabase - SUBSTITUA COM SUAS CREDENCIAIS
const SUPABASE_URL = https://jelzheugzimwucqnytok.supabase.co
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbHpoZXVnemltd3VjcW55dG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTYxOTcsImV4cCI6MjA3MzUzMjE5N30.lviaZq07p_F_NaT5hloCua7sRT1sKChQD3Qy9ymvP1o

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema GS Iniciado');
    carregarDados();
    configurarNavegacao();
    iniciarHeartbeat();
});

// Carregar dados do Supabase
async function carregarDados() {
    try {
        // Carregar robôs
        const { data: robots, error: robotsError } = await supabase
            .from('robots')
            .select('*');

        if (robotsError) throw robotsError;

        // Carregar plataformas
        const { data: platforms, error: platformsError } = await supabase
            .from('affiliate_platforms')
            .select('*');

        if (platformsError) throw platformsError;

        // Carregar logs
        const { data: logs, error: logsError } = await supabase
            .from('registros')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (logsError) throw logsError;

        // Mostrar dados
        mostrarRobots(robots || []);
        mostrarPlataformas(platforms || []);
        mostrarLogs(logs || []);

        console.log('Dados carregados com sucesso!');

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar dados. Verifique o console.');
    }
}

// Mostrar robôs
function mostrarRobots(robots) {
    const container = document.getElementById('robots-container');
    if (!container) return;

    container.innerHTML = '';

    robots.forEach(robot => {
        const metrics = robot.metrics || {};
        const card = document.createElement('div');
        card.className = 'cyber-card robot-card';
        card.innerHTML = `
            <div class="robot-status status-active">${robot.status.toUpperCase()}</div>
            <h3>${robot.name}</h3>
            <p>Último heartbeat: ${formatarData(robot.last_heartbeat)}</p>
            <div class="metrics">
                <div class="metric">
                    <span>CPU: ${metrics.cpu_uso || 0}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${metrics.cpu_uso || 0}%"></div>
                    </div>
                </div>
                <div class="metric">
                    <span>Memória: ${metrics.memoria_uso || 0}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${metrics.memoria_uso || 0}%"></div>
                    </div>
                </div>
                <div class="metric-grid">
                    <div class="metric-item">
                        <small>Deploys Hoje:</small>
                        <strong>${metrics.deploy_hoje || 0}</strong>
                    </div>
                    <div class="metric-item">
                        <small>Integridade:</small>
                        <strong>${metrics.integridade || 0}%</strong>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Mostrar plataformas
function mostrarPlataformas(platforms) {
    const container = document.getElementById('platforms-container');
    if (!container) return;

    container.innerHTML = '';

    platforms.forEach(platform => {
        const metrics = platform.metrics || {};
        const card = document.createElement('div');
        card.className = 'cyber-card platform-card';
        card.innerHTML = `
            <h3>${platform.nome}</h3>
            <div class="platform-type">${platform.tipo}</div>
            <div class="metric-grid">
                <div class="metric-item">
                    <small>Taxa Sucesso:</small>
                    <strong>${metrics.taxa_sucesso || 'N/A'}</strong>
                </div>
                <div class="metric-item">
                    <small>Requisições/h:</small>
                    <strong>${metrics.requisicoes_hora || 0}</strong>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Mostrar logs
function mostrarLogs(logs) {
    const container = document.getElementById('logs-container');
    if (!container) return;

    container.innerHTML = '';

    logs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${log.tipo || 'info'}`;
        logEntry.innerHTML = `
            <strong>[${formatarData(log.created_at)}]</strong> ${log.acao}
        `;
        container.appendChild(logEntry);
    });
}

// Configurar navegação
function configurarNavegacao() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            mostrarSecao(sectionId);
        });
    });
}

// Mostrar seção
function mostrarSecao(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    // Mostrar a seção clicada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

// Formatar data
function formatarData(dataString) {
    return new Date(dataString).toLocaleString('pt-BR');
}

// Heartbeat automático
function iniciarHeartbeat() {
    setInterval(atualizarHeartbeat, 30000);
}

async function atualizarHeartbeat() {
    const robotId = '356a5a4a-ed38-4d9c-8f5d-e2852c91e482';
    const metrics = {
        cpu_uso: Math.floor(Math.random() * 20) + 25,
        memoria_uso: Math.floor(Math.random() * 15) + 25,
        uptime: "99.9%",
        deploy_hoje: Math.floor(Math.random() * 3) + 8,
        integridade: 98,
        dominios_ativos: 12,
        verificacoes_hora: Math.floor(Math.random() * 50) + 100,
        tempo_deploy_medio: "45s",
        dns_status: "operacional",
        ssl_status: "valido"
    };

    try {
        const { error } = await supabase
            .from('robots')
            .update({
                last_heartbeat: new Date().toISOString(),
                metrics: metrics,
                updated_at: new Date().toISOString()
            })
            .eq('id', robotId);

        if (error) throw error;

        console.log('Heartbeat atualizado:', new Date().toLocaleTimeString());
    } catch (error) {
        console.error('Erro no heartbeat:', error);
    }
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    const container = document.getElementById('robots-container');
    if (container) {
        container.innerHTML = `<div class="error-message">${mensagem}</div>`;
    }
}