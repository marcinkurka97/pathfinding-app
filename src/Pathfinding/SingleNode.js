import React from "react";

class SingleNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onDragStart = (e, obj) => {
    if ((obj.props.isStart || obj.props.isFinish) && !obj.props.isWall) {
      e.target.parentNode.classList = "node ";
      e.dataTransfer.setData("text", e.target.id);
    }
  };

  onDrop = (e, obj) => {
    e.stopPropagation();
    e.preventDefault();

    let data = e.dataTransfer.getData("text/plain");

    if (data === "start-node") {
      e.target.classList = "node node__start";
      this.props.setStartNode(obj.props.row, obj.props.col);
      e.target.appendChild(document.getElementById(data));
    } else if (data === "finish-node") {
      e.target.classList = "node node__finish";
      this.props.setFinishNode(obj.props.row, obj.props.col);
      e.target.appendChild(document.getElementById(data));
    }
  };

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
        onDrop={e => this.onDrop(e, this)}
        onDragOver={e => this.onDragOver(e)}
      >
        {isStart ? (
          <span
            aria-label="startNode"
            id="start-node"
            role="img"
            draggable="true"
            onDragStart={e => this.onDragStart(e, this)}
          >
            ▶️
          </span>
        ) : isFinish ? (
          <span
            aria-label="finishNode"
            id="finish-node"
            role="img"
            draggable="true"
            onDragStart={e => this.onDragStart(e, this)}
          >
            🏁
          </span>
        ) : (
          " "
        )}
      </div>
    );
  }
}

export default SingleNode;
