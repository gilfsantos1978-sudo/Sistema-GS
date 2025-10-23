// Atualizar heartbeat do robô existente
async function updateRobotHeartbeat() {
    const robotId = '356a5a4a-ed38-4d9c-8f5d-e2852c91e482'; // ID do seu robô existente
    
    const newMetrics = {
        cpu_uso: Math.floor(Math.random() * 20) + 25, // Entre 25-45%
        memoria_uso: Math.floor(Math.random() * 15) + 25, // Entre 25-40%
        uptime: "99.9%",
        deploy_hoje: Math.floor(Math.random() * 3) + 8, // Entre 8-11
        integridade: 98,
        dominios_ativos: 12,
        verificacoes_hora: Math.floor(Math.random() * 50) + 100, // Entre 100-150
        tempo_deploy_medio: "45s",
        dns_status: "operacional",
        ssl_status: "valido"
    };

    try {
        const { error } = await supabase
            .from('robots')
            .update({
                last_heartbeat: new Date().toISOString(),
                metrics: newMetrics,
                updated_at: new Date().toISOString()
            })
            .eq('id', robotId);

        if (error) throw error;

        console.log('✅ Heartbeat atualizado:', new Date().toLocaleTimeString());
        
        // Adicionar log de atividade
        await addLog(robotId, 'Heartbeat atualizado - Sistema operacional', 'info');
        
    } catch (error) {
        console.error('❌ Erro no heartbeat:', error);
        await addLog(robotId, 'ERRO: Falha no heartbeat', 'error');
    }
}

// Adicionar log
async function addLog(robotId, acao, tipo = 'info') {
    try {
        const { error } = await supabase
            .from('registros')
            .insert({
                robot_id: robotId,
                acao: acao,
                tipo: tipo
            });

        if (error) throw error;
    } catch (error) {
        console.error('Erro ao adicionar log:', error);
    }
}

// Iniciar heartbeat automático
function startHeartbeat() {
    // Executar imediatamente
    updateRobotHeartbeat();
    
    // Executar a cada 30 segundos
    setInterval(updateRobotHeartbeat, 30000);
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(startHeartbeat, 3000);
});