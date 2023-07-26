import { title } from "process";
import { ActionType, CardInfoType } from "../interfaces/main.interface";
import {
  CARDINFO_GET_ERROR,
  CARDINFO_GET_SUCCESS,
  CARDINFO_CREATE,
  CARDINFO_SET,
} from "./reducersConsts";

const initialState = {
  loading: true,
  data: [
    {
      color: "rgb(255, 199, 94)",
      title: "not es",
      content: "",
      emoji: "🚫🍑",
      date: "August 13th, 2023",
    },
  ],
  error: "",
};

const cardInfoReducer = (
  state: CardInfoType = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case CARDINFO_GET_SUCCESS:
      return {
        loading: false,
        data: action.payload.length > 0 ? action.payload : state.data,
        error: "",
      };
      break;
    case CARDINFO_GET_ERROR:
      return {
        loading: true,
        data: [],
        error: action.error,
      };
      break;
    case CARDINFO_CREATE:
      return {
        loading: false,
        data: [action.payload, ...state.data],
        error: "",
      };
      break;
    case CARDINFO_SET:
      return {
        loading: false,
        data: action.payload,
        error: "",
      };
      break;

    default:
      return state;
  }
};

export default cardInfoReducer;
