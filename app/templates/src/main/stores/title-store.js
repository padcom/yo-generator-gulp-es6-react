import { EventEmitter } from 'events';
import dispatcher from '../dispatcher';

class TitleStore extends EventEmitter {
  constructor() {
    super();
    this.title = "Hello, world!";
  }

  getTitle() {
    return this.title;
  }

  setTitle(newTitle) {
    this.title = newTitle;
    this.emit("title-changed");
  }

  handleAction(action) {
    switch(action.type) {
      case "TITLE_CHANGED": {
        this.setTitle(action.title);
      }
    }
  }
}

var titleStore = new TitleStore();
window.titleStore = titleStore;
dispatcher.register(titleStore.handleAction.bind(titleStore));

export default titleStore;
