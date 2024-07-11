# Auto Clicker Chrome Plugin for ChatGPT by Storizzi

Written by Simon Huggins of Storizzi
Available on the [Chrome Web Store](https://chromewebstore.google.com/)

## Version: 0.1

### Purpose

The Auto Clicker for ChatGPT is a Chrome extension designed to automatically click the "Continue generating" button on the ChatGPT website. This extension ensures uninterrupted chat generation, making the user experience smoother and more efficient.

### How It Operates

This extension only works on the chatgpt.com website. When it detects the "Continue generating" button, it automatically clicks it to keep the conversation flowing without manual intervention. Additionally, the extension provides audio notifications to keep you informed about the actions being taken.

### Features

- **Automatic Button Clicking**: Detects and clicks the "Continue generating" button on ChatGPT.
- **Audio Notifications**: Provides sound alerts for different actions.
- **Customizable Settings**: Various settings to tailor the extension's behavior to your preference.

### Settings

1. **Enable Checking**: 
   - **Description**: Toggles the automatic checking and clicking feature on or off.
   - **Default**: Enabled.
   
2. **Check Interval (seconds)**:
   - **Description**: Sets the interval at which the extension checks for the "Continue generating" button.
   - **Options**: 5s, 10s, 15s, 20s, 25s, 30s.
   - **Default**: 10 seconds.

3. **Timeout After (intervals)**:
   - **Description**: Specifies how many check intervals to wait before timing out if the button is not found.
   - **Options**: 1 to 20 intervals.
   - **Default**: 10 intervals.

4. **Copy Code Block After Timeout**:
   - **Description**: If enabled, copies the last code block on the page to the clipboard after a timeout.
   - **Default**: Disabled.

5. **Enable Sound**:
   - **Description**: Toggles audio notifications on or off.
   - **Default**: Enabled.

6. **Base Tone Frequency (Hz)**:
   - **Description**: Sets the base frequency for the audio notifications.
   - **Options**: 100Hz to 1000Hz in 100Hz increments.
   - **Default**: 400Hz.

7. **Enable Interval Sound**:
   - **Description**: Plays a sound at each interval when checking for the button.
   - **Default**: Enabled.

8. **Increase Frequency for Interval Tone**:
   - **Description**: Increases the frequency of the interval tone progressively.
   - **Default**: Enabled.

### Audio Notifications

- **Triple Ping**: Plays when the extension is loaded and audio is enabled.
- **Single Ping**: Plays at each interval if the button is not found.
- **Double Ping**: Plays when the "Continue generating" button is clicked.
- **Triple Ping After Timeout**: Plays when the specified timeout intervals are reached without finding the button.

### Usage

1. Open the ChatGPT website.
2. The extension will automatically start checking for the "Continue generating" button based on the set interval.
3. Customize the settings through the extension's popup menu to fit your preferences.
4. **Note**: After installing the extension, refresh any existing ChatGPT tabs for the extension to work properly on those sessions.
5. **Audio Confirmation**: When starting a ChatGPT session, a confirmation prompt will appear asking to enable audio notifications. Click to enable audio for the extension to function fully.

Enjoy seamless and uninterrupted chat generation with ChatGPT!

# Notes

Yes, it was created with the help of ChatGPT. And I now use it myself to help further accelerate my own development process - being able to automatically copy the last code block helps a lot.

I'm looking to pair this with another project I am working on called Chatblox which aims to collect different tools together under one chat-like interface (currently on a Mac only).

This is a bit of a proof-of-concept which is likely to end up as a companion to Chatblox so that the two can work together symbiotically - e.g. to generate and run programs, and access an array of tools from ChatGPT (and vice versa).

Future features will include things like:

* Selecting from multiple code blocks
* Looking for the chat prompt block to finish rather than relying purely on the long timeout
* Getting the full last ChatGPT response onto the clipboard
* Integration with Chatblox via web service to share various tooling (optionally)

Note the Chatblox stuff is highly speculative at the moment, as this is in its early stages of development
