import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";

function App() {
  const defaultShipState = [
    {
      type: 'Carrier',
      asset: 'carrier.png',
      position: [
        {x: 2, y: 9, isHit: false},
        {x: 3, y: 9, isHit: false},
        {x: 4, y: 9, isHit: false},
        {x: 5, y: 9, isHit: false},
        {x: 6, y: 9, isHit: false},
      ]
    },
    {
      type: 'Battleship',
      asset: 'battleship.png',
      position: [
        {x: 5, y: 2, isHit: false},
        {x: 5, y: 3, isHit: false},
        {x: 5, y: 4, isHit: false},
        {x: 5, y: 5, isHit: false},
      ],
    },
    {
      type: 'Cruiser',
      asset: 'cruiser.png',
      position: [
        {x: 8, y: 1, isHit: false},
        {x: 8, y: 2, isHit: false},
        {x: 8, y: 3, isHit: false},
      ],
    },
    {
      type: 'Submarine',
      asset: 'submarine.png',
      position: [
        {x: 3, y: 0, isHit: false},
        {x: 3, y: 1, isHit: false},
        {x: 3, y: 2, isHit: false},
      ],
    },
    {
      type: 'Destroyer',
      asset: 'destroyer.png',
      position: [
        {x: 0, y: 0, isHit: false},
        {x: 1, y: 0, isHit: false},
      ],
    }
  ]

  const [player, setPlayer] = useState({
    name: 'player 1',
    score: 0,
  });
  const [board, setBoard] = useState([]);
  const [ships, setShips] = useState([])

  useEffect(() => {
    resetBoard()
    resetShips()
  }, [])

  useEffect(() => {
    if (isWin()) {
      alert('You win!');
      setPlayer({...player, score: player.score + 1})
      resetBoard();
      resetShips();
    }

  }, [ships])

  const hit = (tile) => {
    return () => {
      if (tile.isHit || tile.isMiss) return;

      const updatedBoard = board.map((row) => {
        return row.map((t) => {
          if (t.x === tile.x && t.y === tile.y) {
            if (isHit(t)) {
              return {...t, isHit: true};
            } else {
              return {...t, isMiss: true};
            }
          }
          return t;
        })
      })
      setBoard(updatedBoard);

      const updatedShips = ships.map((ship) => {
        return {
          ...ship,
          position: ship.position.map((position) => {
            if (position.x === tile.x && position.y === tile.y) {
              return {...position, isHit: true}
            }
            return position;
          })
        }
      })
      setShips(updatedShips);
    }
  }

  const resetBoard = () => {
    const board = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push({x: i, y: j, isHit: false, isMiss: false});
      }
      board.push(row);
    }
    setBoard(board);
  }

  const resetShips = () => {
    setShips(defaultShipState)
  }

  const isHit = (tile) => {
    let isHit = false;

    ships.map((ship) => {
      ship.position.map((position) => {
        if (position.x === tile.x && position.y === tile.y) {
          isHit = true;
        }
      })
    })

    return isHit
  }

  const isWin = () => {
    let isWin = true;
    if (ships.length === 0) return false;

    ships.map((ship) => {
      ship.position.map((position) => {
        if (!position.isHit) {
          isWin = false;
        }
      })
    })

    return isWin;
  }

  return (<>
    <div className={'bg-indigo-400 h-[60px] w-full mb-4'}></div>

    <div className={'flex w-[85%] max-w-[1600px] mx-auto'}>
      <div id="left" className={'flex-initial w-96'}>
        <div className={'flex w-full border border-gray-300'}>
          <div className={'flex flex-col flex-1 p-8 bg-amber-500 text-gray-700'}>
            <div className={'font-bold text-4xl text-center py-12 mb-8 border-b border-b-gray-950'}>
              {player.score}
            </div>
            <div className={'font-bold text-2xl text-center'}>
              {player.name}
            </div>
          </div>
          <div className={'flex flex-col flex-1 p-8 bg-teal-500 text-gray-700'}>
            <div className={'font-bold text-4xl text-center py-12 mb-8 border-b border-b-gray-950'}>
              00
            </div>
            <div className={'font-bold text-2xl text-center'}>
              player 2
            </div>
          </div>
        </div>

        <div className={'flex flex-col mt-8'}>
          {ships.map((ship) => (
            <div className={'flex flex-1 mt-2'}>
              <div>
                <img src={`/assets/${ship.asset}`} alt={ship.type} className={'h-12'} />
              </div>
              <div className={'flex justify-start items-center pl-6'}>
                {ship.position.map((position) => (
                  position.isHit && <img src={'/assets/hit-small.png'} className={'ship-status w-6 h-6'} />
                ))}
                {ship.position.map((position) => (
                  !position.isHit && <img src={'/assets/miss-small.png'} className={'ship-status w-6 h-6'} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="board" className={'flex flex-col flex-1 ms-4 h-[80dvh] border border-4 border-amber-400'}>
        {board.map((row) => (
          <div className={'flex flex-1 w-full h-full'}>
            {row.map((tile) => (
              <div
                onClick={hit(tile)}
                className={'flex flex-1 h-full justify-center items-center w-2.5 h-2.5 border-b border-r'}
              >
                {tile.isHit
                  ? <img src={'/assets/hit.png'} className={'w-6 h-6'} />
                  : tile.isMiss
                  ? <img src={'/assets/miss.png'} className={'w-6 h-6'} />
                  : '' }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div id={'debug'} className={'hidden'}>
      {JSON.stringify(board)}
    </div>
  </>);
}

export default App;
