import React, { useState, useEffect } from 'react';
import avatarImage from './avatar.png';
import './TalkingAvatar.css'; // Create this CSS file for styling
import PrimaryButton from './PrimaryButton';

const TalkingAvatar = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);
  const avatarStyle = {
    animation: speaking ? 'talk 1s infinite alternate' : 'none'
  };

  const speakText = () => {
    setSpeaking(true);
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
    speech.onend = () => setSpeaking(false);
    setSpeaking(false);
  };

  useEffect(() => {
    if (text && text.trim() !== '') {
      speakText();
      
    }
  }, [text]);

  return (
    <div className="avatar-container">
      <img src={avatarImage} alt="Avatar" style={avatarStyle} />
      <PrimaryButton onClick={speakText}>Speak</PrimaryButton>
    </div>
  );
};

export default TalkingAvatar;
