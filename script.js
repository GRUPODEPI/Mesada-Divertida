/* Meu-Jogo-Quiz — script.js
    Versão: Quiz animado com Feedback Pedagógico e localStorage (v2.7 - Cores no Feedback)
*/

const STORAGE_KEY = 'meu_jogo_quiz_v2_7'; // Chave atualizada para refletir as últimas mudanças

// ---------- Estado e elementos ----------
let state = {
    score: 0,
    wallet: 100, // Capital inicial ajustado para R$ 100
    stage: 0,
    completed: false
};
let isPaused = false; // Variável para controlar se o jogo está aguardando a explicação

const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const resetBtn = document.getElementById('reset-btn');
const playAgainBtn = document.getElementById('play-again');
const toMenuBtn = document.getElementById('to-menu');

const menu = document.getElementById('menu');
const gameArea = document.getElementById('game-area');
const resultArea = document.getElementById('result-area');

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreSpan = document.getElementById('score');
const walletSpan = document.getElementById('wallet');
const stageSpan = document.getElementById('stage');
const totalStagesSpan = document.getElementById('total-stages');
const feedbackEl = document.getElementById('feedback');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// ---------- Sons (opcionais) ----------
const sounds = {
    success: 'assets/sounds/success.mp3',
    fail: 'assets/sounds/fail.mp3',
    click: 'assets/sounds/click.mp3'
};
function playSound(src){
    if(!src) return;
    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(()=>{ /* autoplay blocked on some browsers — ignore */});
}

// ---------- Perguntas (COM EXPLICAÇÃO PEDAGÓGICA) ----------
const challenges = [
    { id: 'c1', q: 'Você recebeu R$100 de mesada. O que você faz?', choices: [
        { text: 'Guardo R$75 e gasto R$25', score: 10, walletDelta: -25, good: true, explanation: 'Ótima decisão! Você equilibrou o consumo com a economia (75% de economia!), praticando o bom planejamento.' },
        { text: 'Dou R$50 (metade) para um amigo', score: -5, walletDelta: -50, good: false, explanation: 'Compartilhar é legal, mas dar metade do seu dinheiro pode comprometer suas finanças pessoais. É preciso equilíbrio!' },
        { text: 'Gasto R$100 em compras por impulso', score: -10, walletDelta: -100, good: false, explanation: 'Gastar toda a mesada de uma vez significa que você não poderá comprar nada pelo resto do mês. É melhor guardar para objetivos maiores!' },
        { text: 'Compro um item de R$20 e guardo o resto', score: 8, walletDelta: -20, good: true, explanation: 'Excelente! Você atendeu a um pequeno desejo, mas priorizou a poupança. Isso é ter controle financeiro.' }
    ] },
    { id: 'c2', q: 'Você quer comprar um brinquedo de R$100. O que faz?', choices: [
        { text: 'Peço emprestado a juros', score: -10, walletDelta: 0, good: false, explanation: 'Pegar dinheiro emprestado com juros (ou taxas) é arriscado e deve ser evitado, pois você terá que devolver mais do que pegou.' },
        { text: 'Desisto e fico triste', score: -2, walletDelta: 0, good: false, explanation: 'Você pode ter um objetivo sem ter que desistir dele. O planejamento é a chave para alcançá-lo!' },
        { text: 'Guardo um pouco por mês até ter o suficiente', score: 12, walletDelta: 0, good: true, explanation: 'Parabéns! Isso se chama **planejamento** e **disciplina**. É a melhor forma de comprar algo caro!' },
        { text: 'Gasto R$40 em itens pequenos para compensar, e desisto do brinquedo de R$100', score: -5, walletDelta: -40, good: false, explanation: 'Cuidado com o "gasto de compensação"! Gastar sem foco faz você perder dinheiro com coisas que não queria realmente.' }
    ] },
    { id: 'c3', q: 'Seu amigo te convida para um lanche que custa R$20. Como proceder?', choices: [
        { text: 'Digo "sim" na hora, sem verificar se tenho dinheiro', score: -6, walletDelta: -20, good: false, explanation: 'Sempre confira seu saldo! Se você gastar mais do que tem, pode ficar com a carteira negativa. Isso é falta de orçamento.' },
        { text: 'Recuso educadamente e economizo', score: 5, walletDelta: 0, good: true, explanation: 'É bom economizar, mas é importante encontrar o equilíbrio entre economizar e aproveitar os momentos. Boa economia!' },
        { text: 'Verifico meu saldo, vejo que posso pagar e decido ir', score: 8, walletDelta: -20, good: true, explanation: 'Perfeito! Você verificou seu **orçamento** antes de tomar uma decisão, mostrando responsabilidade.' },
        { text: 'Compro um lanche mais barato de R$10 para economizar', score: 7, walletDelta: -10, good: true, explanation: 'Boa! Você adaptou a vontade ao seu orçamento, gastando menos do que o lanche de R$20.' }
    ] },
    { id: 'c4', q: 'Você encontrou uma promoção: brinquedo por R$80. Tem R$40 agora. O que faz?', choices: [
        { text: 'Economizo o restante e compro depois, mesmo que a promoção acabe', score: 10, walletDelta: 0, good: true, explanation: 'Economizar para comprar à vista é a melhor forma de evitar dívidas. Ótima disciplina!' },
        { text: 'Uso cartão e fico com dívida', score: -15, walletDelta: 0, good: false, explanation: 'O cartão de crédito (ou débito sem saldo) pode gerar dívidas e juros. Para crianças, é melhor usar o dinheiro que você já tem.' },
        { text: 'Peço para dividir com um amigo', score: -2, walletDelta: 0, good: false, explanation: 'Dividir pode ser uma solução, mas o ideal é comprar algo que você possa pagar sozinho.' },
        { text: 'Gasto os R$40 que tenho em outro brinquedo mais barato', score: 6, walletDelta: -40, good: true, explanation: 'Você fez uma escolha dentro de seu orçamento, mostrando maturidade e adaptabilidade.' }
    ] },
    { id: 'c5', q: 'Você quer ir ao cinema com amigos. O ingresso custa R$30. O que faz?', choices: [
        { text: 'Desisto e guardo o dinheiro', score: 6, walletDelta: 0, good: true, explanation: 'Economizar é sempre bom, mas lembre-se de que o lazer também faz parte da vida, desde que esteja no seu orçamento.' },
        { text: 'Vou e peço dinheiro emprestado', score: -5, walletDelta: 0, good: false, explanation: 'Pedir dinheiro emprestado cria uma dívida que você precisará pagar. É melhor usar seu próprio dinheiro.' },
        { text: 'Verifico se cabe no orçamento e pago o ingresso', score: 8, walletDelta: -30, good: true, explanation: 'Decisão inteligente! Você priorizou o lazer, mas só após confirmar que tinha o dinheiro.' },
        { text: 'Não vou ao cinema e gasto os R$30 em outra coisa', score: -3, walletDelta: -30, good: false, explanation: 'Você fez um gasto impulsivo. O ideal seria guardar o dinheiro ou usá-lo para um objetivo planejado.' }
    ] },
    { id: 'c6', q: 'Você viu um brinquedo por R$60, mas só tem R$40. O que faz?', choices: [
        { text: 'Economizo mais um pouco', score: 10, walletDelta: 0, good: true, explanation: 'Excelente! Você está praticando a paciência e o planejamento para atingir seu objetivo.' },
        { text: 'Peço para parcelar', score: -4, walletDelta: 0, good: false, explanation: 'Parcelar é uma forma de dívida. Para brinquedos, o ideal é juntar todo o dinheiro antes de comprar.' },
        { text: 'Compro outro mais barato que custa R$40', score: 7, walletDelta: -40, good: true, explanation: 'Decisão madura! Você adaptou sua vontade ao seu orçamento atual, mostrando flexibilidade.' },
        { text: 'Tento convencer meus pais a darem o restante', score: -2, walletDelta: 0, good: false, explanation: 'Pedir o que falta não é planejar. É melhor se esforçar para ganhar o dinheiro que falta.' }
    ] },
    { id: 'c7', q: 'Você quer comprar figurinhas. Cada pacote custa R$5. Você tem R$20. O que faz?', choices: [
        { text: 'Compro 2 pacotes e guardo o resto', score: 9, walletDelta: -10, good: true, explanation: 'Você gastou o que queria, mas ainda guardou metade para outra ocasião. Isso é equilíbrio financeiro.' },
        { text: 'Não compro nada', score: 5, walletDelta: 0, good: true, explanation: 'Boa! Você priorizou a economia. Mas lembre-se: é importante gastar um pouco para o lazer também!' },
        { text: 'Compro 4 pacotes (gasto tudo)', score: -3, walletDelta: -20, good: false, explanation: 'Gastar todo o dinheiro em um único item é arriscado. O ideal é deixar uma reserva.' },
        { text: 'Compro 1 pacote, mas me arrependo e gasto os R$15 restantes em doces', score: -6, walletDelta: -20, good: false, explanation: 'Gastar por impulso é um erro. O dinheiro que sobra deve ser guardado ou usado para algo mais importante.' }
    ] },
    { id: 'c8', q: 'Você quer comprar um presente para alguém. O que faz?', choices: [
        { text: 'Compro algo caro sem pensar', score: -6, walletDelta: -50, good: false, explanation: 'Comprar presentes caros exige planejamento. Se você não planeja, seu orçamento fica desorganizado.' },
        { text: 'Planejo um valor e economizo por um tempo', score: 10, walletDelta: 0, good: true, explanation: 'Planejamento é a chave! Ao definir um valor e juntar o dinheiro, você compra sem comprometer suas outras finanças.' },
        { text: 'Faço um presente criativo e gasto pouco', score: 8, walletDelta: -10, good: true, explanation: 'Ótimo! Você valorizou a criatividade e economizou. O valor do presente está na intenção, não no preço.' },
        { text: 'Compro o presente mais caro da loja para mostrar que gosto muito', score: -8, walletDelta: -100, good: false, explanation: 'O valor do presente está na intenção, não no preço. Comprar o mais caro pode prejudicar sua saúde financeira.' }
    ] },
    { id: 'c9', q: 'Você recebeu R$100. O que faz com esse dinheiro?', choices: [
        // CORRIGIDO: O walletDelta reflete o quanto dos R$100 recebidos sobrou (100 - gasto)
        { text: 'Gasto tudo em jogos online', score: -7, walletDelta: 0, good: false, explanation: 'Gastar grandes quantias em itens voláteis pode causar arrependimento. Tente sempre guardar uma parte.' },
        { text: 'Guardo R$50 e uso R$50', score: 10, walletDelta: 50, good: true, explanation: 'A regra de ouro (50/50) é ótima para começar a equilibrar gastos e economia. Parabéns! (Você guardou R$50).' },
        { text: 'Invisto em um cofrinho para um objetivo maior', score: 9, walletDelta: 100, good: true, explanation: 'Guardar todo o dinheiro para um objetivo maior (investir) é uma atitude de longo prazo que traz grandes recompensas. Excelente!' },
        { text: 'Compro um item de R$80 e me preocupo com o que sobrou', score: -4, walletDelta: 20, good: false, explanation: 'Comprar um item caro sem planejamento pode causar arrependimento e ansiedade sobre o que sobrou. (Você guardou R$20).' }
    ] },
    { id: 'c10', q: 'Você quer comprar um livro de R$30. O que faz?', choices: [
        { text: 'Espero uma promoção', score: 6, walletDelta: 0, good: true, explanation: 'Procurar promoções é um jeito inteligente de economizar dinheiro e ser um consumidor consciente.' },
        { text: 'Peço para alguém comprar', score: -2, walletDelta: 0, good: false, explanation: 'Tente usar seu próprio dinheiro para seus desejos. Isso ensina o valor do dinheiro.' },
        { text: 'Verifico se posso pagar e compro', score: 8, walletDelta: -30, good: true, explanation: 'Você checou o orçamento e fez a compra com responsabilidade. Ótima atitude.' },
        { text: 'Peço para comprar e parcelar no cartão dos pais', score: -5, walletDelta: 0, good: false, explanation: 'Evite dívidas! Parcelar um livro de R$30 é desnecessário. É melhor juntar o dinheiro.' }
    ] },
    { id: 'c11', q: 'Você quer comprar um jogo novo. O que faz?', choices: [
        { text: 'Economizo por 2 meses, se necessário', score: 10, walletDelta: 0, good: true, explanation: 'Isso é disciplina! Juntar dinheiro por um tempo para um item de valor é o segredo do sucesso financeiro.' },
        { text: 'Uso todo o dinheiro agora', score: -5, walletDelta: -50, good: false, explanation: 'Gastos impulsivos podem impedir você de comprar outras coisas mais importantes no futuro.' },
        { text: 'Peço emprestado', score: -3, walletDelta: 0, good: false, explanation: 'Evite dívidas desnecessárias! Tente sempre pagar seus desejos com seu próprio dinheiro.' },
        { text: 'Vendo um jogo antigo para ajudar a pagar o novo', score: 8, walletDelta: 0, good: true, explanation: 'Ótima atitude! Você está usando a revenda de itens para gerar renda extra e financiar seus desejos.' }
    ] },
    { id: 'c12', q: 'Você quer comprar um lanche na escola. O que faz?', choices: [
        { text: 'Compro só às sextas', score: 7, walletDelta: -5, good: true, explanation: 'Limitar as compras (criar uma regra) ajuda a controlar os gastos e economizar no final do mês.' },
        { text: 'Levo lanche de casa e economizo', score: 9, walletDelta: 0, good: true, explanation: 'Levar lanche de casa é uma das melhores formas de economizar dinheiro todos os dias!' },
        { text: 'Compro todos os dias', score: -6, walletDelta: -20, good: false, explanation: 'Comprar todos os dias pode parecer pouco, mas no final do mês a soma é grande. Isso compromete o orçamento.' },
        { text: 'Peço dinheiro emprestado aos amigos para comprar um lanche diferente todo dia', score: -7, walletDelta: 0, good: false, explanation: 'Criar dívidas, mesmo que pequenas, com amigos para um lanche é um péssimo hábito financeiro.' }
    ] },
    { id: 'c13', q: 'Você quer comprar um brinquedo de R$120. Tem R$60. O que faz?', choices: [
        { text: 'Peço para parcelar', score: -4, walletDelta: 0, good: false, explanation: 'Evite parcelar itens de baixo valor. O ideal é juntar o dinheiro para comprar à vista e sem dívidas.' },
        { text: 'Economizo mais 2 meses para completar o valor', score: 10, walletDelta: 0, good: true, explanation: 'Ótima disciplina de poupança! Você está focando no objetivo e não está agindo por impulso.' },
        { text: 'Compro outro mais barato com os R$60', score: 7, walletDelta: -60, good: true, explanation: 'Você ajustou sua expectativa ao seu orçamento. Isso é ser flexível e responsável com seu dinheiro.' },
        { text: 'Gasto os R$60 em um passeio e me esqueço do brinquedo', score: 5, walletDelta: -60, good: true, explanation: 'Você priorizou uma experiência (passeio) em vez de um objeto (brinquedo). É uma boa troca, desde que o passeio fosse planejado.' }
    ] },
    { id: 'c14', q: 'Você quer comprar um presente para sua mãe. O que faz?', choices: [
        { text: 'Faço um presente artesanal', score: 8, walletDelta: -10, good: true, explanation: 'Excelente! A criatividade economiza dinheiro e o presente feito à mão tem um valor sentimental enorme.' },
        { text: 'Economizo e compro algo especial', score: 10, walletDelta: -30, good: true, explanation: 'Você planejou o presente e economizou o suficiente, mostrando responsabilidade e carinho.' },
        { text: 'Compro algo caro sem pensar', score: -5, walletDelta: -80, good: false, explanation: 'Comprar algo caro sem planejamento pode te deixar endividado ou sem dinheiro para o resto do mês.' },
        { text: 'Compro um cartão de presente de R$20 e uso o resto', score: 7, walletDelta: -20, good: true, explanation: 'Você limitou o gasto com o presente, o que é um bom planejamento. O cartão é uma ótima ideia!' }
    ] },
    { id: 'c15', q: 'Você quer comprar um ingresso para um parque. Custa R$70. Você tem R$50.', choices: [
        { text: 'Economizo mais um pouco para completar os R$70', score: 10, walletDelta: 0, good: true, explanation: 'Você está planejando a compra para o futuro. Isso é uma excelente atitude financeira.' },
        { text: 'Compro outro passeio mais barato', score: 8, walletDelta: -40, good: true, explanation: 'Você priorizou o lazer, mas adaptando-se ao que tinha na carteira. Inteligente!' },
        { text: 'Peço dinheiro emprestado', score: -4, walletDelta: 0, good: false, explanation: 'Evite pedir dinheiro emprestado, pois isso gera uma dívida que você terá que pagar depois.' },
        { text: 'Compro na hora, pois acho que o caixa aceita só R$50', score: -9, walletDelta: -50, good: false, explanation: 'Assumir que pode comprar algo sem ter o valor total é arriscado. Isso pode te deixar sem dinheiro e sem o ingresso.' }
    ] },
];

totalStagesSpan.textContent = challenges.length;

// ---------- Storage ----------
function loadState(){
    const raw = localStorage.getItem(STORAGE_KEY);
    // Novo estado inicial para novos jogos ou saves inexistentes
    const defaultState = { score:0, wallet:100, stage:0, completed:false };
    
    if(!raw) return defaultState;
    try { 
        return JSON.parse(raw); 
    } catch(e){ 
        console.warn('Erro ao ler storage', e); 
        return defaultState; 
    }
}
function saveState(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function resetState(){
    localStorage.removeItem(STORAGE_KEY);
    // O valor no reset agora é R$ 100
    state = { score:0, wallet:100, stage:0, completed:false };
    renderHUD();
}

// ---------- Render ----------
function renderHUD(){
    scoreSpan.textContent = state.score;
    walletSpan.textContent = `R$ ${state.wallet}`;
    stageSpan.textContent = Math.min(state.stage+1, challenges.length);
}

function showMenu(){
    menu.classList.remove('hidden');
    gameArea.classList.add('hidden');
    resultArea.classList.add('hidden');
    menu.querySelector('#start-btn').focus();
}

function startNewGame(){
    // Garante que o estado inicial para novo jogo é R$ 100
    state = { score:0, wallet:100, stage:0, completed:false }; 
    saveState();
    openGame();
}

function openGame(){
    menu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    renderHUD();
    nextBtn.style.display = 'none'; 
    renderChallenge();
}

function renderChallenge(){
    isPaused = false; 
    
    const idx = state.stage;
    if(idx >= challenges.length){
        showResult();
        return;
    }
    const ch = challenges[idx];
    
    questionEl.textContent = ch.q;
    optionsEl.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.classList.add('hidden'); 
    
    // Remove as classes de cor de feedback antes de renderizar a próxima pergunta
    feedbackEl.classList.remove('feedback-success', 'feedback-error');
    
    optionsEl.style.display = 'flex'; 
    nextBtn.style.display = 'none'; 

    const shuffledChoices = [...ch.choices].sort(() => Math.random() - 0.5);
    shuffledChoices.forEach((choice) => {
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.type = 'button';
        b.textContent = choice.text;
        
        // Encontra o índice da escolha original no array 'ch.choices'
        const originalIndex = ch.choices.findIndex(origChoice => origChoice.text === choice.text);
        
        b.addEventListener('click', () => onChoose(originalIndex, b)); 
        optionsEl.appendChild(b);
    });
    renderHUD();
    
    // accessibility
    const firstBtn = optionsEl.querySelector('button');
    if(firstBtn) firstBtn.focus();
}

// NOVO FLUXO DE JOGO: PAUSA, EXPLICAR, CONTINUAR
function onChoose(originalChoiceIndex, buttonEl){
    if (isPaused) return; 

    const idx = state.stage;
    const ch = challenges[idx];
    const choice = ch.choices[originalChoiceIndex]; 

    // 1. Aplica o feedback (visual e no estado)
    const isGood = choice.good;
    state.score += choice.score;
    state.wallet += choice.walletDelta;
    if(state.wallet < 0) state.wallet = 0; // Impede saldo negativo

    // 2. Trava as opções e aplica o estilo
    const buttons = optionsEl.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    buttonEl.classList.add(isGood ? 'correct' : 'wrong');

    // 3. Toca o som
    playSound(isGood ? sounds.success : sounds.fail);
    if(isGood) spawnCoin();

    // 4. EXIBE A EXPLICAÇÃO PEDAGÓGICA (COM A RESPOSTA ESCOLHIDA VISÍVEL)
    // --- Lógica de cores e cabeçalho dinâmico ---
    const header = isGood ? '⭐ Parabéns! Decisão de Gênio Financeiro.' : '🚨 Atenção! Oportunidade de Aprendizado.';
    const feedbackClass = isGood ? 'feedback-success' : 'feedback-error';
    
    // Adiciona a classe de cor ao elemento de feedback
    feedbackEl.classList.remove('feedback-success', 'feedback-error');
    feedbackEl.classList.add(feedbackClass);
    // --- Fim da lógica de cores ---
    
    const chosenText = choice.text; 
    const impactText = `Impacto: ${isGood ? `+${choice.score} pontos` : `${choice.score} pontos`} e R$ ${choice.walletDelta >= 0 ? `+${choice.walletDelta}` : choice.walletDelta}`;

    feedbackEl.innerHTML = `
        <div class="feedback-header">${header}</div>
        <div class="chosen-answer">Sua Escolha: <strong>"${chosenText}"</strong></div>
        <div class="feedback-text">${choice.explanation}</div>
        <small class="impact">${impactText}</small>
    `;
    feedbackEl.classList.remove('hidden');
    
    // 5. PAUSA o jogo e mostra o botão "Próxima Fase"
    isPaused = true;
    optionsEl.style.display = 'none'; 
    nextBtn.style.display = 'inline-block'; 
    nextBtn.focus();

    saveState();
    renderHUD();
}

function goToNextStage() {
    if (!isPaused) return; 
    
    // Limpa e esconde o feedback
    feedbackEl.innerHTML = '';
    feedbackEl.classList.add('hidden');
    
    // Esconde o botão Next e re-exibe as opções
    nextBtn.style.display = 'none';
    optionsEl.style.display = 'flex'; 

    state.stage++;
    saveState();
    
    if (state.stage >= challenges.length) {
        showResult();
    } else {
        renderChallenge();
    }
}


function spawnCoin(){
    // briefly show a coin animation near HUD
    const coin = document.createElement('div');
    coin.className = 'coin-anim';
    const panel = document.querySelector('.score-panel');
    panel.appendChild(coin);
    setTimeout(()=>coin.remove(), 900);
}

function showResult(){
    gameArea.classList.add('hidden');
    resultArea.classList.remove('hidden');

    const finalScore = state.score;
    let title = '';
    let message = '';
    
    // Lógica para determinar a mensagem de incentivo (Baseada no desempenho final)
    if (finalScore >= 120) {
        title = '🥇 Mestre das Finanças! Parabéns!';
        message = `Suas decisões foram excelentes. Você demonstrou uma visão de longo prazo e um controle financeiro de gênio, terminando com R$ ${state.wallet} na carteira. Continue assim!`;
    } else if (finalScore >= 80) {
        title = '🥈 Ótimo Desempenho!';
        message = `Você fez muitas escolhas inteligentes! Há um bom equilíbrio entre gastar e poupar. Sua pontuação foi alta e você terminou com R$ ${state.wallet}. Continue focado no planejamento!`;
    } else if (finalScore >= 40) {
        title = '🥉 Bom Começo!';
        message = `Você já entende os conceitos básicos, mas houve alguns gastos por impulso. Lembre-se: planejar é a chave! Sua pontuação foi razoável, e você terminou com R$ ${state.wallet}. Na próxima, tente poupar mais!`;
    } else {
        title = '💡 Momento de Aprender!';
        message = `Sua pontuação final mostra que há espaço para grandes melhorias. As finanças exigem disciplina e atenção. Não desanime, revise as explicações e tente de novo para terminar com mais dinheiro na sua carteira (R$ ${state.wallet}).`;
    }

    // Estrutura final do texto
    const resultHtml = `
        <h2>${title}</h2>
        <p>${message}</p>
        <p>Pontuação final de decisão financeira: <strong>${finalScore}</strong> pontos.</p>
    `;

    // Garante que o h2 antigo (se existir) seja limpo e o novo seja injetado
    const existingH2 = document.getElementById('result-area').querySelector('h2');
    if (existingH2) existingH2.remove();

    document.getElementById('result-text').innerHTML = resultHtml; 
    
    state.completed = true;
    saveState();
}


// ---------- Buttons ----------
startBtn.addEventListener('click', ()=>{ playSound(sounds.click); startNewGame(); });
continueBtn.addEventListener('click', ()=>{ playSound(sounds.click); state = loadState(); openGame(); });
resetBtn.addEventListener('click', ()=>{ if(confirm('Reiniciar progresso local?')){ resetState(); alert('Progresso reiniciado.'); }});
playAgainBtn?.addEventListener('click', ()=>{ startNewGame(); });
toMenuBtn?.addEventListener('click', ()=>{ showMenu(); });

// prev/next (opcionais) - AGORA COM LÓGICA DE PAUSA
prevBtn.addEventListener('click', ()=>{ 
    if(isPaused) return; // Impede o clique se estiver pausado
    if(state.stage>0){ 
        state.stage--; 
        renderChallenge(); 
        saveState(); 
    }
});
nextBtn.addEventListener('click', ()=>{ 
    playSound(sounds.click); 
    goToNextStage(); // Novo fluxo de avanço
});

// ---------- Init ----------
(function init(){
    state = loadState();
    renderHUD();
    if(state.stage > 0 && !state.completed){
        // show continue if there's progress
        continueBtn.style.display = 'inline-block';
    } else {
        // Se for 0, só mostra o "Iniciar Jogo"
        continueBtn.style.display = 'none'; 
    }
    totalStagesSpan.textContent = challenges.length;
})();
