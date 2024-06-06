<?php

namespace App\Http\Controllers;

use App\Models\Assistant;
use App\Models\Play;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenAI\Laravel\Facades\OpenAI;
use OpenAI\Responses\Threads\ThreadResponse;
use OpenAI\Responses\Threads\Runs\ThreadRunResponse;

class PlayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public ?string $error = null;
    public function index()
    {

        $user = Auth::user();
        $plays = $user->plays()->with('assistant:id,name,seller_desc')->get();
        return inertia("Plays/Index", [
            'plays' => $plays,
            'success' => session('success')
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $assistant_id = $request->input('id');
        session(['thread_id' => $this->createThread()->id]);
        $data['Thread_id'] = session('thread_id');
        $data['AI_seller_id'] = $assistant_id;
        $data['user_id'] = Auth::id();
        $data['status'] = 'Attempted';
        Play::create($data);
        $AI_seller = $request;
        $thread_id = $this->createThread()->id;
        return inertia("Plays/Create", [
            'AI_seller' => $AI_seller,
            'text' => session('text'),
            'thread_id' => $thread_id
        ]);
    }
    public function destroy(string $id)
    {
        $play = Play::findOrFail($id);
        $play->delete();
        OpenAI::threads()->delete($play->Thread_id);
        session()->forget('thread_id');
        return to_route('plays.index')
            ->with('success', 'The Play was Deleted successfully.');
    }
    public function quitPlay()
    {
        $thread_id = session('thread_id');
        $play = Play::where('thread_id', $thread_id)->first();
        if ($play) {
            $play->status = "failed";
            $play->save();
        }
        session()->forget('thread_id');
        return redirect()->route('plays.index');
    }
    public function win(Request $request)
    {
        $thread_id = session('thread_id');
        $seller = Assistant::find($request->input('seller_id'));
        $play = Play::where('thread_id', $thread_id)->first();
        if ($play) {
            $play->status = "success";
            $play->save();
        }
        $response = [
            'AI_seller' => $seller,
        ];
        return response()->json($response);
    }
    public function fail(Request $request)
    {
        $thread_id = session('thread_id');
        $seller = Assistant::find($request->input('seller_id'));
        $play = Play::where('thread_id', $thread_id)->first();
        if ($play) {
            $play->status = "failed";
            $play->save();
        }
        $response = [
            'AI_seller' => $seller,
        ];
        return response()->json($response);
    }
    public function deleteAllUserPlays()
    {
        $user = Auth::user();
        $user->plays()->delete();
        $plays = $user->plays()->with('assistant:id,name,seller_desc')->get();
        return inertia("Plays/Index", [
            'plays' => $plays,
            'success' => session('success')
        ]);
    }
    public function continuePlay()
    {

        $response = [
            'AI_seller' => session('AI_seller'),
            'text' => session('text')
        ];
        return response()->json($response);
    }

    public function play(Request $request)
    {
        $seller = Assistant::find($request->input('seller_id'));
        $user_response = $request->input('text');
        $assistant_id = $request->input("asst_id");
        $thread_id = $request->input("thread_id");
        $this->addMessage($thread_id, $user_response);
        $threadRun = $this->RunThread($thread_id, $assistant_id);
        $answer = $this->loadAnswer($threadRun);

        $response = [
            'AI_seller' => $seller,
            'text' => $answer
        ];
        return response()->json($response);
    }
    private function createThread(): ThreadResponse
    {
        return OpenAI::threads()->create([]);
    }
    private function addMessage($thread_id, $user_response)
    {
        try {
            return OpenAI::threads()->messages()->create($thread_id, [
                'role' => 'user',
                'content' => $user_response,
            ]);
        } catch (\Exception $e) {
            error_log("Error adding message: " . $e->getMessage());
            throw new \RuntimeException("Failed to add message to the thread", 0, $e);
        }
    }

    private function RunThread($thread_id, $assistant_id): ThreadRunResponse
    {
        set_time_limit(0);

        try {
            return OpenAI::threadRuns()->create(
                $thread_id,
                [
                    'assistant_id' => $assistant_id,
                ]
            );
        } catch (\Exception $e) {
            error_log("Error running thread: " . $e->getMessage());
            throw new \RuntimeException("Failed to run the thread", 0, $e);
        }
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
        return $messageList->data[0]->content[0]->text->value;
    }
}
