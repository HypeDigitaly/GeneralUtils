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
          SMT: ['Dokončuji svoji odpověď.', 'Zde vypisuji svoji odpověď.'],
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
          SMT: ['Preparing my response.', 'Analyzing information.'],
          KB_WS: [
            'Processing query.',
            'Searching information in database.',
            'Searching web sources.',
            'Analyzing information.',
            'Preparing response.',
            'I will start writing my response below.'
          ],
          OTHER: ['Analyzing query.', 'Inappropriate topic detected.'],
          SWEARS: ['Analyzing query.', 'Inappropriate expression detected.'],
          KB: [
            'Processing query.',
            'Searching information in database.',
            'Analyzing information.',
            'Preparing response.',
            'I will start writing my response below.'
          ]
        }
      },
      de: {
        analysis: ['Ich bereite meine Antwort vor.', 'Analysiere Informationen.'],
        rewrite: ['Optimalizeren Sie meine Antwort für die Suche'],
        output: {
          SMT: ['Ich bereite meine Antwort vor.', 'Analysiere Informationen.'],
          KB_WS: [
            'Verarbeite Anfrage.',
            'Suche Informationen in der Datenbank.',
            'Durchsuche Webquellen.',
            'Analysiere Informationen.',
            'Bereite Antwort vor.',
            'Ich beginne unten mit meiner Antwort.'
          ],
          OTHER: ['Analysiere Anfrage.', 'Unangemessenes Thema erkannt.'],
          SWEARS: ['Analysiere Anfrage.', 'Unangemessener Ausdruck erkannt.'],
          KB: [
            'Verarbeite Anfrage.',
            'Suche Informationen in der Datenbank.',
            'Analysiere Informationen.',
            'Bereite Antwort vor.',
            'Ich beginne unten mit meiner Antwort.'
          ]
        }
      },
      uk: {
        analysis: ['Готую відповідь.', 'Аналізую інформацію.'],
        rewrite: ['Оптимізую відповідь для пошуку'],
        output: {
          SMT: ['Готую відповідь.', 'Аналізую інформацію.'],
          KB_WS: [
            'Обробляю запит.',
            'Шукаю інформацію в базі даних.',
            'Шукаю веб-джерела.',
            'Аналізую інформацію.',
            'Готую відповідь.',
            'Нижче почну писати свою відповідь.'
          ],
          OTHER: ['Аналізую запит.', 'Виявлено неприйнятну тему.'],
          SWEARS: ['Аналізую запит.', 'Виявлено неприйнятний вираз.'],
          KB: [
            'Обробляю запит.',
            'Шукаю інформацію в базі даних.',
            'Аналізую інформацію.',
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
          transition: opacity 0.3s ease-out;
          width: 100%;
          display: block;
        }

        .vfrc-message.vfrc-message--extension.LoadingAnimation.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .loading-container {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          margin: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .loading-text {
          color: #1a1e23;  /* matching exact color from CSS */
          font-size: 14px;
          line-height: 20px;  /* exact line height from CSS */
          font-family: var(--_1bof89na);  /* using the same font variable */
          position: relative;
          display: flex;
          flex-direction: column;
          max-width: 100%;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease-out, transform 0.3s ease-out;
          flex: 1;
          min-width: 0;
        }

        .loading-text.changing {
          opacity: 0;
          transform: translateY(-5px);
        }

        .loading-text.entering {
          opacity: 0;
          transform: translateY(5px);
        }

        .loading-animation {
          position: relative;
          width: 16px;
          height: 16px;
          flex: 0 0 16px;
          opacity: 1;
          transition: all 0.3s ease-out;
          display: grid;
          grid-template-columns: repeat(3, 4px);
          grid-template-rows: repeat(3, 4px);
          gap: 1px;
          margin-top: 2px;
        }

        .loading-animation.hide {
          opacity: 0;
          visibility: hidden;
          width: 0;
          margin-right: 0;
          flex: 0 0 0;
        }

        .loading-square {
          width: 4px;
          height: 4px;
          background-color: #808080;
          animation: wave 1s infinite;
        }

        .loading-square:nth-child(1) { animation-delay: 0s; }
        .loading-square:nth-child(2) { animation-delay: 0.1s; }
        .loading-square:nth-child(3) { animation-delay: 0.2s; }
        .loading-square:nth-child(6) { animation-delay: 0.3s; }
        .loading-square:nth-child(9) { animation-delay: 0.4s; }
        .loading-square:nth-child(8) { animation-delay: 0.5s; }
        .loading-square:nth-child(7) { animation-delay: 0.6s; }
        .loading-square:nth-child(4) { animation-delay: 0.7s; }
        .loading-square:nth-child(5) { animation-delay: 0.8s; }

        @keyframes wave {
          0%, 100% {
            background-color: #E6E6E6;
          }
          50% {
            background-color: #808080;
          }
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

      // Set up the hide timeout
      const hideTimeout = setTimeout(() => {
        // Hide the animation and remove its space
        const animationElement = container.querySelector('.loading-animation');
        if (animationElement) {
          animationElement.classList.add('hide');
        }
        
        // Function to recursively set padding/margin to 0 and hide elements
        // Hide the entire extension component after animation
        setTimeout(() => {
          // Get the extension's root element (the vfrc-message element)
          const extensionRoot = element.querySelector('.vfrc-message--extension');
          if (extensionRoot) {
            extensionRoot.style.display = 'none';
            extensionRoot.style.visibility = 'hidden';
            extensionRoot.style.opacity = '0';
            extensionRoot.style.height = '0';
            extensionRoot.style.overflow = 'hidden';
            // Also remove it from layout flow
            extensionRoot.style.position = 'absolute';
            extensionRoot.style.pointerEvents = 'none';
          }
          // Also hide the container element itself
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.height = '0';
        }, 300); // Match the transition duration
        
        // Clear any remaining intervals
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
