et cellSize: number = 25;
let gridWidth: number = 20;
let gridHeight: number = 20;
let aliveCellColor: string = 'yellow';
let deadCellColor: string = 'lightgray';

let getPixelString = (px: number): string => px + 'px';
let getRows = (): HTMLScriptElement[] => <HTMLScriptElement[]><any>document.getElementById('grid-container').getElementsByClassName('row');
let getRowAt = (rows: HTMLScriptElement[], y: number): HTMLScriptElement[] => <HTMLScriptElement[]><any>rows[y].getElementsByClassName('cell');

const enum CellState {
    Alive,
    Dead
}

class Grid {
    public constructor(public width: number, public height: number) {
        this.generateHTMLGrid()
    }

    private generateHTMLGrid() {
        for (let y = 0; y < gridHeight; ++y) {
            let row = document.createElement('div');
            row.className = 'row';

            row.style.width = getPixelString(cellSize * this.width);
            row.style.height = getPixelString(cellSize);

            for (let x = 0; x < this.width; ++x) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.onclick = () => this.toggleCell(cell);
                row.appendChild(cell);
            }

            document.getElementById('grid-container').appendChild(row);
        }
    }

    public step() {
        let newCellStates: CellState[][] = [];

        let rows = getRows();
        for (let y = 0; y < rows.length; ++y) {
            newCellStates[y] = [];
            let cells = getRowAt(rows, y);
            for (let x = 0; x < cells.length; ++x) {
                let neighbors = this.getNumberOfNeighbors(rows, x, y);
                if (this.isAlive(cells[x])) {
                    if (neighbors == 2 || neighbors == 3) newCellStates[y][x] = CellState.Alive;
                    else newCellStates[y][x] = CellState.Dead;
                }
                else if (neighbors == 3) newCellStates[y][x] = CellState.Alive;
            }
        }

        this.drawNewCellStates(newCellStates);
    }


    private drawNewCellStates(states: CellState[][]) {
        let rows = getRows();
        for (let y = 0; y < rows.length; ++y) {
            let cells = getRowAt(rows, y);
            for (let x = 0; x < cells.length; ++x) {
                if (states[y][x] == CellState.Alive) cells[x].style.backgroundColor = aliveCellColor;
                else cells[x].style.backgroundColor = deadCellColor;
            }
        }
    }

    public clear() {
        let rows = getRows();
        for (let y = 0; y < rows.length; ++y) {
            let cells = getRowAt(rows, y);
            for (let x = 0; x < cells.length; ++x) {
                cells[x].style.backgroundColor = deadCellColor;
            }
        }
    }

    private getNumberOfNeighbors(rows: HTMLScriptElement[], x: number, y: number): number {
        let neighboursOfTopOrBottomRow = (row: HTMLScriptElement[]): number => {
            let neighbors = 0;
            if (x > 0 && this.isAlive(row[x - 1])) neighbors++;
            if (this.isAlive(row[x])) neighbors++;
            if (x < this.width - 1 && this.isAlive(row[x + 1])) neighbors++;
            return neighbors;
        }

        let neighbors = 0;

        if (y > 0) { // Has neighbours above.
            let row = getRowAt(rows, y - 1);
            neighbors += neighboursOfTopOrBottomRow(row);
        }

        if (y < this.height - 1) { // Has neighbours below.
            let row = getRowAt(rows, y + 1);
            neighbors += neighboursOfTopOrBottomRow(row);
        }

        let cells = getRowAt(rows, y);
        if (x > 0 && this.isAlive(cells[x - 1])) neighbors++;
        if (x < this.width - 1 && this.isAlive(cells[x + 1])) neighbors++;

        return neighbors;
    }

    private isAlive(cell: HTMLScriptElement): boolean {
        return cell.style.backgroundColor == aliveCellColor;
    }

    private toggleCell(cell: HTMLScriptElement | HTMLDivElement) {
        cell.style.backgroundColor = (cell.style.backgroundColor == aliveCellColor ? deadCellColor : aliveCellColor);
    }
}

window.onload = () => {
    let grid = new Grid(gridWidth, gridHeight);
    document.getElementById('step-button').onclick = () => grid.step();
    document.getElementById('clear-button').onclick = () => grid.clear();
};