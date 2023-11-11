import MessageModel from '../models/message';


export const getMessages = async(req, res) => {
  try {
    const messages = await MessageModel.find().exec();

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось оплучить сообщения',
    })
  }
};

export const postMessage = async(req, res) => {
  try {
    const doc = new MessageModel({
      message: req.body.message,
      createdAt: req.body.createdAt,
      userName: req.body.userName,
    })

    const message = await doc.save();

    res.json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать сообщение',
    })
  }
};
