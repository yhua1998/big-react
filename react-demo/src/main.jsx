import React, { useState } from "react";
import ReactDOM from "react-dom";

// 定义函数组件
function FC({ children }) {
  const [num, setNum] = useState(1)
  return <div>{num}</div>;
}

const jsx = (
  <div>
    <FC>
      <span>big-react</span>
    </FC>
  </div>
);

const root = document.querySelector("#root");
ReactDOM.createRoot(root).render(jsx);
