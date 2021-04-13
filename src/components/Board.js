import React, { useEffect, useState } from "react";

export default function Board({ GridSize }) {
  let initGrid = [...Array(GridSize)].map(() => [...Array(GridSize)].fill(0));
  let [grid, setGrid] = useState(initGrid);
  let [score, setScore] = useState(0);
  let [gameOver, setGameOver] = useState(false);
  //   grid[1][2] = 2;
  //   grid[3][4] = 4;
  const addNewNumber = (copiedGrid) => {
    let freeSpcaes = [];
    for (let i = 0; i < GridSize; i++) {
      for (let j = 0; j < GridSize; j++) {
        if (grid[i][j] == 0) {
          freeSpcaes.push({
            row: i,
            col: j,
          });
        }
      }
    }
    if (freeSpcaes.length === 0) {
      setGameOver(true);
      return;
    }
    let randomFreeSpace = Math.floor(Math.random() * freeSpcaes.length);
    copiedGrid[freeSpcaes[randomFreeSpace].row][
      freeSpcaes[randomFreeSpace].col
    ] = Math.random() > 0.49 ? 4 : 2;
    setGrid(copiedGrid);
  };
  const topShift = () => {
    let gridCopy = transpose(grid);
    gridCopy = gridCopy.map((row) => {
      let rowCopy = shiftAll("left", row);
      mergeLeft(rowCopy);
      return shiftAll("left", rowCopy);
    });
    addNewNumber(transpose(gridCopy));
  };
  const bottomShift = () => {
    let gridCopy = transpose(grid);
    gridCopy = gridCopy.map((row) => {
      let rowCopy = shiftAll("right", row);
      mergeRight(rowCopy);
      return shiftAll("right", rowCopy);
    });
    addNewNumber(transpose(gridCopy));
  };
  const leftShift = () => {
    let gridCopy = [...grid];
    gridCopy = gridCopy.map((row) => {
      let rowCopy = shiftAll("left", row);
      mergeLeft(rowCopy);
      return shiftAll("left", rowCopy);
    });
    addNewNumber(gridCopy);
  };
  const rightShift = () => {
    let gridCopy = [...grid];
    gridCopy = gridCopy.map((row) => {
      let rowCopy = shiftAll("right", row);
      mergeRight(rowCopy);
      return shiftAll("right", rowCopy);
    });
    addNewNumber(gridCopy);
  };
  const shiftAll = (direction, row) => {
    let arr = row.filter((val) => val);
    let zeroCount = GridSize - arr.length;
    let zero = Array(zeroCount).fill(0);
    if (direction === "right") {
      arr = zero.concat(arr);
    } else {
      arr = arr.concat(zero);
    }
    return arr;
  };
  const mergeRight = (row) => {
    let netScore = 0;
    for (let i = GridSize - 1; i > 0; i--) {
      let a = row[i];
      let b = row[i - 1];
      if (a === b) {
        row[i] = a + b;
        netScore += row[i];
        row[i - 1] = 0;
      }
    }
    setScore(score + netScore);
  };
  const mergeLeft = (row) => {
    let netScore = 0;
    for (let i = 0; i < GridSize - 1; i++) {
      let a = row[i];
      let b = row[i + 1];
      if (a === b) {
        row[i] = a + b;
        netScore += row[i];
        row[i + 1] = 0;
      }
    }
    setScore(score + netScore);
  };
  const transpose = (array) => {
    return array.map((_, colIndex) => array.map((row) => row[colIndex]));
  };
  const handleKeyDownEvent = (event) => {
    event.preventDefault();
    if (gameOver) {
      return;
    }
    switch (event.keyCode) {
      case 37:
        leftShift();
        break;
      case 38:
        topShift();
        break;
      case 39:
        rightShift();
        break;
      case 40:
        bottomShift();
        break;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [grid]);
  return (
    <>
      <h1>
        Score:- <span>{score}</span>
      </h1>
      <div className="board">
        {grid.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((val, colIndex) => (
              <div
                className={`board-box ${val && "board-box-high"}`}
                key={colIndex}
              >
                {val !== 0 && val}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
