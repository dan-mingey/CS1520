var p1name;
var p2name;

var P1AttackBoard;
var P1ShipsBoard;
var P2AttackBoard;
var P2ShipsBoard;

var spaceingP = document.createElement("p");
var nameHeader = document.createElement("h");
nameHeader.setAttribute("align", "center");

var P2AircraftCount = 5;
var P2SubCount = 3;
var P2BattleshipCount = 4;

var P1AircraftCount = 5;
var P1SubCount = 3;
var P1BattleshipCount = 4;

var Aship = false;
var Bship = false;
var Sship = false;

var P1Score = 0;
var P2Score = 0;

var GameOver = false;

var arr = [["", 0],["", 0],["", 0],["", 0],["", 0],["", 0],["", 0],["", 0],["", 0],["", 0]];
if(localStorage.getItem("Top10") == null)
{
	localStorage.setItem("Top10", JSON.stringify(arr));
}


function doNothing(){}

function insertHorizontalShip(Board,startIndex, finishIndex, rowNumber, shipType)
{
	for(var i = startIndex; i <= finishIndex; i++)
	{
		Board.children[rowNumber].children[i].innerHTML  = shipType;
	}

}

function insertVerticalShip(Board,startIndex, finishIndex, columnNumber, shipType)
{
	for(var i = startIndex; i <= finishIndex; i++ )
	{
		Board.children[i].children[columnNumber].innerHTML = shipType;
	}
}
 

// function to take the start cell and end cell of a ship, and assign the ships to the board
function assignShipsToBoard(Board,start, finish, shipType)
{
	if(start.charAt(1) == finish.charAt(1))
	{
		// this means that the ship is placed horizontally
		startIndex = start.charCodeAt(0) - 64 ;
		finishIndex = finish.charCodeAt(0) - 64 ;
		rowNumber = start.charAt(1);
		insertHorizontalShip(Board,startIndex, finishIndex, rowNumber, shipType);
	}
	else
	{
		// this means that the ship was placed vertically
		startIndex = start.charAt(1);
		finishIndex = finish.charAt(1);
		columnNumber = start.charCodeAt(0) - 64;
		insertVerticalShip(Board,startIndex, finishIndex, columnNumber, shipType);
	}
}


function createShips(Board,locations)
{	
	var locationStart = String(locations[0][2]+locations[0][3]);
	var locationFinish = String(locations [0][5]+locations[0][6]);
	var shipType = String(locations[0][0]);
	assignShipsToBoard(Board,locationStart, locationFinish, shipType);

	locationStart = String(locations[1][2]+locations[1][3]);
	locationFinish = String(locations [1][5]+locations[1][6]);
	shipType = String(locations[1][0]);
	assignShipsToBoard(Board,locationStart, locationFinish, shipType);

	locationStart = String(locations[2][2]+locations[2][3]);
	locationFinish = String(locations [2][5]+locations[2][6]);
	shipType = String(locations[2][0]);
	assignShipsToBoard(Board,locationStart, locationFinish, shipType);
}


function checkP1Ships(id)
{

	var letterIndex = String(id).charCodeAt(0) - 64;
	var rowNumber = String(id).charAt(1);	
	shipType = P1ShipsBoard.children[rowNumber].children[letterIndex].innerHTML;

	switch(shipType)
	{
		case "A":
		{
			P2Score = P2Score + 2;
			P1ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P2AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P1AircraftCount)==0)
			{
				alert("you sunk an aircraft carrier");
			}else{
				alert("that was a hit!");
			}
			break;
			
		}
		case "B":
		{
			P2Score = P2Score + 2;
			P1ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P2AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P1BattleshipCount) == 0)
			{
				alert("you sunk a battleship");
			}else{
				alert("that was a hit!");
			}
			break;
		}
		case "S":
		{
			P2Score = P2Score + 2;
			P1ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P2AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P1SubCount) == 0)
			{
				alert("you sunk a submarine");
			}else{
				alert("that was a hit!");
			}
			break;
		}
		default:
		{
			P1ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "white");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "white");
			P2AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P2AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			alert("miss!");
			break;
			
		}
	}

}

function checkP2Ships(id)
{

	var letterIndex = String(id).charCodeAt(0) - 64;
	var rowNumber = String(id).charAt(1);
	shipType = P2ShipsBoard.children[rowNumber].children[letterIndex].innerHTML;

	switch(shipType)
	{
		case "A":
		{
			P1Score = P1Score + 2;
			P2ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P1AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P2AircraftCount)==0)
			{
				alert("you sunk an aircraft carrier");
			} else{
				alert("that was a hit!");
			}
			break;
			
		}
		case "B":
		{
			P1Score = P1Score + 2;
			P2ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P1AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P2BattleshipCount) == 0)
			{
				alert("you sunk a battleship");
			} else{
				alert("that was a hit!");
			}
			break;
		}
		case "S":
		{
			P1Score = P1Score + 2;
			P2ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "red");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P1AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			if((--P2SubCount)==0)
			{
				alert("you sunk a submarine");
			} else {
				alert("that was a hit!");
			}
			break;
		}
		default:
		{
			P2ShipsBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "white");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("bgcolor", "white");
			P1AttackBoard.children[rowNumber].children[letterIndex].setAttribute("onclick","doNothing()");
			P1AttackBoard.children[rowNumber].children[letterIndex].style = "cursor:default";
			alert("miss!");
			break;
		}
	}

}
function displayP1()
{
	document.body.appendChild(P1AttackBoard);
	document.body.appendChild(spaceingP);
	document.body.appendChild(P1ShipsBoard);
	nameHeader.innerHTML = p1name;
	document.body.appendChild(nameHeader);
}

function displayP2()
{
	document.body.appendChild(P2AttackBoard);
	document.body.appendChild(spaceingP);
	document.body.appendChild(P2ShipsBoard);
	nameHeader.innerHTML = p2name;
	document.body.appendChild(nameHeader);
}

function removeP1()
{
	document.body.removeChild(P1AttackBoard);
	document.body.removeChild(spaceingP);
	document.body.removeChild(P1ShipsBoard);
	document.body.removeChild(nameHeader);
}
function removeP2()
{
	document.body.removeChild(P2AttackBoard);
	document.body.removeChild(spaceingP);
	document.body.removeChild(P2ShipsBoard);
	document.body.removeChild(nameHeader);
}

function changeTurn(id)
{
	currentBoard = document.body.children[1].getAttribute("id");
	if (String(currentBoard) == "P1Attack")
	{
		//show whether or not it was a hit or miss
		checkP2Ships(id);
		displayP1();
		removeP1();
		setTimeout(function() {
			if(!GameOver)
			{
				alert("Press ok to begin "+p2name+"'s turn");
				displayP2();
			}
			
		}, 10);
		
		
		
	} else
	{

		checkP1Ships(id);
		displayP2();
		removeP2();		
		setTimeout(function() {
			if(!GameOver)
			{
				alert("Press ok to begin "+p1name+"'s  turn");
				displayP1();
			}
			
		}, 10);
		
		
	}
}

function clickable(id)
{
	changeTurn(id);

	if(P1Score == 24)
	{
		GameOver = true;
		alert(p1name+" won");
		P1Score = P1Score - P2Score;
		checkLocalStorage(p1name, P1Score);
		
	} else if (P2Score == 24)
	{
		GameOver = true;
		alert(p2name+" won");
		P2Score = P2Score - P1Score;
		checkLocalStorage(p2name, P2Score);
	}
}

function createTable(clickable)
{
	var board = document.createElement("table");
	var letterArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
	//for every row j
	for(var j = 0; j < 11; j++)
	{
		var row = document.createElement("tr");
	
		
		//for every column i in that row j
		for(var i = 0; i < 11; i++)
		{
			
			var col = document.createElement("td");
			col.setAttribute("id", letterArray[i]+String(j));
			col.setAttribute("height","20" );

			col.setAttribute("width","20" );
			
			if(j == 0)
			{
				col.innerHTML = letterArray[i];
			}
			else if(i == 0)
			{
				if(j != 0)
				{
					col.innerHTML = String(j);
				}
			} else if(clickable)
			{
				col.setAttribute("onclick", "clickable(this.id);");
				col.style = "cursor:move";
			}
			row.appendChild(col);
		}
		board.appendChild(row); 
	}
	board.setAttribute("border","2");
	board.setAttribute("align","center");
	board.setAttribute("width","75%");
	board.style.backgroundColor = "lightblue";
	return board;
}

function createFourTables()
{
	P1AttackBoard = createTable(true);
	P1AttackBoard.setAttribute("id","P1Attack");

	P1ShipsBoard = createTable();
	P1ShipsBoard.setAttribute("id", "P1Ships");
	
	P2AttackBoard = createTable(true);
	P2AttackBoard.setAttribute("id","P2Attack");

	P2ShipsBoard = createTable();
	P2ShipsBoard.setAttribute("id", "P2Ships");
}

function display()
{
	document.body.appendChild(P2AttackBoard);
	document.body.appendChild(P2ShipsBoard);
}

function checkShipLength(locationStart, locationFinish, shipType)
{
	switch(shipType)
	{
		case "A":
		{
			if(locationStart.charAt(1)==locationFinish.charAt(1))
			{
				// check the column letter cause its vertical
				if((locationFinish.charCodeAt(0) - locationStart.charCodeAt(0)) == 4)
				{
					Aship = true;
					return true;
				}else {
					return false;
				}
			} else {
				//check the rows cause its horizontal
				if((locationFinish.charAt(1) - locationStart.charAt(1)) == 4)
				{
					Aship = true;
					return true;
				} else {
					return false;
				}
			}
			break;
		}
		case "B":
		{
			if(locationStart.charAt(1)==locationFinish.charAt(1))
			{
				// check the column letter cause its vertical
				if((locationFinish.charCodeAt(0) - locationStart.charCodeAt(0)) == 3)
				{
					Bship = true;
					return true;
				}else {
					return false;
				}
			} else {
				//check the rows cause its horizontal
				if((locationFinish.charAt(1) - locationStart.charAt(1)) == 3)
				{
					Bship = true;
					return true;
				}else {
					return false;
				}
			}
			
			break;
		}
		case "S":
		{
			if(locationStart.charAt(1)==locationFinish.charAt(1))
			{
				// check the column letter cause its vertical
				if((locationFinish.charCodeAt(0) - locationStart.charCodeAt(0)) == 2)
				{
					Sship = true;
					return true;
				}else {
					return false;
				}
			} else {
				//check the rows cause its horizontal
				if((locationFinish.charAt(1) - locationStart.charAt(1)) == 2)
				{
					Sship = true;
					return true;
				}else {
					return false;
				}
			}
			break;
		}
		default:
		{
			return false;
		}
			
	}	
}


function checkLocations(locations)
{
	var goodShips = false;
	var locationStart = String(locations[0][2]+locations[0][3]);
	var locationFinish = String(locations [0][5]+locations[0][6]);
	var shipType = String(locations[0][0]);

	goodShips = checkShipLength(locationStart, locationFinish, shipType);
	if(!goodShips)
	{
		return false;
	}

	locationStart = String(locations[1][2]+locations[1][3]);
	locationFinish = String(locations [1][5]+locations[1][6]);
	shipType = String(locations[1][0]);
	
	goodShips = checkShipLength(locationStart, locationFinish, shipType);
	if(!goodShips)
	{
		return false;
	}


	locationStart = String(locations[2][2]+locations[2][3]);
	locationFinish = String(locations [2][5]+locations[2][6]);
	shipType = String(locations[2][0]);

	goodShips = checkShipLength(locationStart, locationFinish, shipType);
	if(!goodShips)
	{
		return false;
	}

	if(!(Aship && Bship && Sship))
	{
		return false;
	}


	return goodShips;
}

function getInfo()
{
	//get player 1 info
	p1name = prompt("Player1, what is your name?");
	
	//p1ships = "A:A1-A5;B:B6-E6; S:H3-J3";
	var goodLocations = false;
	while(!goodLocations)
	{
		var p1ships = prompt(p1name+", where would you like to place your ships");
		locations = p1ships.match(/(([A|B|S]{1})(:|\()([A-J]{1})([1-9])-([A-J])([1-9])\)?;?)/g);
		if(locations != null && locations.length == 3)
		{
			goodLocations = checkLocations(locations);
		}
	}
	createShips(P1ShipsBoard, locations);
		
	//get player 2 info
	p2name = prompt("Player2, what is your name?");
	//p2ships = "A:A1-A5;B:B6-E6; S:H3-J3";
	goodLocations = false;
	while(!goodLocations)
	{
		var p2ships = prompt(p2name+", Where would you like to place your ships?");
		locations = p2ships.match(/(([A|B|S]{1})(:|\()([A-J]{1})([1-9])-([A-J])([1-9])\)?;?)/g);
		if(locations != null && locations.length == 3)
		{
			goodLocations = checkLocations(locations);
		}
	}
	createShips(P2ShipsBoard,locations);
}

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}



function checkLocalStorage(name, score)
{
	arr = JSON.parse(localStorage.getItem("Top10"));
	arr.sort(compareSecondColumn);

	if(localStorage.getItem("Top10MaxedOut") == null)
	{
		if(arr[0][1] < score)
		{
			arr[0][1] = score;
			arr[0][0] = name;
		} else if(arr[0][1] == 24)
		{
			localStorage.setItem("Top10MaxedOut", true);
		}
		arr.sort(compareSecondColumn);
		arr.reverse();
		localStorage.setItem("Top10", JSON.stringify(arr));
	}

	scoreboard = document.createElement("table");
	scoreboard.setAttribute("border", "2");
	scoreboard.setAttribute("align","center");
	scoreboard.setAttribute("width","25%");
	for(var i = 0; i < 10; i++)
	{
		row = document.createElement("tr");
		name = document.createElement("td");
		score = document.createElement("td");
		name.innerHTML = String(arr[i][0]);
		score.innerHTML = String(arr[i][1]);
		row.appendChild(name);
		row.appendChild(score);
		scoreboard.appendChild(row);
	}
	header = document.createElement("h1");
	header.innerHTML = "Top 10 scores all time";
	header.setAttribute("align", "center");
	document.body.appendChild(header);
	document.body.appendChild(scoreboard);
}

createFourTables();
getInfo();
displayP1();













