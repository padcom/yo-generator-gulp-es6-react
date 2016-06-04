import dispatcher from '../dispatcher';

export function titleChanged(title) {
  dispatcher.dispatch({
    type: "TITLE_CHANGED",
    title
  });
}
