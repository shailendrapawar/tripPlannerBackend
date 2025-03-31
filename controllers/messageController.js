import ConversationModel from "../models/chatModels/ConversationModel.js";
import MessageModel from "../models/chatModels/MesssageModel.js"
class MessageController {

    static sendMessage = async (req, res) => {
        try {
            const userId = req.id;
            const { conversationId } = req.params;
            const { message } = req.body;

            const conversation = await ConversationModel.findById(conversationId);

            if (!conversation) {
                return res.status(400).json({
                    msg: "conversation  not found",
                    success: false
                })
            }

            const newMessage = new MessageModel({
                senderId: userId,
                message: message
            })

            const isMsgCreated = await newMessage.save();

            if (!isMsgCreated) {

                return res.status(400).json({
                    msg: "message not created",
                    success: false
                })
            }

            conversation.messages.push(isMsgCreated);
            await conversation.save()

            return res.status(200).json({
                msg: "message sent successfully",
                success: true
            })

        } catch (err) {
            return res.status(400).json({
                msg: "some error sending msg",
                success: false
            })

        }

    }
    static getConversation = async (req, res) => {

    }
}

export default MessageController;