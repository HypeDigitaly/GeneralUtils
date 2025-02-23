export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    // Log the entire trace and payload
    console.log('Full trace object:', trace);
    console.log('Full payload object:', trace.payload);

    const { lang = 'cs', type = 'SMT' } = trace.payload
    
    // Log individual fields
    console.log('Language:', lang);
    console.log('Type:', type);
    console.log('Element:', element);

    // Message sequences for different types and languages
    const messageSequences = {
      cs: {
        SMT: ['Připravuji svou odpověď.'],
        KB_WS: [
          'Zpracovávám dotaz',
          'Hledám informace ve své databázi',
          'Prohledávám webové zdroje',
          'Analyzuji informace',
          'Připravuji odpověď'
        ],
        OTHER: ['Analyzuji dotaz', 'Nalezen dotaz na nevhodné téma'],
        SWEARS: ['Analyzuji dotaz', 'Nalezen nevhodný výraz'],
        KB: [
          'Zpracovávám dotaz',
          'Hledám informace ve své databázi',
          'Analyzuji informace',
          'Připravuji odpověď'
        ]
      },
      en: {
        SMT: ['Preparing my response.'],
        KB_WS: [
          'Processing query',
          'Searching information in database',
          'Searching web sources',
          'Analyzing information',
          'Preparing response'
        ],
        OTHER: ['Analyzing query', 'Inappropriate topic detected'],
        SWEARS: ['Analyzing query', 'Inappropriate expression detected'],
        KB: [
          'Processing query',
          'Searching information in database',
          'Analyzing information',
          'Preparing response'
        ]
      },
      de: {
        SMT: ['Ich bereite meine Antwort vor.'],
        KB_WS: [
          'Verarbeite Anfrage',
          'Suche Informationen in der Datenbank',
          'Durchsuche Webquellen',
          'Analysiere Informationen',
          'Bereite Antwort vor'
        ],
        OTHER: ['Analysiere Anfrage', 'Unangemessenes Thema erkannt'],
        SWEARS: ['Analysiere Anfrage', 'Unangemessener Ausdruck erkannt'],
        KB: [
          'Verarbeite Anfrage',
          'Suche Informationen in der Datenbank',
          'Analysiere Informationen',
          'Bereite Antwort vor'
        ]
      },
      uk: {
        SMT: ['Готую відповідь.'],
        KB_WS: [
          'Обробляю запит',
          'Шукаю інформацію в базі даних',
          'Шукаю веб-джерела',
          'Аналізую інформацію',
          'Готую відповідь'
        ],
        OTHER: ['Аналізую запит', 'Виявлено неприйнятну тему'],
        SWEARS: ['Аналізую запит', 'Виявлено неприйнятний вираз'],
        KB: [
          'Обробляю запит',
          'Шукаю інформацію в базі даних',
          'Аналізую інформацію',
          'Готую відповідь'
        ]
      }
    }

    // Log selected message sequence
    console.log('Selected messages:', messageSequences[lang][type]);

    // Create container div with class for styling
    const container = document.createElement('div')
    container.className = 'vfrc-message vfrc-message--extension LoadingAnimation'
    
    container.innerHTML = `
      <style>
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
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .loading-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid transparent;
          animation: rotate 1.5s linear infinite;
        }

        .loading-circle:nth-child(1) {
          border-top-color: #333;
          animation-delay: 0s;
        }

        .loading-circle:nth-child(2) {
          border-right-color: #666;
          animation-delay: 0.5s;
        }

        .loading-circle:nth-child(3) {
          border-bottom-color: #999;
          animation-delay: 1s;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="loading-container">
        <span class="loading-text"></span>
        <div class="loading-animation">
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
          <div class="loading-circle"></div>
        </div>
      </div>
    `

    const textElement = container.querySelector('.loading-text')
    const messages = messageSequences[lang][type]
    let currentIndex = 0

    const updateText = () => {
      textElement.textContent = messages[currentIndex]
      currentIndex = (currentIndex + 1) % messages.length
    }

    updateText()

    if (messages.length > 1) {
      const interval = setInterval(updateText, 2000)

      // Cleanup when element is removed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node.contains(container)) {
              clearInterval(interval)
              observer.disconnect()
            }
          })
        })
      })

      observer.observe(element.parentElement || document.body, { 
        childList: true,
        subtree: true 
      })
    }

    // Make sure we're appending to the correct element
    if (element) {
      element.appendChild(container)
      
      // Force a reflow to ensure animation starts
      void container.offsetHeight
    }
  }
}
