import React from "react";
import SingleNode from "./SingleNode";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../pathfindingAlgorithms/dijkstra";
import { cpus } from "os";

export default class PathfindingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { grid: [], mouseIsPressed: false };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp(row, col) {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node__visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node__shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[7][5];
    const finishNode = grid[7][29];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  generateMaze() {
    const grid = getInitialGrid();
    this.setState({ grid });

    let counter = 0;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (
          row === 0 ||
          col === 0 ||
          row === grid.length - 1 ||
          col === grid[row].length - 1
        ) {
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid });
        } else if (col % 2 === 0) {
          let newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid });
          if (counter < col / 2) {
            const num = Math.floor(Math.random() * (grid.length - 2)) + 1;
            const gap = grid[num][col];
            newGrid = getNewGridWithWallToggled(
              this.state.grid,
              gap.row,
              gap.col
            );
            this.setState({ grid: newGrid });
          }
          counter++;
        }
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.generateMaze()}>Generate Maze</button>
        <div className="table">
          {grid.map((row, rowIndex) => {
            return (
              <div className="table__row" key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const {
                    row,
                    col,
                    isStart,
                    isFinish,
                    isWall,
                    isVisited
                  } = node;
                  return (
                    <SingleNode
                      key={nodeIndex}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      isVisited={isVisited}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></SingleNode>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 15; row++) {
    const currentRow = [];
    for (let col = 0; col < 35; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    col,
    row,
    isStart: row === 7 && col === 5,
    isFinish: row === 7 && col === 29,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
