// CONFIGURACAO SUPABASE
const SUPABASE_URL = 'https://jelzheugzimwucqnytok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbHpoZXVnemltd3VjcW55dG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTYxOTcsImV4cCI6MjA3MzUzMjE5N30.lviaZq07p_F_NaT5hloCua7sRT1sKChQD3Qy9ymvP1o';

let supabase = null;

function initSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            throw new Error('Biblioteca Supabase nao carregada');
        }

        if (SUPABASE_URL.includes('SEU-PROJETO') || SUPABASE_ANON_KEY.includes('SUA-CHAVE')) {
            console.warn('Credenciais do Supabase nao configuradas');
            showError('Configure as credenciais do Supabase no arquivo app.js');
            return false;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase inicializado');
        return true;
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        showError('Erro na inicializacao: ' + error.message);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema GS Iniciado');
    
    if (initSupabase()) {
        carregarDados();
        setInterval(carregarDados, 60000);
        setTimeout(enviarHeartbeat, 5000);
        setInterval(enviarHeartbeat, 120000);
    }
});

async function carregarDados() {
    if (!supabase) {
        console.error('Supabase nao inicializado');
        return;
    }

    try {
        console.log('Carregando dados...');

        const { data: robots, error: robotsError } = await supabase
            .from('robots')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (robotsError) {
            console.error('Erro ao carregar robos:', robotsError);
            throw new Error('Erro na tabela robots: ' + robotsError.message);
        }

        const { data: platforms, error: platformsError } = await supabase
            .from('affiliate_platforms')
            .select('*')
            .order('nome', { ascending: true });
        
        if (platformsError) {
            console.error('Erro ao carregar plataformas:', platformsError);
            throw new Error('Erro na tabela affiliate_platforms: ' + platformsError.message);
        }

        console.log('Carregados: ' + (robots?.length || 0) + ' robos, ' + (platforms?.length || 0) + ' plataformas');

        atualizarEstatisticas(robots || [], platforms || []);
        renderizarRobos(robots || []);
        renderizarPlataformas(platforms || []);

        console.log('Dados carregados com sucesso');

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError(error.message);
    }
}

function atualizarEstatisticas(robots, platforms) {
    const activeRobots = robots.filter(r => r.status === 'active').length;
    updateElement('active-robots', activeRobots);
    updateElement('total-platforms', platforms.length);
    
    const totalRequests = robots.reduce((sum, robot) => {
        const metrics = robot.metrics || {};
        return sum + (metrics.verificacoes_hora || 0);
    }, 0);
    updateElement('requests-hour', totalRequests);
}

function renderizarRobos(robots) {
    const container = document.getElementById('robots-container');
    if (!container) {
        console.warn('Elemento robots-container nao encontrado');
        return;
    }

    if (robots.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhum robo cadastrado</p></div>';
        return;
    }

    container.innerHTML = '';

    robots.forEach(robot => {
        const card = criarCardRobo(robot);
        container.appendChild(card);
    });
}

function criarCardRobo(robot) {
    const metrics = robot.metrics || {};
    const card = document.createElement('div');
    card.className = 'cyber-card robot-card';
    
    const isActive = robot.status === 'active';
    const statusClass = isActive ? 'status-active' : 'status-inactive';
    const statusText = robot.status?.toUpperCase() || 'DESCONHECIDO';
    
    let heartbeatText = 'Nunca';
    if (robot.last_heartbeat) {
        try {
            const date = new Date(robot.last_heartbeat);
            heartbeatText = date.toLocaleString('pt-BR');
        } catch (e) {
            heartbeatText = 'Data invalida';
        }
    }
    
    const cpuUso = Math.min(Math.max(metrics.cpu_uso || 0, 0), 100);
    const memoriaUso = Math.min(Math.max(metrics.memoria_uso || 0, 0), 100);
    
    card.innerHTML = '<div class="robot-status ' + statusClass + '">' + statusText + '</div>' +
        '<h3>' + (robot.name || 'Robo sem nome') + '</h3>' +
        '<p class="robot-heartbeat">Ultimo: ' + heartbeatText + '</p>' +
        '<div class="metrics">' +
        '<div class="metric">' +
        '<span>CPU: ' + cpuUso.toFixed(1) + '%</span>' +
        '<div class="progress-bar">' +
        '<div class="progress-fill" style="width: ' + cpuUso + '%"></div>' +
        '</div>' +
        '</div>' +
        '<div class="metric">' +
        '<span>Memoria: ' + memoriaUso.toFixed(1) + '%</span>' +
        '<div class="progress-bar">' +
        '<div class="progress-fill" style="width: ' + memoriaUso + '%"></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    
    return card;
}

function renderizarPlataformas(platforms) {
    const container = document.getElementById('platforms-mini-container');
    if (!container) {
        console.warn('Elemento platforms-mini-container nao encontrado');
        return;
    }

    if (platforms.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Nenhuma plataforma cadastrada</p></div>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'platform-mini-grid';

    platforms.slice(0, 4).forEach(platform => {
        const card = criarCardPlataforma(platform);
        grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
}

function criarCardPlataforma(platform) {
    const metrics = platform.metrics || {};
    const card = document.createElement('div');
    card.className = 'platform-card';
    
    card.innerHTML = '<div class="platform-icon">' + getPlatformIcon(platform.nome) + '</div>' +
        '<div class="platform-name">' + (platform.nome || 'Sem nome') + '</div>' +
        '<div class="platform-metric">' + (metrics.taxa_sucesso || 'N/A') + '</div>';
    
    return card;
}

function getPlatformIcon(nome) {
    const icons = {
        'Shopee': '🛍️',
        'Mercado Livre': '📦',
        'Monetizze': '💰',
        'Hotmart': '🎯',
        'Amazon': '📦',
        'Eduzz': '💎',
        'Braip': '🚀',
        'Kiwify': '🥝',
        'PerfectPay': '💳'
    };
    return icons[nome] || '🔗';
}

async function enviarHeartbeat() {
    if (!supabase) {
        console.warn('Supabase nao inicializado - heartbeat cancelado');
        return;
    }

    try {
        const { data: activeRobots, error: selectError } = await supabase
            .from('robots')
            .select('id')
            .eq('status', 'active');

        if (selectError) throw selectError;

        if (!activeRobots || activeRobots.length === 0) {
            console.log('Nenhum robo ativo para atualizar');
            return;
        }

        const now = new Date().toISOString();
        const { error: updateError } = await supabase
            .from('robots')
            .update({
                last_heartbeat: now,
                updated_at: now
            })
            .eq('status', 'active');

        if (updateError) throw updateError;

        console.log('Heartbeat enviado para ' + activeRobots.length + ' robo(s)');
    } catch (error) {
        console.error('Erro no heartbeat:', error.message);
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    } else {
        console.warn('Elemento ' + id + ' nao encontrado');
    }
}

function showError(message) {
    const container = document.getElementById('robots-container');
    if (container) {
        container.innerHTML = '<div class="error-message">' +
            '<h3>Erro</h3>' +
            '<p>' + message + '</p>' +
            '<small>Verifique o console para mais detalhes</small>' +
            '</div>';
    }
}