import React from 'react';
import { createGrid, updateGrid, getRowCount, getColCount } from './game';
import { isNull, range } from './util';


/**
 * React Components
 * ================
 */

// grid size
const ROW_CT = 50 // 35;
const COL_CT = 80 // 70;
// update time
const MIN_TICK = 0;
const MAX_TICK = 1000;
const DEFAULT_TICK = 200;

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [[]],
            tickSpeed: DEFAULT_TICK,
        };

        // async timer stuff
        this.tick = () => {
            const curTime = performance.now();
            const dt = curTime - this.prevTime;
            if (dt >= this.state.tickSpeed) {
                this.update();
                this.prevTime = curTime;
            }
            this.raf = requestAnimationFrame(this.tick);
        }
        this.prevTime = 0;
        this.raf = null;

        // DEBUG
        window.initGrid = this.initGrid.bind(this);
    }

    componentWillMount() {
        this.initGrid();
    }
    componentDidMount() {
        this.tick();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.raf);
        clearTimeout(this.initTimeout);
    }

    initGrid(rows = ROW_CT, cols = COL_CT) {
        this.setState({
            grid: createGrid(rows, cols)
        });
    }

    update() {
        const newGrid = updateGrid(this.state.grid);
        this.setState({ grid: newGrid });
    }

    handleClick(ri, ci) {
        const {grid} = this.state;
        const val = grid[ri][ci];
        console.log(`click evt: [${ri}, ${ci}] -> ${val}`)
    }

    render() {

        const {grid, tickSpeed} = this.state;

        return (
            <div className="game">
                <Board
                grid={ grid }
                handleClick={ (ri, ci)=> this.handleClick(ri, ci) }
                />
                <div className="game-info">
                    <div className="slider-container">
                        <div>{`tick speed: ${tickSpeed}`}</div>
                        <input type="range" className="slider"
                        min={MIN_TICK} max={MAX_TICK} value={tickSpeed} 
                        onChange={(e)=> {
                            const newSpeed = e.target.value;
                            this.setState({ tickSpeed: newSpeed});
                        }}
                        />
                    </div>
                    <div>
                        <button onClick={()=> this.initGrid()}>reset game</button>
                    </div>
                </div>
            </div>
        );
    }
}

class Board extends React.Component {

    renderSquare(data, ri, ci) {
        const { handleClick } = this.props;
        return (
            <Square
            key={ci}
            value={data} ri={ri} ci={ci}
            handleClick={ handleClick }
            />
        );
    }

    renderRow(row, ri) {
        return (
            <div className="board-row" key={ri}>
            {
                row.map( (cell, ci) => this.renderSquare(cell, ri, ci) )
            }
            </div>
        );
    }

    render() {
        const {grid} = this.props;
        return (
        <div className="game-board">
            { grid.map((row, i) => this.renderRow(row, i)) }
        </div>
        );
    }
}

const Square = (props) => {
    const { value, ri, ci, handleClick } = props;
    const className = `square ${value === true ? 'active' : ''}`;
    // const renderVal = (value === true ? 'X' : ' ');
    return (
        <div className={className} onClick={(evt) => handleClick(ri, ci)}>
        {/* { renderVal } */}
        </div>
    );
}
