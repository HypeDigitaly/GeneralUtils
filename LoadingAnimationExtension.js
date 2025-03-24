export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const payload = trace.payload || {};
    const phase = payload.phase || 'output'; // default to output if not specified

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

    // Get custom duration if provided (in seconds, convert to milliseconds)
    const customDuration = payload.durationSec ? (payload.durationSec * 1000) : null;
    
    // Get custom messages with durations if provided
    const customMessagesWithDurations = payload.messagesWithDurations || null;

    // Define fixed durations for each phase (in milliseconds)
    const phaseDurations = {
      analysis: 3000,  // 3 seconds
      output: 9000,    // 9 seconds for multiple messages
      rewrite: 3000    // 3 seconds
    };

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

    // Adjust duration if there's only one message and no custom duration
    if (!customDuration && phase === 'output' && messageSequences[lang]?.output?.[type]?.length === 1) {
      phaseDurations.output = 1500; // 1.5 seconds for single message
    }

    // Error handling for missing messages
    try {
      // Check if we have custom messages with durations
      let messages;
      let messageIntervals = [];
      let totalDuration;
      
      if (customMessagesWithDurations) {
        // Use custom messages and their durations
        messages = customMessagesWithDurations.map(item => item.message);
        
        // Convert durations from seconds to milliseconds
        messageIntervals = customMessagesWithDurations.map(item => item.durationSec * 1000);
        
        // Calculate total duration as sum of all individual durations
        totalDuration = messageIntervals.reduce((sum, duration) => sum + duration, 0);
      } else {
        // Use predefined messages based on phase and type
        if (phase === 'all' && (type === 'KB' || type === 'KB_WS')) {
          messages = messageSequences[lang]?.all?.[type];
        } else if (phase === 'output') {
          messages = messageSequences[lang]?.output?.[type];
        } else {
          messages = messageSequences[lang]?.[phase];
        }
        
        if (!messages) {
          return;
        }
        
        // Use custom duration if provided, otherwise use phase duration
        totalDuration = customDuration || phaseDurations[phase];
        
        // Calculate interval between messages to distribute evenly
        const equalInterval = totalDuration / messages.length;
        messageIntervals = new Array(messages.length).fill(equalInterval);
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
          padding: 6px 12px;
          margin: 0;
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .loading-text {
          color: rgba(26, 30, 35, 0.6);  /* less prominent text color */
          font-size: 11px;
          line-height: 16px;
          font-family: var(--_1bof89na);
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
          margin: 0;
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
          background-color: rgba(128, 128, 128, 0.6);
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
            background-color: rgba(230, 230, 230, 0.6);
          }
          50% {
            background-color: rgba(128, 128, 128, 0.6);
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

      // Set up intervals for multiple messages with different durations
      let timeouts = [];
      let cumulativeTime = 0;
      
      if (messages.length > 1) {
        // For each message (except the first one which is already displayed),
        // set a timeout based on the previous message's duration
        for (let i = 1; i < messages.length; i++) {
          cumulativeTime += messageIntervals[i-1];
          
          const timeout = setTimeout(() => {
            currentIndex = i;
            updateText(messages[i]);
          }, cumulativeTime);
          
          timeouts.push(timeout);
        }
      }

      // Set up the hide timeout - only hide after all messages have been displayed and their durations elapsed
      const hideTimeout = setTimeout(() => {
        // Clear any remaining timeouts
        timeouts.forEach(timeout => clearTimeout(timeout));
        
        // Add a delay before hiding the animation for the last message
        // This ensures the animation continues during the last message's display time
        setTimeout(() => {
          // Hide the animation and remove its space
          const animationElement = container.querySelector('.loading-animation');
          if (animationElement) {
            animationElement.classList.add('hide');
          }

          // Remove the gap after animation is hidden
          setTimeout(() => {
            loadingContainer.style.gap = '0';
          }, 300); // Match the transition duration
        }, messageIntervals[messages.length - 1] || 1500); // Use the last message's duration, or default to 1.5s
        
      }, totalDuration);

      // Enhanced cleanup observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === container || node.contains(container)) {
              timeouts.forEach(timeout => clearTimeout(timeout));
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
        element.appendChild(container);
        void container.offsetHeight; // Force reflow
      }
    } catch (error) {
      // Silently handle errors
    }
  }
};