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

    // Define fixed durations for each phase (in milliseconds)
    // const phaseDurations = {
    //   analysis: 3000,  // 3 seconds
    //   output: 9000,    // 9 seconds for multiple messages
    //   rewrite: 3000    // 3 seconds
    // };

    // Message sequences for different phases and types
    const messageSequences = {
      cs: {
        analysis: ['Vydržte moment'],
        rewrite: ['Zpracovávám Váš dotaz.'],
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
        analysis: ['Hold on a moment'],
        rewrite: ['Processing your query.'],
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
        analysis: ['Einen Moment bitte'],
        rewrite: ['Ihre Anfrage wird bearbeitet.'],
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
        analysis: ['Зачекайте хвилинку'],
        rewrite: ['Обробляю ваш запит.'],
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

    // Error handling for missing messages or duration calculation
    try {
      const customDurationSeconds = payload.duration; // From payload

      // Determine messages based on phase and type
      let messages;
      if (phase === 'all' && (type === 'KB' || type === 'KB_WS')) {
        messages = messageSequences[lang]?.all?.[type];
      } else if (phase === 'output') {
        messages = messageSequences[lang]?.output?.[type];
      } else {
        messages = messageSequences[lang]?.[phase];
      }

      // Exit if no messages are found or if the message array is empty
      if (!messages || messages.length === 0) {
        // console.warn(`LoadingAnimationExtension: No messages or empty message array for lang='${lang}', phase='${phase}', type='${type}'`);
        return;
      }

      // Determine totalDuration for the animation
      let totalDuration;
      if (customDurationSeconds !== undefined && typeof customDurationSeconds === 'number' && customDurationSeconds > 0) {
        totalDuration = customDurationSeconds * 1000; // Use custom duration from payload (in ms)
        console.log(`LoadingAnimationExtension: Using custom duration from payload: ${customDurationSeconds}s (${totalDuration}ms)`);
      } else {
        // Fallback to a default duration if payload.duration is not provided or invalid
        // console.warn(`LoadingAnimationExtension: payload.duration is missing or invalid. Defaulting to 3000ms.`);
        totalDuration = 3000; // Default to 3 seconds
        console.log(`LoadingAnimationExtension: payload.duration is missing or invalid. Defaulting to fallback duration: ${totalDuration}ms`);
      }

      // Calculate interval between messages to distribute evenly
      const messageInterval = totalDuration / messages.length; // messages.length is guaranteed to be > 0 here

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

        /* Updated styling for the main loading container (inspired by Perplexity's reasoning-section) */
        .loading-box {
          display: flex;
          align-items: center;
          gap: 8px; /* Reduced gap */
          padding: 8px 12px; /* Reduced padding */
          margin: 0;
          width: 100%;
          box-sizing: border-box;
          background-color: #F9FAFB;
          border-radius: 12px;
          /* border: 1px solid #E5E7EB; /* Optional: if a subtle border is desired */
        }

        .loading-text {
          color: rgba(26, 30, 35, 0.7); /* Slightly darker for better contrast on new bg */
          font-size: 12px; /* Increased font size slightly */
          line-height: 1.3; /* Adjusted line height for better vertical centering */
          font-family: var(--_1bof89na); /* Assuming this is a Voiceflow variable for font */
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

        /* New loading dots animation (inspired by Perplexity) */
        .loading-dots-animation {
          display: inline-flex;
          align-items: center;
          gap: 5px; /* Space between dots */
          flex-shrink: 0; /* Prevent shrinking */
          transition: opacity 0.3s ease-out, width 0.3s ease-out; /* For hiding */
          opacity: 1;
        }

        .loading-dots-animation.hide {
          opacity: 0;
          visibility: hidden;
          width: 0 !important; /* Ensure it collapses */
          margin-right: 0 !important; /* Ensure it collapses */
          gap: 0; /* Ensure it collapses */
        }

        .loading-dots-animation .dot {
          width: 4px; /* Reduced dot size */
          height: 4px; /* Reduced dot size */
          background-color: #6B7280; /* Perplexity's dot color */
          border-radius: 50%;
          animation: dotPulse 1.5s infinite ease-in-out;
        }

        .loading-dots-animation .dot:nth-child(1) { animation-delay: 0s; }
        .loading-dots-animation .dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots-animation .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `;
      container.appendChild(style);

      // Create the main styled box (renamed from loadingContainer)
      const loadingBox = document.createElement('div');
      loadingBox.className = 'loading-box';

      // Create new dots animation container
      const dotsAnimationContainer = document.createElement('div');
      dotsAnimationContainer.className = 'loading-dots-animation';

      // Create three dots
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotsAnimationContainer.appendChild(dot);
      }

      // Append the dots animation first
      loadingBox.appendChild(dotsAnimationContainer);

      // Then create and append text element
      const textElement = document.createElement('span');
      textElement.className = 'loading-text';
      loadingBox.appendChild(textElement);

      container.appendChild(loadingBox); // Append the styled box to the main container

      let currentIndex = 0;

      const updateText = (newText) => {
        // Ensure textElement is the one inside loadingBox for consistency
        const currentTextElement = loadingBox.querySelector('.loading-text');
        if (!currentTextElement) return;

        currentTextElement.classList.add('changing');

        setTimeout(() => {
          currentTextElement.textContent = newText;
          currentTextElement.classList.remove('changing');
          currentTextElement.classList.add('entering');

          requestAnimationFrame(() => {
            currentTextElement.classList.remove('entering');
          });
        }, 300);
      };

      // Initial text update
      updateText(messages[currentIndex]);

      // Set up interval for multiple messages
      let intervalId = null;
      if (messages.length > 1) {
        intervalId = setInterval(() => {
          if (currentIndex < messages.length - 1) { // Check if not the last message
            currentIndex++;
            updateText(messages[currentIndex]);
          } else {
            // Reached the last message, stop cycling new messages
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null; // Mark as cleared
            }
          }
        }, messageInterval);
      }

      // Stop animation (dots) and message cycling after totalDuration
      const animationTimeoutId = setTimeout(() => {
        if (intervalId) { // If message cycling interval is still active
          clearInterval(intervalId);
          intervalId = null;
        }
        // Hide only the dots animation, not the whole container or text
        if (dotsAnimationContainer) {
          dotsAnimationContainer.classList.add('hide');
        }
        // The last message will remain visible
      }, totalDuration);

      // Enhanced cleanup observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === container || node.contains(container)) {
              if (intervalId) clearInterval(intervalId);
              clearTimeout(animationTimeoutId); // Clear the animation timeout as well
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