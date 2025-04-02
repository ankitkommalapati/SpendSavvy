"use client";

import { voiceAssistant } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Microphone2, Loader2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AiOutlineAudio } from 'react-icons/ai';

const VoiceAssistant = ({ onVoiceAssistantComplete }) => {
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');
    const { loading: voiceAssistantLoading, fn: voiceAssistantFn, data: voiceAssistantData } = useFetch(voiceAssistant);

    const handleStartListening = () => {
        setIsListening(true);
        const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.maxResults = 10;
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };
        recognition.onerror = (event) => {
            console.error('Error recognizing speech:', event.error);
        };
        recognition.onstart = () => {
            setIsListening(true);
        };
        recognition.onend = () => {
            setIsListening(false);
            handleVoiceAssistant(text);
        };
        recognition.start();
    };
    const handleVoiceAssistant = async (text) => {
        if (text.trim() === '') {
            toast.error('Please speak something');
            return;
        }
        await voiceAssistantFn(text);
    };

    useEffect(() => {
        if (voiceAssistantData && !voiceAssistantLoading) {
            onVoiceAssistantComplete(voiceAssistantData);
            toast.success("Voice assistant completed successfully");
        }
    }, [voiceAssistantLoading, voiceAssistantData]);
    return (
        <div>
            <Button
                type="button"
                variant="outline"
                className="w-full h-10 bg-gradient-to-br from-blue-500 via-green-500 to-violet-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                onClick={handleStartListening}
                disabled={voiceAssistantLoading || isListening}
            >
                {voiceAssistantLoading || isListening ? (
                    <>
                        <Loader2 className='mr-2 animate-spin' />
                        <span>Processing Transaction...</span>
                    </>
                ) : (
                    <>
                        <AiOutlineAudio className='mr-2' />
                        <span>Speak to Savvy</span>
                    </>
                )}
            </Button>
        </div>
    );
};

export default VoiceAssistant;