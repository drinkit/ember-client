import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('spinkit-three-bounce', 'Integration | Component | spinkit three bounce', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{spinkit-three-bounce}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#spinkit-three-bounce}}
      template block text
    {{/spinkit-three-bounce}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
