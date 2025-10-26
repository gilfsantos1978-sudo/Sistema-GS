// Sistema de Autenticação GS AI
class AuthSystem {
    constructor() {
        this.validUsers = {
            // Usuários autorizados - você pode mudar essas credenciais
            'admin': 'gsai2024',
            'gilberto': 'sistema123',
            'operador': 'painel456'
        };
        this.init();
    }

    init() {
        console.log('🔐 Sistema de Autenticação GS AI - Carregado');
        this.setupLoginForm();
        this.checkExistingSession();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (this.validateCredentials(username, password)) {
            this.loginSuccess(username);
        } else {
            this.loginError();
        }
    }

    validateCredentials(username, password) {
        return this.validUsers[username] === password;
    }

    loginSuccess(username) {
        // Salva a sessão
        localStorage.setItem('gsai_authenticated', 'true');
        localStorage.setItem('gsai_username', username);
        localStorage.setItem('gsai_login_time', new Date().toISOString());

        // Redireciona para o painel admin
        window.location.href = 'admin.html';
    }

    loginError() {
        alert('❌ Usuário ou senha incorretos!\n\nSe esqueceu suas credenciais, entre em contato com o suporte.');
        
        // Efeito visual de erro
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '#e74c3c';
            setTimeout(() => {
                input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }, 2000);
        });
    }

    checkExistingSession() {
        const isAuthenticated = localStorage.getItem('gsai_authenticated');
        const loginTime = localStorage.getItem('gsai_login_time');
        
        if (isAuthenticated === 'true' && this.isSessionValid(loginTime)) {
            // Se já está logado e a sessão é válida, redireciona
            window.location.href = 'admin.html';
        }
    }

    isSessionValid(loginTime) {
        if (!loginTime) return false;
        
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        // Sessão expira em 24 horas
        return hoursDiff < 24;
    }

    // Método para logout
    static logout() {
        localStorage.removeItem('gsai_authenticated');
        localStorage.removeItem('gsai_username');
        localStorage.removeItem('gsai_login_time');
        window.location.href = 'login.html';
    }

    // Método para verificar se usuário está autenticado
    static isAuthenticated() {
        const isAuth = localStorage.getItem('gsai_authenticated');
        const loginTime = localStorage.getItem('gsai_login_time');
        
        if (isAuth === 'true') {
            const authSystem = new AuthSystem();
            return authSystem.isSessionValid(loginTime);
        }
        return false;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    new AuthSystem();
});
