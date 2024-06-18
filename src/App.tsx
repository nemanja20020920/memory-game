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

const getInitialNumbers = (): TNumber[][] => [
  [
    { open: false, status: 'incorrect', value: 0 },
    { open: false, status: 'incorrect', value: 1 },
    { open: false, status: 'incorrect', value: 2 },
    { open: false, status: 'incorrect', value: 4 },
  ],
  [
    { open: false, status: 'incorrect', value: 1 },
    { open: false, status: 'incorrect', value: 6 },
    { open: false, status: 'incorrect', value: 6 },
    { open: false, status: 'incorrect', value: 7 },
  ],
  [
    { open: false, status: 'incorrect', value: 2 },
    { open: false, status: 'incorrect', value: 0 },
    { open: false, status: 'incorrect', value: 4 },
    { open: false, status: 'incorrect', value: 7 },
  ],
];

function App() {
  //State
  const [numbers, setNumbers] = useState<TNumber[][]>(getInitialNumbers);
  const [clickedNumber, setClickedNumber] = useState<TClickedNumber | null>(
    null
  );
  //Boolean value which checks if the game is solved
  const solved: boolean = useMemo(() => {
    let flag = true;
    numbers.forEach((row) =>
      row.forEach((num) => {
        if (num.status !== 'correct') flag = false;
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
    setNumbers(getInitialNumbers);
  };

  return (
    <>
      <div className="wrapper">
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
