import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('builder', {path: '/'});

  this.route('recipe', {
    path: '/recipes/:recipe_id'
  });
  this.route('recipes');
  this.route('bar');
});

export default Router;
