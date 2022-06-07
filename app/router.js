import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('builder', {path: '/'});
  this.route('recipe', {
    path: '/recipes/:recipe_id'
  });
  this.route('recipes');
  this.route('bar');
  this.route('error404', {path: '/*wildcard'});
  this.route('ingredients');
  this.route('ingredient', {
    path: '/ingredients/:ingredient_id'
  });

  this.route('facebook', function() {
    this.route('data-deletion');
  });
  this.route('privacy-policy');
});
