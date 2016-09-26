import Ember from 'ember';
import RegisterShowdownExtensionsInitializer from 'ember-drink-it/initializers/register-showdown-extensions';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | register showdown extensions', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RegisterShowdownExtensionsInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
