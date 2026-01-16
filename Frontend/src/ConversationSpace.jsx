// Importing all the required packages

import { useContext } from "react";
import { AppContext } from "./AppContext.jsx";
import ReactMarkdown from "react-markdown";
import "./ConversationSpace.css";
import rehypeHighlight from "rehype-highlight";

function ConversationSpace() {
    const { newConversation, pastConversations } = useContext(AppContext);

    return (
        <>
        
            {newConversation && <h1> Hello Everyone ! What's up ?</h1>}
            <div className="conversation-space-container">
                {pastConversations?.map((conversation, index) => (
                    <div
                        className={conversation.role === "user" ? "humanSpace" : "gptSpace"}
                        key={index}
                    >
                        {conversation.role === "user" ? (
                            <p className="humanChat">{conversation.content}</p>
                        ) : (
                            // The below code is for the GPT response (The package is being applied only on GPT's response)
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {conversation.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}


            </div>
        </>
    )
}

export default ConversationSpace; 