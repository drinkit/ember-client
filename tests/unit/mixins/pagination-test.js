import Ember from 'ember';
import PaginationMixin from '../../../mixins/pagination';
import { module, test } from 'qunit';

module('Unit | Mixin | pagination');

// Replace this with your real tests.
test('it works', function(assert) {
  var PaginationObject = Ember.Object.extend(PaginationMixin);
  var subject = PaginationObject.create();
  assert.ok(subject);
});
