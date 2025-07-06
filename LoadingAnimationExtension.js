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
    else if (incomingLang.includes('sk')) lang = 'sk';
    else if (incomingLang.includes('pl')) lang = 'pl';
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
        analysis: {
          DEFAULT: ['Vydržte moment'],
          SMT: ['Analyzuji dotaz.', 'Vydržte moment'],
          SWEARS: ['Analyzuji dotaz.', 'Vydržte moment'],
          OTHER: ['Analyzuji dotaz.', 'Vydržte moment'],
          KB: ['Analyzuji dotaz.', 'Zpracovávám váš dotaz.', 'Vydržte moment'],
          KB_WS: ['Analyzuji dotaz.', 'Zpracovávám váš dotaz.', 'Vydržte moment']
        },
        rewrite: ['Zpracovávám Váš dotaz.'],
        output: {
          SMT: ['Dokončuji odpověď.'],
          KB_WS: [
            'Hledám v databázi.',
            'Prohledávám webové zdroje.',
            'Připravuji odpověď.',
            'Přemýšlím, prosím čekejte',
            'Píši odpověď.'
          ],
          OTHER: ['Nacházím nevhodný výraz.'],
          SWEARS: ['Nacházím nevhodný výraz.'],
          KB: [
            'Hledám v databázi.',
            'Připravuji odpověď.',
            'Přemýšlím, prosím čekejte',
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
        },
        KB_Search: [
          'Zanalyzoval jsem Váš dotaz.',
          'Optimalizuji Váš dotaz.',
          'Prohledávám svou interní databázi.',
          'Níže je má finální odpověď.'
        ],
        Web_Search: [
          'Spouštím webové vyhledávání.',
          'Prohledávám naší webovou stránku.',
          'Prohledávám ostatní webové zdroje.',
          'Níže je má finální odpověď.'
        ]
      },
      en: {
        analysis: {
          DEFAULT: ['Hold on a moment'],
          SMT: ['Analyzing query.', 'Hold on a moment'],
          SWEARS: ['Analyzing query.', 'Hold on a moment'],
          OTHER: ['Analyzing query.', 'Hold on a moment'],
          KB: ['Analyzing query.', 'Processing your query.', 'Hold on a moment'],
          KB_WS: ['Analyzing query.', 'Processing your query.', 'Hold on a moment']
        },
        rewrite: ['Processing your query.'],
        output: {
          SMT: ['I am completing my response.'],
          KB_WS: [
            'I am searching the database.',
            'I am searching web sources.',
            'I am preparing my response.',
            'I am thinking, please wait',
            'I am writing my response.'
          ],
          OTHER: ['I am detecting inappropriate content.'],
          SWEARS: ['I am detecting inappropriate content.'],
          KB: [
            'I am searching the database.',
            'I am preparing my response.',
            'I am thinking, please wait',
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
        analysis: {
          DEFAULT: ['Einen Moment bitte'],
          SMT: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          SWEARS: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          OTHER: ['Anfrage wird analysiert.', 'Einen Moment bitte'],
          KB: ['Anfrage wird analysiert.', 'Ihre Anfrage wird bearbeitet.', 'Einen Moment bitte'],
          KB_WS: ['Anfrage wird analysiert.', 'Ihre Anfrage wird bearbeitet.', 'Einen Moment bitte']
        },
        rewrite: ['Ihre Anfrage wird bearbeitet.'],
        output: {
          SMT: ['Ich bin dabei, meine Antwort fertigzustellen.'],
          KB_WS: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, Web-Quellen zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich denke nach, bitte warten',
            'Ich bin dabei, meine Antwort zu schreiben.'
          ],
          OTHER: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          SWEARS: ['Ich bin dabei, unangemessenen Inhalt zu erkennen.'],
          KB: [
            'Ich bin dabei, die Datenbank zu durchsuchen.',
            'Ich bin dabei, meine Antwort vorzubereiten.',
            'Ich denke nach, bitte warten',
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
        analysis: {
          DEFAULT: ['Зачекайте хвилинку'],
          SMT: ['Аналізую запит.', 'Зачекайте хвилинку'],
          SWEARS: ['Аналізую запит.', 'Зачекайте хвилинку'],
          OTHER: ['Аналізую запит.', 'Зачекайте хвилинку'],
          KB: ['Аналізую запит.', 'Обробляю ваш запит.', 'Зачекайте хвилинку'],
          KB_WS: ['Аналізую запит.', 'Обробляю ваш запит.', 'Зачекайте хвилинку']
        },
        rewrite: ['Обробляю ваш запит.'],
        output: {
          SMT: ['Зараз завершую відповідь.'],
          KB_WS: [
            'Зараз шукаю в базі даних.',
            'Зараз шукаю веб-джерела.',
            'Зараз готую відповідь.',
            'Думаю, будь ласка, зачекайте',
            'Зараз пишу відповідь.'
          ],
          OTHER: ['Зараз виявляю недоречний зміст.'],
          SWEARS: ['Зараз виявляю недоречний зміст.'],
          KB: [
            'Зараз шукаю в базі даних.',
            'Зараз готую відповідь.',
            'Думаю, будь ласка, зачекайте',
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
      },
      sk: {
        analysis: {
          DEFAULT: ['Počkajte chvíľu'],
          SMT: ['Analyzujem dotaz.', 'Počkajte chvíľu'],
          SWEARS: ['Analyzujem dotaz.', 'Počkajte chvíľu'],
          OTHER: ['Analyzujem dotaz.', 'Počkajte chvíľu'],
          KB: ['Analyzujem dotaz.', 'Spracúvam váš dotaz.', 'Počkajte chvíľu'],
          KB_WS: ['Analyzujem dotaz.', 'Spracúvam váš dotaz.', 'Počkajte chvíľu']
        },
        rewrite: ['Spracúvam váš dotaz.'],
        output: {
          SMT: ['Dokončujem odpoveď.'],
          KB_WS: [
            'Hľadám v databáze.',
            'Prehľadávam webové zdroje.',
            'Pripravujem odpoveď.',
            'Premýšľam, prosím čakajte',
            'Píšem odpoveď.'
          ],
          OTHER: ['Nachádzam nevhodný výraz.'],
          SWEARS: ['Nachádzam nevhodný výraz.'],
          KB: [
            'Hľadám v databáze.',
            'Pripravujem odpoveď.',
            'Premýšľam, prosím čakajte',
            'Píšem odpoveď.'
          ]
        },
        all: {
          KB: [
            'Prehľadávam svoju databázu.',
            'Overujem informácie.',
            'Pripravujem svoju odpoveď.'
          ],
          KB_WS: [
            'Prehľadávam svoju databázu.',
            'Prehľadávam webové zdroje.',
            'Overujem informácie.',
            'Pripravujem svoju odpoveď.'
          ]
        }
      },
      pl: {
        analysis: {
          DEFAULT: ['Poczekaj chwilę'],
          SMT: ['Analizuję zapytanie.', 'Poczekaj chwilę'],
          SWEARS: ['Analizuję zapytanie.', 'Poczekaj chwilę'],
          OTHER: ['Analizuję zapytanie.', 'Poczekaj chwilę'],
          KB: ['Analizuję zapytanie.', 'Przetwarzam twoje zapytanie.', 'Poczekaj chwilę'],
          KB_WS: ['Analizuję zapytanie.', 'Przetwarzam twoje zapytanie.', 'Poczekaj chwilę']
        },
        rewrite: ['Przetwarzam twoje zapytanie.'],
        output: {
          SMT: ['Kończę odpowiedź.'],
          KB_WS: [
            'Szukam w bazie danych.',
            'Przeszukuję źródła internetowe.',
            'Przygotowuję odpowiedź.',
            'Myślę, proszę czekać',
            'Piszę odpowiedź.'
          ],
          OTHER: ['Wykrywam nieodpowiednie treści.'],
          SWEARS: ['Wykrywam nieodpowiednie treści.'],
          KB: [
            'Szukam w bazie danych.',
            'Przygotowuję odpowiedź.',
            'Myślę, proszę czekać',
            'Piszę odpowiedź.'
          ]
        },
        all: {
          KB: [
            'Przeszukuję moją bazę danych.',
            'Weryfikuję informacje.',
            'Przygotowuję moją odpowiedź.'
          ],
          KB_WS: [
            'Przeszukuję moją bazę danych.',
            'Przeszukuję źródła internetowe.',
            'Weryfikuję informacje.',
            'Przygotowuję moją odpowiedź.'
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
      } else if (phase === 'analysis') {
        messages = messageSequences[lang]?.[phase]?.[type] || messageSequences[lang]?.[phase]?.DEFAULT;
      } else if (phase === 'KB_Search' || phase === 'Web_Search') {
        messages = messageSequences[lang]?.[phase];
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
        // console.log(`LoadingAnimationExtension: Using custom duration from payload: ${customDurationSeconds}s (${totalDuration}ms)`);
      } else {
        // Automatic duration calculation based on phase and type
        if (phase === 'analysis') {
          if (type === 'SMT' || type === 'SWEARS' || type === 'OTHER') {
            totalDuration = 4000;
          } else if (type === 'KB' || type === 'KB_WS') {
            totalDuration = 12000;
          } else {
            totalDuration = 3000; // Default for analysis if type doesn't match
          }
        } else if (phase === 'output') {
          if (type === 'SMT' || type === 'SWEARS' || type === 'OTHER') {
            totalDuration = 4000;
          } else if (type === 'KB') {
            totalDuration = 12000;
          } else if (type === 'KB_WS') {
            totalDuration = 23000;
          } else {
            totalDuration = 3000; // Default for output if type doesn't match
          }
        } else if (phase === 'KB_Search') {
          totalDuration = 16000; // 16 seconds for KB_Search (4 messages)
        } else if (phase === 'Web_Search') {
          totalDuration = 16000; // 16 seconds for Web_Search (4 messages)
        } else {
          // Fallback to a general default duration if phase is not analysis or output
          // or if payload.duration is not provided or invalid for other phases
          totalDuration = 3000; // Default to 3 seconds
        }
        // console.log(`LoadingAnimationExtension: Using automatic duration for lang='${lang}', phase='${phase}', type='${type}': ${totalDuration}ms`);
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

        /* New rotating point spinner animation */
        @keyframes loading-spinner-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .rotating-point-spinner {
          position: relative;
          width: 16px; /* Spinner size */
          height: 16px;
          animation: loading-spinner-spin 0.9s linear infinite;
          flex-shrink: 0;
          transition: opacity 0.3s ease-out, width 0.3s ease-out;
          opacity: 1;
        }

        /* The track of the circle */
        .rotating-point-spinner::before {
          content: "";
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.12); /* Light grey track */
        }

        /* The thicker rotating point */
        .rotating-point-spinner::after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          width: 5px; /* Size of the thicker point */
          height: 5px;
          background-color: var(--spinner-point-colour, #696969); /* Use CSS var with dark grey fallback */
          border-radius: 50%;
          /* Position it at 12 o'clock on the track's centerline */
          top: -1.5px; 
          left: calc(50% - 2.5px); /* (ContainerWidth/2 - PointWidth/2) */
        }

        .rotating-point-spinner.hide {
          opacity: 0;
          visibility: hidden;
          width: 0 !important;
          display: none; /* Completely remove from layout flow */
          /* margin-right: 0 !important; // Not strictly needed */
        }
      `;
      container.appendChild(style);

      // Create the main styled box (renamed from loadingContainer)
      const loadingBox = document.createElement('div');
      loadingBox.className = 'loading-box';

      // Create new spinner animation container
      const spinnerAnimationContainer = document.createElement('div');
      spinnerAnimationContainer.className = 'rotating-point-spinner';

      // Get custom color from payload or use default
      const mainColour = trace.payload?.mainColour;
      if (mainColour && typeof mainColour === 'string') {
        // Validate HEX color format (e.g., #E21D1F or #F00)
        if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(mainColour)) {
          spinnerAnimationContainer.style.setProperty('--spinner-point-colour', mainColour);
        }
      }

      // No need to create individual dots anymore
      // The spinner is self-contained via CSS pseudo-elements

      // Append the spinner animation first
      loadingBox.appendChild(spinnerAnimationContainer);

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

      // Stop animation (spinner) and message cycling after totalDuration
      const animationTimeoutId = setTimeout(() => {
        if (intervalId) { // If message cycling interval is still active
          clearInterval(intervalId);
          intervalId = null;
        }
        // Hide only the spinner animation, not the whole container or text
        if (spinnerAnimationContainer) {
          spinnerAnimationContainer.classList.add('hide');
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