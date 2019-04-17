
/**
 *
 *
 * @class Life
 */
class Life {
    constructor(table) {
        this.table = table.slice().map(function (row) { return row.slice(); })
    };

    getTable() {
        return this.table;
    };

    setTable(table) {
        this.table = table.slice().map(function (row) { return row.slice(); })
    };

    updateValue(x, y, value) {
        if (this.table[x][y] != value) {
            this.table[x][y] = value;
        }
    }


}


/**
 *build an array width columns any rows
 *
 * @param {number} rows
 * @param {number} col
 */
setTableParameter = (rows, col) => {
    _tableSize = [rows];
    for (let x = 0; x < rows; x++) {
        _tableSize[x] = new Array();
        for (let y = 0; y < col; y++) {
            _tableSize[x].push(0);
        }
    }
    newLife.setTable(_tableSize);
    createTable(_tableSize);
}

/**
 *get an array and build a table in the Dom
 *
 * @param {Array} table
 */
createTable = (table) => {
    if (_domContainer.childNodes[0]) {
        _domContainer.removeChild(_domContainer.childNodes[0]);
    }

    let tableElement = document.createElement('table');
    for (let i = 0; i < table.length; i++) {
        let col = document.createElement('tr');
        for (let x = 0; x < table[i].length; x++) {
            let rowElement = document.createElement('td');

            rowElement.addEventListener('click', function() {
                stopLife();
                rowElement.classList.toggle('alive');
            });

            if (table[i][x] === 1) rowElement.classList.add('alive');
            col.appendChild(rowElement);
        }
        tableElement.appendChild(col);
    }

    _domContainer.appendChild(tableElement);
}

/**
 * sync DOM table --> Array
 *
 */
updateTable = () => {
    if (document.getElementsByTagName('table')) {
        let tb = document.getElementsByTagName('table')[0];
        for (let i = 0; i < tb.childElementCount; i++) {
            for (let x = 0; x < tb.childNodes[i].childElementCount; x++) {
                if (tb.childNodes[i].childNodes[x].classList.contains('alive')) {
                    newLife.updateValue(i, x, 1);
                }
            }
        }
    }
}

/**
 *sync Array --> DOM table
 *
 * @param {Array} table
 */
updateDom = (table) => {
    if (document.getElementsByTagName('table')) {
        let tb = document.getElementsByTagName('table')[0];
        for (let i = 0; i < tb.childElementCount; i++) {
            for (let x = 0; x < tb.childNodes[i].childElementCount; x++) {
                if ((tb.childNodes[i].childNodes[x].classList.contains('alive') && table[i][x] == 0) ||
                    (!tb.childNodes[i].childNodes[x].classList.contains('alive') && table[i][x] == 1)) {
                    tb.childNodes[i].childNodes[x].classList.toggle('alive');
                }
            }
        }
    }
}

/**
 * Check nearby boxes and return 1 if the box (rows, columns) must be alive in the other case return 0
 *
 * @param {Array} table whole table
 * @param {number} rows position to check nearby boxes
 * @param {number} columns position to check nearby boxes
 * @returns {number} 1 if the box must be alive, 0 if died
 */
moveLife = (table, rows, columns) => {
    let alive = false;
    let neighbor = 0;
    if (table[rows][columns] === 1) {
        alive = true;
    }
    // check nearby boxes if they are alive
    for (let x = rows - 1; x <= rows + 1; x++) {
        if (x >= 0 && x < table[rows].length) {
            for (let y = columns - 1; y <= columns + 1; y++) {
                if (y >= 0 && y < table[columns].length) {
                    // check if the loop are looking the same box and not the neighbor
                    if (x != rows || y != columns) {
                        if (table[x][y] === 1) {
                            neighbor++;
                        }
                    }
                }
            }
        }
    }

    if (alive) {
        if (neighbor < 2 || neighbor > 3) {
            return 0;
        } else {
            return 1;
        }
    } else if (neighbor === 3) {
        return 1;
    }
    return 0;
}


const _domContainer = document.getElementById('game-container');
const speed = document.getElementById('speed');

/**
 * it stop if the user changing the speed.
 *
 */
speed.oninput = ()=> {
    stopLife();
    startLife();
}

let _tableSize = [];
let newLife = new Life(_tableSize);
let interval;

/**
 * scan whole table and apply the rules (calling moveLife());
 *
 */
checkEveryElementOnTable = () => {
    let tb = newLife.getTable().slice().map(function (row) { return row.slice(); })
    for (let rows = 0; rows < tb.length; rows++) {
        for (let col = 0; col < tb[rows].length; col++) {
            let result = moveLife(tb, rows, col);
            newLife.updateValue(rows, col, result);
        }
    }
}
/**
 *function for the interval loop
 *it check every element and then update the DOM
 */
core = () => {
    checkEveryElementOnTable();
    updateDom(newLife.getTable());
}

/**
 * start the interval
*/
startLife = () => {
    if (_tableSize.length > 0) {
        updateTable();
        interval = setInterval(core, speed.value);
    } else {
        console.log('Please, create a table first!');
    }

}

/**
 * stop the interval
*/
stopLife = () => {
    clearInterval(interval);
};

// create a first table 10x10
setTableParameter(10,10);