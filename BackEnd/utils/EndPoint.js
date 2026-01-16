
import "dotenv/config";

const fetchEndPointReply = async (prompt) => {
    const payload = {
        model: "gpt-4o-mini",
        messages: [
            { role: "user", content: prompt }
        ]
    };

    try {
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", { //This line consists of the API that is being used. 
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const json = await response.json();
        
        // Check if there's an error from OpenAI API
        if(json.error) {
            console.error("OpenAI API Error:", json.error);
            return null;
        }
        
        return json.choices?.[0]?.message?.content;  //Extracting only the required part from the response body
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default fetchEndPointReply;