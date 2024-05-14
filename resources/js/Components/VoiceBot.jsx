import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';

const VoiceChatbot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [botMessage, setBotMessage] = useState('');

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const message = event.results[0][0].transcript;
        setUserMessage(message);
        sendRequest(message);
    };

    const sendRequest = async (message) => {
        try {
        const response = await fetch('/api/play', {
            method: 'POST',
            body: JSON.stringify({ message }),
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setBotMessage(data.message);
        speak(data.message);
        } catch (error) {
        console.error('Error:', error);
        }
    };

    const speak = (message) => {
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        recognition.startListening({ continuous: true });
    };

    return (
        <div>
        <PrimaryButton onClick={startListening}>Start Listening</PrimaryButton>
        <div className='text-white'>
            <strong className='text-white'>You:</strong> {userMessage}
        </div>
        <div className='text-white'>
            <strong className='text-white'>Bot:</strong> {botMessage}
        </div>
        </div>
    );
};

export default VoiceChatbot;
