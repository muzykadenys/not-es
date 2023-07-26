import { ReactNode, forwardRef, useEffect, useRef } from "react";
import "./field.scss";
import Card from "../card/Card";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../redux/store";
import { gsap } from "gsap";
import { CARDINFO_CREATE } from "../../redux/reducersConsts";
import { SingleCardType } from "../../interfaces/main.interface";
import OpenCard from "../openCard/OpenCard";
import useWriteToStore from "../../hooks/useWriteToStore";
import useGetDataFromStore from "../../hooks/useGetDataFromStore";

type typeProps = {
  cardsWraperRef: any;
};

const Field = forwardRef((props: typeProps, ref: any) => {
  const state = useSelector((state: StoreState) => state);
  const cardsLoad: Boolean = state.cardInfo.loading;
  const cardsList: SingleCardType[] = state.cardInfo.data;

  const openCardRef = useRef<HTMLDivElement>(null);
  useWriteToStore(cardsList);
  useGetDataFromStore()

  return (
    <div className="FieldSection">
      <div className="FieldSection_Cards" ref={ref}>
        {!cardsLoad
          ? cardsList.map((el, index) => (
              <Card
                key={`FSC_${index}`}
                el={el}
                index={index}
                cardsWraperRef={props.cardsWraperRef}
                openCardRef={openCardRef}
              />
            ))
          : null}

        <OpenCard ref={openCardRef} />

        <div className="OpenCardSection_Cover"></div>
      </div>
    </div>
  );
});

export default Field;
