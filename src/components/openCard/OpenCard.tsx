import { forwardRef, useEffect, useRef, useState } from "react";
import "./openCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../redux/store";
import { CARDINFO_SET, CURRENTCARD_SET } from "../../redux/reducersConsts";
import { SingleCardType } from "../../interfaces/main.interface";
import _ from "lodash";
import useWriteToStore from "../../hooks/useWriteToStore";

const OpenCard = forwardRef((props, ref: any) => {
  const state = useSelector((state: StoreState) => state);
  const currentCard = state.curentCard;
  const cardInfo = state.cardInfo;

  const dispatch = useDispatch();
  const setCurrentCard = (values: SingleCardType) => {
    dispatch({ type: CURRENTCARD_SET, payload: values });
  };

  const setCardInfo = (data: SingleCardType, index: number) => {
    const copyArr = cardInfo.data;
    copyArr[index] = data;

    dispatch({ type: CARDINFO_SET, payload: copyArr });
  };

  // ==============================================================
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  useWriteToStore([titleValue,contentValue]);

  // console.log("shit", currentCard.data, titleValue);

  const onTitleChange = (value: any) => {
    const text = value.target.value;
    setTitleValue(() => {
      const info = {
        ...currentCard.data,
        title: text,
        content: contentValue,
      };

      // setCurrentCard(info);

      setCardInfo(info, currentCard.index);

      return text;
    });
  };
  const onContentChange = (value: any) => {
    const text = value.target.value;

    setContentValue(() => {
      const info = {
        ...currentCard.data,
        title: titleValue,
        content: text,
      };
      // setCurrentCard(info);

      setCardInfo(info, currentCard.index);

      return text;
    });
  };

  useEffect(() => {
    setTitleValue(currentCard.data.title);
    setContentValue(currentCard.data.content);
  }, [currentCard]);

  return (
    <div className="OpenCardSection" ref={ref}>
      <div className="OpenCardSection_Main">
        <div className="OpenCardSection_Main_Wrap">
          <div className="OpenCardSection_Main_Wrap_WrapTitle">
            <span className="OpenCardSection_Main_Wrap_WrapTitle_Emoji">{currentCard.data.emoji}</span>

            <input
              className="OpenCardSection_Main_Wrap_WrapTitle_Title"
              placeholder="title"
              onChange={e=>onTitleChange(e)}
              value={titleValue}
            />
          </div>

          <textarea
            className="OpenCardSection_Main_Wrap_Content"
            role="textbox"
            placeholder="write your masterpeace here✨"
            onChange={e=>onContentChange(e)}
            value={contentValue}
          ></textarea>
        </div>
      </div>
    </div>
  );
});

export default OpenCard;
