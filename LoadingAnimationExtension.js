export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  render: ({ trace, element }) => {
    const { lang = 'cs', type = 'SMT' } = trace.payload

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

    const container = document.createElement('div')
    container.innerHTML = `
      <style>
        .loading-container {
          display: flex;
          align-items: center;
          gap: 15px;
          font-family: sans-serif;
        }

        .loading-text {
          color: #333;
          font-size: 14px;
        }

        .loading-animation {
          position: relative;
          width: 24px;
          height: 24px;
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

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === container) {
              clearInterval(interval)
              observer.disconnect()
            }
          })
        })
      })

      observer.observe(element, { childList: true })
    }

    element.appendChild(container)
  }
}
