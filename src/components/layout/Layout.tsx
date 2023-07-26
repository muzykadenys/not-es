import { Provider } from "react-redux";
import Field from "../field/Field";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

import "./layout.scss";
import { store } from "../../redux/store";
import { useEffect, useRef } from "react";

function Layout() {
  const cardsWraperRef = useRef<HTMLDivElement>(null);
  const layoutMainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    var canvas: any = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.onresize = resize;

    function noise(ctx: any) {
      var w = ctx.canvas.width,
        h = ctx.canvas.height,
        idata = ctx.createImageData(w, h),
        buffer32 = new Uint32Array(idata.data.buffer),
        len = buffer32.length,
        i = 0;

      for (; i < len; ) buffer32[i++] = ((255 * Math.random()) | 0) << 24;

      ctx.putImageData(idata, 0, 0);
    }

    var toggle = true;

    // added toggle to get 30 FPS instead of 60 FPS
    (function loop() {
      toggle = !toggle;
      if (toggle) {
        requestAnimationFrame(loop);
        return;
      }
      noise(ctx);
      requestAnimationFrame(loop);
    })();
  }, []);

  return (
    <Provider store={store}>
      <div className="LayoutSection">
        <Sidebar
          cardsWraperRef={cardsWraperRef}
          layoutMainRef={layoutMainRef}
        />
        <div className="LayoutSection_Main" ref={layoutMainRef}>
          <Header />
          <Field ref={cardsWraperRef} cardsWraperRef={cardsWraperRef} />
        </div>
      </div>

      <canvas id="canvas" className="LayoutSection_Noise"></canvas>
    </Provider>
  );
}

export default Layout;
