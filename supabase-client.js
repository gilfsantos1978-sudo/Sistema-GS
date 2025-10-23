const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-anon-public';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', function() {
    initSystem();
});

async function initSystem() {
    await loadRobots();
    await loadLogs();
    setupRealtime();
}

async function loadRobots() {
    const { data: robots, error } = await supabase
        .from('robots')
        .select('*')
        .order('last_heartbeat', { ascending: false });

    if (error) {
        console.error('Erro ao carregar robôs:', error);
        return;
    }

    renderRobots(robots);
}

function renderRobots(robots) {
    const container = document.getElementById('robots-container');
    if (!container) return;
    
    container.innerHTML = '';

    robots.forEach(robot => {
        const metrics = robot.metrics || {};
        const card = document.createElement('div');
        card.className = 'robot-card';
        card.innerHTML = `
            <div class="robot-status ${robot.status === 'active' ? 'status-active' : 'status-offline'}">
                ${robot.status.toUpperCase()}
            </div>
            <h3>${robot.name}</h3>
            <p>Último: ${new Date(robot.last_heartbeat).toLocaleString('pt-BR')}</p>
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
                        <div class="progress-fill" style="width: ${metrics.memoria_uso || 0}%