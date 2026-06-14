document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('quest-input');
    const addBtn = document.getElementById('add-btn');
    const questList = document.getElementById('quest-list');
    const congratsMsg = document.getElementById('congrats-msg');
    
    const timerDisplay = document.getElementById('timer-display');
    const timerMinutesInput = document.getElementById('timer-minutes');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    const quoteBtn = document.getElementById('quote-btn');
    const quoteDisplay = document.getElementById('quote-display');

    if(!input || !addBtn || !questList){
        console.error("Error: Couldn't find the Required HTML elements");
        return;
    }

    let quests = [];
    try{
        const savedQuests = localStorage.getItem('myQuests');
        quests = savedQuests ? JSON.parse(savedQuests) : [];
    } catch(e){
        console.error('Error Reading From the Storage: ', e);
        quests = [];
    }

    function renderQuests(){
        questList.innerHTML = '';
        let completedCount = 0;

        quests.forEach((quest, index) => {
            const li = document.createElement('li');
            li.innerText = quest.text;
            
            if(quest.completed){
                li.classList.add('completed');
                completedCount++;
            }
            
            li.addEventListener('click', () => {
                quests[index].completed = !quests[index].completed;
                saveAndRender();
            });
            
            questList.appendChild(li);
        });

        if(quests.length >= 3) {
            input.disabled = true;
            addBtn.disabled = true;
            input.placeholder = "You have 3 Quests, go do them!";
        } else {
            input.disabled = false;
            addBtn.disabled = false;
            input.placeholder = 'What is your Quest?';
        }

        if (quests.length === 3 && completedCount === 3) {
            congratsMsg.style.display = 'block';
        } else {
            congratsMsg.style.display = 'none';
        }
    }

    function saveAndRender(){
        try{
            localStorage.setItem('myQuests', JSON.stringify(quests));
        }catch(e){
            console.error('Error saving to storage', e);
        }
        renderQuests();
    }

    addBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (text !== '' && quests.length < 3){
            quests.push({text: text, completed: false});
            input.value = '';
            saveAndRender();
        }
    });

    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter'){
            addBtn.click();
        }
    });

    let timeLeft = null; 
    let timerId = null;
    let isRunning = false;

    function formatDisplay(secondsTotal) {
        const minutes = Math.floor(secondsTotal / 60);
        const seconds = secondsTotal % 60;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    timerMinutesInput.addEventListener('input', () => {
        if (!isRunning) {
            let mins = parseInt(timerMinutesInput.value) || 0;
            if (mins < 0) mins = 0;
            timeLeft = mins * 60;
            formatDisplay(timeLeft);
        }
    });

    startPauseBtn.addEventListener('click', () => {
        if (isRunning) {
            clearInterval(timerId);
            startPauseBtn.textContent = 'Start';
            isRunning = false;
        } else {
            if (timeLeft === null || timeLeft === 0) {
                let userMinutes = parseInt(timerMinutesInput.value) || 0;
                if (userMinutes <= 0) {
                    alert("Please set a time greater than 0 minutes!");
                    return;
                }
                timeLeft = userMinutes * 60;
            }

            timerMinutesInput.disabled = true;
            startPauseBtn.textContent = 'Pause';
            isRunning = true;

            timerId = setInterval(() => {
                timeLeft--;
                formatDisplay(timeLeft);
                
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    isRunning = false;
                    timeLeft = null;
                    startPauseBtn.textContent = 'Start';
                    timerMinutesInput.disabled = false;
                    
                    alert("Time's up! Great effort.");
                    
                    let resetMins = parseInt(timerMinutesInput.value) || 0;
                    formatDisplay(resetMins * 60);
                }
            }, 1000);
        }
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timerId);
        isRunning = false;
        timeLeft = null;
        startPauseBtn.textContent = 'Start';
        timerMinutesInput.disabled = false;
        
        let userMinutes = parseInt(timerMinutesInput.value) || 0;
        formatDisplay(userMinutes * 60);
    });

    const quotes = [
        "\"Action is the foundational key to all success.\" - Pablo Picasso",
        "\"You don't have to be great to start, but you have to start to be great.\" - Zig Ziglar",
        "\"Amateurs sit and wait for inspiration, the rest of us just get up and go to work.\" - Stephen King",
        "\"The secret of getting ahead is getting started.\" - Mark Twain",
        "\"Do what you can, with what you have, where you are.\" - Theodore Roosevelt",
        "\"Focus on being productive instead of busy.\" - Tim Ferriss",
        "\"Discipline is choosing between what you want now and what you want most.\" - Abraham Lincoln"
    ];

    quoteBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = quotes[randomIndex];
    });

    renderQuests();
    formatDisplay(parseInt(timerMinutesInput.value) * 60); 
});