import Ember from 'ember';
import PaginationMixin from '../mixins/pagination';

export default Ember.Controller.extend(PaginationMixin, {
  queryParams: ['search'],
  search: null
});
