const fetchUrl = async (url) => {
    const data = await fetch(url);
    const html = await data.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.querySelectorAll('tr');
}

const extractRaw = (tableRows) => {
    let rawData = [];
    for(let n = 1; n < tableRows.length; n++){
        let location = {};
        location.x = parseInt(tableRows[n].children[0].innerText);
        location.y = parseInt(tableRows[n].children[2].innerText);
        location.symb = tableRows[n].children[1].innerText;
        rawData.push(location);
    }
    return rawData;
}

const findMax = (rawData) => {
    let xMax = 0;
    let yMax = 0;
    for(item of rawData){
        if(item.x > xMax){
            xMax = item.x;
        };
        if(item.y > yMax){
            yMax = item.y;
        }
    }
    return {xMax, yMax};
}

const buildGrid = (rawData, max) => {
    let grid = [];
    for(let y = 0; y < (max.yMax + 1); y++){
        let arr = [];
        for(let x = 0; x < (max.xMax + 1); x++){
            let obj = ' ';
            arr.push(obj);
        }
        grid.push(arr);
    }
    for(let row of rawData){
        let symbol = row.symb;
        grid[row.y][row.x] = symbol;
    }
    return grid;
}

const printGrid = (grid) => {
    for(let y = (grid.length - 1); y >= 0; y--){
        let output = '';
        for(const symbol of grid[y]){
            output += symbol;
        };
        console.log(output);
    }
}

const solution = async (url) => {
    const tableRows = await fetchUrl(url);
    const rawData = extractRaw(tableRows);
    let max = findMax(rawData);
    const grid = buildGrid(rawData, max);
    printGrid(grid);
}

//Practice Data
// solution("https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub");

//Test Data
solution("https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub");