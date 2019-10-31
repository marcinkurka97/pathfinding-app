import React from "react";

class RecursiveBacktracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dirs = [];
    this.gridH = 0;
    this.gridMap = [];
    this.gridW = 0;
    this.h = 0;
    this.w = 0;
    this.map = [];
    this.modDir = {};
  }

  Maze(w, h, props) {
    console.log(w, h);

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

    // grid = props.grid;
    // grid = props.getInitialGrid();
    // props.updateGridState(grid);

    this.w = isNaN(w) || w < 5 || w > 999 ? 20 : w;
    this.h = isNaN(h) || h < 5 || h > 999 ? 20 : h;
    this.map = [];

    for (var mh = 0; mh < h; ++mh) {
      this.map[mh] = [];
      for (var mw = 0; mw < w; ++mw) {
        this.map[mh][mw] = { n: 0, s: 0, e: 0, w: 0, v: 0 };
      }
    }

    this.dirs = ["n", "s", "e", "w"];
    this.modDir = {
      n: { y: -1, x: 0, o: "s" },
      s: { y: 1, x: 0, o: "n" },
      e: { y: 0, x: -1, o: "w" },
      w: { y: 0, x: 1, o: "e" }
    };

    this.build(0, 0);
    console.log(this.gridMap);

    for (let i = 0; i < this.gridMap.length - 1; i++) {
      for (let j = 0; j < this.gridMap[i].length - 1; j++) {
        if (this.gridMap[i][j] === 0) {
          document.getElementById(`node-${i}-${j}`).className =
            "node node__wall";
        }
      }
    }
  }

  toGrid() {
    var grid = [];
    for (var mh = 0; mh < this.h * 2 + 1; ++mh) {
      grid[mh] = [];
      for (var mw = 0; mw < this.w * 2 + 1; ++mw) {
        grid[mh][mw] = 0;
      }
    }

    for (var y = 0; y < this.h; ++y) {
      var py = y * 2 + 1;

      for (var x = 0; x < this.w; ++x) {
        var px = x * 2 + 1;

        if (this.map[y][x].v === 1) {
          grid[py][px] = 1;
        }

        for (let d in this.dirs) {
          if (this.map[y][x][this.dirs[d]] === 1) {
            grid[py + this.modDir[this.dirs[d]].y][
              px + this.modDir[this.dirs[d]].x
            ] = 1;
          }
        }
      }
    }

    this.gridMap = grid;
    this.gridW = grid.length;
    this.gridH = grid[0].length;
  }

  build(x, y) {
    x = 0;
    y = 0;

    this.explore(x, y);
    this.toGrid();
  }

  explore(ex, ey) {
    this.dirs = this.sortRand(this.dirs);

    for (let d in this.dirs) {
      var nx = ex + this.modDir[this.dirs[d]].x;
      var ny = ey + this.modDir[this.dirs[d]].y;

      if (
        nx >= 0 &&
        nx < this.w &&
        ny >= 0 &&
        ny < this.h &&
        this.map[ny][nx].v === 0
      ) {
        this.map[ey][ex][this.dirs[d]] = 1;
        this.map[ey][ex].v = 1;
        this.map[ny][nx][this.modDir[this.dirs[d]].o] = 1;

        this.explore(nx, ny);
      }
    }
  }

  sortRand(a) {
    var out = [];
    var l = a.length;

    for (let x in a) {
      do {
        var p = Math.floor(Math.random() * (l * 1000)) % l;
      } while (typeof out[p] != "undefined");

      out[p] = a[x];
    }

    return out;
  }

  render() {
    const props = this.props;
    return (
      <button
        onClick={() =>
          this.Maze(props.grid[0].length / 2, props.grid.length / 2, props)
        }
      >
        Generate Maze -> Recursive Backtraciking
      </button>
    );
  }
}

export default RecursiveBacktracking;
