import { useDispatch } from "react-redux";
import "./sidebar.scss";
import { CARDINFO_CREATE } from "../../redux/reducersConsts";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import { gsap } from "gsap";
import { card_gap, card_radius, card_width } from "../../settings/variables";
import { getRandEmoji } from "../../settings/getEmoji";
import useWriteToStore from "../../hooks/useWriteToStore";

const colorsList = [
  "rgb(255, 199, 94)",
  "rgb(255, 142, 85)",
  "rgb(166, 129, 254)",
  "rgb(97, 218, 255)",
  "rgb(238, 255, 112)",
];

type SidebarType = {
  cardsWraperRef: any;
  layoutMainRef: any;
};

function Sidebar({ cardsWraperRef, layoutMainRef }: SidebarType) {
  const dispatch = useDispatch();
  const dispatchCardInfoCreate = (prop_color: string) => {
    dispatch({
      type: CARDINFO_CREATE,
      payload: {
        color: prop_color,
        title: "",
        content: "",
        emoji: getRandEmoji(),
        date: generateDate()
      },
    });
  };
  
  const [isCirclesOpen, setIsCirclesOpen] = useState(false);
  const [isClickCardCreate, setIsClickCardCreate] = useState(false);

  const currentCircle = useRef(null);
  const transitionCardRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const circleRefList = useRef<(HTMLDivElement | null)[]>([]);
  circleRefList.current = [];

  // ==============================================================

  const generateDate = () => {
    const date = new Date();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let daySuffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = "st";
    } else if (day === 2 || day === 22) {
      daySuffix = "nd";
    } else if (day === 3 || day === 23) {
      daySuffix = "rd";
    }

    return `${month} ${day}${daySuffix}, ${year}`;
  };

  const clickOpenCircle = () => {
    animateCircleOutside();
  };
  const clickAddCard = (el: any) => {
    currentCircle.current = el;

    setIsClickCardCreate(true);
   

    layoutMainRef.current.style.overflowY = "hidden";

    // scroll to top when card created
    if (layoutMainRef.current) {
      layoutMainRef.current.scrollTo(0, 0);
    }
  };

  const addCircleRefToList = (el: HTMLDivElement) => {
    if (el && !circleRefList.current.includes(el)) {
      circleRefList.current.push(el);
    }
  };

  const animateCircleFly = (el: any) => {
    var circleBtnGlobalPos = el.target.getBoundingClientRect();
    const circlePos = {
      left: circleBtnGlobalPos.left + window.pageXOffset,
      top: circleBtnGlobalPos.top + window.pageYOffset,
    };

    var cardGlobalPos =
      cardsWraperRef.current.children[0].getBoundingClientRect();
    const cardPos = {
      left: cardGlobalPos.left + window.pageXOffset,
      top: cardGlobalPos.top + window.pageYOffset,
    };

    // console.log(cardPos);

    if (transitionCardRef.current)
      transitionCardRef.current.style.opacity = "1";

    gsap.fromTo(
      transitionCardRef.current,
      1,
      {
        translateX: `${circlePos.left}px`,
        translateY: `${circlePos.top}px`,
        borderRadius: 200,
      },
      {
        ease: "expo.easeIn",
        translateX: `${cardPos.left - (card_width + card_gap)}px`,
        translateY: `${cardPos.top}px`,
        borderRadius: card_radius,

        onComplete: () => {
          // show original card
          gsap.to(cardsWraperRef.current.children[0], {
            opacity: 1,
            onComplete: () => {
              // hide flying card
              gsap.to(transitionCardRef.current, {
                opacity: 0,
              });

              // enable pointer event to add card
              if (circleWrapRef.current) {
                circleWrapRef.current.style.pointerEvents = "all";
              }

              layoutMainRef.current.style.overflowY = "scroll";
            },
          });
        },
      }
    );

    gsap.fromTo(
      transitionCardRef.current,
      {
        width: "20px",
        height: "20px",
        // delay: 0.2,
      },
      {
        width: `${card_width}px`,
        height: `${card_width}px`,
        delay: 0.2,
      }
    );
  };

  const animateCardReveal = (el: any) => {
    const colorOfCircle = el.target.style.backgroundColor.toString();

    // change styles of flying circle
    if (transitionCardRef.current !== null) {
      transitionCardRef.current.style.backgroundColor = colorOfCircle;
    }
    // disable click on circles untill animation over
    if (circleWrapRef.current) {
      circleWrapRef.current.style.pointerEvents = "none";
    }

    // animation of adding card in list
    gsap.to(cardsWraperRef.current.children[0], {
      marginLeft: card_width + card_gap,
      onComplete: () => {
        dispatchCardInfoCreate(colorOfCircle);
        animateCircleFly(el);

        gsap.to(cardsWraperRef.current.children[0], {
          backgroundColor: colorOfCircle,
          marginLeft: 0,
          duration: 0,
          opacity: 0,
        });
      },
    });
  };

  const animateCircleOutside = () => {
    const duration = 0.3;

    function circleRecursive(index: number) {
      gsap.fromTo(
        circleRefList.current[index],
        { marginTop: `${index * 40}px` },
        {
          duration: duration,
          marginTop: `${(index + 1) * 40}px`,

          onComplete: () => {
            if (circleRefList.current.length > index + 2) {
              circleRecursive((index += 1));
            }
          },
        }
      );
    }

    if (!isCirclesOpen) {
      setIsCirclesOpen(true);

      gsap.to(addBtnRef.current, {
        marginTop: "-5px",
        rotate: "360deg",
        duration: 0.2,
        onComplete: () => {
          gsap.to(addBtnRef.current, {
            marginTop: "0px",
            duration: 0.1,
          });
        },
      });

      gsap.to(circleWrapRef.current, {
        marginTop: "40px",
        duration: duration,
        onComplete: () => {
          circleRecursive(0);
        },
      });
    }
  };

  useEffect(() => {
    const launchCardAnimation = () => {
      if (layoutMainRef.current.scrollTop === 0 && isClickCardCreate) {
        animateCardReveal(currentCircle.current);
        setIsClickCardCreate(false);
      }
    };

    launchCardAnimation();

    const handleScroll = debounce(() => {
      launchCardAnimation();
    }, 100);

    // Add the scroll event listener to the window
    layoutMainRef.current.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      layoutMainRef.current.removeEventListener("scroll", handleScroll);
      // Ensure any pending debounced function execution is cancelled on unmount
      handleScroll.cancel();
    };
  }, [isClickCardCreate, currentCircle, setIsClickCardCreate]);



  return (
    <>
      <div
        className="SidebarSection_TransitionCard"
        ref={transitionCardRef}
      ></div>

      <div className="SidebarSection">
        <div className="SidebarSection_Logo">not es</div>

        <div className="SidebarSection_WrapAddCard">
          <div
            className="SidebarSection_AddCard"
            onClick={clickOpenCircle}
            ref={addBtnRef}
          >
            +
          </div>

          <div className="SidebarSection_Circles" ref={circleWrapRef}>
            {colorsList.map((el, index) => (
              <div
                onClick={clickAddCard}
                className={`SidebarSection_Circles_El SidebarSection_Circles_El_${index}`}
                ref={addCircleRefToList}
                style={{ backgroundColor: el }}
                key={`SSCE_${index}`}
              ></div>
            ))}
          </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 23 -8.5"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
}

export default Sidebar;
