import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Canvas } from '@react-three/fiber';

const SpeechToTextAvatarComponent = () => {
    const [isListening, setIsListening] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const synth = window.speechSynthesis;

    useEffect(() => {
        if (!isListening) return;

        const timeout = setTimeout(() => {
            if (transcript.trim() !== '') {
                handleSubmit();
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [isListening, transcript]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMouthOpen((prev) => !prev);
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const handleListen = () => {
        setIsListening(true);
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        handleSubmit();
    };

    const handleSubmit = () => {
        if (transcript.trim() === '') return;

        Inertia.post('/plays.play', { text: transcript })
            .then(() => {
                console.log('Transcript posted successfully');
                resetTranscript();
            })
            .catch(error => {
                console.error('Error posting transcript:', error);
            });
    };

    const speak = (text) => {
        if (!speaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            synth.speak(utterance);
        }
    };

    const handleSpeak = () => {
        speak(transcript);
    };

    return (
        <div>
            {isListening ? (
                <button onClick={handleStopListening}>Stop Listening</button>
            ) : (
                <button onClick={handleListen}>Start Listening</button>
            )}
            <p>{transcript}</p>
            <div onClick={handleSpeak}>
                <Canvas>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <mesh>
                        <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
                        <meshStandardMaterial color="orange" attach="material" />
                    </mesh>
                    <mesh position={[0, -0.5, 0]}>
                        <boxBufferGeometry args={[0.8, 0.4, 0.4]} attach="geometry" />
                        <meshStandardMaterial color="red" attach="material" />
                        <mesh position={[0, -0.2, 0]}>
                            <boxBufferGeometry args={[0.6, 0.2, 0.2]} attach="geometry" />
                            <meshStandardMaterial color={mouthOpen ? 'black' : 'red'} attach="material" />
                        </mesh>
                    </mesh>
                </Canvas>
            </div>
        </div>
    );
};

export default SpeechToTextAvatarComponent;
