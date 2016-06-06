export default class StatefulComponent extends React.Component {
  constructor(config) {
    super();
    this.config = config;
    this.events = config.events;

    // Event listeners for stores need to be bound to this context or else
    // there is no guarantee which context they will be executed in
    for (let i = 0; i < this.events.length; i++) {
      this.events[i].handler = this[this.events[i].handler].bind(this);
    }
  }

  componentWillMount() {
    // register known event handlers
    for (let i = 0; i < this.events.length; i++) {
      this.events[i].store.on(this.events[i].event, this.events[i].handler);
    }
  }

  componentWillUnmount() {
    // event listener must be removed or else there will be a memory leak
    for (let i = 0; i < this.events.length; i++) {
      this.events[i].store.removeListener(this.events[i].event, this.events[i].handler);
    }
  }
}
