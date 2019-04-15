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

setTableParameter = (x, y) => {
    _tableSize = [x];
    for (let px = 0; px < x; px++) {
        _tableSize[px] = new Array();
        for (let py = 0; py < y; py++) {
            _tableSize[px].push(0);
        }
    }
    newLife.setTable(_tableSize);
    createTable(_tableSize);
}

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

updateTable = () => {
    if (document.getElementsByTagName('table')) {
        let tb = document.getElementsByTagName('table')[0];
        for (let i = 0; i < tb.childElementCount; i++) {
            for (let x = 0; x < tb.childNodes[i].childElementCount; x++) {
                //if (tb.childNodes[i].childNodes[x].textContent != _tableClone[i][x]) {
                if (tb.childNodes[i].childNodes[x].classList.contains('alive')) {
                    newLife.updateValue(i, x, 1);
                }
            }
        }
    }
}

updateDom = (table) => {
    if (document.getElementsByTagName('table')) {
        let tb = document.getElementsByTagName('table')[0];
        //if (tb.childElementCount == table.length) {
        for (let i = 0; i < tb.childElementCount; i++) {
            for (let x = 0; x < tb.childNodes[i].childElementCount; x++) {
                if ((tb.childNodes[i].childNodes[x].classList.contains('alive') && table[i][x] == 0) ||
                    (!tb.childNodes[i].childNodes[x].classList.contains('alive') && table[i][x] == 1)) {
                    tb.childNodes[i].childNodes[x].classList.toggle('alive');
                }
            }
        }
        // } else {
        //   createTable(table);
        //}
    }
}

// Check nearby boxes and return 1 if the box (posX, posY) must be alive in the other case return 0
moveLife = (table, posX, posY) => {
    let alive = false;
    let neighbor = 0;
    if (table[posX][posY] === 1) {
        alive = true;
    }
    // check nearby boxes if they are alive
    for (let x = posX - 1; x <= posX + 1; x++) {
        if (x >= 0 && x < table[posX].length) {
            for (let y = posY - 1; y <= posY + 1; y++) {
                if (y >= 0 && y < table[posY].length) {
                    // check if the loop are looking the same box and not the neighbor
                    if (x != posX || y != posY) {
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


const _domContainer = document.getElementById('container');
const speed = document.getElementById('speed');

speed.oninput = ()=> {
    stopLife();
    startLife();
}

let _tableSize = [];
let newLife = new Life(_tableSize);
let interval;

checkEveryElementOnTable = () => {
    let tb = newLife.getTable().slice().map(function (row) { return row.slice(); })
    for (let x = 0; x < tb.length; x++) {
        for (let y = 0; y < tb[x].length; y++) {
            let result = moveLife(tb, x, y);
            newLife.updateValue(x, y, result);
        }
    }
}

core = () => {
    checkEveryElementOnTable();
    updateDom(newLife.getTable());
}

startLife = () => {
    if (_tableSize.length > 0) {
        updateTable();
        interval = setInterval(core, speed.value);
    } else {
        console.log('Please, create a table first!');
    }

}

stopLife = () => {
    clearInterval(interval);
};