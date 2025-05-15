document.addEventListener('DOMContentLoaded', () => {
    const elementos = {
        status: document.getElementById('status-display'),
        board: document.getElementById('board'),
        mensagem: document.querySelector('.message-text'),
        botaoSom: document.getElementById('sound-btn'),
        botaoReiniciar: document.getElementById('restart-btn'),
        playerXScore: document.getElementById('playerX-score'),
        playerOScore: document.getElementById('playerO-score'),
        draws: document.getElementById('draws'),
        playerIndicator: document.getElementById('player-indicator'),
        caixaMensagem: document.getElementById('message'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };

    const statusMessages = [
        "$ Iniciando sistema de jogo...",
        "✅ Jogador X venceu!",
        "✅ Jogador O venceu!",
        "🤝 Empate!",
        "ALERTA: Movimento inválido!",
        "> Aguardando jogada do jogador..."
    ];

    const frasesAtaque = [
        "> Exploit detectado! Tentando invadir o sistema...",
        "🛡️ Patch aplicado! Fortalecendo a defesa...",
        "🔥 Ataque em andamento! Protegendo as linhas de código...",
        "🔒 Sistema reforçado contra vulnerabilidades!",
        "💥 Exploit avançando... Precisa de uma contra-medida!",
        "🛡️ Defesa ativada! Mantendo o sistema seguro...",
        "⚔️ Embate entre exploits e patches!",
        "🚨 Alerta! Tentativa de invasão detectada!",
        "🛡️ Atualização de segurança em progresso..."
    ];

    const estadoJogo = {
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        gameOver: false,
        scores: { playerX: 0, playerO: 0, draws: 0 },
        somAtivado: true,
        gameHistory: []
    };

    const sons = {
        move: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'),
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-213.mp3'),
        error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3')
    };

    // Controle global do intervalo do typeWriter
    let typingInterval = null;

    function typeWriter(element, text, speed = 50) {
        if (typingInterval) clearInterval(typingInterval);

        // Limpa espaços extras e quebras
        text = text.replace(/\s+/g, ' ').trim();

        let i = 0;
        element.textContent = '';
        element.classList.add('typing');

        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                element.classList.remove('typing');
                typingInterval = null;
            }
        }, speed);
    }

    function iniciarJogo() {
        estadoJogo.board = ['', '', '', '', '', '', '', '', ''];
        estadoJogo.currentPlayer = 'X';
        estadoJogo.gameOver = false;

        atualizarTabuleiro();
        atualizarStatus();
        atualizarIndicadorJogador();
        definirMensagem(`Vez do Jogador ${estadoJogo.currentPlayer}`, 'info');

        // Frase inicial no box
        const fraseInicial = frasesAtaque[Math.floor(Math.random() * frasesAtaque.length)];
        typeWriter(elementos.status, fraseInicial);
    }

    // restante das funções (criarTabuleiro, atualizarTabuleiro, fazerJogada, etc.) seguem iguais
    // lembre-se de chamar typeWriter para mostrar as frases aleatórias sempre que quiser atualizar o box.

    // ...

    // Event listeners e inicialização
    elementos.botaoSom.addEventListener('click', alternarSom);
    elementos.botaoReiniciar.addEventListener('click', iniciarJogo);
    elementos.showRanking.addEventListener('click', mostrarRanking);
    elementos.closeRanking.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });
    elementos.overlay.addEventListener('click', () => {
        elementos.ranking.classList.add('hidden');
        elementos.overlay.classList.add('hidden');
    });

    criarTabuleiro();
    iniciarJogo();
});
