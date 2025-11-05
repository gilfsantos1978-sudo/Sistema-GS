const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const { createClient } = require('@supabase/supabase-js'); // NOVO: Importa o Supabase

const app = express();
const PORT = process.env.PORT || 3000;

// CONFIGURAÇÃO DO SUPABASE (USANDO VARIÁVEIS DE AMBIENTE)
// Você deve configurar SUPABASE_URL e SUPABASE_KEY no Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey); // NOVO: Inicializa o cliente

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Importar sistemas
const SistemaRobos = require('./robos');
const AgendadorTarefas = require('./agendador');

// Inicializar sistemas
const robos = new SistemaRobos();
const agendador = new AgendadorTarefas(robos);

// ROTAS DA API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        sistema: 'GS AI Backend 24/7',
        versao: '1.0.0',
        robosAtivos: robos.getStatusRobos(),
        ultimaAnalise: robos.ultimaAnalise,
        proximaTarefa: agendador.proximaTarefa
    });
});

app.get('/api/robos/status', (req, res) => {
    res.json(robos.getStatusRobos());
});

app.post('/api/robos/executar/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const resultado = robos.executarRobo(tipo);
    res.json(resultado);
});

app.get('/api/analises/ultimas', (req, res) => {
    res.json(robos.getUltimasAnalises());
});

// NOVA ROTA: BUSCAR DADOS DE GANHOS DO SUPABASE
app.get('/api/ganhos', async (req, res) => {
    try {
        // ATENÇÃO: Substitua 'ganhos_diarios' pelo nome da sua tabela real de ganhos
        const { data, error } = await supabase
            .from('ganhos_diarios') 
            .select('*')
            .order('data', { ascending: false })
            .limit(4); // Busca os 4 últimos registros (Diário, Semanal, Quinzenal, Mensal)

        if (error) throw error;

        // Formato de retorno (Exemplo)
        const ganhos = {
            diario: data[0] || { valor: 0, tendencia: 0 },
            semanal: data[1] || { valor: 0, tendencia: 0 },
            quinzenal: data[2] || { valor: 0, tendencia: 0 },
            mensal: data[3] || { valor: 0, tendencia: 0 },
            projecao: 0 // A projeção será calculada no frontend ou aqui
        };

        res.json(ganhos);

    } catch (error) {
        console.error('Erro ao buscar ganhos do Supabase:', error.message);
        res.status(500).json({ error: 'Falha ao buscar dados de ganhos' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 GS AI Backend rodando na porta ${PORT}`);
    console.log(`📊 Sistema 24/7 iniciado: ${new Date().toLocaleString()}`);
    
    // Iniciar agendador de tarefas
    agendador.iniciar();
});
