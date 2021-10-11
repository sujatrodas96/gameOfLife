var rows = 40;
var columns = 80;

var watching = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 100;

function intGrids() 
{
    for (var i = 0; i < rows; i++) 
    {
        grid[i] = new Array(columns);
        nextGrid[i] = new Array(columns);
    }
}

function rstGrids() 
{
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < columns; j++) 
        {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function cndrstGrid() 
{
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < columns; j++) 
        {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}


function intialize() 
{
    Table();
    intGrids();
    rstGrids();
    CntrlBttns();
}


function Table() 
{
    var Container = document.getElementById('Container');
    if (!Container) {
       
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) 
    {
        var tr = document.createElement("tr");
        for (var j = 0; j < columns; j++) 
        {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellsHndler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    Container.appendChild(table);
}

    function cellsHndler() 
    {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) 
          {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
          }   else 
        {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
        }
        
    }

    function updte() 
    {
        for (var i = 0; i < rows; i++) 
        {
            for (var j = 0; j < columns; j++) 
            {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) 
                  {
                     cell.setAttribute("class", "dead");
                  }  else 
                {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }

function CntrlBttns() 
{
    
    var startButton = document.getElementById('start');
    startButton.onclick = strtBttn;
    
   
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clrBttnHndlr;
    
    
    var randomButton = document.getElementById("random");
    randomButton.onclick = rndmBttnHndlr;
}

function rndmBttnHndlr() 
{
    if (watching) return;
    clrBttnHndlr();
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < columns; j++) 
        {
            var isLive = Math.round(Math.random());
            if (isLive == 1) 
            {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}


function clrBttnHndlr() 
{
    console.log("Clear the game: stop watching, clear the grid");
    
    watching = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("live");
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) 
    {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    rstGrids;
}


function strtBttn() 
{
    if (watching) 
    {
        console.log("Pause the game");
        watching = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else 
      {
        console.log("Continue the game");
        watching = true;
        this.innerHTML = "Pause";
        play();
      }
}


function play() 
{
    NxtGen();
    
    if (watching) 
    {
        timer = setTimeout(play, reproductionTime);
    }
}

function NxtGen() 
{
    for (var i = 0; i < rows; i++) 
    {
        for (var j = 0; j < columns; j++) 
        {
            Rules(i, j);
        }
    }
    
   
    cndrstGrid();
   
    updte();
}


function Rules(row, col) 
{
    var numberneighbors = Neighbrs(row, col);
    if (grid[row][col] == 1) 
    {
        if (numberneighbors < 2) 
        {
            nextGrid[row][col] = 0;
        } else if (numberneighbors == 2 || numberneighbors == 3) 
        {
            nextGrid[row][col] = 1;
        } else if (numberneighbors > 3) 
        {
            nextGrid[row][col] = 0;
        }
    } 
    else if (grid[row][col] == 0) 
       {
            if (numberneighbors == 3) 
            {
                nextGrid[row][col] = 1;
            }
        }
}
    
function Neighbrs(row, col) 
{
    var count = 0;
    if (row-1 >= 0) 
    {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) 
    {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < columns) 
    {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) 
    {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < columns) 
    {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) 
    {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) 
    {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < columns) 
    {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}


window.onload = intialize;