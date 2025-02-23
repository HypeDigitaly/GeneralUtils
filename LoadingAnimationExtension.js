export const LoadingAnimationExtension = {
  name: 'LoadingAnimation',
  type: 'effect',
  match: ({ trace }) =>
    trace.type === 'ext_loadingAnimation' || trace.payload?.name === 'ext_loadingAnimation',
  effect: ({ trace }) => {
    const { isLoading } = trace.payload

    function updateLoadingAnimation() {
      const chatDiv = document.getElementById('voiceflow-chat')

      if (chatDiv) {
        const shadowRoot = chatDiv.shadowRoot
        if (shadowRoot) {
          // Add a style tag if it doesn't exist
          let styleTag = shadowRoot.querySelector('#vf-loading-animation-style')
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.id = 'vf-loading-animation-style'
            styleTag.textContent = `
              .vfrc-typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px;
              }

              .loading-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                animation: loadingAnimation 1.5s infinite;
                background: #000;
                opacity: 0.2;
              }

              .loading-dot:nth-child(2) {
                animation-delay: 0.2s;
              }

              .loading-dot:nth-child(3) {
                animation-delay: 0.4s;
              }

              @keyframes loadingAnimation {
                0% {
                  transform: scale(1);
                  opacity: 0.2;
                }
                20% {
                  transform: scale(1.2);
                  opacity: 0.6;
                }
                40% {
                  transform: scale(1);
                  opacity: 0.2;
                }
              }

              .vfrc-typing-indicator.hidden {
                display: none !important;
              }
            `
            shadowRoot.appendChild(styleTag)
          }

          // Find or create the typing indicator
          let typingIndicator = shadowRoot.querySelector('.vfrc-typing-indicator')
          if (!typingIndicator) {
            typingIndicator = document.createElement('div')
            typingIndicator.className = 'vfrc-typing-indicator'
            typingIndicator.innerHTML = `
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
              <div class="loading-dot"></div>
            `
            
            // Find the chat messages container and append the typing indicator
            const messagesContainer = shadowRoot.querySelector('.vfrc-chat-messages')
            if (messagesContainer) {
              messagesContainer.appendChild(typingIndicator)
            }
          }

          // Toggle visibility based on isLoading state
          if (isLoading) {
            typingIndicator.classList.remove('hidden')
          } else {
            typingIndicator.classList.add('hidden')
          }
        } else {
          console.error('Shadow root not found')
        }
      } else {
        console.error('Chat div not found')
      }
    }

    updateLoadingAnimation()
  },
} 