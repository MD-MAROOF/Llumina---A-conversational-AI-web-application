import mongoose from "mongoose";


//In the below lines I've defined the code for individual message. 
const individual_message = new mongoose.Schema({
     profile:{
        type:String,
        enum:["human","gpt"],
        required:true
     },

     data:{
        type:String,
        required:true
     }
});

// Generally, under models it is recommended to define only one schema under one file but in my Code I've defined both of them in the same file because in this project, individual messages don't have any individual role apart from being part of a conversation.


// The below code contains the layout of the entire conversation
const conversation_schema = new mongoose.Schema({
    conversation_id:{
        type:String,
        unique:true,
        required:true,
    },
    
    headline:{
        type:String,
        default:"A New Conversation"
    }, 

    all_messages:[individual_message],

    creation_time:{
        type:Date,
        default:Date.now
    },

    last_updated:{
        type:Date,
        default:Date.now
    }
});

export default mongoose.model("Conversation", conversation_schema);