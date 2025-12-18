document.addEventListener('DOMContentLoaded', () => {
    // Views
    const initialView = document.getElementById('initial-view');
    const meterView = document.getElementById('meter-view');
    const reasonsView = document.getElementById('reasons-view');
    const albumView = document.getElementById('album-view');
    const card = document.querySelector('.card');

    // Buttons
    const revealButton = document.getElementById('reveal-button');
    const nextStepButton = document.getElementById('next-step-button');
    const memoriesButton = document.getElementById('memories-button');

    // Audio
    const backgroundSong = document.getElementById('background-song');

    // Cuteness Meter
    const meterBar = document.querySelector('.meter-bar');
    const percentageText = document.getElementById('percentage');
    const meterStatus = document.querySelector('.meter-status');

    // Reasons
    const reasonItems = document.querySelectorAll('.reason-item');

    // Album
    const albumSlider = document.querySelector('.album-slider');
    const albumPages = document.querySelectorAll('.album-page');
    const prevButton = document.querySelector('.album-nav.prev');
    const nextButton = document.querySelector('.album-nav.next');
    const pageCount = albumPages.length;
    let currentPage = 0;

    // --- Event Listeners ---

    // Event 1: "Open My Heart"
    revealButton.addEventListener('click', () => {
        initialView.classList.add('hidden');
        meterView.classList.remove('hidden');
        runCutenessMeter();
    });

    // Event 2: "Want to know more"
    nextStepButton.addEventListener('click', () => {
        meterView.classList.add('hidden');
        reasonsView.classList.remove('hidden');
        // Play the song here, after the option is clicked
        backgroundSong.play().catch(error => {
            console.log("Audio playback failed, user interaction might be needed: ", error);
        });
    });

    // Event 3: Reveal reasons
    reasonItems.forEach(item => {
        item.addEventListener('click', () => item.classList.add('revealed'));
    });

    // Event 4: "Recall Memories"
    memoriesButton.addEventListener('click', () => {
        reasonsView.classList.add('hidden');
        albumView.classList.remove('hidden');
        updateAlbumNav();
    });

    // --- Functions ---

    function runCutenessMeter() {
        let percentage = 0;
        const interval = setInterval(() => {
            percentage++;
            percentageText.textContent = percentage + '%';
            if (percentage <= 100) meterBar.style.width = percentage + '%';
            
            if (percentage >= 150) {
                clearInterval(interval);
                const blast = document.createElement('div');
                blast.classList.add('blast');
                card.appendChild(blast);

                setTimeout(() => {
                    meterStatus.innerHTML = "Your cuteness isn't handled by the meter...";
                    nextStepButton.classList.remove('hidden');
                    // Removed backgroundSong.play() from here
                }, 400);
                setTimeout(() => blast.remove(), 1000);
            }
        }, 20);
    }

    // --- Album Logic ---

    function goToPage(page) {
        if (page < 0 || page >= pageCount) return;
        albumSlider.style.transform = `translateX(-${page * 100}%)`;
        currentPage = page;
        updateAlbumNav();
    }

    function updateAlbumNav() {
        prevButton.classList.toggle('hidden', currentPage === 0);
        nextButton.classList.toggle('hidden', currentPage === pageCount - 1);
    }

    prevButton.addEventListener('click', () => goToPage(currentPage - 1));
    nextButton.addEventListener('click', () => goToPage(currentPage + 1));

    // Swipe Logic
    let touchstartX = 0;
    let touchendX = 0;
    const albumContainer = document.querySelector('.album-container');

    albumContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    albumContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        if (touchendX < touchstartX - swipeThreshold) {
            goToPage(currentPage + 1); // Swiped left
        }
        if (touchendX > touchstartX + swipeThreshold) {
            goToPage(currentPage - 1); // Swiped right
        }
    }

    // Initial setup
    updateAlbumNav();
});