import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('suggest-ingredients', 'Integration | Component | suggest ingredients', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{suggest-ingredients}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#suggest-ingredients}}
      template block text
    {{/suggest-ingredients}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
