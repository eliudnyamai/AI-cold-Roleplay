import React, { useState,useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from './PrimaryButton';

const SpeechToTextAvatarComponent = ({ text,asst_id,seller_id,name,image,gender}) => {
    const [isListening, setIsListening] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const synth = window.speechSynthesis;
    const TIMEOUT_DELAY = 3000; // Adjust this delay as needed
    const avatarStyle = {
        animation: speaking ? 'talk 1s infinite alternate' : 'none',
        width:150,
        height:150
        };
console.log()
    useEffect(() => {
        const interval = setInterval(() => {
            setMouthOpen(prev => !prev);
        }, 200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isListening) {
            resetTimeout();
        }
    }, [transcript,text]);

    const resetTimeout = () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(handleSubmit, TIMEOUT_DELAY);
    };

    const timeoutRef = useRef();

    const handleListen = () => {
        setIsListening(true);
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        console.log("I Quit")
        router.get('/quit');
    };
    const StopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        console.log("I Quit")
       
    };
    const emptyTranscript = () => {
        resetTranscript();
        console.log("Itranscrit")
       
    };
    
       
    const handleSubmit =() => {
        if (transcript.trim() === '') return;
            console.log("Submitiing:"+transcript)
           router.post('/play', 
            { text: transcript,
            asst_id:{asst_id},
            seller_id:{seller_id}
        });
        if(text){

            speak(text); 
        }  
    };
    const speak = (text) => {
        if (!speaking) {
            StopListening();
            SpeechRecognition.stopListening();
            const utterance = new SpeechSynthesisUtterance(text);
            const availableVoices = speechSynthesis.getVoices();
            console.log(availableVoices)
            const femaleVoice = availableVoices[2];
            const maleVoice = availableVoices[0];

            if(gender=="male"){
                utterance.voice = maleVoice;
            }
            utterance.voice = femaleVoice;
            utterance.onstart = () => {
                setSpeaking(true);
                resetTranscript();
                emptyTranscript()
                SpeechRecognition.stopListening();
                console.log("Speech started");
            };
            utterance.onend = () => {
                setSpeaking(false);
                resetTranscript();
                emptyTranscript()
                setTimeout(() => SpeechRecognition.startListening({ continuous: true }), 3000); // Start listening after a small delay
                console.log("Speech ended");
            };
            text=null;
            synth.speak(utterance);
            resetTranscript();


        }
    };
    
    

    return (
        <>
        <div className='border mr-5 p-4 border-white'>
            <div className='text-white md:text-2xl p-4'>AI seller: {name}</div>
            <div className="avatar-container">
            <img id="avatar_img" src={image} alt="Avatar" style={avatarStyle} />
            </div>
            <div className='mt-4 flex justify-center'>
            {isListening ? (
                <PrimaryButton className='bg-green-500 hover:bg-green-700 text-black  py-2 px-2 rounded' onClick={handleStopListening}>Stop Negotiating</PrimaryButton>
            ) : (
                <PrimaryButton className='bg-green-500 hover:bg-green-700 text-white py-2 px-2 rounded' onClick={handleListen}>Start Negotiation Process</PrimaryButton>
            )}            
            </div>
        </div>
        <div>
            <div className='text-white text-center p-2 text-2xl'>Transcript Will Appear Here</div>
            <p className='text-white'>{transcript}
          
            </p>
        </div>
        </>
     

    );
};

export default SpeechToTextAvatarComponent;
