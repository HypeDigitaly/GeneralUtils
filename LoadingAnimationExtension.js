export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    console.log('Full trace object:', trace);
    console.log('Full payload object:', trace.payload);
    console.log('Target element:', element);
    
    const payload = trace.payload || {};
    const phase = payload.phase || 'output'; // default to output if not specified
    
    console.log('Phase:', phase); // Added phase logging
    
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

    console.log('Normalized values - Language:', lang, 'Type:', type);

    // Define fixed durations for each phase (in milliseconds)
    const phaseDurations = {
      analysis: 3000,  // 3 seconds
      output: 6000,    // 6 seconds
      rewrite: 3000    // 3 seconds
    };

    // Message sequences for different phases and types
    const messageSequences = {
      cs: {
        analysis: ['Analyzuji povahu Vašeho dotazu', 'Klasifikuji Váš dotaz'],
        rewrite: ['Optimalizuji Váš dotaz pro vyhledávání'],
        output: {
          SMT: ['Dotaz analyzován.', 'Dokončuji svoji odpověď.'],
          KB_WS: [
            'Hledám informace ve své databázi.',
            'Prohledám webové zdroje.',
            'Připravuji svoji odpověď.',
            'Zde vypisuji svoji odpověď.'
          ],
          OTHER: ['Dotaz analyzován.', 'Nalezen nevhodný výraz mimo téma.'],
          SWEARS: ['Dotaz analyzován.', 'Nalezen nevhodný výraz mimo téma.'],
          KB: [
            'Hledám informace ve své databázi.',
            'Připravuji svoji odpověď.',
            'Zde vypisuji svoji odpověď.'
          ]
        }
      },
      en: {
        analysis: ['Preparing my response.', 'Analyzing information.'],
        rewrite: ['Optimalizing my response for searching'],
        output: {
          SMT: ['Query analyzed.', 'Finalizing my response.'],
          KB_WS: [
            'Searching information in database.',
            'Searching web sources.',
            'Preparing response.',
            'I will start writing my response below.'
          ],
          OTHER: ['Query analyzed.', 'Inappropriate topic detected.'],
          SWEARS: ['Query analyzed.', 'Inappropriate expression detected.'],
          KB: [
            'Searching information in database.',
            'Preparing response.',
            'I will start writing my response below.'
          ]
        }
      },
      de: {
        analysis: ['Ich bereite meine Antwort vor.', 'Analysiere Informationen.'],
        rewrite: ['Optimalizeren Sie meine Antwort für die Suche'],
        output: {
          SMT: ['Anfrage analysiert.', 'Stelle Antwort fertig.'],
          KB_WS: [
            'Suche Informationen in der Datenbank.',
            'Durchsuche Webquellen.',
            'Bereite Antwort vor.',
            'Ich beginne unten mit meiner Antwort.'
          ],
          OTHER: ['Anfrage analysiert.', 'Unangemessenes Thema erkannt.'],
          SWEARS: ['Anfrage analysiert.', 'Unangemessener Ausdruck erkannt.'],
          KB: [
            'Suche Informationen in der Datenbank.',
            'Bereite Antwort vor.',
            'Ich beginne unten mit meiner Antwort.'
          ]
        }
      },
      uk: {
        analysis: ['Готую відповідь.', 'Аналізую інформацію.'],
        rewrite: ['Оптимізую відповідь для пошуку'],
        output: {
          SMT: ['Запит проаналізовано.', 'Завершую відповідь.'],
          KB_WS: [
            'Шукаю інформацію в базі даних.',
            'Шукаю веб-джерела.',
            'Готую відповідь.',
            'Нижче почну писати свою відповідь.'
          ],
          OTHER: ['Запит проаналізовано.', 'Виявлено неприйнятну тему.'],
          SWEARS: ['Запит проаналізовано.', 'Виявлено неприйнятний вираз.'],
          KB: [
            'Шукаю інформацію в базі даних.',
            'Готую відповідь.',
            'Нижче почну писати свою відповідь.'
          ]
        }
      }
    };

    // Error handling for missing messages
    try {
      const totalDuration = phaseDurations[phase];
      
      let messages;
      if (phase === 'output') {
        messages = messageSequences[lang]?.output?.[type];
      } else {
        messages = messageSequences[lang]?.[phase];
      }

      if (!messages) {
        console.error(`No messages found for lang: ${lang}, phase: ${phase}, type: ${type}`);
        return;
      }

      // Calculate interval between messages to distribute evenly
      const messageInterval = totalDuration / (messages.length);

      // Create container div with class for styling
      const container = document.createElement('div');
      container.className = 'vfrc-message vfrc-message--extension LoadingAnimation';
      
      const style = document.createElement('style');
      style.textContent = `
        .vfrc-message.vfrc-message--extension.LoadingAnimation {
          opacity: 1;
          transition: all 0.3s ease-out;
          width: 100%;
          display: block;
          background: transparent !important;
        }

        .vfrc-message.vfrc-message--extension.LoadingAnimation.empty {
          background-color: white !important;
          min-height: 0 !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .vfrc-message.vfrc-message--extension.LoadingAnimation.empty * {
          display: none !important;
        }
      `;
      container.appendChild(style);

      // Create loading container
      const loadingContainer = document.createElement('div');
      loadingContainer.className = 'loading-container';

      // Create animation container
      const animationContainer = document.createElement('div');
      animationContainer.className = 'loading-animation';
      
      // Create nine squares in a grid
      for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.className = 'loading-square';
        animationContainer.appendChild(square);
      }

      // First append the animation
      loadingContainer.appendChild(animationContainer);

      // Then create and append text element
      const textElement = document.createElement('span');
      textElement.className = 'loading-text';
      loadingContainer.appendChild(textElement);

      container.appendChild(loadingContainer);

      console.log('Created container structure:', container); // Log the created structure

      let currentIndex = 0;
      
      const updateText = (newText) => {
        const textElement = container.querySelector('.loading-text');
        textElement.classList.add('changing');
        
        setTimeout(() => {
          textElement.textContent = newText;
          textElement.classList.remove('changing');
          textElement.classList.add('entering');
          
          requestAnimationFrame(() => {
            textElement.classList.remove('entering');
          });
        }, 300);
      };

      // Initial text update
      updateText(messages[currentIndex]);

      // Set up interval for multiple messages
      let interval;
      if (messages.length > 1) {
        interval = setInterval(() => {
          if (currentIndex < messages.length - 1) {
            currentIndex++;
            updateText(messages[currentIndex]);
          } else {
            clearInterval(interval);
          }
        }, messageInterval);
      }

      // Update the hide timeout logic
      const hideTimeout = setTimeout(() => {
        const mainContainer = container.closest('.vfrc-message.vfrc-message--extension.LoadingAnimation');
        if (!mainContainer) {
          console.error('Could not find main container to remove');
          return;
        }

        // Instead of removing, empty the container and make it transparent
        mainContainer.innerHTML = '';
        mainContainer.classList.add('empty');
        mainContainer.style.backgroundColor = 'white';
        mainContainer.style.background = 'transparent';

        // Clear intervals
        if (interval) {
          clearInterval(interval);
        }
      }, totalDuration);

      // Enhanced cleanup observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === container || node.contains(container)) {
              if (interval) clearInterval(interval);
              if (hideTimeout) clearTimeout(hideTimeout);
              observer.disconnect();
            }
          });
        });
      });

      observer.observe(element.parentElement || document.body, { 
        childList: true,
        subtree: true 
      });

      // Make sure we're appending to the correct element
      if (element) {
        console.log('Appending to element:', element);
        element.appendChild(container);
        console.log('Container appended successfully');
        
        void container.offsetHeight; // Force reflow
      } else {
        console.error('Target element is not available');
      }
    } catch (error) {
      console.error('Error in LoadingAnimation extension:', error);
    }
  }
};
