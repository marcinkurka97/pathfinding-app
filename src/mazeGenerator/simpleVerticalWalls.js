import React from "react";

let grid;
let animateGridArr = [];
let gapArr = [];
let differenceArr;

class SimpleVerticalWalls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  verticalWalls(props) {
    document.querySelectorAll(".node").forEach(el => {
      if (el.className !== "node node__wall") {
        el.className = "node ";
      }
      if (el.id === `node-${props.startNode[0]}-${props.startNode[1]}`) {
        el.className = "node node__start";
      }
      if (el.id === `node-${props.finishNode[0]}-${props.finishNode[1]}`) {
        el.className = "node node__finish";
      }
    });

    grid = props.grid;
    grid = props.getInitialGrid();
    props.updateGridState(grid);

    let counter = 0;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (
          row === 0 ||
          col === 0 ||
          row === grid.length - 1 ||
          col === grid[row].length - 1
        ) {
          animateGridArr.push(grid[row][col]);
        } else if (col % 2 === 0) {
          animateGridArr.push(grid[row][col]);
          if (counter < col / 2) {
            const num = Math.floor(Math.random() * (grid.length - 2)) + 1;
            const gap = grid[num][col];
            gapArr.push(grid[gap.row][gap.col]);
          }
          counter++;
        }
      }
    }

    differenceArr = animateGridArr.filter(x => !gapArr.includes(x));

    this.animateWalls();
  }

  async animateWalls() {
    for (let i = 0; i < differenceArr.length; i++) {
      await this.task(differenceArr, i);
      differenceArr[i].isWall = true;
    }
  }

  async task(animateGrid, i) {
    await this.timer(1);
    const node = animateGrid[i];
    document.getElementById(`node-${node.row}-${node.col}`).className =
      "node node__wall";
  }

  timer(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  render() {
    const props = this.props;
    return (
      <button onClick={() => this.verticalWalls(props)}>
        Generate Maze -> Horizontal Walls
      </button>
    );
  }
}

export default SimpleVerticalWalls;
