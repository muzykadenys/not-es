import { FC, useEffect, useRef, useState } from "react";
import "./card.scss";
import { gsap } from "gsap";
import { card_gap, card_radius, card_width } from "../../settings/variables";
import { useDispatch } from "react-redux";
import { SingleCardType } from "../../interfaces/main.interface";
import { CURRENTCARD_SET } from "../../redux/reducersConsts";

const Card: FC<any> = ({
  el,
  cardsWraperRef,
  openCardRef,
  index,
}): JSX.Element => {
  const dispatch = useDispatch();
  const setCurrentCard = () => {
    dispatch({ type: CURRENTCARD_SET, payload: { ...el, index: index } });
  };
  const foldRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastCardPos = useRef<any>(null);

  const setMaxTitleLength = (): String => {
    const maxTitleLength = 60;

    return el.title.length >= 60
      ? el.title.slice(0, maxTitleLength) + "..."
      : el.title;
  };

  const clickOnCard = () => {
    setCurrentCard();
    createOpenCard();
  };
  const clickCloseCard = (e: React.FormEvent<EventTarget>) => {
    if (e.target == e.currentTarget) {
      // console.log("back");
      closeOpenCard();
    }
  };

  const hoverEnterCard = () => {
    gsap.to(foldRef.current, { scale: 1.8, duration: 0.5 });
    gsap.to(cardRef.current, { borderBottomRightRadius: 50, duration: 0.3 });
  };
  const hoverExitCard = () => {
    gsap.to(foldRef.current, { scale: 0, duration: 0.5 });
    gsap.to(cardRef.current, {
      borderBottomRightRadius: card_radius,
      duration: 0.3,
    });
  };

  const createOpenCard = () => {
    var cardGlobalPos = cardRef.current!.getBoundingClientRect();
    const cardPos = {
      left: cardGlobalPos!.left + window.pageXOffset,
      top: cardGlobalPos!.top + window.pageYOffset,
    };
    lastCardPos.current = cardRef.current;

    if (openCardRef.current && cardRef.current) {
      openCardRef.current.style.left = `${cardPos.left}px`;
      openCardRef.current.style.top = `${cardPos.top}px`;
      openCardRef.current.style.scale = "1";

      openCardRef.current.children[0].style.backgroundColor =
        cardRef.current.style.backgroundColor;

      cardsWraperRef.current.lastChild.style.scale = "1";
    }

    gsap.to(foldRef.current, {
      scale: 0,
      duration: 0.2,

      onComplete: () => {
        gsap.to(openCardRef.current, {
          duration: 0.3,
          opacity: 1,

          onComplete: () => {
            const durat = 0.5;

            cardRef.current!.style.opacity = "0";

            gsap.to(openCardRef.current, {
              duration: durat,
              ease: "Power4.easeInOut",
              borderRadius: 0,
              width: "100vw",
              height: "100vh",
              left: 0,
              top: 0,
              onComplete: () => {
                gsap.to(openCardRef.current, {
                  duration: 0.4,
                  backgroundColor: "rgba(210, 210, 210, 0.6)",
                });
                gsap.to(openCardRef.current.children[0], {
                  duration: 0.4,
                  backgroundColor: "white",

                  onComplete: () => {
                    gsap.to(openCardRef.current.children[0].children[0], {
                      duration: 0.5,
                      opacity: 1,
                      display: "flex",
                    });
                  },
                });

                cardsWraperRef.current.lastChild.style.scale = "0";
              },
            });

            gsap.to(openCardRef.current.children[0], {
              duration: durat,
              ease: "Power4.easeInOut",
              width: "70%",
              height: "80%",
              // backgroundColor: "white",
            });
          },
        });
      },
    });
  };

  const closeOpenCard = () => {
    const durat = 0.5;
    if (lastCardPos.current) {
      var cardGlobalPos = lastCardPos.current!.getBoundingClientRect();
      const cardPos = {
        left: cardGlobalPos!.left + window.pageXOffset,
        top: cardGlobalPos!.top + window.pageYOffset,
      };
      lastCardPos.current = null;
      cardsWraperRef.current.lastChild.style.scale = "1";

      gsap.to(openCardRef.current.children[0].children[0], {
        duration: 0.5,
        opacity: 0,
        display: "none",

        onComplete: () => {
          gsap.to(openCardRef.current, {
            duration: 0.2,
            backgroundColor: "rgba(240, 240, 240, 0.0)",
            onComplete: () => {
              gsap.to(openCardRef.current, {
                duration: durat,
                ease: "Power4.easeInOut",
                borderRadius: card_radius,
                width: cardRef.current?.clientWidth,
                height: cardRef.current?.clientHeight,
                left: `${cardPos?.left}px`,
                top: `${cardPos?.top}px`,
              });
            },
          });

          gsap.to(openCardRef.current.children[0], {
            duration: 0.2,
            backgroundColor: cardRef.current?.style.backgroundColor,

            onComplete: () => {
              gsap.to(openCardRef.current.children[0], {
                duration: durat,
                ease: "Power4.easeInOut",
                width: "100%",
                height: "100%",

                onComplete: () => {
                  cardRef.current!.style.opacity = "1";

                  gsap.to(openCardRef.current, {
                    duration: 0.3,
                    opacity: 0,
                    onComplete: () => {
                      openCardRef.current.style.scale = "0";
                      cardsWraperRef.current.lastChild.style.scale = "0";
                    },
                  });
                },
              });
            },
          });
        },
      });
    }
  };

  useEffect(() => {
    if (openCardRef.current) {
      openCardRef.current.addEventListener(
        "click",
        (e: React.FormEvent<EventTarget>) => {
          clickCloseCard(e);
        }
      );
    }
  }, []);

  return (
    <div
      className="CardSection"
      onClick={clickOnCard}
      onMouseEnter={hoverEnterCard}
      onMouseLeave={hoverExitCard}
      ref={cardRef}
      style={{ backgroundColor: el.color }}
    >
      <div className="CardSection_Wraper">
        <div className="CardSection_Wraper_WrapTitle">
          <div className="CardSection_Wraper_WrapTitle_Title">
            <span className="CardSection_Wraper_WrapTitle_Emoji">
              {el.emoji}
            </span>
            {setMaxTitleLength()}
          </div>
        </div>

        <div className="CardSection_Wraper_Time">{el.date}</div>
      </div>

      <div className="CardSection_Fold">
        <div className="CardSection_Fold_El" ref={foldRef}></div>
      </div>
    </div>
  );
};

export default Card;
