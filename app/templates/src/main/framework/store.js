import { EventEmitter } from 'events';
import dispatcher from './dispatcher';

export default class Store extends EventEmitter {
  constructor() {
    super();
    dispatcher.register(this.handler.bind(this));
  }

  handle(action) {
    // default action handler
  }
}
