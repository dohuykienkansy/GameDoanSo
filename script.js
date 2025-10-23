
// Trạng thái game
let secret = 0;
let maxTries = 10;
let attempts = 0;
let guesses = [];
let played = 0;
let won = 0;

// Phần tử DOM
const seg = document.getElementById('difficultySeg');
const maxTriesEl = document.getElementById('maxTries');
const leftTriesEl = document.getElementById('leftTries');
const inputEl = document.getElementById('guessInput');
const msgEl = document.getElementById('message');
const historyEl = document.getElementById('history');
const btnGuess = document.getElementById('btnGuess');
const btnRestart = document.getElementById('btnRestart');
const playedEl = document.getElementById('played');
const wonEl = document.getElementById('won');

// Khởi tạo
bindEvents();
startGame();

function bindEvents() {
    // Chọn độ khó bằng segmented buttons
    seg.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    for (const b of seg.querySelectorAll('button')) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    }
    e.target.classList.add('active');
    e.target.setAttribute('aria-pressed', 'true');

    maxTries = parseInt(e.target.dataset.tries, 10);
    startGame(); // đổi độ khó -> bắt đầu ván mới luôn
    });

    // Nút đoán
    btnGuess.addEventListener('click', makeGuess);

    // Enter để đoán nhanh
    inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') makeGuess();
    });

    // Nút chơi lại
    btnRestart.addEventListener('click', startGame);
}

function startGame() {
    secret = Math.floor(Math.random() * 100) + 1; // 1..100
    attempts = 0;
    guesses = [];
    maxTriesEl.textContent = maxTries;
    leftTriesEl.textContent = maxTries;
    msgEl.innerHTML = 'Hãy nhập số bạn đoán!';
    historyEl.textContent = '';
    inputEl.value = '';
    inputEl.disabled = false;
    btnGuess.disabled = false;
    btnRestart.style.display = 'none';
    inputEl.focus();
    // console.log('secret:', secret); // debug nếu cần
}

function makeGuess() {
    const raw = inputEl.value.trim();
    const guess = Number(raw);

    // Kiểm tra hợp lệ
    if (!raw) {
    setMessage('⚠️ Vui lòng nhập số từ 1 đến 100!', 'warn');
    return;
    }
    if (!Number.isInteger(guess)) {
    setMessage('❌ Chỉ chấp nhận số nguyên từ 1 đến 100!', 'err');
    return;
    }
    if (guess < 1 || guess > 100) {
    setMessage('⚠️ Số phải nằm trong khoảng 1–100, nhập lại nhé!', 'warn');
    return;
    }

    // Ghi nhận đoán hợp lệ
    attempts++;
    guesses.push(guess);
    leftTriesEl.textContent = (maxTries - attempts);
    historyEl.textContent = 'Bạn đã đoán: ' + guesses.join(', ');

    // So sánh
    if (guess === secret) {
    setMessage('🎉 Chính xác! Số đúng là ' + secret, 'ok');
    endGame(true);
    return;
    }

    if (attempts >= maxTries) {
    setMessage('😢 Hết lượt! Số đúng là ' + secret, 'err');
    endGame(false);
    return;
    }

    if (guess < secret) {
    if (secret - guess > 10) {
        setMessage('🔽 Số quá thấp so với số đoán! Còn ' + (maxTries - attempts) + ' lượt.', 'warn');
    } else {
        setMessage('🔽 Số thấp hơn số đoán! Còn ' + (maxTries - attempts) + ' lượt.', 'warn');
    }
    } else {
    if (guess - secret > 10) {
        setMessage('🔼 Số quá cao so với số đoán! Còn ' + (maxTries - attempts) + ' lượt.', 'warn');
    } else {
        setMessage('🔼 Số cao hơn số đoán! Còn ' + (maxTries - attempts) + ' lượt.', 'warn');
    }
    }


    inputEl.value = '';
    inputEl.focus();
}

function endGame(isWin) {
    btnGuess.disabled = true;
    inputEl.disabled = true;
    btnRestart.style.display = 'inline-block';
    played++;
    if (isWin) won++;
    playedEl.textContent = played;
    wonEl.textContent = won;
}

function setMessage(text, type) {
    msgEl.className = 'message ' + (type || '');
    msgEl.textContent = text;
}
