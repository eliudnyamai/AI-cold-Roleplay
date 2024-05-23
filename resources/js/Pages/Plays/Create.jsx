import PrimaryButton from "@/Components/PrimaryButton";
import { Head,useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from 'react';
import '@/Components/TalkingAvatar.css'; // Create this CSS file for styling
import 'regenerator-runtime/runtime';


import SpeechComponent from "@/Components/SpeechComponent";
export default function Create({success,auth, AI_seller,text, thread_id}) {
    const imageUrl = `${window.location.origin}/${AI_seller.image_url}`;
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
                {/* <UsageInstructions/> */}
                <SpeechComponent AI_seller={AI_seller} thread_id={thread_id} image={imageUrl}/>     
                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
