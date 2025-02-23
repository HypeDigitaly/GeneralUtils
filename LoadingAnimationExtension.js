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
        SMT: ['Připravuji svou odpověď.', 'Analyzuji informace.'],
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
        }

        .vfrc-message.vfrc-message--extension.LoadingAnimation.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .loading-container {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 16px;
          background: #f8f8f8;
          border-radius: 8px;
          margin: 8px 0;
        }

        .loading-text {
          color: #333;
          font-size: 14px;
          font-family: sans-serif;
        }

        .loading-animation {
          position: relative;
          width: 50px;
          height: 24px;
          flex-shrink: 0;
          transition: visibility 0.3s ease-out;
        }

        .loading-animation.hide {
          visibility: hidden;
        }

        .loading-circle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #333;
          animation: moveCircle 1.5s infinite ease-in-out;
        }

        .loading-circle:nth-child(1) {
          left: 0;
          animation-delay: 0s;
          background-color: #555;
        }

        .loading-circle:nth-child(2) {
          left: 20px;
          animation-delay: 0.15s;
          background-color: #777;
        }

        .loading-circle:nth-child(3) {
          left: 40px;
          animation-delay: 0.3s;
          background-color: #999;
        }

        @keyframes moveCircle {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          25% {
            transform: translateY(-10px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          75% {
            transform: translateY(10px) scale(0.8);
            opacity: 0.8;
          }
        }
      `;
      container.appendChild(style);

      // Create loading container
      const loadingContainer = document.createElement('div');
      loadingContainer.className = 'loading-container';

      // Create text element
      const textElement = document.createElement('span');
      textElement.className = 'loading-text';
      loadingContainer.appendChild(textElement);

      // Create animation container
      const animationContainer = document.createElement('div');
      animationContainer.className = 'loading-animation';

      // Create circles
      for (let i = 0; i < 3; i++) {
        const circle = document.createElement('div');
        circle.className = 'loading-circle';
        animationContainer.appendChild(circle);
      }

      loadingContainer.appendChild(animationContainer);
      container.appendChild(loadingContainer);

      console.log('Created container structure:', container); // Log the created structure

      let currentIndex = 0;
      const messageInterval = 2000; // Fixed 2-second interval between messages
      
      const updateText = () => {
        textElement.textContent = messages[currentIndex];
        currentIndex++;
        
        // If we've shown all messages except the last one, stop the interval
        if (currentIndex >= messages.length - 1) {
          clearInterval(interval);
          // Set the last message
          textElement.textContent = messages[messages.length - 1];
        }
      };

      // Initial text update
      updateText();

      // Set up interval for multiple messages
      let interval;
      if (messages.length > 1) {
        interval = setInterval(updateText, messageInterval);
      }

      // Set up the hide timeout
      const hideTimeout = setTimeout(() => {
        // Only hide the animation circles
        animationContainer.classList.add('hide');
        
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
