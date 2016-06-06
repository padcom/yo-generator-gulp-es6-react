import dispatcher from '../framework/dispatcher';

export function titleChanged(title) {
  dispatcher.dispatch({
    type: "TITLE_CHANGED",
    title
  });
}
