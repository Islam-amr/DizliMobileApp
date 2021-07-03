import {TOGGLE_MODAL} from '../actions/globalModal';
const initalState = {
  visible: false,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        visible: !state.visible,
      };
    default:
      return state;
  }
};
