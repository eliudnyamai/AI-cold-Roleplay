import PrimaryButton from "@/Components/PrimaryButton";
import { Head,useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from 'react';
import avatarImage from '@/Components/avatar.png';
import '@/Components/TalkingAvatar.css'; // Create this CSS file for styling
import SpeechToText from "@/Components/SpeechToText";
import TalkingAvatar from "@/Components/TalkingAvatar";
import regeneratorRuntime from "regenerator-runtime";
import 'regenerator-runtime/runtime';

import SpeechComponent from "@/Components/SpeechComponent";
export default function Create({success,auth, AI_seller,text, thread_id}) {
    const T=thread_id;
    const imageUrl = `${window.location.origin}${AI_seller.image_url}`;
    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        seller_desc:""
        
    });
    const onsubmit = (e) => {
        e.preventDefault();
        post(route("assistants.store"));
    }
    
    return (
        <AuthenticatedLayout user={auth.user}>
        <Head title="Cold Role Play" />
        <div className="container h-screen mx-auto">
        {success&&
            <div className="bg-green-500 text-center text-white p-2 relative">
                {success}
                </div>} 
            <div className="w-full h-screen p-4">
            <div className="flex flex-col justify-center items-center">
                {/* <SpeechToText text={text} asst_id={AI_seller.openAI_id} seller_id={AI_seller.id} name={AI_seller.name} image={imageUrl} gender={AI_seller.gender}/>      */}
                <SpeechComponent AI_seller={AI_seller} thread_id={T} image={imageUrl}/>     

                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
