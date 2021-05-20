const routes = {};

routes.authRoutes = require("./auth.route");
routes.roomRoutes = require("./rooms.route");
//routes.messageRoutes = require("./message.route");

module.exports = routes;
