import "./Leftbar.css";
import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import { v4 as uuidv4 } from "uuid";

function Leftbar() {
    const {
        allConversations,
        setAllConversations,
        currentConversationId,
        setNewConversation,
        setPrompt,
        setReply,
        setCurrentConversationId,
        setPastConversations
    } = useContext(AppContext);

    useEffect(() => {      //This function will be called everytime there is a change in current conversation ID to fetch the latest conversation (orderwise)
        const fetchConversations = async () => {
            try {
                const response = await fetch("http://localhost:5000/openai/conversation"); //This is the URL that I've defined in app-paths.js (to get all the conversations)
                const result = await response.json();
                //Title is being stored because we want to represent past conversations by their titles
                //Conversation id is also being stored so that it could be retrieved in future by clicking on it.
                const formatted = Array.isArray(result)
                    ? result.map((conversation) => ({
                        conversation_id: conversation.conversation_id,
                        title: conversation.headline || conversation.title || "Untitled Conversation"
                    }))
                    : [];

                setAllConversations(formatted);
            } catch (error) {
                console.error("Failed to load conversations", error);
            }
        };

        fetchConversations();
    }, [currentConversationId]);

    //The below function will be called whenever a new conversation is created. 
    //This function is making all the required changes in states for a new conversation.
    const handleNewConversation = () => {
        setNewConversation(true);
        setPrompt("");
        setReply(null);
        setCurrentConversationId(uuidv4());
        setPastConversations([]);
    };

    //The below function is to fetch all the past messages for a specific conversation (conversation that appear on left bar)
    const handleSelectConversation = async (conversationId) => {
        setNewConversation(false);
        setCurrentConversationId(conversationId);

        try {
            const response = await fetch(`http://localhost:5000/openai/conversation/${conversationId}`);
            const messages = await response.json();

            const formattedMessages = Array.isArray(messages)
                ? messages.map((message) => ({
                    role: message.profile === "human" ? "user" : "assistant",
                    content: message.data
                }))
                : [];

            setPastConversations(formattedMessages);
            setReply(null);
            setPrompt("");
        } catch (error) {
            console.error("Failed to load conversation", error);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/openai/conversation/${conversationId}`,
                { method: "DELETE" }
            );
            const res = await response.json();
            console.log(res);

            //After deletion, we have to again render the list of conversations. Below piece of code does that.
            setAllConversations(
                allConversations.filter(
                    (conversation) => conversation.conversation_id !== conversationId
                )
            );

            
            if (conversationId === currentConversationId) {
                handleNewConversation();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        // The below code shows the header of the left bar.
        <section className="leftbar-container">
            <button onClick={handleNewConversation}>
                <img
                    src="src/assets/gptlogo.png"
                    className="gptlogo"
                    alt="Gpt logo"
                />
                <span>
                    <i className="fa-regular fa-pen-to-square"></i>
                </span>
            </button>

            {/* The below code shows all the previous chats sorted by their last updated times. */}
            <ul className="history-container">
                {allConversations.map((conversation) => (
                    <li
                        key={conversation.conversation_id}
                        onClick={() => handleSelectConversation(conversation.conversation_id)}
                    >
                        {conversation.title}
                        <i
                            className="fa-regular fa-trash-can"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conversation.conversation_id);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* The below code is the last portion of the leftbar (it basically consists of copyright related info) */}
            <div className="copyright-container">
                Copyright © Maroof 2025
            </div>
        </section>
    );
}
export default Leftbar;