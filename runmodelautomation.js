async function startAutoLabelFast(frames = 10) {
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < frames; i++) {
        const brainBtn = document.getElementById('d_model')?.querySelector('.item-btn');
        if (!brainBtn) break;

        // --- SPEED UP: First Click ---
        brainBtn.click();

        // --- SPEED UP: Faster Polling ---
        let plusFound = false;
        for (let attempt = 0; attempt < 25; attempt++) { // Max 2.5 seconds wait
            const plusIcon = document.querySelector('.msg');
            if (plusIcon && plusIcon.innerText.trim() === '+') {
                plusFound = true;
                break;
            }
            await sleep(100); // Check every 100ms instead of 200ms
        }

        // --- SPEED UP: Second Click ---
        if (plusFound) {
            brainBtn.click();
        } else {
            console.warn("Plus not found, stopping to save data.");
            break;
        }

        // --- SPEED UP: Processing Wait ---
        // Reduced from 3000ms to 1200ms. 
        // Watch closely: if boxes don't appear before it clicks next, increase this!
        await sleep(1200); 

        const nextIcon = document.querySelector('g[clip-path*="an_right_svg"]');
        const nextBtn = nextIcon ? nextIcon.closest('svg').parentElement : null;

        if (nextBtn) {
            nextBtn.click();
        } else {
            break;
        }

        // --- SPEED UP: Loading Wait ---
        // Reduced from 2000ms to 800ms
        await sleep(800); 
    }
}