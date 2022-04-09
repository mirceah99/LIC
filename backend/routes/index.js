const routes = {};

routes.user = require('./user.route');
routes.ingredient = require('./ingredient.route');
routes.recipe = require('./recipe.route');
routes.ustensil = require('./ustensil.route');
routes.tag = require('./tag.route');
routes.author = require('./author.route');
routes.login = require('./login.route');


module.exports = routes;
