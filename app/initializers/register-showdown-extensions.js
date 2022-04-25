import showdown from 'showdown';

export function initialize(/* application */) {
  showdown.extension("internal-links", function() {
  return [{
    type: 'html',
    regex: '<a href=',
    replace: '<a class="underline text-black" href='
  }];
});
}

export default {
  name: 'register-showdown-extensions',
  initialize
};
