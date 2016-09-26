export function initialize(/* application */) {
  showdown.extension("internal-links", function() {
  return [{
    type: 'html',
    regex: '<a href=',
    replace: '<a class="ember-href-to" href='
  }];
});
}

export default {
  name: 'register-showdown-extensions',
  initialize
};
