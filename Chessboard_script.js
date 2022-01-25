const canvas = document.querySelector('canvas');
var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

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
		img.src = color+"_"+piece+".svg" //Save the svgs of the pieces as "color_piece.svg"
		img.onload = function(){ctx.drawImage(img, 8 + 62.5*x, 8 + 62.5*y);};
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
let wpawns = [];
for(let i = 0; i<8; i++){
	wpawns[i] = new chess_piece(i, 6, "white", "pawn");
	reassign(i, 6);
	wpawns[i].draw();
}
let bpawns = [];
for(let i = 0; i<8; i++){
	bpawns[i] = new chess_piece(i, 1, "black", "pawn");
	reassign(i, 1);
	bpawns[i].draw();
}
let wrooks = [];
for(let i = 0; i<2; i++){
	wrooks[i] = new chess_piece(7*i, 7, "white", "rook");
	reassign(7*i, 7);
	wrooks[i].draw();
}
let brooks = [];
for(let i = 0; i<2; i++){
	brooks[i] = new chess_piece(7*i, 0, "black", "rook");
	reassign(7*i, 0);
	brooks[i].draw();
}
let wknights = [];
for(let i = 0; i<2; i++){
	wknights[i] = new chess_piece(1+5*i, 7, "white", "knight");
	reassign(1+5*i, 7);
	//wknights[i].draw(); //need white_knight.svg
}
let bknights = [];
for(let i = 0; i<2; i++){
	bknights[i] = new chess_piece(1+5*i, 0, "black", "knight");
	reassign(1+5*i, 0);
	bknights[i].draw();
}
let wbishops = [];
for(let i = 0; i<2; i++){
	wbishops[i] = new chess_piece(2+3*i, 7, "white", "bishop");
	reassign(2+3*i, 7);
	wbishops[i].draw();
}
let bbishops = [];
for(let i = 0; i<2; i++){
	bbishops[i] = new chess_piece(2+3*i, 0, "black", "bishop");
	reassign(2+3*i, 0);
	bbishops[i].draw();
}
let wqueen = new chess_piece(3, 7, "white", "queen");
reassign(3, 7);
wqueen.draw();
let bqueen = new chess_piece(3, 0, "black", "queen");
reassign(3, 0);
bqueen.draw();
let wking = new chess_piece(4, 7, "white", "king");
reassign(4, 7);
wking.draw();
let bking = new chess_piece(4, 0, "black", "king");
reassign(4, 0);
bking.draw();