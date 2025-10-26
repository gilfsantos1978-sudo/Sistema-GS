const cron = require('node-cron');

class AgendadorTarefas {
    constructor(sistemaRobos) {
        this.robos = sistemaRobos;
        this.tarefasAgendadas = [];
        this.proximaTarefa = null;
    }

    iniciar() {
        console.log('⏰ Agendador de Tarefas - Iniciando...');
        
        // Agendar tarefas automáticas
        this.agendarTarefas();
        
        console.log('✅ Agendador de Tarefas - Ativo 24/7');
    }

    agendarTarefas() {
        // Análise de tendências a cada 4 horas
        cron.schedule('0 */4 * * *', () => {
            console.log('🕐 Executando análise de tendências agendada');
            this.robos.executarRobo('analiseTendencias');
        });

        // Scan de mercado a cada 6 horas  
        cron.schedule('0 */6 * * *', () => {
            console.log('🕐 Executando scan de mercado agendado');
            this.robos.executarRobo('scanMercado');
        });

        // Análise de concorrentes às 8h e 20h
        cron.schedule('0 8,20 * * *', () => {
            console.log('🕐 Executando análise de concorrentes agendada');
            this.robos.executarRobo('analiseConcorrentes');
        });

        // Otimização de campanhas diária às 9h
        cron.schedule('0 9 * * *', () => {
            console.log('🕐 Executando otimização de campanhas agendada');
            this.robos.executarRobo('otimizacaoCampanhas');
        });

        // Log de status a cada hora
        cron.schedule('0 * * * *', () => {
            this.logStatusSistema();
        });
    }

    logStatusSistema() {
        const status = this.robos.getStatusRobos();
        console.log('📊 Status do Sistema 24/7:');
        console.log(`- Análises realizadas: ${this.robos.analisesRealizadas}`);
        console.log(`- Última análise: ${this.robos.ultimaAnalise}`);
        
        for (const [robo, info] of Object.entries(status)) {
            console.log(`- ${robo}: ${info.ativo ? '✅' : '❌'} | Última: ${info.ultimaExecucao}`);
        }
        console.log('---');
    }

    parar() {
        this.tarefasAgendadas.forEach(tarefa => tarefa.stop());
        console.log('🛑 Agendador de Tarefas - Parado');
    }
}

module.exports = AgendadorTarefas;
