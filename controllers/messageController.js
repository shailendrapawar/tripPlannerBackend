import ConversationModel from "../models/chatModels/ConversationModel.js";
import MessageModel from "../models/chatModels/MesssageModel.js"
import { io } from "../socket/socket.js";

class MessageController {

    static sendMessage = async (req, res) => {
        try {
            const userId = req.id;
            const { conversationId } = req.params;
            const { message,senderName } = req.body;

            const conversation = await ConversationModel.findById(conversationId);

            if (!conversation) {
                return res.status(400).json({
                    msg: "conversation  not found",
                    success: false
                })
            }

            const newMessage = new MessageModel({
                senderId: userId,
                message: message,
                senderName
            })

            const isMsgCreated = await newMessage.save()

            if (!isMsgCreated) {
                console.log(isMsgCreated)

                return res.status(400).json({
                    msg: "message not created",
                    success: false,
                    
                })
            }

            conversation.messages.push(isMsgCreated);
            await conversation.save()
            
            
            //====socket event to handle message===========
            io.to(conversationId).emit("getMsg",isMsgCreated);

            // console.log("msg emmitted==")
            return res.status(200).json({
                msg: "message sent successfully",
                success: true,
                // newMessage: {...isMsgCreated,name:senderName}
                newMessage
            })

        } catch (err) {
            return res.status(400).json({
                msg: "some error sending msg",
                success: false
            })

        }

    }

    static getSingleConversation = async (req, res) => {
        try {
            // const userId = req.id;
            const { conversationId } = req.params;
            const conversation = await ConversationModel.findById(conversationId).populate({
                path:"messages",
                // populate:{
                //     path:"senderId",
                //     select:"name avatar"
                // }
            });

            if (!conversation) {
                return res.status(400).json({
                    msg: "conversation not found",
                    success: false
                })
            }

            return res.status(200).json({
                msg: "Conversation found ",
                success: true,
                conversation: conversation.messages || []
            })
        } catch (err) {
            if (!conversation) {
                return res.status(400).json({
                    msg: "conversation not found",
                    success: false
                })
            }
        }

    }

    static getUserAllConversations = async (req, res) => {

        try {
            const userId = req.id;

            const allConversations = await ConversationModel.find({
                users: {
                    $in: userId
                }
            })

            if (!allConversations) {
                return res.status(400).json({
                    msg: "conversations not found",
                    success: false
                })
            }

            return res.status(200).json({
                msg: "Conversation found ",
                success: true,
                allConversations
            })

        } catch (err) {
            return res.status(400).json({
                msg: "conversations not found",
                success: false
            })
        }
    }
}

export default MessageController;