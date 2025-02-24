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
      output: 6000,    // 6 seconds for multiple messages
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
            'Prohledávám svou databázi.',
            'Prohledávám webové zdroje.',
            'Ověřuji informace.',
            'Připravuji svoji odpověď.'
          ],
          OTHER: ['Nacházím nevhodný výraz.'],
          SWEARS: ['Nacházím nevhodný výraz.'],
          KB: [
            'Prohledávám svou databázi.',
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
        }
      }
    };

    // Adjust duration if there's only one message
    if (phase === 'output' && messageSequences[lang]?.output?.[type]?.length === 1) {
      phaseDurations.output = 1500; // 1.5 seconds for single message
    }

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