import { attr, Model } from 'ember-cli-simple-store/model';

export default Model.extend({
  name: attr(),
  vol: attr(),
  description: attr(),
  category: attr(),
  alias: attr()
});
