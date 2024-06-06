<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssistantRequest;
use App\Http\Resources\AssistantResource;
use App\Models\Assistant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;

class AssistantsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $AI_sellers = Assistant::all();
        return inertia("Assistants/Index", [
            'AI_sellers' => $AI_sellers,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Assistants/Create", [
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AssistantRequest $request)
    {
        $data = $request->validated();
        $assistant = OpenAI::assistants()->create([
            'name' => $request->input('name'),
            'tools' => [
                [
                    'type' => 'retrieval',
                ],
            ],
            'instructions' => $request->input("seller_desc") . 'This is a conversation keep your responses as short as possible.
            Your responses will be converted to voice so output something can be spoken easily do include thing like asterisks in your reponse that when spoken will confuse the user. 
            These are real estate agents approaching you so do not start giving them advice just listen to what they are offering and respond to that according to the situation you are in.
            You are free to object,bargain, complain or have any other response according to what the real estate person is offering.
            This is a simulation so follow the description of the seller as much as possible and portray them in the negotiation conversations.
            The person enquiring already knows you and who you are, do not repeat it. Also to not be direct with the situation you are facing in conversations to avoid appearing despearate. Bargain like a pro.
            Remember you are just a normal seller with limited real estate knowledge. Do not behave like a customer assistance person. Assume this is like a phone call so that when the person first contacts you will be 
            wanting to know who they are and what is their business. Your reply to the first message must strictly be "what is going on , who is this" or "Are you calling about my house?".Never reply with "Hello! How can I assist you today?".
            We want this simulation to have the right level of difficulty and simulate a real cold call scenario. If you agree to do business with the cold caller reply with these words "I AM HAPPY TO CONTINUE". If you are rejecting their business reply with "NOT INTERESTED"
            ',
            'model' => 'gpt-4-turbo-preview',
        ]);
        $data['openAI_id'] = $assistant->id;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move('/home/customer/www/airoleplay.godspeedoffers.com/public_html/storage/images', $imageName);
            $imageUrl = 'storage/images/' . $imageName;
            $data['image_url'] = $imageUrl;
        }
        Assistant::create($data);
        return redirect()->route('assistants.create')
            ->with('success', 'The AI seller was created successfully.');
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $AI_seller = Assistant::find($id);
        return inertia("Assistants/Show", [
            'AI_seller' => $AI_seller,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $AI_seller = Assistant::find($id);
        return inertia("Assistants/Edit", [
            'AI_seller' => $AI_seller,
            'success' => session('success')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'seller_desc' => 'required',
        ]);
        $assistant = Assistant::find($id);
        $assistant->update([
            'name' => $request->name,
            'seller_desc' => $request->seller_desc,
        ]);
        OpenAI::assistants()->modify($assistant['openAI_id'], [
            'name' => $request->name,
            'instructions' => $request->seller_desc . 'This is a conversation keep your responses as short as possible.
            Your responses will be converted to voice so output something can be spoken easily do include thing like asterisks in your reponse that when spoken will confuse the user. 
            These are real estate agents approaching you so do not start giving them advice just listen to what they are offering and respond to that according to the situation you are in.
            You are free to object,bargain, complain or have any other response according to what the real estate person is offering.
            This is a simulation so follow the description of the seller as much as possible and portray them in the negotiation conversations.
            The person enquiring already knows you and who you are, do not repeat it. Also to not be direct with the situation you are facing in conversations to avoid appearing despearate. Bargain like a pro.
            Remember you are just a normal seller with limited real estate knowledge. Do not behave like a customer assistance person. Assume this is like a phone call so that when the person first contacts you will be 
            wanting to know who they are and what is their business. Your reply to the first message must strictly be "what is going on , who is this" or "Are you calling about my house?".Never reply with "Hello! How can I assist you today?".
            We want this simulation to have the right level of difficulty and simulate a real cold call scenario. If you agree to do business with the cold caller reply with these words "I AM HAPPY TO CONTINUE". If you are rejecting their business reply with "NOT INTERESTED"
            ',
        ]);

        return to_route('assistants.show', $assistant)
            ->with('success', 'The AI seller was Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $assistant = Assistant::findOrFail($id);
        if ($assistant->image_url) {
            $imagePath = public_path($assistant->image_url);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        $assistant->delete();
        OpenAI::assistants()->delete($assistant->openAI_id);
        return redirect()->route('assistants.index')
            ->with('success', 'The AI seller was deleted successfully.');
    }
}
