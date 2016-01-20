import Ember from 'ember';
import RememberScrollMixin from '../../../mixins/remember-scroll';
import { module, test } from 'qunit';

module('Unit | Mixin | remember scroll');

// Replace this with your real tests.
test('it works', function(assert) {
  let RememberScrollObject = Ember.Object.extend(RememberScrollMixin);
  let subject = RememberScrollObject.create();
  assert.ok(subject);
});
