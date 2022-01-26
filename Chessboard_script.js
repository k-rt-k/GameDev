var canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

function get_square(coor_x, coor_y){
//returns the square in which (coor_x, coor_y) 
	p = Math.floor(coor_x/62.5);
	q = Math.floor(coor_y/62.5);
	return [p, q];
}

//class of chess squares
/*
class chess_square{
	constructor(x, y, occupied){
		this.x = x;
		this.y = y;
		this.occupied = occupied;
	}
	get_x(){
		return this.x;
	}
	get_y(){
		return this.y;
	}
	get_occ(){
		return this.occupied;
	}
}*/
//class of chess squares not required so far

var chessboard = [[], [], [], [], [], [], [], []];


//filling in the Chessboard
//lemme know if any of the colors need to be changed
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		chessboard[i][j] = 0;
		var col;
		if((i+j)%2 == 1){
			col = "#654321";
		}
		else{
			col = "#c4a484";
		}
		var rect = new fabric.Rect({
			left: 62.5*i,
			top: 62.5*j,
			fill: col,
			width: 62.5,
			height: 62.5,
			selectable: false
		});
		canvas.add(rect);
	}
}


//chess piece class
class chess_piece{
	constructor(x, y, color, piece){
		this.x = x; //origin at the top left corner, x - axis goes right, y - axis goes down
		this.y = y; //counting starts from 0 for x and y
		this.color = color;
		this.piece = piece;
	}
	draw(){
		let x = this.x;
		let y = this.y;
		let color = this.color;
		let piece = this.piece;
		fabric.Image.fromURL(piece+color+"t.png", function(img){
			img.set({
				left: -3 + 62.5*x,
				top: -3 + 62.5*y,
				selectable: false,
				opacity: 1
			})
			canvas.add(img);
		});
	}
	get_x(){
		return this.x;
	}
	get_y(){
		return this.y;
	}
	get_color(){
		return this.color;
	}
	get_piece(){
		return this.piece;
	}
}


//positioning the pieces
for(let i = 0; i<8; i++){
	chessboard[i][6] = new chess_piece(i, 6, "l", "p");
	chessboard[i][6].draw();
}
for(let i = 0; i<8; i++){
	chessboard[i][1] = new chess_piece(i, 1, "d", "p");
	chessboard[i][1].draw();
}
for(let i = 0; i<2; i++){
	chessboard[7*i][7] = new chess_piece(7*i, 7, "l", "r");
	chessboard[7*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[7*i][0] = new chess_piece(7*i, 0, "d", "r");
	chessboard[7*i][0].draw();
}
for(let i = 0; i<2; i++){
	chessboard[1+5*i][7] = new chess_piece(1+5*i, 7, "l", "n");
	chessboard[1+5*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[1+5*i][0] = new chess_piece(1+5*i, 0, "d", "n");
	chessboard[1+5*i][0].draw();
}
for(let i = 0; i<2; i++){
	chessboard[2+3*i][7] = new chess_piece(2+3*i, 7, "l", "b");
	chessboard[2+3*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[2+3*i][0] = new chess_piece(2+3*i, 0, "d", "b");
	chessboard[2+3*i][0].draw();
}
chessboard[3][7] = new chess_piece(3, 7, "l", "q");
chessboard[3][7].draw();
chessboard[3][0] = new chess_piece(3, 0, "d", "q");
chessboard[3][0].draw();
chessboard[4][7] = new chess_piece(4, 7, "l", "k");
chessboard[4][7].draw();
chessboard[4][0] = new chess_piece(4, 0, "d", "k");
chessboard[4][0].draw();

to_move = [8, 8]; //square to which piece is to be moved
//[8,8] means that no move has been chosen yet

canvas.on("mouse:down", function(options) {
//main game loop
	if(options.target.type == "image"){
		if(to_move[0]!=8){
			moved_from = get_square(options.e.clientX, options.e.clientY);
			options.target.set("left", -3+62.5*to_move[0]);
			options.target.set("top", -3+62.5*to_move[1]);
			options.target.setCoords();
			canvas.renderAll();
			chessboard[to_move[0]][to_move[1]] = chessboard[moved_from[0]][moved_from[1]];
			chessboard[moved_from[0]][moved_from[1]] = 0;
			to_move = [8, 8];
		}
	}
	else{
		to_move = get_square(options.e.clientX, options.e.clientY);
  }
});
