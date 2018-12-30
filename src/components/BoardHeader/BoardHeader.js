import React from "react";
import BoardTitle from "./BoardTitle";
// import ColorPicker from "./ColorPicker";
import BoardDeleter from "./BoardDeleter";
import "./BoardHeader.scss";

const BoardHeader = () => (
  <div className="board-header">
    <BoardTitle />
    <div className="board-header-right">
      <BoardDeleter />
    </div>
  </div>
);

export default BoardHeader;
