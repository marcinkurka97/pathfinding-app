import React from "react";

class SingleNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isVisited,
      isWall,
      onMouseEnter,
      onMouseDown,
      onMouseUp
    } = this.props;
    const extraClassName = isStart
      ? "node__start"
      : isFinish
      ? "node__finish"
      : isVisited
      ? "node__visited"
      : isWall
      ? "node__wall"
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}

export default SingleNode;
