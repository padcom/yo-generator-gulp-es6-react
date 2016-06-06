import Store from '../framework/store';

class TitleStore extends Store {
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

  handler(action) {
    switch(action.type) {
      case "TITLE_CHANGED": {
        this.setTitle(action.title);
      }
    }
  }
}

export default new TitleStore();
