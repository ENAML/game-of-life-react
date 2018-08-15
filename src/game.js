import { isNull, range } from './util';

/**
 * Logic
 * =====
 */

export const createGrid = (rows, cols) => {
    const grid = [];
    for (let r of range(0, rows)) {
        const row = [];
        for (let c of range(0, cols)) {
            const val = Math.random() > 0.70 ? true : false;
            row.push(val);
        }
        grid.push(row);
    }
    return grid;
}

export const getRowCount = (grid) => grid.length;
export const getColCount = (grid) => (grid.length > 0 ? grid[0].length : 0);

export const updateGrid = (grid) => {
    const newGrid = cloneGrid(grid);
    const rows = getRowCount(grid);
    const cols = getColCount(grid);
    for (let ri of range(0, rows)) {
        for (let ci of range(0, cols)) {
            // console.log(`${ri}, ${ci}`)
            newGrid[ri][ci] = getNextState(
                grid[ri][ci],
                getActiveNeighbors(grid, ri, ci),
            );
        }
    }
    return newGrid;
}

export const printGrid = (grid) => {
    grid = grid.map(
        (row, ri) => row.map(
            (val, ci) => (val === true ? 'X' : ' ')
        )
    );
    console.table(grid);
}

// const isGridValid = (grid) => Array.isArray(grid) && grid.length > 0 && grid[0].length > 0;

const cloneGrid = (grid) => {
    return grid.map((row, i) => {
        return row.slice();
    })
}

const isCoordValid = (grid, ri, ci) => {
    return (ri >= 0 && ri < getRowCount(grid)) && (ci >= 0 && ci < getColCount(grid))
};

const getActiveNeighbors = (grid, ri, ci) => {
    const rows = getRowCount(grid);
    const cols = getColCount(grid);
    let count = 0;

    for (let rCur of range(ri - 1, ri + 2)) {
        for (let cCur of range(ci - 1, ci + 2)) {
            if (rCur === ri && cCur === ci)
                continue;

            // if (isCoordValid(grid, rCur, cCur)) {
                // wrap around borders
                const r = (rCur < 0 ? rCur + rows : rCur) % rows;
                const c = (cCur < 0 ? cCur + cols : cCur) % cols;
                if (grid[r][c] === true) count++;
            // }
        }
    }
    // console.log(count);
    return count;
}

const getNextState = (wasAlive, activeNeighbors) => {
    let isAlive = null;
    if (wasAlive) {
        if (activeNeighbors <= 1) isAlive = false;
        else if (activeNeighbors <= 3) isAlive = true;
        else isAlive = false;
    }
    else {
        if (activeNeighbors === 3) isAlive = true;
        else isAlive = false;
    }
    return isAlive;
}

