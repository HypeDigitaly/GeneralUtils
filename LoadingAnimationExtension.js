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
              .layyscc1 {
                display: flex;
                align-items: center;
                padding: 12px;
              }

              .vfrc-typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
              }

              .xaffbq2 {
                position: relative;
                width: 20px;
                height: 20px;
                border: 2px solid transparent;
                border-radius: 50%;
                animation: rotateCircle 2s infinite linear;
              }

              .xaffbq3 {
                border-top-color: #333;
                animation-delay: 0s;
              }

              .xaffbq4 {
                border-right-color: #666;
                animation-delay: -0.5s;
              }

              .xaffbq5 {
                border-left-color: #999;
                animation-delay: -1s;
              }

              @keyframes rotateCircle {
                0% {
                  transform: rotate(0deg) scale(0.8);
                }
                50% {
                  transform: rotate(180deg) scale(1.2);
                }
                100% {
                  transform: rotate(360deg) scale(0.8);
                }
              }

              .vfrc-typing-indicator.hidden {
                display: none !important;
              }
            `
            shadowRoot.appendChild(styleTag)
          }

          // Find the existing typing indicator
          let typingIndicator = shadowRoot.querySelector('.vfrc-typing-indicator')
          
          // Toggle visibility based on isLoading state
          if (isLoading) {
            typingIndicator?.classList.remove('hidden')
          } else {
            typingIndicator?.classList.add('hidden')
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