const { User, Room, Member, Message } = require("../models");

const chatController = {};

chatController.getRooms = async (req, res, next) => {
  const userId = req.user.id;
  try {
    let rooms = await Room.findAll({
      attributes: ["id", "name", "screenname", "private", "avatar"],
      include: [
        {
          model: User,
          attributes: [],
          where: {
            id: userId,
          },
        },
      ],
    });
    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

chatController.addRoom = async (req, res, next) => {
  const { name, screenname } = req.body;
  const owner = req.user.id;

  try {
    let room = await Room.create({ name, screenname, owner });
    if (room) {
      let roomObj = room.get();
      await Member.create({ userId: owner, roomId: roomObj.id });
    }
    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

chatController.addMembers = async (req, res, next) => {
  let { members } = req.body;
  let roomId = req.params.id;
  try {
    members = members.map((member) => {
      return { userId: member, roomId };
    });
    const membersResult = await Member.bulkCreate(members, { returning: true });
    return res.status(201).json(membersResult);
  } catch (error) {
    next(error);
  }
};

chatController.sendMessage = async (req, res, next) => {
  const { text } = req.body;
  const userId = req.user.id;
  const roomId = req.params.id;
  try {
    const messages = await Message.create({ userId, roomId, text });
    return res.status(201).json(messages);
  } catch (error) {
    next(error);
  }
};

chatController.getMessages = async (req, res, next) => {
  let roomId = req.params.id;
  try {
    let rooms = await Room.findAll({
      attributes: ["id", "name", "screenname"],
      include: [
        {
          model: Message,
          attributes: ["id", "text", "user_id"],
          where: {
            roomId,
          },
        },
      ],
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

chatController.deleteRoom = async (req, res, next) => {
  const roomId = req.params.id;
  try {
    const response = await Room.destroy({ where: { id: roomId } });
    if (response) {
      return res.status(200).json({ message: "The room has been deleted" });
    }
    return res.status(400).json({ message: "The room has not been deleted" });
  } catch (error) {
    next();
  }
};

chatController.deleteMembers = async (req, res, next) => {
  const { members } = req.body;
  const roomId = req.params.id;
  try {
    const response = await Member.destroy({
      where: {
        [Op.and]: [{ room_id: roomId }, { user_id: members }],
      },
    });
    if (response) {
      return res.status(200).json({ message: "The members has been removed" });
    }
    return res
      .status(400)
      .json({ message: "The members has not been deleted" });
  } catch (error) {
    next();
  }
};

module.exports = chatController;
