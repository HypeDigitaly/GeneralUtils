export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    console.log('Full trace object:', trace);
    console.log('Full payload object:', trace.payload);
    console.log('Target element:', element); // Log the target element

    const payload = trace.payload || {};
    
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

    // Define fixed durations for each type (in milliseconds)
    const typeDurations = {
      KB: 10000,      // 10 seconds
      KB_WS: 15000,   // 15 seconds
      SMT: 4000,      // 4 seconds
      OTHER: 4000,    // 4 seconds
      SWEARS: 4000    // 4 seconds
    };

    // Message sequences for different types and languages
    const messageSequences = {
      cs: {
        SMT: ['Analyzuji dotaz.', 'Níže začnu vypisovat svou odpověď.'],
        KB_WS: [
          'Zpracovávám dotaz.',
          'Hledám informace ve své databázi.',
          'Prohledávám webové zdroje.',
          'Analyzuji informace.',
          'Připravuji odpověď.',
          'Níže začnu vypisovat svou odpověď.'
        ],
        OTHER: ['Analyzuji dotaz.', 'Nalezen dotaz na nevhodné téma.'],
        SWEARS: ['Analyzuji dotaz.', 'Nalezen nevhodný výraz.'],
        KB: [
          'Zpracovávám dotaz.',
          'Hledám informace ve své databázi.',
          'Analyzuji informace.',
          'Připravuji odpověď.',
          'Níže začnu vypisovat svou odpověď.'
        ]
      },
      en: {
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
      },
      de: {
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
      },
      uk: {
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
    };

    // Error handling for missing messages
    try {
      const messages = messageSequences[lang]?.[type];
      const totalDuration = typeDurations[type] || 4000; // default to 4s if type not found

      if (!messages) {
        console.error(`No messages found for lang: ${lang}, type: ${type}`);
        return;
      }

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
          padding: 4px 8px;  /* much more compact padding */
          border-radius: 4px;  /* smaller radius to match */
          margin: 0;  /* removed margins completely */
          width: 100%;
          box-sizing: border-box;
        }

        .loading-text {
          color: #333;
          font-size: 13px;  /* slightly smaller font */
          font-family: sans-serif;
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
          width: 16px;  /* even smaller animation */
          height: 16px;
          flex: 0 0 16px;
          opacity: 1;
          transition: all 0.3s ease-out;
          display: grid;
          grid-template-columns: repeat(3, 4px);
          grid-template-rows: repeat(3, 4px);
          gap: 1px;
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
      const messageInterval = 2000;
      
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
            // Stop the interval when we reach the last message
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
        
        // Remove the gap after animation is hidden
        setTimeout(() => {
          loadingContainer.style.gap = '0';
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
