//invoke WebSocket io to emit to the Node.js server
const socket = io();
//invoke an instance of SpeechRecognition controller interface (double bar)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
//this will customize the speech recognition for english
recognition.lang = 'en-US';
//taper the results for less spam
recognition.interimResults = false;
//jQuery to get DOM button ref, and give it a click event
//(this replaces document.querySelector('button').addEventListener("click")...
$('button').click(() => {
    recognition.start();
});
//let us know in browser when has started
recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});
//once speech recognition is started, use result event to retrieve speech into array
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log('Confidence: ' + e.results[0][0].confidence);
    console.log(text);
    //emit the message, same as send, server js will look for 'chat message'
    socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});

//give AI a Voice with SpeechSynthesis Interface
synthVoice = (text) => {
    console.log(text);
    const synth = window.SpeechSynthesis;
    console.log(synth);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

//we have emitted from app.js, capture the bot reply with this EL
socket.on('bot reply', (replyText) => {
    //jquery to post bot reply text sent via app.js
    $('.output').html(replyText);
    //Now lets get the bot to speak!
    synthVoice(replyText);
    if(replyText == '') replyText = '(No answer...)';

});
