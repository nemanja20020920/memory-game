import { useMemo, useState } from 'react';
import './App.css';

type TNumber = {
  open: boolean;
  status: 'correct' | 'incorrect' | 'neutral';
  value: number;
};

type TClickedNumber = {
  rowIndex: number;
  cellIndex: number;
  value: number;
};

//Shuffle function which shuffles a two dimensional array (matrix)
const shuffle = (matrix: TNumber[][]): TNumber[][] => {
  let currentRowIndex = matrix.length;
  let currentCellIndex = matrix[0].length;

  while (currentRowIndex !== 0) {
    currentRowIndex--;

    while (currentCellIndex !== 0) {
      const randomCell = Math.floor(Math.random() * currentCellIndex);
      const randomRow = Math.floor(Math.random() * currentRowIndex);
      currentCellIndex--;

      const temp = matrix[currentRowIndex][currentCellIndex];
      matrix[currentRowIndex][currentCellIndex] = matrix[randomRow][randomCell];
      matrix[randomRow][randomCell] = temp;
    }
  }

  return matrix;
};

//Function which returns a random shuffled two dimensional array of TNumber
const getRandomNumbers = (): TNumber[][] => {
  const numbers: TNumber[][] = [
    [
      { open: false, status: 'neutral', value: 0 },
      { open: false, status: 'neutral', value: 1 },
      { open: false, status: 'neutral', value: 2 },
      { open: false, status: 'neutral', value: 4 },
    ],
    [
      { open: false, status: 'neutral', value: 1 },
      { open: false, status: 'neutral', value: 6 },
      { open: false, status: 'neutral', value: 6 },
      { open: false, status: 'neutral', value: 7 },
    ],
    [
      { open: false, status: 'neutral', value: 2 },
      { open: false, status: 'neutral', value: 0 },
      { open: false, status: 'neutral', value: 4 },
      { open: false, status: 'neutral', value: 7 },
    ],
  ];

  for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
    for (let cellIndex = 0; cellIndex < 4; cellIndex += 2) {
      numbers[rowIndex][cellIndex] = numbers[rowIndex][cellIndex + 1] = {
        open: false,
        status: 'neutral',
        value: parseInt((Math.random() * 9).toFixed(2)),
      };
    }
  }

  return shuffle(numbers);
};

function App() {
  //State
  const [numbers, setNumbers] = useState<TNumber[][]>(getRandomNumbers);
  const [clickedNumber, setClickedNumber] = useState<TClickedNumber | null>(
    null
  );
  //Boolean value which checks if the game is solved
  const solved: boolean = useMemo(() => {
    let flag = true;

    numbers.forEach((row) =>
      row.forEach((num) => {
        if (num.status !== 'correct') {
          flag = false;
          return flag;
        }
      })
    );

    return flag;
  }, [numbers]);

  //Functions
  const clickHandler = (
    number: TNumber,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (number.open) return;

    setNumbers((prev) => {
      prev.forEach((col) =>
        col.forEach((num) => {
          if (num.status === 'incorrect') {
            (num.status = 'neutral'), (num.open = false);
          }
        })
      );

      const newNumber: TNumber = { ...number, open: true };
      const newNumbers: TNumber[][] = [...prev];
      newNumbers[rowIndex][cellIndex] = newNumber;

      return [...newNumbers];
    });

    let newClickedNumber: TClickedNumber | null = null;

    if (clickedNumber !== null) {
      const status =
        clickedNumber.value === number.value ? 'correct' : 'incorrect';

      setNumbers((prev) => {
        const newNumbers: TNumber[][] = prev;
        newNumbers[rowIndex][cellIndex] = {
          open: true,
          status,
          value: number.value,
        };

        newNumbers[clickedNumber.rowIndex][clickedNumber.cellIndex] = {
          open: true,
          status,
          value: clickedNumber.value,
        };

        return [...newNumbers];
      });
    } else {
      newClickedNumber = {
        rowIndex,
        cellIndex,
        value: number.value,
      };
    }

    setClickedNumber(newClickedNumber);
  };

  const resetHandler = () => {
    setNumbers(getRandomNumbers);
  };

  return (
    <>
      <div className="wrapper">
        <h1>Memory game</h1>
        <p>
          Click on the field to reveal a number. If you pair the same numbers
          you progress, if you don&apos;t you keep trying. The game ends when
          you get all the correct pairs.
        </p>
        <div className="grid">
          {numbers.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex} ${cellIndex}`}
                className="cell"
                onClick={() => clickHandler(cell, rowIndex, cellIndex)}
              >
                {cell.open ? cell.value : '?'}
              </div>
            ))
          )}
        </div>

        {solved && <button onClick={resetHandler}>Play Again</button>}
      </div>
    </>
  );
}

export default App;
