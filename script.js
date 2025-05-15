document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const elementos = {
        status: document.getElementById('status-display'),
        board: document.getElementById('board'),
        mensagem: document.querySelector('.message-text'),
        botaoModo: document.getElementById('mode-btn'),
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

    // Mensagens de status fixas (para erros, vitórias e empates)
    const statusMessages = [
        "$ Iniciando sistema de jogo...",
        "✅ Jogador X venceu!",
        "✅ Jogador O venceu!",
        "🤝 Empate!",
        "ALERTA: Movimento inválido!",
        "> Aguardando jogada do jogador..."
    ];

    // Frases temáticas de ataque e defesa para mostrar no box de status
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

    // Estado do jogo
    const estadoJogo = {
        board: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: 'X',
        gameOver: false,
        scores: {
            playerX: 0,
            playerO: 0,
            draws: 0
        },
        somAtivado: true,
        gameHistory: []
    };

    // Sons
    const sons = {
        move: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3'),
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-game-over-213.mp3'),
        error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3')
    };

    // Inicialização do jogo
    function iniciarJogo() {
        estadoJogo.board = ['', '', '', '', '', '', '', '', ''];
        estadoJogo.currentPlayer = 'X';
        estadoJogo.gameOver = false;
        
        atualizarTabuleiro();
        atualizarStatus();
        atualizarIndicadorJogador();
        definirMensagem(`Vez do Jogador ${estadoJogo.currentPlayer}`, 'info');

        // Frase inicial temática no box de status
        const fraseInicial = frasesAtaque[Math.floor(Math.random() * frasesAtaque.length)];
        typeWriter(elementos.status, fraseInicial);
    }

    // Cria o tabuleiro
    function criarTabuleiro() {
        elementos.board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => fazerJogada(i));
            elementos.board.appendChild(cell);
        }
    }

    // Atualiza o tabuleiro na tela com ícones FontAwesome
    function atualizarTabuleiro() {
        const cells = document.querySelectorAll('.cell');
        estadoJogo.board.forEach((valor, index) => {
            cells[index].innerHTML = '';
            cells[index].className = 'cell';
            if (valor === 'X') {
                cells[index].innerHTML = '<i class="fa-solid fa-virus"></i>';
                cells[index].classList.add('x');
            } else if (valor === 'O') {
                cells[index].innerHTML = '<i class="fa-solid fa-shield"></i>';
                cells[index].classList.add('o');
            }
        });
    }

    // Processa uma jogada
    function fazerJogada(index) {
        if (estadoJogo.gameOver || estadoJogo.board[index] !== '') {
            tocarSom(sons.error);
            typeWriter(elementos.status, statusMessages[4]);
            return;
        }

        estadoJogo.board[index] = estadoJogo.currentPlayer;
        tocarSom(sons.move);
        atualizarTabuleiro();

        // Verifica se há um vencedor
        if (verificarVitoria(estadoJogo.currentPlayer)) {
            finalizarJogo(estadoJogo.currentPlayer);
            return;
        }

        // Verifica empate
        if (verificarEmpate()) {
            finalizarJogo('draw');
            return;
        }

        // Alterna jogador
        estadoJogo.currentPlayer = estadoJogo.currentPlayer === 'X' ? 'O' : 'X';
        atualizarIndicadorJogador();
        definirMensagem(`Vez do Jogador ${estadoJogo.currentPlayer}`, 'info');

        // Mostra uma frase temática aleatória no box de status
        const fraseAleatoria = frasesAtaque[Math.floor(Math.random() * frasesAtaque.length)];
        typeWriter(elementos.status, fraseAleatoria);
    }

    // Verifica se há um vencedor
    function verificarVitoria(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            if (estadoJogo.board[a] === player && 
                estadoJogo.board[b] === player && 
                estadoJogo.board[c] === player) {
                
                pattern.forEach(index => {
                    document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner');
                });
                
                return true;
            }
            return false;
        });
    }

    // Verifica empate
    function verificarEmpate() {
        return !estadoJogo.board.includes('') && !verificarVitoria('X') && !verificarVitoria('O');
    }

    // Finaliza o jogo
    function finalizarJogo(resultado) {
        estadoJogo.gameOver = true;
        
        if (resultado === 'X') {
            estadoJogo.scores.playerX++;
            elementos.playerXScore.textContent = estadoJogo.scores.playerX;
            typeWriter(elementos.status, statusMessages[1]);
            definirMensagem('🎉 Jogador X venceu!', 'success');
            tocarSom(sons.win);
        } else if (resultado === 'O') {
            estadoJogo.scores.playerO++;
            elementos.playerOScore.textContent = estadoJogo.scores.playerO;
            typeWriter(elementos.status, statusMessages[2]);
            definirMensagem('🎉 Jogador O venceu!', 'success');
            tocarSom(sons.win);
        } else {
            estadoJogo.scores.draws++;
            elementos.draws.textContent = estadoJogo.scores.draws;
            typeWriter(elementos.status, statusMessages[3]);
            definirMensagem('🤝 Empate!', 'info');
            tocarSom(sons.draw);
        }
        
        salvarPartida(resultado);
    }

    // Atualiza o status do jogo (simples)
    function atualizarStatus() {
        typeWriter(elementos.status, statusMessages[0]);
    }

    // Atualiza o indicador de jogador atual com ícones
    function atualizarIndicadorJogador() {
        if (estadoJogo.currentPlayer === 'X') {
            elementos.playerIndicator.innerHTML = '<i class="fa-solid fa-virus"></i>';
            elementos.playerIndicator.style.color = 'var(--player-x)';
        } else {
            elementos.playerIndicator.innerHTML = '<i class="fa-solid fa-shield"></i>';
            elementos.playerIndicator.style.color = 'var(--player-o)';
        }
    }

    // Alterna som
    function alternarSom() {
        estadoJogo.somAtivado = !estadoJogo.somAtivado;
        elementos.botaoSom.innerHTML = estadoJogo.somAtivado ? 
            '<i class="fas fa-volume-up"></i> Som' : 
            '<i class="fas fa-volume-mute"></i> Som';
    }

    // Toca som
    function tocarSom(som) {
        if (estadoJogo.somAtivado) {
            som.currentTime = 0;
            som.play().catch(e => console.log("Erro ao reproduzir som:", e));
        }
    }

    // Configura mensagem na tela (mensagem dentro da caixa de status)
    function definirMensagem(texto, tipo = 'info') {
        elementos.mensagem.textContent = texto;
        elementos.caixaMensagem.className = 'message-box ' + tipo;
    }

    // Efeito de máquina de escrever
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        element.classList.add('typing');
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
                element.classList.remove('typing');
            }
        }, speed);
    }

    // Salva partida no histórico
    function salvarPartida(resultado) {
        const partida = {
            data: new Date().toLocaleString('pt-BR'),
            modo: '2 Jogadores',
            vencedor: resultado === 'X' ? 'Jogador X' : 
                     resultado === 'O' ? 'Jogador O' : 'Empate',
            tabuleiro: [...estadoJogo.board]
        };
        
        estadoJogo.gameHistory.unshift(partida);
        
        if (estadoJogo.gameHistory.length > 10) {
            estadoJogo.gameHistory.pop();
        }
        
        atualizarRanking();
    }

    // Atualiza o ranking
    function atualizarRanking() {
        elementos.rankingList.innerHTML = estadoJogo.gameHistory.map((partida, index) => `
            <li>
                <span class="rank">${index + 1}º</span>
                <span class="name">${partida.vencedor}</span>
                <span class="score">${partida.modo}</span>
                <span class="date">${partida.data}</span>
            </li>
        `).join('');
    }

    // Mostra ranking
    function mostrarRanking() {
        elementos.ranking.classList.remove('hidden');
        elementos.overlay.classList.remove('hidden');
    }

    // Remove listener e esconde o botão modo para evitar uso
    if (elementos.botaoModo) {
        elementos.botaoModo.style.display = 'none';
        elementos.botaoModo.removeEventListener('click', () => {});
    }

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

    // Inicia o jogo
    criarTabuleiro();
    iniciarJogo();
});
