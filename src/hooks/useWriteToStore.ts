import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";
import { SingleCardType } from "../interfaces/main.interface";
import { useEffect } from "react";

function useWriteToStore(updateValueArr: any) {
  const state = useSelector((state: StoreState) => state);
  const cardsLoad: Boolean = state.cardInfo.loading;
  const cardsList: SingleCardType[] = state.cardInfo.data;

  useEffect(() => {
    if(!cardsLoad) localStorage.setItem("cardList", JSON.stringify(cardsList));
  }, [updateValueArr]);
}

export default useWriteToStore;
