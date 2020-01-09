import React from "react";

let grid;

class SimpleVerticalWalls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  verticalWalls(props) {
    props.clearBoard();
    grid = props.grid;
    grid = props.getInitialGrid();
    props.updateGridState(grid);

    this.animateWalls(props);
  }

  async animateWalls(props) {
    props.setSerachingState(true);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (
          i === 0 ||
          i === grid.length - 1 ||
          j === 0 ||
          j === grid[i].length - 1
        ) {
          await this.task2(i, j);
          grid[i][j].isWall = true;
        }
      }
    }

    for (let i = 0; i < grid[0].length - 2; i += 2) {
      const num = Math.floor(Math.random() * (grid.length - 2)) + 1;
      const gap = grid[num][i];

      for (let j = 1; j < grid.length - 1; j++) {
        if (grid[j][i] !== gap) {
          await this.task2(j, i);
          grid[j][i].isWall = true;
        }
      }
    }

    props.setSerachingState(false);
  }

  async task2(i, j) {
    await this.timer(5);
    document.getElementById(`node-${i}-${j}`).className = "node node__wall";
  }

  timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  render() {
    const props = this.props;
    return (
      <button
        disabled={props.disabled}
        onClick={() => this.verticalWalls(props)}
      >
        Horizontal Walls
      </button>
    );
  }
}

export default SimpleVerticalWalls;
