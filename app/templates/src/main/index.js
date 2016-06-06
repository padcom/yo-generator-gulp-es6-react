import dispatcher from './framework/dispatcher';

import TitleStore from './stores/title-store';
import * as TitleActions from './actions/title-actions';

import App from './components/app';

// This makes certain things available in runtime which is good for debugging
window.Application = {
  dispatcher,
  TitleStore,
  TitleActions
}

// Render the application under #react-output
ReactDOM.render(<App/>, document.getElementById('react-output'));
