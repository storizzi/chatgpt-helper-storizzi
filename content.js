let checkInProgress = false;
let audioContext = null;
let copyCodeBlock = false;
let intervalCounter = 0;
let buttonAutoPressed = false;

let shortInterval = 10; // Default to 10 seconds
let longTimeoutIntervals = 10; // Default to 10 intervals
let enableChecking = true; // Default to enabled
let enableSound = true; // Default to enabled
let enableIntervalSound = true; // Default to enabled
let increaseFrequency = true; // Default to enabled
let baseFrequency = 440; // Base frequency for sound

chrome.storage.sync.get([
  'enableChecking',
  'shortInterval',
  'longTimeoutIntervals',
  'copyCodeBlock',
  'enableSound',
  'baseFrequency',
  'enableIntervalSound',
  'increaseFrequency'
], function(data) {
  enableChecking = data.enableChecking !== false; // Default to true
  if (data.shortInterval) {
    shortInterval = parseInt(data.shortInterval);
  }
  if (data.longTimeoutIntervals) {
    longTimeoutIntervals = parseInt(data.longTimeoutIntervals);
  }
  copyCodeBlock = data.copyCodeBlock || false;
  enableSound = data.enableSound !== false; // Default to true
  baseFrequency = data.baseFrequency || 400; // Default to 400Hz
  enableIntervalSound = data.enableIntervalSound !== false; // Default to true
  increaseFrequency = data.increaseFrequency !== false; // Default to true

  if (enableChecking) {
    if (enableSound && !audioContext) {
      showEnableAudioOverlay();
    } else {
      if (enableSound) {
        // Play triple ping sound on load once
        playSound("triple-ping");
      }
      // Initial button check
      checkAndClickButton();
      // Set interval to check for the button every user-defined interval
      setInterval(checkAndClickButton, shortInterval * 1000);
    }
  }
});

function showEnableAudioOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'enable-audio-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.color = 'white';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';

  const message = document.createElement('div');
  message.innerHTML = 'Click to enable audio notifications';
  message.style.fontSize = '24px';
  message.style.cursor = 'pointer';
  message.addEventListener('click', () => {
    document.body.removeChild(overlay);
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    playSound("triple-ping");
    // Initial button check
    checkAndClickButton();
    // Set interval to check for the button every user-defined interval
    setInterval(checkAndClickButton, shortInterval * 1000);
  });

  overlay.appendChild(message);
  document.body.appendChild(overlay);
}

function findButton() {
  const buttons = document.querySelectorAll('button.btn');
  for (let button of buttons) {
    const buttonText = (button.textContent || button.innerText || "").trim().toLowerCase();
    if (buttonText === "continue generating" && button.offsetParent !== null) {
      return button;
    }
  }
  return null;
}

function checkAndClickButton() {
  chrome.storage.sync.get([
    'enableChecking',
    'shortInterval',
    'longTimeoutIntervals',
    'copyCodeBlock',
    'enableSound',
    'baseFrequency',
    'enableIntervalSound',
    'increaseFrequency'
  ], function(data) {
    enableChecking = data.enableChecking !== false; // Default to true
    if (data.shortInterval) {
      shortInterval = parseInt(data.shortInterval);
    }
    if (data.longTimeoutIntervals) {
      longTimeoutIntervals = parseInt(data.longTimeoutIntervals);
    }
    copyCodeBlock = data.copyCodeBlock || false;
    enableSound = data.enableSound !== false; // Default to true
    baseFrequency = data.baseFrequency || 400; // Default to 400Hz
    enableIntervalSound = data.enableIntervalSound !== false; // Default to true
    increaseFrequency = data.increaseFrequency !== false; // Default to true

    if (!enableChecking || checkInProgress) return;
    checkInProgress = true;

    const button = findButton();

    if (button) {
      button.click();
      if (enableSound) {
        playSound("double-ping");
      }
      buttonAutoPressed = true;
      intervalCounter = 0; // Reset the interval counter when the button is clicked
    } else {
      if (buttonAutoPressed) {
        if (enableSound && enableIntervalSound) {
          const frequency = increaseFrequency ? baseFrequency + intervalCounter * 20 : baseFrequency;
          playSound("single-ping", frequency);
        }
        intervalCounter++;
        if (intervalCounter >= longTimeoutIntervals) {
          if (copyCodeBlock) {
            copyLastCodeBlock(false); // Call without alert
          }
          if (enableSound) {
            playSound("triple-ping");
          }
          buttonAutoPressed = false;
          intervalCounter = 0; // Reset the interval counter after the timeout
        }
      }
    }
    checkInProgress = false;
  });
}

function playSound(type, frequency = 440) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  if (type === "single-ping") {
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
  } else if (type === "double-ping") {
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Half volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      gainNode2.gain.setValueAtTime(0.25, audioContext.currentTime); // Half volume
      oscillator2.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.5);
    }, 250);
  } else if (type === "triple-ping") {
    const frequencies = [frequency, frequency + 220, frequency + 440];
    frequencies.forEach((frequency, index) => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      gainNode2.gain.setValueAtTime(1, audioContext.currentTime + index * 0.5);
      oscillator2.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.5);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (index * 0.5) + 0.5);
      oscillator2.start(audioContext.currentTime + index * 0.5);
      oscillator2.stop(audioContext.currentTime + (index * 0.5) + 0.5);
    });
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1);
}

// Function to copy the last code block
function copyLastCodeBlock(showAlert = true) {
  const codeBlocks = document.querySelectorAll('code.hljs');
  if (codeBlocks.length > 0) {
    const lastCodeBlock = codeBlocks[codeBlocks.length - 1].innerText;
    navigator.clipboard.writeText(lastCodeBlock).then(() => {
      if (showAlert) {
        alert('Code block copied to clipboard');
      }
    }).catch(err => {
      if (showAlert) {
        alert('Failed to copy code block');
      }
    });
  } else {
    if (showAlert) {
      alert('No code blocks found');
    }
  }
}
