import React, { useState, useEffect } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import PrimaryButton from "./PrimaryButton";
import 'regenerator-runtime/runtime';
import regeneratorRuntime from "regenerator-runtime";
import { Head, useForm, router } from "@inertiajs/react";

const SpeechComponent = ({ AI_seller, thread_id, image }) => {
  const [responseText, setResponseText] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const seller = AI_seller;
  const synth = window.speechSynthesis;
  const TIMEOUT_DELAY = 3000; // Adjust this value as needed
  const [speaking, setSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const avatarStyle = {
    animation: speaking ? "talk 1s infinite alternate" : "none",
    width: 150,
    height: 150,
  };
  useEffect(() => {
    let timeout;

    const handleSpeechEnd = () => {
      if (transcript !== "") {
        console.log("Transcript: " + transcript);
        submitTranscript();
      }
    };

    const startTimeout = () => {
      timeout = setTimeout(handleSpeechEnd, TIMEOUT_DELAY);
    };

    const resetTimeout = () => {
      clearTimeout(timeout);
      startTimeout();
    };

    if (transcript !== "") {
      resetTimeout();
    } else {
      handleSpeechEnd();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [transcript]);
  const submitTranscript = () => {
    axios
      .post("/api/play", {
        text: transcript,
        seller_id: seller.id,
        asst_id: seller.openAI_id,
        thread_id: thread_id,
      })
      .then((response) => {
        setResponseText(response.data.text);
        setSpeaking(true);
        console.log("Response: " + response.data.text);
      })
      .catch((error) => {
        console.error("Error sending speech to server:", error);
      })
      .finally(() => {
        resetTranscript();
      });
  };

  useEffect(() => {
    //This block is not getting executed
    // Speak out the response text using text-to-speech
    if (responseText !== "") {
      console.log(responseText);
      startListening();
      const utterance = new SpeechSynthesisUtterance(responseText);
      console.log(utterance);
      utterance.onstart = () => {
        SpeechRecognition.stopListening();
      };
      utterance.onend = () => {
        SpeechRecognition.startListening({ continuous: true });
        setSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [responseText]);

  useEffect(() => {
    // Start listening initially
    //SpeechRecognition.startListening({ continuous: true });

    // Clean up on component unmount
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);
  // Start speech recognition
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  // Stop speech recognition
  const stopListening = () => {
    SpeechRecognition.stopListening();
    router.get("/quit");
  };

  return (
    // <div>
    //   <PrimaryButton onClick={startListening}>Start Listening</PrimaryButton>
    //   <PrimaryButton onClick={stopListening}>Stop Listening</PrimaryButton>
    // </div>
    <>
      <div className="border mr-5 px-12 py-2 border-white">
        <div className="text-white md:text-2xl p-4">AI seller: {name}</div>
        <div className="avatar-container">
          <img id="avatar_img" src={image} alt="Avatar" style={avatarStyle} />
        </div>
        <div className="mt-4 flex justify-center">
          {isListening ? (
            <PrimaryButton
              className="bg-green-500 hover:bg-green-700 text-black  py-2 px-2 rounded"
              onClick={stopListening}
            >
              Stop Negotiating
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-2 rounded"
              onClick={startListening}
            >
              Start Negotiation
            </PrimaryButton>
          )}
        </div>
      </div>
      <div>
        <div className="text-white text-center p-2 text-2xl">
          Transcript Will Appear Here
        </div>
        <p className="text-white">{transcript}</p>
      </div>
    </>
  );
};

export default SpeechComponent;
