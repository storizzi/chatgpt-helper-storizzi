document.addEventListener('DOMContentLoaded', function() {
    const enableCheckingCheckbox = document.getElementById('enable-checking');
    const checkingSettingsDiv = document.getElementById('checking-settings');
    const shortIntervalSelect = document.getElementById('short-interval');
    const longTimeoutSelect = document.getElementById('long-timeout');
    const copyCodeBlockCheckbox = document.getElementById('copy-code-block');
    const enableSoundCheckbox = document.getElementById('enable-sound');
    const toneSettingsDiv = document.getElementById('tone-settings');
    const baseFrequencySelect = document.getElementById('base-frequency');
    const enableIntervalSoundCheckbox = document.getElementById('enable-interval-sound');
    const increaseFrequencyCheckbox = document.getElementById('increase-frequency');
    const copyButton = document.getElementById('copy-last-code-block');
  
    // Load saved settings
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
      enableCheckingCheckbox.checked = data.enableChecking !== false; // Default to true
      shortIntervalSelect.value = data.shortInterval || '10'; // Default to 10 seconds
      longTimeoutSelect.value = data.longTimeoutIntervals || 10; // Default to 10 intervals
      copyCodeBlockCheckbox.checked = data.copyCodeBlock || false;
      enableSoundCheckbox.checked = data.enableSound !== false; // Default to true
      baseFrequencySelect.value = data.baseFrequency || '400'; // Default to 400Hz
      enableIntervalSoundCheckbox.checked = data.enableIntervalSound !== false; // Default to true
      increaseFrequencyCheckbox.checked = data.increaseFrequency !== false; // Default to true
  
      updateSettingsAccessibility();
    });
  
    // Save settings immediately when they are changed
    enableCheckingCheckbox.addEventListener('change', function() {
      const enableChecking = enableCheckingCheckbox.checked;
      chrome.storage.sync.set({ enableChecking: enableChecking }, updateSettingsAccessibility);
    });
  
    shortIntervalSelect.addEventListener('change', function() {
      const shortInterval = parseInt(shortIntervalSelect.value);
      chrome.storage.sync.set({ shortInterval: shortInterval });
    });
  
    longTimeoutSelect.addEventListener('change', function() {
      const longTimeoutIntervals = parseInt(longTimeoutSelect.value);
      chrome.storage.sync.set({ longTimeoutIntervals: longTimeoutIntervals });
    });
  
    copyCodeBlockCheckbox.addEventListener('change', function() {
      const copyCodeBlock = copyCodeBlockCheckbox.checked;
      chrome.storage.sync.set({ copyCodeBlock: copyCodeBlock });
    });
  
    enableSoundCheckbox.addEventListener('change', function() {
      const enableSound = enableSoundCheckbox.checked;
      chrome.storage.sync.set({ enableSound: enableSound }, updateSettingsAccessibility);
    });
  
    baseFrequencySelect.addEventListener('change', function() {
      const baseFrequency = parseInt(baseFrequencySelect.value);
      chrome.storage.sync.set({ baseFrequency: baseFrequency });
    });
  
    enableIntervalSoundCheckbox.addEventListener('change', function() {
      const enableIntervalSound = enableIntervalSoundCheckbox.checked;
      chrome.storage.sync.set({ enableIntervalSound: enableIntervalSound });
    });
  
    increaseFrequencyCheckbox.addEventListener('change', function() {
      const increaseFrequency = increaseFrequencyCheckbox.checked;
      chrome.storage.sync.set({ increaseFrequency: increaseFrequency });
    });
  
    // Copy last code block
    copyButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: copyLastCodeBlock
        }, function() {
          window.close(); // Close the popup
        });
      });
    });
  
    // Function to copy the last code block
    function copyLastCodeBlock() {
      const codeBlocks = document.querySelectorAll('code.hljs');
      if (codeBlocks.length > 0) {
        const lastCodeBlock = codeBlocks[codeBlocks.length - 1].innerText;
        navigator.clipboard.writeText(lastCodeBlock).then(() => {
          alert('Code block copied to clipboard');
        }).catch(err => {
          alert('Failed to copy code block');
        });
      } else {
        alert('No code blocks found');
      }
    }
  
    // Enable/disable settings based on enableCheckingCheckbox
    enableCheckingCheckbox.addEventListener('change', updateSettingsAccessibility);
    enableSoundCheckbox.addEventListener('change', updateSettingsAccessibility);
  
    function updateSettingsAccessibility() {
      const enableChecking = enableCheckingCheckbox.checked;
      const enableSound = enableSoundCheckbox.checked;
  
      checkingSettingsDiv.style.pointerEvents = enableChecking ? 'auto' : 'none';
      checkingSettingsDiv.style.opacity = enableChecking ? '1' : '0.5';
  
      toneSettingsDiv.style.pointerEvents = enableSound ? 'auto' : 'none';
      toneSettingsDiv.style.opacity = enableSound ? '1' : '0.5';
    }
  });
  