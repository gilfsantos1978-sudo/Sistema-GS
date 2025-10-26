const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Rotas da API
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 GS AI Backend rodando na porta ${PORT}`);
    console.log(`📊 Sistema 24/7 iniciado: ${new Date().toLocaleString()}`);
    
    // Iniciar agendador de tarefas
    agendador.iniciar();
});
