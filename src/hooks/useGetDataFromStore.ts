import { useDispatch } from "react-redux";
import {
  CARDINFO_GET_ERROR,
  CARDINFO_GET_SUCCESS,
} from "../redux/reducersConsts";
import { useEffect } from "react";

function useGetDataFromStore() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const data: string | null = localStorage.getItem("cardList");

      console.log(data);
      if (data)
        dispatch({ type: CARDINFO_GET_SUCCESS, payload: JSON.parse(data) });
      else dispatch({ type: CARDINFO_GET_SUCCESS, payload: [] });
    } catch (e) {
      dispatch({ type: CARDINFO_GET_ERROR, error: e });
    }
  }, []);
}

export default useGetDataFromStore;
