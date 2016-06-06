import StatefulComponent from '../framework/stateful-component';
import TitleStore from '../stores/title-store';
import * as TitleActions from '../actions/title-actions';

export default class App extends StatefulComponent {
  constructor() {
    super({
      events: [
        { store: TitleStore, event: "title-changed", handler: "updateTitle" }
      ]
    });
    this.state = { title: "Hello, world!" };

    // DEMO: change the title after 2s
    setTimeout(() => TitleActions.titleChanged("Hello, world! from React+Flux"), 2000);

    // The FLUX flow is like this:
    //   1. TitleActions.titleChanged is called and dispatches an event with type "TITLE_CHANGED"
    //   2. The store is a registerd action listener and receives this event setting
    //      the internal state to new title and emitting a "title-changed" event
    //   3. The components listens to "title-changed" event in the store and re-reads the title
    //      from the store
  }

  updateTitle() {
    this.setState({ title: TitleStore.getTitle() });
  }

  render() {
    return (<h1>{this.state.title}</h1>);
  }
}
