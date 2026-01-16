import "./mainpage.css";
import ConversationSpace from "./ConversationSpace.jsx";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import { PuffLoader } from "react-spinners";

function MainPage() {

    const { prompt, setPrompt, reply, setReply, currentConversationId, setCurrentConversationId, pastConversations, setPastConversations } = useContext(AppContext);
    const [loader, setLoader] = useState(false);

    //The below function will be executed whenever a submit button is clicked
    //The below function sends the required payload to the API and gets the response
    const handleSend = async () => {

        setLoader(true);
        const choices = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                conversationId: currentConversationId
            })
        };

        try {
            const reply = await fetch("http://localhost:5000/openai/app-path", choices);
            const rep = await reply.json();
            console.log(rep);
            setReply(rep.reply);

        }
        catch (err) {
            console.log(err);
        }

        setLoader(false);
    }

    // I am adding newer conversations to previous conversations
    //The below function will be executed whenever there is a change in reply variable.
    useEffect(() => {

        if (prompt.trim() && reply) {
            setPastConversations([...pastConversations, { role: "user", content: prompt }, { role: "assistant", content: reply }]);
        }

        setPrompt("");
    }, [reply]);

    return (
        <div className="mainpage-container">
            <div className="header-section">
                Llumina
            </div>
            <ConversationSpace></ConversationSpace>
            <PuffLoader color="#ffff" loading={loader} >

            </PuffLoader>

            <div className="input-container">
                <div className="prompt-container">

                    {/* The below fields are for inputs (related to input bar on the bottom of the page) */}
                    <input type="text" placeholder="What's on your mind ?" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" ? handleSend() : ''} />

                    <div id="send" onClick={handleSend} > <i className="fa-solid fa-paper-plane"></i></div>
                </div>

                <p className="disclaimer">
                    LLumina can make mistakes. Check important info.
                </p>
            </div>
        </div>


    )
}

export default MainPage;