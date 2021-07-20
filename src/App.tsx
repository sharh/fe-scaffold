import React from "react";
import { useState } from "react";
import Logo from "./logo.svg";

import json from "./test.json";
import stylesss from "./main.response.module.less";
// import request from "@/utils/request";

// import './main.response.module.less';
export default function App() {
  const [state, setstate] = useState(0);
  if (state == 0) {
    console.log(2);
  }
  // useEffect(() => {
  // 	request({
  // 		url: '/api'
  // 	});
  // }, []);
  // alert('main2');
  // ! todo
  console.log(json);
  return (
    <div
      className={["main", "test", "jsx-test", stylesss["main-1"]].join(" ")}
      styleName="main-test"
      onClick={() => {
        setstate((state) => {
          return state + 1;
        });
      }}
    >
      <h3
        style={{
          lineHeight: 1.4,
        }}
      >
        Hello React {state} times!
      </h3>
      <Logo styleName="logo-test" />
      {/* {process.env.BUILD_ENV} */}
      <style jsx>{`
        .jsx-test {
          color: red;
        }
      `}</style>
    </div>
  );
}
