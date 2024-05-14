<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssistantRequest;
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
            'instructions' => $request->input("seller_desc").'This is a conversation keep yor responses as short as possible. If you are rejecting to do business with the person enquiring, strict reply with these words "NOT INTRESTED"',
            'model' => 'gpt-4-turbo-preview',
        ]);
        $data['openAI_id'] = $assistant->id;
        $imagePath = $request->file('image')->store('public/images'); // Store image in storage/app/public/images folder
        $imageUrl = Storage::url($imagePath); // Get URL of the stored image
        $data['image_url']=$imageUrl;
        Assistant::create($data);
        return to_route('assistants.create')
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
           // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'seller_desc' => 'required',
            // Add more validation rules as needed
        ]);
        $assistant = Assistant::find($id);
        // Update the assistant record with the validated data
        $assistant->update([
            'name' => $request->name,
            'seller_desc' => $request->seller_desc,
        ]);
        OpenAI::assistants()->modify($assistant['openAI_id'], [
            'name' => $request->name,
            'instructions' => $request->seller_desc.'This is a conversation keep yor responses as short as possible. If you are rejecting to do business with the person enquiring, strict reply with these words "NOT INTERESTED". If a person succeeds in convincing you to do business with them, strictly reply with these word "I AM HAPPY TO CONTINUE"',
        ]);

        return to_route('assistants.show',$assistant)
        ->with('success', 'The AI seller was Updated successfully.');   
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $assistant = Assistant::findOrFail($id);
        if ($assistant->image_url) {
            $imagePath = str_replace('/storage', 'public', $assistant->image_url);
            Storage::delete($imagePath);
        }
        $assistant->delete();
        OpenAI::assistants()->delete($assistant->openAI_id);
        return to_route('assistants.index')
            ->with('success', 'The AI seller was Deleted successfully.');
    }
}
