import React from "react";
import ReactDOM from "react-dom";

// 定义函数组件
function FC({ children }) {
  return <div>{children}</div>;
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
