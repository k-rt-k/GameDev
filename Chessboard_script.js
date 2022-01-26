const canvas = document.querySelector('canvas');
var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

//class of chess squares
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
}

var chessboard = [[], [], [], [], [], [], [], []];

function reassign(i, j){
	chessboard[i][j] = new chess_square(i, j, !chessboard[i][j].get_occ());
}

//filling in the Chessboard
//lemme know if any of the colors need to be changed
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		chessboard[i][j] = new chess_square(i, j, false);
		ctx.beginPath();
		ctx.rect(62.5*i, 62.5*j, 62.5, 62.5);
		if((i+j)%2 == 1){
			ctx.fillStyle = "#654321";
		}
		else{
			ctx.fillStyle = "#c4a484";
		}
		ctx.fill();
	}
}

class chess_board{
	constructor(){
		


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
		var img = new Image();
		img.src = piece+color+"t.svg" 
		img.onload = function(){ctx.drawImage(img, 8 + 62.5*x, 8 + 62.5*y);};
	}
	get get_x(){
		return this.x;
	}
	get get_y(){
		return this.y;
	}
	get get_color(){
		return this.color;
	}
	get get_piece(){
		return this.piece;
	}
	set moveto(X,Y){
		this.x=X;
		this.y=Y;
	}

}
//white='l'(light), black='d' (dark)
//'k'ing, 'q'ueen, 'b'ishop, k'n'ight, 'r'ook,'p'awn,'U'nicorn
//positioning the pieces
let wpawns = [];
for(let i = 0; i<8; i++){
	wpawns[i] = new chess_piece(i, 6, "l", "p");
	reassign(i, 6);
	wpawns[i].draw();
}
let bpawns = [];
for(let i = 0; i<8; i++){
	bpawns[i] = new chess_piece(i, 1, "d", "p");
	reassign(i, 1);
	bpawns[i].draw();
}
let wrooks = [];
for(let i = 0; i<2; i++){
	wrooks[i] = new chess_piece(7*i, 7, "l", "r");
	reassign(7*i, 7);
	wrooks[i].draw();
}
let brooks = [];
for(let i = 0; i<2; i++){
	brooks[i] = new chess_piece(7*i, 0, "d", "r");
	reassign(7*i, 0);
	brooks[i].draw();
}
let wknights = [];
for(let i = 0; i<2; i++){
	wknights[i] = new chess_piece(1+5*i, 7, "l", "n");
	reassign(1+5*i, 7);
	wknights[i].draw();
}
let bknights = [];
for(let i = 0; i<2; i++){
	bknights[i] = new chess_piece(1+5*i, 0, "d", "n");
	reassign(1+5*i, 0);
	bknights[i].draw();
}
let wbishops = [];
for(let i = 0; i<2; i++){
	wbishops[i] = new chess_piece(2+3*i, 7, "l", "b");
	reassign(2+3*i, 7);
	wbishops[i].draw();
}
let bbishops = [];
for(let i = 0; i<2; i++){
	bbishops[i] = new chess_piece(2+3*i, 0, "d", "b");
	reassign(2+3*i, 0);
	bbishops[i].draw();
}
let wqueen = new chess_piece(3, 7, "l", "q");
reassign(3, 7);
wqueen.draw();
let bqueen = new chess_piece(3, 0, "d", "q");
reassign(3, 0);
bqueen.draw();
let wking = new chess_piece(4, 7, "l", "k");
reassign(4, 7);
wking.draw();
let bking = new chess_piece(4, 0, "d", "k");
reassign(4, 0);
bking.draw();