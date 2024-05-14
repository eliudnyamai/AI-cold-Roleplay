<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;
use OpenAI\Responses\Threads\Runs\ThreadRunResponse;
use OpenAI\Responses\Threads\ThreadResponse;
class ChatController extends Controller
{
    public ?string $error = null;
    public function test(Request $request){
        // $threadRun = $this->createAndRunThread("HELLO");
        $this->addMessage();
        $threadRun=$this->RunThread();
        $answer = $this->loadAnswer($threadRun);
        Storage::disk('public')->put("audio.mp3", $answer);
    }
    private function loadAnswer(ThreadRunResponse $threadRun)
    {
        set_time_limit(0);
        while (in_array($threadRun->status, ['queued', 'in_progress'])) {
            $threadRun = OpenAI::threads()->runs()->retrieve(
                threadId: $threadRun->threadId,
                runId: $threadRun->id,
            );
        }

        if ($threadRun->status !== 'completed') {
            $this->error = 'Request failed, please try again';
        }

        $messageList = OpenAI::threads()->messages()->list(
            threadId: $threadRun->threadId,
        );

        return  OpenAI::audio()->speech([
           "model"=>"tts-1",
            "voice"=>"alloy",
            "input"=> $messageList->data[0]->content[0]->text->value,
         
        ]);
    }
    private function createAndRunThread($question): ThreadRunResponse
    {
        return OpenAI::threads()->createAndRun([
            'assistant_id' => 'asst_8Brqx8PaZklSkZPTmkSRa9z6',
            'thread' => [
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $question,
                    ],
                ],
            ],
        ]);
    }
    private function addMessage(){
        return OpenAI::threads()->messages()->create('thread_iAMQzaMiafvdhfq8plSe5LvO', [
            'role' => 'user',
            'content' => 'yes, I would like to see the property',
        ]);
    }
    private function RunThread(): ThreadRunResponse
    {
        set_time_limit(0);
    return OpenAI::threadRuns()->create('thread_iAMQzaMiafvdhfq8plSe5LvO',
    [
        'assistant_id' => 'asst_8Brqx8PaZklSkZPTmkSRa9z6',
        ]
    );
    }
    public function view(){
        return inertia("test", [
            
        ]);
    }
    public function audio(){
        
    }
}
