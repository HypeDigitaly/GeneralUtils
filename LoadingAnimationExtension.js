export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const phase = payload.phase || 'output'; // default to output if not specified
    
    // Get duration from payload in seconds, default to 10 seconds if not provided
    const totalDurationSeconds = payload.Duration || 10;
    const totalDuration = totalDurationSeconds * 1000; // Convert to milliseconds

    // Normalize and detect language
    const incomingLang = (payload.lang || 'cs').toLowerCase();
    let lang;
    if (incomingLang.includes('cs')) lang = 'cs';
    else if (incomingLang.includes('en')) lang = 'en';
    else if (incomingLang.includes('de')) lang = 'de';
    else if (incomingLang.includes('uk')) lang = 'uk';
    else lang = 'cs'; // default to Czech

    // Normalize type
    const type = (payload.type || 'SMT').toUpperCase();

    // Message sequences for different phases and types
    const messageSequences = {
      cs: {
        analysis: ['Analyzuji Váš dotaz.', 'Klasifikuji Váš dotaz.'],
        rewrite: ['Snažím se pochopit, co přesně hledáte.'],
        output: {
          SMT: ['Dokončuji odpověď.'],
          KB_WS: [
            'Hledám v databázi.',
            'Prohledávám webové zdroje.',
            'Připravuji odpověď.',
            'Píši odpověď.'
          ],
          OTHER: ['Nacházím nevhodný výraz.'],
          SWEARS: ['Nacházím nevhodný výraz.'],
          KB: [
            'Hledám v databázi.',
            'Připravuji odpověď.',
            'Píši odpověď.'
          ]
        },
        all: {
          KB: [
            'Prohledávám svou databázi.',
            'Ověřuji informace.',
            'Připravuji svoji odpověď.'
          ],
          KB_WS: [
            'Prohledávám svou databázi.',
            'Prohledávám webové zdroje.',
            'Ověřuji informace.',
            'Připravuji svoji odpověď.'
          ]
        }
      },
      en: {
        analysis: ['I am analyzing your query.', 'I am classifying your query.'],
        rewrite: ['I am trying to understand what you are looking for.'],
        output: {
          SMT: ['I am completing my response.'],
          KB_WS: [
            'I am searching the database.',
            'I am searching web sources.',
            'I am preparing my response.',
            'I am writing my response.'
          ],
          OTHER: ['I am detecting inappropriate content.'],
          SWEARS: ['I am detecting inappropriate content.'],
          KB: [
            'I am searching the database.',
            'I am preparing my response.',
            'I am writing my response.'
          ]
        },
        all: {
          KB: [
            'I am searching my database.',
            'I am verifying information.',
            'I am preparing my response.'
          ],
          KB_WS: [
            'I am searching my database.',
            'I am searching web sources.',
            'I am verifying information.',
            'I am preparing my response.'
          ]
        }
      },
      de: {
        analysis: ['Ich bin dabei, Ihre Anfrage zu analysieren.', 'Ich bin dabei, Ihre Anfrage zu klassifizieren.'],
        rewrite: ['Ich bin dabei zu verstehen, wonach Sie suchen.'],
        output: {
          SMT: ['Ich bin dabei, meine Antwort fertigzustellen.'],
          KB_WS: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, Web-Quellen zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich bin dabei, meine Antwort zu schreiben.'
          ],
          OTHER: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          SWEARS: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          KB: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich bin dabei, meine Antwort zu schreiben.'
          ]
        },
        all: {
          KB: [
            'Ich durchsuche meine Datenbank.',
            'Ich überprüfe die Informationen.',
            'Ich bereite meine Antwort vor.'
          ],
          KB_WS: [
            'Ich durchsuche meine Datenbank.',
            'Ich durchsuche Web-Quellen.',
            'Ich überprüfe die Informationen.',
            'Ich bereite meine Antwort vor.'
          ]
        }
      },
      uk: {
        analysis: ['Зараз аналізую ваш запит.', 'Зараз класифікую ваш запит.'],
        rewrite: ['Зараз намагаюся зрозуміти, що ви шукаєте.'],
        output: {
          SMT: ['Зараз завершую відповідь.'],
          KB_WS: [
            'Зараз шукаю в базі даних.',
            'Зараз шукаю веб-джерела.',
            'Зараз готую відповідь.',
            'Зараз пишу відповідь.'
          ],
          OTHER: ['Зараз виявляю недоречний зміст.'],
          SWEARS: ['Зараз виявляю недоречний зміст.'],
          KB: [
            'Зараз шукаю в базі даних.',
            'Зараз готую відповідь.',
            'Зараз пишу відповідь.'
          ]
        },
        all: {
          KB: [
            'Шукаю у своїй базі даних.',
            'Перевіряю інформацію.',
            'Готую свою відповідь.'
          ],
          KB_WS: [
            'Шукаю у своїй базі даних.',
            'Шукаю веб-джерела.',
            'Перевіряю інформацію.',
            'Готую свою відповідь.'
          ]
        }
      }
    };

    // Error handling for missing messages
    try {
      let messages;
      if (phase === 'all' && (type === 'KB' || type === 'KB_WS')) {
        messages = messageSequences[lang]?.all?.[type];
      } else if (phase === 'output') {
        messages = messageSequences[lang]?.output?.[type];
      } else {
        messages = messageSequences[lang]?.[phase];
      }

      if (!messages || messages.length === 0) {
        return;
      }

      // Calculate message interval based on total duration from Duration parameter
      const messageInterval = totalDuration / messages.length;
      
      // Log the duration for debugging
      console.log(`Animation duration: ${totalDurationSeconds}s, Message interval: ${messageInterval / 1000}s per message`);

      const STYLE_ID = 'loading-animation-dynamic-styles';
      if (!document.getElementById(STYLE_ID)) {
        const styleSheet = document.createElement('style');
        styleSheet.id = STYLE_ID;
        styleSheet.textContent = `
          .loading-animation-local-text-wrapper {
            opacity: 1;
            transition: opacity 0.3s ease-out;
            width: 100%;
            display: block;
            background: rgba(0, 0, 0, 0.03);
            border-radius: 6px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            padding: 6px 12px;
            margin: 0;
            box-sizing: border-box;
          }
          .loading-animation-text-content {
            color: rgba(26, 30, 35, 0.6);
            font-size: 11px;
            line-height: 16px;
            font-family: var(--_1bof89na); /* Ensure this var is available globally or replace */
            position: relative;
            display: flex;
            flex-direction: column;
            max-width: 100%;
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            flex: 1;
            min-width: 0;
            font-style: italic;
          }
          .loading-animation-text-content.changing {
            opacity: 0;
            transform: translateY(-5px);
          }
          .loading-animation-text-content.entering {
            opacity: 0;
            transform: translateY(5px);
          }
          .loading-animation-global-dots-container {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 6px; /* If text was ever planned to be here */
            padding: 6px; /* Minimal padding for the dots container */
            border-radius: 6px;
            /* Optional: background for the dots container if desired */
            /* background: rgba(255, 255, 255, 0.8); */
            /* box-shadow: 0 2px 4px rgba(0,0,0,0.1); */
          }
          .loading-animation-global-dots-container.hide {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-out, visibility 0.01s linear 0.3s;
          }
          .loading-animation-dots-grid {
            position: relative;
            width: 16px;
            height: 16px;
            flex: 0 0 16px;
            opacity: 1;
            /* transition: all 0.3s ease-out; remove this if not needed for grid itself */
            display: grid;
            grid-template-columns: repeat(3, 4px);
            grid-template-rows: repeat(3, 4px);
            gap: 1px;
            margin: 0;
          }
          /* .loading-animation-dots-grid.hide { Replaced by parent container hide logic } */
          .loading-square {
            width: 4px;
            height: 4px;
            background-color: rgba(128, 128, 128, 0.6);
            animation: wave_anim_unique 1s infinite; /* Renamed animation */
          }
          .loading-square:nth-child(1) { animation-delay: 0s; }
          .loading-square:nth-child(2) { animation-delay: 0.1s; }
          .loading-square:nth-child(3) { animation-delay: 0.2s; }
          .loading-square:nth-child(6) { animation-delay: 0.3s; }
          .loading-square:nth-child(9) { animation-delay: 0.4s; }
          .loading-square:nth-child(8) { animation-delay: 0.5s; }
          .loading-square:nth-child(7) { animation-delay: 0.6s; }
          .loading-square:nth-child(4) { animation-delay: 0.7s; }
          /* Square 5 is often the center, adjust if a different effect is desired */
          .loading-square:nth-child(5) { animation-delay: 0.8s; }

          @keyframes wave_anim_unique { /* Renamed animation */
            0%, 100% { background-color: rgba(230, 230, 230, 0.6); }
            50% { background-color: rgba(128, 128, 128, 0.6); }
          }
        `;
        document.head.appendChild(styleSheet);
      }

      // --- Local Text Animation Setup ---
      const localTextWrapper = document.createElement('div');
      localTextWrapper.className = 'loading-animation-local-text-wrapper vfrc-message vfrc-message--extension'; // Added VF classes

      const textElement = document.createElement('span');
      textElement.className = 'loading-animation-text-content';
      localTextWrapper.appendChild(textElement);

      let localTextCurrentIndex = 0;
      let localTextInterval = null;

      const updateLocalText = (newText) => {
        try {
          if (!textElement || !localTextWrapper.contains(textElement)) {
            if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; }
            return;
          }
          textElement.classList.add('changing');
          setTimeout(() => {
            try {
              if (!textElement || !localTextWrapper.contains(textElement)) {
                if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; }
                return;
              }
              textElement.textContent = newText;
              textElement.classList.remove('changing');
              textElement.classList.add('entering');
              requestAnimationFrame(() => {
                if (textElement && localTextWrapper.contains(textElement)) {
                  textElement.classList.remove('entering');
                }
              });
            } catch (e) { console.error('LoadingAnimation: Error in updateLocalText setTimeout:', e); if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; } }
          }, 300);
        } catch (e) { console.error('LoadingAnimation: Error in updateLocalText:', e); if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; } }
      };
      
      updateLocalText(messages[localTextCurrentIndex]);

      if (messages.length > 1) {
        localTextInterval = setInterval(() => {
          try {
            if (localTextCurrentIndex < messages.length - 1) {
              localTextCurrentIndex++;
              updateLocalText(messages[localTextCurrentIndex]);
            } else {
              if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; }
            }
          } catch (e) { console.error('LoadingAnimation: Error in localTextInterval callback:', e); if (localTextInterval) { clearInterval(localTextInterval); localTextInterval = null; } }
        }, messageInterval);
      }

      if (element) {
        element.innerHTML = ''; // Clear previous content
        element.appendChild(localTextWrapper);
        void localTextWrapper.offsetHeight; // Force reflow
      }

      // --- Global Dot Grid Animation Setup ---
      const globalDotsContainer = document.createElement('div');
      globalDotsContainer.className = 'loading-animation-global-dots-container';

      const dotsGridElement = document.createElement('div');
      dotsGridElement.className = 'loading-animation-dots-grid';
      for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.className = 'loading-square';
        dotsGridElement.appendChild(square);
      }
      globalDotsContainer.appendChild(dotsGridElement);
      document.body.appendChild(globalDotsContainer);
      void globalDotsContainer.offsetHeight; // Force reflow

      const hideGlobalDotsTimeout = setTimeout(() => {
        if (globalDotsContainer && globalDotsContainer.parentNode) {
          globalDotsContainer.classList.add('hide');
          globalDotsContainer.addEventListener('transitionend', () => {
            if (globalDotsContainer && globalDotsContainer.parentNode) {
              globalDotsContainer.parentNode.removeChild(globalDotsContainer);
            }
          }, { once: true });
        }
      }, totalDuration);

      // --- Cleanup Observer for Local Text ---
      let localTextObserver = null;
      if (element) { // Only setup observer if element is provided
        localTextObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === element || element.contains(node) || node === localTextWrapper || localTextWrapper.contains(node)) { // Check if element or our wrapper is removed
                if (localTextInterval) {
                  clearInterval(localTextInterval);
                  localTextInterval = null;
                }
                // Do NOT clear hideGlobalDotsTimeout here
                if (localTextObserver) localTextObserver.disconnect(); // Disconnect this observer
              }
            });
          });
        });

        // Observe the parent of the VF element, or body if no parent yet.
        const watchTarget = element.parentElement || document.body;
        localTextObserver.observe(watchTarget, { childList: true, subtree: true });
      }

    } catch (error) {
      console.error('LoadingAnimation: General error in render function:', error);
      // Silently handle errors in production, or log for debugging
    }
  }
};
