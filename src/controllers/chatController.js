const { User, Room, Member, Message } = require("../models");
const Sequelize = require("sequelize");
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
    console.log(room);
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
  let userValid = false;

  try {
    let member = await Member.findAll({
      attributes: ["user_id", "room_id"],
      where: {
        room_id: roomId,
      },
    });

    let otherMember = member.map((m) => {
      return { userId: m.dataValues.user_id, roomId: m.dataValues.room_id };
    });

    for (let index = 0; index < otherMember.length; index++) {
      if (userId === otherMember[index].userId) {
        userValid = true;
        //return res.status(403).json("User not valid");
      }
    }
    console.log(userValid);
    if (userValid) {
      const messages = await Message.create({ userId, roomId, text });
      return res.status(201).json(messages);
    }
    return res.status(403).json("You are not the user currently logged in");
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
  let roomId = req.params.id;
  let userId = req.user.id;
  let { members } = req.body;
  try {
    let results = await Member.destroy({
      where: {
        [Sequelize.Op.and]: [{ user_id: members }, { room_id: roomId }],
        [Sequelize.Op.not]: [{ user_id: userId }],
      },
    });
    if (results) {
      return res.status(200).json({ message: "The members have been removed" });
    }
    return res
      .status(400)
      .json({ message: "The members have not been removed" });
  } catch (error) {
    next(error);
  }
};

chatController.getMembers = async (req, res, next) => {
  const roomId = req.params.id;
  try {
    const response = await Member.findAll({
      where: {
        room_id: roomId,
      },
    });
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    next();
  }
};

module.exports = chatController;
