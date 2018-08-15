import { range } from './util';
import { createGrid, updateGrid, printGrid } from './game';

// TEST
const testfn = () => {
    let grid = createGrid(10, 20);
    console.log('> start');
    printGrid(grid);

    for (let i of range(0, 5)) {
        grid = updateGrid(grid);
        console.log(`> step (${i})`);
        printGrid(grid);
    }
}
testfn()