    /* -------------------------------------------------------------------------- */
    /* FUNKTIONER                                                                 */
    /* -------------------------------------------------------------------------- */

    // 1. SELECT SCENARIO (Huvudfunktion)
    function selectScenario(scenarioId) {
        
        // A. Aktivera triggern i vänstermenyn
        document.querySelectorAll('.scenario-trigger-card').forEach(card => {
            card.classList.remove('active');
        });
        const activeTrigger = document.getElementById('trigger-' + scenarioId);
        if(activeTrigger) activeTrigger.classList.add('active');

        // B. Visa innehållet (Display Wrappers)
        document.querySelectorAll('.scenario-display-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
        const activeDisplay = document.getElementById(scenarioId + '-display');
        if(activeDisplay) activeDisplay.classList.add('active');

        // C. Hantera Header & Avatar Animation
        const headerContainer = document.getElementById('dynamic-header');
        
        // Ta bort 'centered' klassen för att flytta upp den, lägg till 'scenario-mode'
        if(headerContainer) {
            headerContainer.classList.remove('centered');
            headerContainer.classList.add('scenario-mode');
        }

        // D. Byt bild i mitten (Stora avataren) dynamiskt
        const charImg = document.getElementById('story-avatar');
        if(charImg) {
            charImg.classList.remove('pop'); 
            
            // Liten fördröjning för att animationen ska kännas
            setTimeout(() => {
                // Hämta bild från vår lista högst upp. Om ingen finns, använd startbilden.
                const newImage = scenarioData[scenarioId];
                
                if (newImage) {
                    charImg.src = newImage;
                } else {
                    charImg.src = imgStart; 
                }
                
                charImg.classList.add('pop'); 
            }, 150);
        }

        // E. Uppdatera rubriken
        if(activeTrigger) {
            const titleElement = activeTrigger.querySelector('.trigger-title');
            const dynamicTitleEl = document.getElementById('dynamic-header-title');
            if(titleElement && dynamicTitleEl) {
                dynamicTitleEl.innerText = titleElement.innerText.replace(/"/g, '');
            }
        }

        // F. Öppna första fliken automatiskt
        const firstTabBtn = document.querySelector(`#${scenarioId}-display .tab-btn`);
        if(firstTabBtn) openInnerTab(scenarioId, 'snabb', firstTabBtn);

        // G. SCROLLA UPP AUTOMATISKT TILL TOPPEN AV TEXTEN
        const headerTop = document.getElementById('dynamic-header');
        if (headerTop) {
            headerTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Om headern inte hittas, scrolla hela sidan till toppen
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 2. ÖPPNA INRE FLIK
    function openInnerTab(scenarioId, tabName, btnElement) {
        const parent = document.getElementById(scenarioId + '-display');
        if(!parent) return;

        const panels = parent.querySelectorAll('.content-panel');
        panels.forEach(p => p.classList.remove('active'));

        const buttons = parent.querySelectorAll('.tab-btn');
        buttons.forEach(b => b.classList.remove('active'));

        const targetPanel = document.getElementById(scenarioId + '-' + tabName);
        if(targetPanel) {
            targetPanel.classList.add('active');
            const animatables = targetPanel.querySelectorAll('.scroll-animate');
            animatables.forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 50); 
            });
            setupScrollObserver(targetPanel);
        }
        if(btnElement) btnElement.classList.add('active');
    }

    // SCROLL OBSERVER
    function setupScrollObserver(panel) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        const elements = panel.querySelectorAll('.scroll-animate');
        elements.forEach(el => observer.observe(el));
    }

    // 3. JUMP TO DIAGNOSIS
    function goToDiagnosis(scenarioId, diagId) {
        selectScenario(scenarioId);
        const displayWrapper = document.getElementById(scenarioId + '-display');
        if(!displayWrapper) return;

        const diffBtn = Array.from(displayWrapper.querySelectorAll('.tab-btn')).find(btn => btn.innerText.includes('Diff'));
        if(diffBtn) openInnerTab(scenarioId, 'diff', diffBtn);
        
        setTimeout(() => {
            const el = document.getElementById(diagId);
            if(el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.transition = "background 0.5s";
                el.style.background = "#fff";
                el.style.border = "2px solid var(--accent-terracotta)";
                setTimeout(() => { el.style.background = ""; el.style.border = ""; }, 1500);
            }
        }, 300);
    }

    // 4. COPY TEXT
    function copyText(btn) {
        const textElement = btn.nextElementSibling;
        if(!textElement) return;

        const text = textElement.innerText;
        navigator.clipboard.writeText(text);
        const original = btn.innerText;
        btn.innerText = "KOPIERAD!";
        setTimeout(() => btn.innerText = original, 2000);
    }
    
    // 5. SEARCH
    function searchCards() {
        const input = document.getElementById('mainSearch');
        if(!input) return;
        
        const searchTerm = input.value.toLowerCase();
        const cards = document.querySelectorAll('.scenario-trigger-card');
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            if (text.includes(searchTerm)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }
