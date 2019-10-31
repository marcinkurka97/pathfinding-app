import React from "react";
import SingleNode from "./SingleNode";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../pathfindingAlgorithms/dijkstra";
import RecursiveBacktracking from "../mazeGenerator/recursiveBacktracking";
import RecursiveDivision from "../mazeGenerator/recursiveDivision";
import SimpleVerticalWalls from "../mazeGenerator/simpleVerticalWalls";

const TABLE_WIDTH = 85;
const TABLE_HEIGHT = 37;
const NODE_START = [1, 1];
const NODE_FINISH = [TABLE_HEIGHT - 2, TABLE_WIDTH - 2];

export default class PathfindingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: [NODE_START[0], NODE_START[1]],
      finishNode: [NODE_FINISH[0], NODE_FINISH[1]]
    };
  }

  // #region Helper Functions

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (
      !this.state.grid[row][col].isStart &&
      !this.state.grid[row][col].isFinish
    ) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  setStartNode(row, col) {
    this.setState({ startNode: [row, col] });
  }

  setFinishNode(row, col) {
    this.setState({ finishNode: [row, col] });
  }

  toggleWalls(grid, row, col) {
    if (!grid[row][col].isWall) {
      grid[row][col].isWall = true;
    } else {
      grid[row][col].isWall = false;
    }
  }

  updateGridState = newGrid => {
    this.setState({ grid: newGrid });
  };

  // #endregion

  // #region Dijkstra pathfinding algorithm

  visualizeDijkstra() {
    document.querySelectorAll(".node").forEach(el => {
      if (el.className !== "node node__wall") {
        el.className = "node ";
      }
      if (
        el.id === `node-${this.state.startNode[0]}-${this.state.startNode[1]}`
      ) {
        el.className = "node node__start";
      }
      if (
        el.id === `node-${this.state.finishNode[0]}-${this.state.finishNode[1]}`
      ) {
        el.className = "node node__finish";
      }
    });

    const { grid } = this.state;
    const startNode = grid[this.state.startNode[0]][this.state.startNode[1]];
    const finishNode = grid[this.state.finishNode[0]][this.state.finishNode[1]];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
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
      }, 10 * i);
    }
  }

  // #endregion

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <div className="config-buttons">
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <SimpleVerticalWalls
            grid={grid}
            getInitialGrid={getInitialGrid}
            updateGridState={this.updateGridState}
            startNode={this.state.startNode}
            finishNode={this.state.finishNode}
          />
          <RecursiveDivision
            grid={grid}
            getInitialGrid={getInitialGrid}
            updateGridState={this.updateGridState}
            startNode={this.state.startNode}
            finishNode={this.state.finishNode}
          />
          <RecursiveBacktracking
            grid={grid}
            getInitialGrid={getInitialGrid}
            updateGridState={this.updateGridState}
            startNode={this.state.startNode}
            finishNode={this.state.finishNode}
          />
        </div>
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
                      setStartNode={(row, col) => this.setStartNode(row, col)}
                      setFinishNode={(row, col) => this.setFinishNode(row, col)}
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
  for (let row = 0; row < TABLE_HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col < TABLE_WIDTH; col++) {
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
    isStart: row === NODE_START[0] && col === NODE_START[1],
    isFinish: row === NODE_FINISH[0] && col === NODE_FINISH[1],
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
