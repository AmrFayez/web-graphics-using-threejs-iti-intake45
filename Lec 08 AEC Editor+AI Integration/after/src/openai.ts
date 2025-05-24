import OpenAI from 'openai';

export class AIChat {
    private openai: OpenAI;
    private context: { role: 'system' | 'user' | 'assistant', content: string }[] = [];

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true // Note: In production, you should use a backend server
        });

        // Initialize with system message
        this.context.push({
            role: 'system',
            content: `You are a helpful assistant integrated into a 3D viewer application.
            do not reply to general questions, only reply to questions related to the 3d viewer.
            the 3d viewer has function called draw wall that accepts 2 Three.Vectoer3 to draw a wall in xy plane keep the z always 0
            multiply the dimension by 10 
          
            the user will ask you to draw a room with specific width and height provide the lines coordinates to draw the room.
            you can also draw other abstract shapes like car,chair,table,etc. by using the draw wall to draw the lines of the shape,
             respond only  with the following format  as json object in the following format{
             
          "message":"a friendly message to the user",   
            "lines": [
                {
                    "start": {x:0,y:0,z:0},
                    "end": {x:0,y:0,z:0}
                }
            ] 
             }
              `
        });
    }

    async sendMessage(message: string): Promise<string> {
        try {
            // Add user message to context
            this.context.push({
                role: 'user',
                content: message
            });

            // Get completion from OpenAI
            const completion = await this.openai.chat.completions.create({
                messages: this.context,
                model: 'gpt-4o-mini',
            });
            console.log(completion);
            debugger;
            const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
            var parsedReply=  this.parseReply(reply);
            // Add assistant's reply to context
            this.context.push({
                role: 'assistant',
                content: parsedReply.message
            });
            console.log(this.context);
            // Keep context size manageable (last 10 messages)
            if (this.context.length > 11) { // 1 system message + 10 conversation messages
                this.context = [
                    this.context[0],
                    ...this.context.slice(-10)
                ];
            }

            return parsedReply;
        } catch (error) {
            console.error('Error in AI response:', error);
            throw error;
        }
    }
    parseReply(reply: string)  {
        try {
            var json= JSON.parse(reply);
            debugger;
            return json;
        } catch (error) {
            debugger;
            return {
                message: 'Sorry, I could not generate a response.',
                lines: []
            }
        }
       

    }  
} 