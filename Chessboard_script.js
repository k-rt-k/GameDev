var canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

//class of chess squares
class chess_square{
	constructor(x, y, occupied, img){
		this.x = x;
		this.y = y;
		this.occupied = occupied;
		this.img = img;
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
	get_img(){
		return this.img;
	}
}

var chessboard = [[], [], [], [], [], [], [], []];


//filling in the Chessboard
//lemme know if any of the colors need to be changed
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		chessboard[i][j] = new chess_square(i, j, 0, 0);
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
				selectable: true
			})
			canvas.add(img);
			return img;
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
let wpawns = [];
for(let i = 0; i<8; i++){
	wpawns[i] = new chess_piece(i, 6, "l", "p");
	chessboard[i][6] = new chess_square(i, 6, wpawns[i], wpawns[i].draw());
}
let bpawns = [];
for(let i = 0; i<8; i++){
	bpawns[i] = new chess_piece(i, 1, "d", "p");
	chessboard[i][1] = new chess_square(i, 1, bpawns[i], bpawns[i].draw());
}
let wrooks = [];
for(let i = 0; i<2; i++){
	wrooks[i] = new chess_piece(7*i, 7, "l", "r");
	chessboard[7*i][7] = new chess_square(7*i, 7, wrooks[i], wrooks[i].draw());
}
let brooks = [];
for(let i = 0; i<2; i++){
	brooks[i] = new chess_piece(7*i, 0, "d", "r");
	chessboard[7*i][0] = new chess_square(7*i, 0, brooks[i], brooks[i].draw());
}
let wknights = [];
for(let i = 0; i<2; i++){
	wknights[i] = new chess_piece(1+5*i, 7, "l", "n");
	chessboard[1+5*i][7] = new chess_square(1+5*i, 7, wknights[i], wknights[i].draw());
}
let bknights = [];
for(let i = 0; i<2; i++){
	bknights[i] = new chess_piece(1+5*i, 0, "d", "n");
	chessboard[1+5*i][0] = new chess_square(1+5*i, 0, bknights[i], bknights[i].draw());
}
let wbishops = [];
for(let i = 0; i<2; i++){
	wbishops[i] = new chess_piece(2+3*i, 7, "l", "b");
	chessboard[2+3*i][7] = new chess_square(2+3*i, 7, wbishops[i], wbishops[i].draw());
}
let bbishops = [];
for(let i = 0; i<2; i++){
	bbishops[i] = new chess_piece(2+3*i, 0, "d", "b");
	chessboard[2+3*i][0] = new chess_square(2+3*i, 0, bbishops[i], bbishops[i].draw());
}
let wqueen = new chess_piece(3, 7, "l", "q");
chessboard[3][7] = new chess_square(3, 7, wqueen, wqueen.draw());
let bqueen = new chess_piece(3, 0, "d", "q");
chessboard[3][0] = new chess_square(3, 0, bqueen, bqueen.draw());
let wking = new chess_piece(4, 7, "l", "k");
chessboard[4][7] = new chess_square(4, 7, wking, wking.draw());
let bking = new chess_piece(4, 0, "d", "k");
chessboard[4][0] = new chess_square(4, 0, bking, bking.draw());
