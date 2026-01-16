
import './App.css';
import MainPage from './mainPage.jsx';
import ConversationSpace from './ConversationSpace.jsx';
import { AppContext } from './AppContext.jsx';
import Leftbar from './Leftbar.jsx';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "highlight.js/styles/github.css";


function App() {

  // Creating all the required state varibles for managing data and rendering logic
  const [prompt, setPrompt] = useState("");
  const [pastConversations, setPastConversations] = useState([]); 
  const [newConversation, setNewConversation] = useState(true); 
  const [reply, setReply] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(uuidv4());
  const [allConversations, setAllConversations] = useState([]); 

  const values_for_provider = {
    prompt, setPrompt, reply, setReply, currentConversationId, setCurrentConversationId, pastConversations, setPastConversations, newConversation, setNewConversation, allConversations, setAllConversations
  };


  return (

    <div className='app-container'>
       {/* All the values in provider array will be passed to child components (i.e., Leftbar and MainPage) */}
      <AppContext.Provider value={values_for_provider}>
        <Leftbar />
        <MainPage />
      </AppContext.Provider>

    </div>
  )
}

export default App
