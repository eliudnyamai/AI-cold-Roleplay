import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import PrimaryButton from "./PrimaryButton";
import "regenerator-runtime/runtime";
import regeneratorRuntime from "regenerator-runtime";
import "./TypingAnimation.css"; // Create this CSS file for styling
import { Head, useForm, router, Link } from "@inertiajs/react";

const SpeechComponent = ({ AI_seller, thread_id, image }) => {
  const [responseText, setResponseText] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverText, setGameOverText] = useState("");

  const seller = AI_seller;
  const synth = window.speechSynthesis;
  const TIMEOUT_DELAY = 3000;
  const [speaking, setSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const gender = AI_seller.gender;
  const avatarStyle = {
    animation: speaking ? "talk 1s infinite alternate" : "none",
    width: 150,
    height: 150,
  };
  const feedbackStyle = {
    display: feedback ? "block" : "none",
  };

  useEffect(() => {
    let timeout;
    const handleSpeechEnd = () => {
      if (transcript !== "") {
        setFeedback("Waiting For AI Response...");
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
        console.log(response.data.text);
        if (response.data.text == "I AM HAPPY TO CONTINUE") {
          //you lost
          axios
            .post("/api/win", {
              text: transcript,
              seller_id: seller.id,
              asst_id: seller.openAI_id,
              thread_id: thread_id,
            })
            .then((response) => {
              console.log(response.data);
              setFeedback(null);
              setSpeaking(false);
              //stop listening
              stopListening1();
              setGameOverText("You Won")
              setGameOver(true);
            })
            .catch((error) => {
              console.error("Error registering win:", error);
              setFeedback("Error registering win. Check Network");
            })
            .finally(() => {
              resetTranscript();
            });
        } else if (response.data.text == "NOT INTERESTED") {
          axios
            .post("/api/fail", {
              text: transcript,
              seller_id: seller.id,
              asst_id: seller.openAI_id,
              thread_id: thread_id,
            })
            .then((response) => {
              console.log(response.data);
              setFeedback(null);
              setSpeaking(false);
              //stop listening
              stopListening1();
              setGameOverText("You Failed")
              setGameOver(true);
            })
            .catch((error) => {
              console.error("Error Registering Fail:", error);
              setFeedback("Error registering fail.");
            })
            .finally(() => {
              resetTranscript();
            });
        }
        setResponseText(response.data.text);
        setFeedback(null);
        setSpeaking(true);
      })
      .catch((error) => {
        console.error("Error sending speech to server:", error);
        setFeedback("Error communicating with AI. Check Network");
      })
      .finally(() => {
        resetTranscript();
      });
  };

  useEffect(() => {
    if (responseText !== "") {
      startListening();
      const utterance = new SpeechSynthesisUtterance(responseText);
      const availableVoices = speechSynthesis.getVoices();
      const femaleVoice = availableVoices[2];
      const maleVoice = availableVoices[0];
      if (gender == "male") {
        utterance.voice = maleVoice;
      } else {
        utterance.voice = femaleVoice;
      }
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
  const stopListening1 = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <>
      <div className="mt-4 flex justify-center">
        {gameOver ? (
          <div>
            <div class="text-center bg-gray-900 text-white border border-white  p-8 rounded shadow-lg">
              <h1 class="text-2xl font-bold mb-4">Status: {gameOverText}</h1>
              <Link
                href={route("plays.create", AI_seller)}
                className="bg-blue-500 w-1/2 hover:bg-blue-700 text-white font-bold p-2 rounded mr-2"
              >
                Play Again
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="border mr-5 px-12 py-2 border-white">
              <div className="text-white text-center md:text-2xl p-4">
                AI seller: {AI_seller.name}
              </div>
              <div className="avatar-container">
                <img
                  id="avatar_img"
                  src={image}
                  alt="Avatar"
                  style={avatarStyle}
                />
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
              <div style={feedbackStyle} className="text-center p-2">
                <span className=" text-white">{feedback}</span>
              </div>
            </div>
            <div>
              <div className="text-white text-center p-2 text-2xl">
                Transcript Will Appear Here
              </div>
              <p className="text-white">{transcript}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SpeechComponent;
