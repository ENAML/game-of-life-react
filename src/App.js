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
const TILE_SIZE = 10; // 15;
// update time
const MIN_TICK = 0;
const MAX_TICK = 700;
const DEFAULT_TICK = 100;

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: [[]],
            rows: ROW_CT,
            cols: COL_CT,
            tileSize: TILE_SIZE,
            tickSpeed: DEFAULT_TICK,
            canUpdate: true,
        };

        // async timer stuff
        this.tick = () => {
            const curTime = performance.now();
            const dt = curTime - this.prevTime;
            if (this.state.canUpdate && dt >= this.state.tickSpeed) {
                this.update();
                this.prevTime = curTime;
            }
            this.raf = requestAnimationFrame(this.tick);
        }
        this.prevTime = 0;
        this.raf = null;

        // DEBUG
        console.log(`run 'window.initGrid(<rowCount>, <colCount>)' to change board size and restart`);
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

    initGrid(rows = this.state.rows, cols = this.state.cols) {
        this.setState({
            rows,
            cols,
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
        const {grid, tileSize, tickSpeed} = this.state;

        return (
            <div className="game">
                {/* UI STUFF */}
                <div className="game-info">
                    <div className="slider-container">
                        <div>{`tick speed: ${tickSpeed}`}</div>
                        <input type="range" className="slider"
                        min={MIN_TICK} max={MAX_TICK} value={tickSpeed} 
                        onChange={(e)=> {
                            const newSpeed = parseInt(e.target.value);
                            this.setState({ tickSpeed: newSpeed});
                        }}
                        />
                    </div>
                    <div className="slider-container">
                        <div>{`tile size: ${this.state.tileSize}`}</div>
                        <input type="range" className="slider"
                        min={5} max={20} value={tileSize} 
                        onChange={(e)=> {
                            const newSize = parseInt(e.target.value);
                            this.setState({ tileSize: newSize });
                        }}
                        />
                    </div>
                    <div>
                        <button onClick={()=> this.initGrid()}>reset game</button>
                    </div>
                    <div>
                        <button onClick={()=> this.setState({canUpdate: !this.state.canUpdate})}>{this.state.canUpdate ? "pause" : "play"}</button>
                    </div>
                </div>

                {/* GAME BOARD */}
                <Board
                grid={ grid }
                tileSize={ tileSize }
                handleClick={ (ri, ci)=> this.handleClick(ri, ci) }
                />
            </div>
        );
    }
}

class Board extends React.Component {

    renderSquare(data, ri, ci) {
        const { tileSize, handleClick } = this.props;
        return (
            <Square
            key={ci}
            value={data} ri={ri} ci={ci} size={tileSize}
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
    const { value, ri, ci, size, handleClick } = props;
    const className = `square ${value === true ? 'active' : ''}`;
    const style = { width: size, height: size };

    return (
        <div
        className={className}
        style={style}
        onClick={(evt) => handleClick(ri, ci)}
        >
        {/* { renderVal } */}
        </div>
    );
}
