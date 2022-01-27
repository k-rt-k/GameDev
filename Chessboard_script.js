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

var chessboard = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];

function addif(set,X,Y){
	if ((X<8)&&(Y<8)&&(X>=0)&&(Y>=0)) set.push([X,Y]);
}

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
	is_white(){
		return (this.color=="l");
	}
	same_color(other){
		if (typeof(other)=="number") return false;
		else return (this.color==other.color);
	}
	opp_colour(other){
		if (typeof(other)=="number") return false;
		else return (this.color!=other.color);
	}
	get_piece(){
		return this.piece;
	}
	moves(){
		poss=[]
		if (this.piece=="r"||this.piece=="q"){
			for(let x_inc=this.x+1;x_inc<8;x_inc++){
				if (chessboard[x_inc][this.y]==0) poss.push([x_inc,this.y]);
				else if (this.opp_colour(chessboard[x_inc][this.y])){
					poss.push([x_inc,this.y]);
					break;
				}
				else break;
			}
			for(let x_dec=this.x-1;x_dec>=0;x_dec--){
				if (chessboard[x_dec][this.y]==0) poss.push([x_dec,this.y]);
				else if (this.opp_colour(chessboard[x_dec][this.y])){
					poss.push([x_dec,this.y]);
					break;
				}
				else break;
			}
			for(let y_inc=this.y+1;y_inc<8;y_inc++){
				if (chessboard[this.x][y_inc]==0) poss.push([this.x,y_inc]);
				else if (this.opp_colour(chessboard[this.x][y_inc])){
					poss.push([this.x,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1;y_dec>=0;y_dec--){
				if (chessboard[this.x][y_dec]==0) poss.push([this.x,y_dec]);
				else if (this.opp_colour(chessboard[this.x][y_dec])){
					poss.push([this.x,y_dec]);
					break;
				}
				else break;
			}
		}
		if (this.piece=="b"||this.piece=="q"){
			for(let y_inc=this.y+1,x_inc=this.x+1;y_inc<8&&x_inc<8;y_inc++, x_inc++){
				if (chessboard[x_inc][y_inc]==0) poss.push([x_inc,y_inc]);
				else if (this.opp_colour(chessboard[x_inc][y_inc])){
					poss.push([x_inc,y_inc]);
					break;
				}
				else break;
			}
			for(let y_inc=this.y+1,x_dec=this.x-1;y_inc<8&&x_dec>=0;y_inc++, x_dec--){
				if (chessboard[x_dec][y_inc]==0) poss.push([x_dec,y_inc]);
				else if (this.opp_colour(chessboard[x_dec][y_inc])){
					poss.push([x_dec,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_inc=this.x+1;y_dec>=0&&x_inc<8;y_dec--, x_inc++){
				if (chessboard[x_inc][y_dec]==0) poss.push([x_inc,y_dec]);
				else if (this.opp_colour(chessboard[x_inc][y_dec])){
					poss.push([x_inc,y_dec]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_dec=this.x-1;y_dec>=0&&x_dec>=0;y_dec--, x_dec--){
				if (chessboard[x_dec][y_dec]==0) poss.push([x_dec,y_dec]);
				else if (this.opp_colour(chessboard[x_dec][y_dec])){
					poss.push([x_dec,y_dec]);
					break;
				}
				else break;
			}
		}

		else if (this.piece=="p"){
			if (this.is_white()){
				if (chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-1]);
				if (this.y==6&&chessboard[this.x][this.y-2]==0) poss.push([this.x,this.y-2]);
				if (this.x<7&&this.opp_colour(chessboard[this.x+1][this.y-1])) poss.push([this.x+1,this.y-1]);
				if (this.x>0&&this.opp_colour(chessboard[this.x-1][this.y-1])) poss.push([this.x-1,this.y-1]);
			}
			else{
				if (chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if (this.y==1&&chessboard[this.x][this.y+2]==0) poss.push([this.x,this.y+2]);
				if (this.x<7&&this.opp_colour(chessboard[this.x+1][this.y+1])) poss.push([this.x+1,this.y+1]);
				if (this.x>0&&this.opp_colour(chessboard[this.x-1][this.y+1])) poss.push([this.x-1,this.y+1]);
			}


		}
		else if (this.piece=="n"){
			let all_poss=[[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]];
			for (let i=0; i<8;i++){
				if (!this.same_color(chessboard[this.x+all_poss[i][0]][this.y+all_poss[i][1]])){addif(poss,this.x+all_poss[i][0],this.y+all_poss[i][1])}
			}
		}
		else if (this.piece=="k"){
			let all_poss=[[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[-1,0],[1,0]];
			for (let i=0; i<8;i++){
				if (!this.same_color(chessboard[this.x+all_poss[i][0]][this.y+all_poss[i][1]])){addif(poss,this.x+all_poss[i][0],this.y+all_poss[i][1])}
			}
		}
		
		return poss;
	}
};


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
			if (chessboard[moved_from[0]][moved_from[1]].moves().includes(to_move))			
			
			chessboard[to_move[0]][to_move[1]] = chessboard[moved_from[0]][moved_from[1]];
			chessboard[moved_from[0]][moved_from[1]] = 0;
			to_move = [8, 8];
		}
	}
	else{
		to_move = get_square(options.e.clientX, options.e.clientY);
  }
});
/*
//alt main game loop
legal_moves = []; //square to which piece is to be moved
white_move=true;
selected=false;
moved_from=0;
//[8,8] means that no move has been chosen yet

canvas.on("mouse:down", function(options) {
//main game loop
	if (typeof(moved_from)=="object"){
		move_to = get_square(options.e.clientX, options.e.clientY);
		if (legal_moves.includes(move_to)){
			options.target.set("left", -3+62.5*move_to[0]);
			options.target.set("top", -3+62.5*move_to[1]);
			options.target.setCoords();
			canvas.renderAll();
			chessboard[move_to[0]][move_to[1]] = chessboard[moved_from[0]][moved_from[1]];
			chessboard[moved_from[0]][moved_from[1]] = 0;
			legal_moves=[];
			moved_from=0;
			white_move=!white_move;
		}
	else if(options.target.type == "image"){
		
		moved_from = get_square(options.e.clientX, options.e.clientY);
		if (chessboard[moved_from[0]][moved_from[1]].is_white()^white_move){moved_from=0;continue;}
		legal_moves=chessboard[moved_from[0]][moved_from[1]].moves();
		
	}
	
  }
});
*/