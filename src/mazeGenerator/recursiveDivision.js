import React from "react";

let grid;
let animateGrid = [];
let gapsArr = [];

class RecursiveDivision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  generate(props) {
    animateGrid = [];
    props.clearBoard();
    grid = props.grid;
    grid = props.getInitialGrid();
    props.updateGridState(grid);

    this.addOuterWalls();
    this.addInnerWalls(true, 1, grid[0].length - 2, 1, grid.length - 2);
    this.display(props);
  }

  // Add border walls
  addOuterWalls() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (i === 0 || i === grid.length - 1) {
          animateGrid.push(grid[i][j]);
        } else if (j === 0 || j === grid[i].length - 1) {
          animateGrid.push(grid[i][j]);
        }
      }
    }
  }

  // Add inner walls
  addInnerWalls(h, minX, maxX, minY, maxY) {
    if (h) {
      if (maxX - minX < 2) {
        return;
      }

      const y = Math.floor(this.randomNumber(minY, maxY) / 2) * 2;
      this.addHWall(minX, maxX, y);

      // If !h will return in 'maxY - minY < 2' then use second call
      this.addInnerWalls(!h, minX, maxX, minY, y - 1);
      this.addInnerWalls(!h, minX, maxX, y + 1, maxY);
    } else {
      if (maxY - minY < 2) {
        return;
      }

      const x = Math.floor(this.randomNumber(minX, maxX) / 2) * 2;
      this.addVWall(minY, maxY, x);

      this.addInnerWalls(!h, minX, x - 1, minY, maxY);
      this.addInnerWalls(!h, x + 1, maxX, minY, maxY);
    }
  }

  // Adding horizontal walls
  addHWall(minX, maxX, y) {
    const gap = Math.floor(this.randomNumber(minX, maxX) / 2) * 2 + 1;
    gapsArr.push(grid[y][gap]);

    for (let i = minX; i <= maxX; i++) {
      if (i !== gap) {
        animateGrid.push(grid[y][i]);
      }
    }
  }

  // Adding vertical walls
  addVWall(minY, maxY, x) {
    const gap = Math.floor(this.randomNumber(minY, maxY) / 2) * 2 + 1;
    gapsArr.push(grid[gap][x]);

    for (let i = minY; i <= maxY; i++) {
      if (i !== gap) {
        animateGrid.push(grid[i][x]);
      }
    }
  }

  // Helper function generating random between min - max
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Animate walls
  async display(props) {
    props.setSerachingState(true);

    // const differenceArray = animateGrid.filter(x => !gapsArr.includes(x));

    for (let i = 0; i < animateGrid.length; i++) {
      await this.task(animateGrid, i);
      animateGrid[i].isWall = true;
    }

    gapsArr.map(el => {
      return (el.isWall = false);
      // document.getElementById(`node-${el.row}-${el.col}`).className = "node ";
    });

    props.setSerachingState(false);
  }

  // Async fn delaying animation
  async task(animateGrid, i) {
    await this.timer(5);
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
      <button disabled={props.disabled} onClick={() => this.generate(props)}>
        Revursive Division
      </button>
    );
  }
}

export default RecursiveDivision;
