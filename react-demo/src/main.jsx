import React from "react";
import ReactDOM from "react-dom";

const jsx = (
  <div>
    <span>big-react</span>
    <span>big-react</span>
  </div>
);

const root = document.querySelector("#root");
ReactDOM.createRoot(root).render(jsx);

console.log(React);
console.log(ReactDOM);
console.log(jsx);
