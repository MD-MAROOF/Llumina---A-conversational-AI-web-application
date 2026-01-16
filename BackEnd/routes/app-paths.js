import express from "express";
import Conversation from "../models/Conversation.js";
import fetchEndPointReply from "../utils/EndPoint.js";
const expressRouter = express.Router();

//-----------------The below code is only for testing a path-----------------------------
// expressRouter.post("/test", async (req, res) => { 
//     try {
//         const reply = await new Conversation({
//             conversation_id: "00001322abcdexyz",
//             headline: "My third conversation from backend"
//         }).save();

//         res.send(reply);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ err: "Couldn't save the data in the database due to some error" });
//     }
// });


//The below code is to fetch all the conversations from the database
expressRouter.get("/conversation", async (req, res) => {
    try {
        const result = await Conversation.find({}).sort({ last_updated: -1 }).exec();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: "Couldn't fetch the data from the database due to some error" });
    }
});


//the below code is to fetch the messages of a specific conversation from the database
expressRouter.get("/conversation/:conversationId", async (req, res) => {
    const { conversationId } = req.params;

    try {
        const conversation = await Conversation.findOne({ conversation_id: conversationId }).exec();

        if (!conversation) {
            return res.status(404).json({ err: "Conversation not found" });
        }

        // Return all_messages (will be [] if empty, which is valid)
        res.json(conversation.all_messages || []);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Couldn't fetch the data from the database due to some error" });
    }

});

//The below code finds and deletes a conversation from the database on the basis of ID
expressRouter.delete("/conversation/:conversationId", async (req, res) => {
    const { conversationId } = req.params;
    try {
        const result = await Conversation.deleteOne({ conversation_id: conversationId }).exec();

        if (result.deletedCount === 0) {
            res.status(404).json({ err: "Conversation is not found and hence cannot be deleted" });
            return;
        }
        res.status(200).json({ message: "Conversation is found and deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Couldn't delete the conversation from the database." });
    }
});

//The below code is used to store new  messages into the database
expressRouter.post("/app-path", async (req, res) => {
    const { conversationId, message } = req.body;

    if (!conversationId) {
        return res.status(400).json({ err: "Conversation ID is required" });
    }

    if (!message) {
        return res.status(400).json({ err: "Message is required" });
    }
    try {
        let conversation = await Conversation.findOne({ conversation_id: conversationId }).exec();

        if (!conversation) {
            conversation = new Conversation({
                conversation_id: conversationId,
                headline: message,
                all_messages: [{ profile: "human", data: message }]
            });
        } else {
            conversation.all_messages.push({ profile: "human", data: message });
        }

        const gptResponse = await fetchEndPointReply(message);


        //Validating GPT response before adding to conversation
        if (!gptResponse || typeof gptResponse !== 'string') {
            return res.status(500).json({ err: "Failed to get response from GPT endpoint" });
        }

        conversation.all_messages.push({ profile: "gpt", data: gptResponse });
        conversation.last_updated = new Date();
        await conversation.save();
        res.json({ reply: gptResponse });


    }
    catch (err) {
        console.log(err);
        console.log("Couldn't process the request due to some error");
    }
});


export default expressRouter;


