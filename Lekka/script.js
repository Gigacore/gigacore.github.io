document.addEventListener('DOMContentLoaded', () => {
    const timerText = document.getElementById('timer-text');
    const timerBar = document.getElementById('timer-bar');
    const problemsDiv = document.getElementById('problems');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const line4 = document.getElementById('line4');
    const grandTotalInput = document.getElementById('grand-total');
    const submitBtn = document.getElementById('submit-btn');
    const messageArea = document.getElementById('message-area');

    let timer;
    const totalTime = 90;
    let timeLeft = totalTime;
    let totals = {};

    function getRandomTwoDigitNumber() {
        return Math.floor(Math.random() * 90) + 10;
    }

    function getRandomSingleDigitNumber() {
        return Math.floor(Math.random() * 8) + 2;
    }

    function generateProblems() {
        // Line 1: Addition
        const add1 = getRandomTwoDigitNumber();
        const add2 = getRandomTwoDigitNumber();
        line1.innerHTML = `<span>${add1}</span><span>+</span><span>${add2}</span><span>=</span><span>?</span>`;
        totals.line1 = add1 + add2;

        // Line 2: Subtraction
        let sub1 = getRandomTwoDigitNumber();
        let sub2 = getRandomTwoDigitNumber();
        if (sub1 < sub2) {
            [sub1, sub2] = [sub2, sub1]; // Ensure sub1 is greater
        }
        line2.innerHTML = `<span>${sub1}</span><span>-</span><span>${sub2}</span><span>=</span><span>?</span>`;
        totals.line2 = sub1 - sub2;

        // Line 3: Multiplication
        let mul1 = getRandomTwoDigitNumber();
        let mul2 = getRandomSingleDigitNumber();
        if (Math.random() > 0.5) {
            [mul1, mul2] = [mul2, mul1];
        }
        line3.innerHTML = `<span>${mul1}</span><span>*</span><span>${mul2}</span><span>=</span><span>?</span>`;
        totals.line3 = mul1 * mul2;

        // Line 4: Division
        let dividend, divisor, quotient;
        do {
            divisor = getRandomTwoDigitNumber();
            quotient = Math.floor(Math.random() * 8) + 2; // 2 to 9
            dividend = divisor * quotient;
        } while (dividend >= 100);

        line4.innerHTML = `<span>${dividend}</span><span>/</span><span>${divisor}</span><span>=</span><span>?</span>`;
        totals.line4 = quotient;

        totals.grandTotal = totals.line1 + totals.line2 + totals.line3 + totals.line4;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const percentage = (timeLeft / totalTime) * 100;
            timerBar.style.width = `${percentage}%`;
            timerText.textContent = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 10) {
                timerBar.classList.add('low-time');
            }

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function triggerConfetti() {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }

    function endGame() {
        clearInterval(timer);
        grandTotalInput.disabled = true;
        submitBtn.textContent = 'Start Again';
        submitBtn.disabled = false;
        timerText.textContent = "Time's up!";
        showResults();
    }

    function showResults() {
        line1.querySelector('span:last-child').textContent = totals.line1;
        line2.querySelector('span:last-child').textContent = totals.line2;
        line3.querySelector('span:last-child').textContent = totals.line3;
        line4.querySelector('span:last-child').textContent = totals.line4;

        const finalGrandTotal = document.getElementById('final-grand-total');
        finalGrandTotal.textContent = `Grand Total: ${totals.grandTotal}`;
        finalGrandTotal.style.display = 'block';
    }

    function resetGame() {
        clearInterval(timer);
        timeLeft = totalTime;
        timerBar.style.width = '100%';
        timerBar.classList.remove('low-time');
        timerText.textContent = `Time Left: ${timeLeft}s`;
        
        generateProblems();
        
        grandTotalInput.value = '';
        grandTotalInput.disabled = false;
        
        messageArea.textContent = '';
        messageArea.className = '';
        
        submitBtn.textContent = 'Submit';
        
        document.getElementById('final-grand-total').style.display = 'none';
        
        startTimer();
    }

    submitBtn.addEventListener('click', () => {
        if (submitBtn.textContent === 'Start Again') {
            resetGame();
            return;
        }

        const userAnswer = parseInt(grandTotalInput.value, 10);
        if (isNaN(userAnswer)) {
            messageArea.textContent = 'Please enter a number.';
            messageArea.className = 'incorrect';
            return;
        }

        if (userAnswer === totals.grandTotal) {
            clearInterval(timer);
            messageArea.textContent = 'Congratulations! You got it right!';
            messageArea.className = 'correct';
            grandTotalInput.disabled = true;
            submitBtn.textContent = 'Start Again';
            submitBtn.disabled = false;
            showResults();
            triggerConfetti();
        } else {
            messageArea.textContent = 'Incorrect, please try again.';
            messageArea.className = 'incorrect';
            problemsDiv.classList.add('shake');
            grandTotalInput.classList.add('shake');
            setTimeout(() => {
                problemsDiv.classList.remove('shake');
                grandTotalInput.classList.remove('shake');
            }, 500);
        }
    });

    function init() {
        generateProblems();
        startTimer();
    }

    init();
});