// Configuração do Supabase - USE SUAS PRÓPRIAS CREDENCIAIS
const SUPABASE_URL = 'https://jelzheugzimwucqnytok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbHpoZXVnemltd3VjcW55dG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTYxOTcsImV4cCI6MjA3MzUzMjE5N30.lviaZq07p_F_NaT5hloCua7sRT1sKChQD3Qy9ymvP1o';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', function() {
    initSystem();
    setupNavigation();
});

async function initSystem() {
    await loadRobots();
    await loadLogs();
    setupRealtime();
    initCharts();
}

async function loadRobots() {
    const { data: robots, error } = await supabase
        .from('robots')
        .select('*')
        .order('last_heartbeat', { ascending: false });

    if (error) {
        console.error('Erro ao carregar robôs:', error);
        showError('Erro ao carregar robôs: ' + error.message);
        return;
    }

    renderRobots(robots);
    updateStats(robots);
}

function renderRobots(robots) {
    const container = document.getElementById('robots-container');
    if (!container) return;
    
    container.innerHTML = '';

    robots.forEach(robot => {
        const metrics = robot.metrics || {};
        const card = document.createElement('div');
        card.className = 'robot-card scan-line';
        card.innerHTML = `
            <div class="robot-status ${robot.status === 'active' ? 'status-active' : 'status-offline'}">
                ${robot.status.toUpperCase()}
            </div>
            <h3>${robot.name}</h3>
            <p>Último heartbeat: ${formatDate(robot.last_heartbeat)}</p>
            
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
                
                <div class="metric">
                    <span>Uptime: ${metrics.uptime || '0%'}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${parseFloat(metrics.uptime) || 0}%"></div>
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
                    <div class="metric-item">
                        <small>Domínios:</small>
                        <strong>${metrics.dominios_ativos || 0}</strong>
                    </div>
                    <div class="metric-item">
                        <small>Verificações/h:</small>
                        <strong>${metrics.verificacoes_hora || 0}</strong>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function updateStats(robots) {
    // Atualizar contadores do dashboard
    const activeRobots = robots.filter(r => r.status === 'active').length;
    const totalRequests = robots.reduce((sum, robot) => {
        return sum + (robot.metrics?.verificacoes_hora || 0);
    }, 0);
    
    document.getElementById('active-robots').textContent = activeRobots;
    document.getElementById('requests-hour').textContent = totalRequests;
    
    // Calcular uptime médio
    const avgUptime = robots.reduce((sum, robot) => {
        return sum + parseFloat(robot.metrics?.uptime || 0);
    }, 0) / robots.length;
    
    document.getElementById('system-uptime').textContent = avgUptime.toFixed(1) + '%';
}

function showError(message) {
    console.error(message);
    // Você pode adicionar um toast ou alerta visual aqui
}