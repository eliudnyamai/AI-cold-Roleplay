<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssistantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'gender' => $this->gender,
            'id'=>$this->id,
            'name' => $this->name,
            'seller_desc' => $this->seller_desc,
            'openAI_id' => $this->openAI_id,
            'image_url' => $this->image_url,
        ];    
    }
}
