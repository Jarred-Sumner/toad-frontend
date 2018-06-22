const routes = (module.exports = require("next-routes")());

routes.add("board", "/:board/");
routes.add("thread", "/:board/:id");
