import { Conversation } from "../model/conversation.js";

export const getConversation = (req, res) => {
  const { recieverId } = req.params;

  const senderId = req.user;

  console.log(senderId, recieverId);

  Conversation.findOne({
    _id: { $in: [`${senderId}${recieverId}`, `${recieverId}${senderId}`] },
  }).exec((err, data) => {
    console.log(data);
    if (err) {
      res.json({
        error: "Cannot fetch data",
      });
    }
    res.json(data);
  });
};

export const setConversation = (senderId, recieverId, message, client) => {
  Conversation.findOne(
    {
      _id: { $in: [`${senderId}${recieverId}`, `${recieverId}${senderId}`] },
    },
    (err, data) => {
      if ((err, !data)) {
        console.log(err, data);
        const conversation = new Conversation({
          _id: `${senderId}${recieverId}`,
          message: {
            value: message,
            senderId: senderId,
            recieverId: recieverId,
          },
        });
        conversation.save().then((data) => {
          console.log(data);
          client &&
            client.send(
              JSON.stringify({
                _id: data._id,
                message: message,
              })
            );
          return;
        });
      } else {
        Conversation.findOneAndUpdate(
          { _id: data._id },
          {
            $push: {
              message: {
                value: message,
                senderId: senderId,
                recieverId: recieverId,
                date: new Date(),
              },
            },
          },
          (err, data) => {
            console.log(data);
            if (err) {
              client &&
                client.send(JSON.stringify({ error: "Unable to update" }));
              return;
            }

            console.log(message);

            client &&
              client.send(
                JSON.stringify({
                  _id: data._id,
                  message: message,
                })
              );
          }
        );
      }
    }
  );
};
