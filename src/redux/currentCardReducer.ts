import {
  ActionType,
  CurrentCardType,
  SingleCardType,
} from "../interfaces/main.interface";
import { CURRENTCARD_GET_SUCCESS, CURRENTCARD_SET } from "./reducersConsts";

const initialState = {
  loading: false,
  data: {
    color: "rgb(255, 199, 94)",
    title: "someTitle",
    content: "someContent",
    emoji: "",
    date: ""
  },
  index: 0,
  error: "",
};

const currentCardReducer = (
  state: CurrentCardType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case CURRENTCARD_GET_SUCCESS:
      return {
        loading: false,
        data: action.payload,
        error: "",
      };
    case CURRENTCARD_SET:
      return {
        loading: false,
        data: action.payload,
        index: action.payload.index,
        error: "",
      };
    default:
      return state;
  }
};

export default currentCardReducer;
