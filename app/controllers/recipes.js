import Controller from '@ember/controller';
import PaginationMixin from '../mixins/pagination';

export default Controller.extend(PaginationMixin, {
  queryParams: ['search'],
  search: null
});
