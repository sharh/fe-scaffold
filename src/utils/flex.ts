/*
 * @Author: HuMwing
 * @since: 2019-12-24 15:20:27
 * @lastTime: 2021-06-29 17:21:19
 * @LastAuthor: Mwing
 * @message:
 */
/* eslint-disable */
/* ts-nocheck */
/* flex.js */
(function flexible(window, document) {
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // set 1rem = viewWidth / 10
  function setRemUnit() {
    var rem = window.innerWidth > 750 ? 750 : window.innerWidth;
    // rem = rem < 50 ? 50 : rem;
    // @ts-ignore
    window.CFONT = rem;
    docEl.style.fontSize = rem + "px";
  }
  // @ts-ignore
  window.setRemUnit = setRemUnit;
  setRemUnit();
  window.onresize = setRemUnit;
  // reset rem unit on page resize
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });
  var td = setInterval(function () {
    // @ts-ignore
    if (window.CFONT < 10) {
      setRemUnit();
    } else {
      clearInterval(td);
    }
  }, 500);
  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement("body");
    var testElement = document.createElement("div");
    testElement.style.border = ".5px solid transparent";
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add("hairlines");
    }
    docEl.removeChild(fakeBody);
  }
})(window, document);
(function initVconsole() {
  function $(selector: string) {
    return document.querySelector(selector)
  }
  // @ts-ignore
  if (!window.VConsole) {
    return
  }
  function addToolEl() {
    let el: any = $(".vc-mask");
    if (el) {
      if (!$("#cs_tools")) {
        let div = document.createElement("div");
        div.id = "cs_tools";
        div.innerHTML = `
                <div style="background: #39f;border-bottom: 1px solid;color: #fff;font-size: 0.042667rem;text-align: center;padding: 10px;" onclick="localStorage.clear();sessionStorage.clear();$toastMethod('清除成功！')">清除全部缓存</div>
              `;
        el.appendChild(div);
      }
    }
  }
  let time = 0,
    count = 0;
  window.addEventListener("mousedown", function (params) {
    var now = Date.now();
    if (time) {
      let delta = now - time;
      if (delta > 1000) {
        count = 0;
      } else {
        count++;
      }
    } else {
      count++;
    }
    time = now;
    // @ts-ignore
    if (count > 20 && window.VConsole && !window.vConsole) {
      // @ts-ignore
      window.vConsole = new window.VConsole();
      addToolEl();
      // @ts-ignore
    } else if (count > 20 && window.vConsole) {
      // @ts-ignore
      if ($('#__vconsole').style.display !== "block") {
        // @ts-ignore
        $('#__vconsole').style.display = "block";
        addToolEl();
      } else {
        // @ts-ignore
        $('#__vconsole').style.display = "none";
      }
    }
  });
  // @ts-ignore
  if (window.VConsole) {
    // @ts-ignore
    window.vConsole = new window.VConsole({
      onReady: function () {
        console.log('ready')
        // @ts-ignore
        $('#__vconsole').style.display = "none";
      }
    });
  }
  if (/debug=true/i.test(location.search)) {
    // @ts-ignore
    if (window.vConsole && $('#__vconsole')) {
      // @ts-ignore
      $('#__vconsole').style.display = "block"
    }
  }
})()
export { }