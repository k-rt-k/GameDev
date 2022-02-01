var canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

const SQUARE_WIDTH=62.5;
const CENTERX=canvas.width/2;
const CENTERY=canvas.height/2;

/*function get_image(x, y) {
//use this only if you are sure that an image exists at that point
	var objArray = canvas.getObjects();
    for(let i = 0; i<objArray.length; i++){
		if(objArray[i].left == -3 +  SQUARE_WIDTH*x && objArray[i].top == -3 +  SQUARE_WIDTH*y){
			return objArray[i];
		}
	}
}*/

function get_square(coor_x, coor_y){
//returns the square in which (coor_x, coor_y) 
	p = Math.floor((coor_x-CENTERX)/ SQUARE_WIDTH)+4;
	q = Math.floor((coor_y-CENTERY)/ SQUARE_WIDTH)+4;
	return [p, q];
}


function my_includes(legal_moves, move_to){
	for(let i = 0; i<legal_moves.length; i++){
		if(legal_moves[i].length == 3 && move_to.length == 3){
			if(legal_moves[i][0] == move_to[0] && legal_moves[i][1] == move_to[1] && legal_moves[i][2] == move_to[2]){return true;}
		}
		else{
			if(legal_moves[i][0] == move_to[0] && legal_moves[i][1] == move_to[1]){return true;}	
		}
	}
	return false;
}

function is_in_chessboard(x, y){
	return (x>=0 && x<8 && y>=0 && y<8);
}

function is_in_check(chessboard, col){
	//console.log(chessboard);
	let k_coords = [8, 8];
	for(let i = 0; i<8; i++){
		for(let j = 0; j<8; j++){
			if(chessboard[i][j]==0){continue;}
			if(chessboard[i][j].get_color()!=col){continue;}
			if(chessboard[i][j].get_piece()!="k"){continue;}
			k_coords = [i, j];
			break;
		}
		if(k_coords[0]!=8){break;}
	}
	for(let i = 0; i<8; i++){
		for(let j = 0; j<8; j++){
			if(chessboard[i][j]==0){continue;}
			if(chessboard[i][j].get_color()==col){continue;}
			//console.log(i, j);
			//console.log(chessboard[i][j].poss_moves(chessboard), k_coords);
			//console.log(chessboard);
			if(my_includes(chessboard[i][j].poss_moves(chessboard), k_coords)){return true;}
		}
	}
	return false;
}

var can_en_passant=[8,8];//which pawn can be en passanted


var chessboard = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];


//filling in the Chessboard
//lemme know if any of the colors need to be changed
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		var col;
		if((i+j)%2 == 1){
			col = "#654321";
		}
		else{
			col = "#c4a484";
		}
		var rect = new fabric.Rect({
			left:  CENTERX+SQUARE_WIDTH*(i-4),
			top:  CENTERY+SQUARE_WIDTH*(j-4),
			fill: col,
			width:  SQUARE_WIDTH,
			height:  SQUARE_WIDTH,
			selectable: false
		});
		canvas.add(rect);
	}
}

//var imgset = [];
//chess piece class
class chess_piece{
	constructor(x, y, color, piece, num_moves){
		this.x = x; //origin at the top left corner, x - axis goes right, y - axis goes down
		this.y = y; //counting starts from 0 for x and y
		this.color = color;
		this.piece = piece;
		this.num_moves = num_moves;
	}
	draw(){
		let x = this.x;
		let y = this.y;
		let col = this.color;
		let pc = this.pc;
		this.image=fabric.Image.fromURL(this.piece+this.color+"t.png", function(img){
			img.set({
				left: CENTERX+SQUARE_WIDTH*(x-4),
				top: CENTERY+SQUARE_WIDTH*(y-4),
				scaleX:SQUARE_WIDTH/68,
				scaleY:SQUARE_WIDTH/68,
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
	get_num_moves(){
		return this.num_moves;
	}
	opp_colour(other){
		if (typeof(other)=="number") return false;
		else return (this.color!=other.color);
	}
	same_color(other){
		if (typeof(other)=="number") return false;
		else return (!this.opp_colour(other));
	}
	get_piece(){
		return this.piece;
	}
	poss_moves(my_chessboard){
		var poss = []
		if (this.piece=="r"||this.piece=="q"){
			for(let x_inc=this.x+1;x_inc<8;x_inc++){
				if (my_chessboard[x_inc][this.y]==0) poss.push([x_inc,this.y]);
				else if (this.opp_colour(my_chessboard[x_inc][this.y])){
					poss.push([x_inc,this.y]);
					break;
				}
				else break;
			}
			for(let x_dec=this.x-1;x_dec>=0;x_dec--){
				if (my_chessboard[x_dec][this.y]==0) poss.push([x_dec,this.y]);
				else if (this.opp_colour(my_chessboard[x_dec][this.y])){
					poss.push([x_dec,this.y]);
					break;
				}
				else break;
			}
			for(let y_inc=this.y+1;y_inc<8;y_inc++){
				if (my_chessboard[this.x][y_inc]==0) poss.push([this.x,y_inc]);
				else if (this.opp_colour(my_chessboard[this.x][y_inc])){
					poss.push([this.x,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1;y_dec>=0;y_dec--){
				if (my_chessboard[this.x][y_dec]==0) poss.push([this.x,y_dec]);
				else if (this.opp_colour(my_chessboard[this.x][y_dec])){
					poss.push([this.x,y_dec]);
					break;
				}
				else break;
			}
		}
		if (this.piece=="b"||this.piece=="q"){
			for(let y_inc=this.y+1,x_inc=this.x+1;y_inc<8&&x_inc<8;y_inc++, x_inc++){
				if (my_chessboard[x_inc][y_inc]==0) poss.push([x_inc,y_inc]);
				else if (this.opp_colour(my_chessboard[x_inc][y_inc])){
					poss.push([x_inc,y_inc]);
					break;
				}
				else break;
			}
			for(let y_inc=this.y+1,x_dec=this.x-1;y_inc<8&&x_dec>=0;y_inc++, x_dec--){
				if (my_chessboard[x_dec][y_inc]==0) poss.push([x_dec,y_inc]);
				else if (this.opp_colour(my_chessboard[x_dec][y_inc])){
					poss.push([x_dec,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_inc=this.x+1;y_dec>=0&&x_inc<8;y_dec--, x_inc++){
				if (my_chessboard[x_inc][y_dec]==0) poss.push([x_inc,y_dec]);
				else if (this.opp_colour(my_chessboard[x_inc][y_dec])){
					poss.push([x_inc,y_dec]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_dec=this.x-1;y_dec>=0&&x_dec>=0;y_dec--, x_dec--){
				if (my_chessboard[x_dec][y_dec]==0) poss.push([x_dec,y_dec]);
				else if (this.opp_colour(my_chessboard[x_dec][y_dec])){
					poss.push([x_dec,y_dec]);
					break;
				}
				else break;
			}
		}

		else if (this.piece=="p"){
			if (this.get_color()=="l"){
				if (my_chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-1]);
				if (this.y==6&&my_chessboard[this.x][this.y-2]==0&&my_chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-2]);
				if (this.x<7&&this.opp_colour(my_chessboard[this.x+1][this.y-1])) poss.push([this.x+1,this.y-1]);
				if (this.x>0&&this.opp_colour(my_chessboard[this.x-1][this.y-1])) poss.push([this.x-1,this.y-1]);
				if (this.y==3&&can_en_passant[1]==3&&(this.x-can_en_passant[0]==1||this.x-can_en_passant[0]==-1)) poss.push([can_en_passant[0],2]);
			}
			else{
				if (my_chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if (this.y==1&&my_chessboard[this.x][this.y+2]==0&&my_chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+2]);
				if (this.x<7&&this.opp_colour(my_chessboard[this.x+1][this.y+1])) poss.push([this.x+1,this.y+1]);
				if (this.x>0&&this.opp_colour(my_chessboard[this.x-1][this.y+1])) poss.push([this.x-1,this.y+1]);
				if (this.y==4&&can_en_passant[1]==4&&(this.x-can_en_passant[0]==1||this.x-can_en_passant[0]==-1)) poss.push([can_en_passant[0],5]);
			}
		}
		else if (this.piece=="n"){
			let all_poss=[[this.x+1,this.y+2],[this.x+1,this.y-2],[this.x-1,this.y+2],[this.x-1,this.y-2],[this.x+2,this.y+1],[this.x+2,this.y-1],[this.x-2,this.y+1],[this.x-2,this.y-1]];
			for (let i=0; i<8;i++){
				let condition=all_poss[i][0]<8&&all_poss[i][0]>=0&&all_poss[i][1]<8&&all_poss[i][1]>=0&&!this.same_color(my_chessboard[all_poss[i][0]][all_poss[i][1]]);
				if(condition){poss.push(all_poss[i]);}
			}
		}
		else if (this.piece=="k"){
			let all_poss=[[this.x+1,this.y+1],[this.x+1,this.y-1],[this.x-1,this.y+1],[this.x-1,this.y-1],[this.x,this.y+1],[this.x,this.y-1],[this.x-1,this.y],[this.x+1,this.y]];
			for (let i=0; i<8;i++){
				let condition=all_poss[i][0]<8&&all_poss[i][0]>=0&&all_poss[i][1]<8&&all_poss[i][1]>=0&&!this.same_color(my_chessboard[all_poss[i][0]][all_poss[i][1]]);
				if(condition){poss.push(all_poss[i]);}
			}
		}
		return poss;
	}
	moves(){
		let poss = this.poss_moves(chessboard);
		var actual_poss = [];
		for(let i = 0; i<poss.length; i++){
			var new_chessboard = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
			for(let p = 0; p<8; p++){
				for(let q = 0; q<8; q++){
					if(p==this.x&&q==this.y){
						new_chessboard[p][q] = 0;
					}
					else if(p==poss[i][0] && q==poss[i][1]){
						new_chessboard[p][q] = new chess_piece(p, q, this.color, this.piece);
					}
					else{
						new_chessboard[p][q] = chessboard[p][q]
					}
				}
			}
			if(!is_in_check(new_chessboard, this.color)){actual_poss.push(poss[i]);}
		}
		if(this.piece=="k"){
			if(this.num_moves==0){
				if(!is_in_check(chessboard, this.color)){
					let rooks_available = [];
					for(let i = 0; i<8; i++){
						if(chessboard[i][this.y]!=0){
							if(chessboard[i][this.y].get_piece()=="r"){
								if(chessboard[i][this.y].get_num_moves()==0){
									let this_var = true;
									if(i>this.x){
									//castling h-side
										for(let j = Math.min(this.x, 6); j<=Math.max(this.x, 6); j++){
											if(chessboard[j][this.y]!=0 && j!=this.x && j!=i){
												this_var = false;
											}
										}
										for(let j = Math.min(i, 5); j<=Math.max(i, 5); j++){
											if(chessboard[j][this.y]!=0 && j!=this.x && j!=i){
												this_var = false;
											}
										}
									}
									else{
									//castling a-side
										for(let j = Math.min(this.x, 2); j<=Math.max(this.x, 2); j++){
											if(chessboard[j][this.y]!=0 && j!=this.x && j!=i){
												this_var = false;
											}
										}
										for(let j = Math.min(i, 3); j<=Math.max(i, 3); j++){
											if(chessboard[j][this.y]!=0 && j!=this.x && j!=i){
												this_var = false;
											}
										}
									}
									if(this_var){
										rooks_available.push(chessboard[i][this.y]);
									}
								}
							}
						}
					}
					for(let i = 0; i<rooks_available.length; i++){
						let rook_x = rooks_available[i].get_x();
						let chessboard_for_checking = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
						let can_castle = true;
						if(rook_x > this.x){
						//castling h-side
							for(let j = Math.min(this.x, 6); j<=Math.max(this.x, 6); j++){
								if(j!=this.x){
									for(let p = 0; p<8; p++){
										for(let q = 0; q<8; q++){
											if(p==this.x && q==this.y){
												chessboard_for_checking[p][q] = 0;
											}
											else if(p == j && q==this.y){
												chessboard_for_checking[p][q] = chessboard[this.x][this.y];
											}
											else{
												chessboard_for_checking[p][q] = chessboard[p][q];
											}
										}
									}
								}
								if(is_in_check(chessboard_for_checking, this.color)){
									can_castle = false;
								}
							}
							if(can_castle){
								actual_poss.push([6, this.y, "ch"]);
							}
						}
						else{
						//castling a-side
							for(let j = Math.min(this.x, 2); j<=Math.max(this.x, 2); j++){
								if(j!=this.x){
									for(let p = 0; p<8; p++){
										for(let q = 0; q<8; q++){
											if(p==this.x && q==this.y){
												chessboard_for_checking[p][q] = 0;
											}
											else if(p == j && q==this.y){
												chessboard_for_checking[p][q] = chessboard[this.x][this.y];
											}
											else{
												chessboard_for_checking[p][q] = chessboard[p][q];
											}
										}
									}
								}
								if(is_in_check(chessboard_for_checking, this.color)){
									can_castle = false;
								}
							}
							if(can_castle){
								actual_poss.push([2, this.y, "ca"]);
							}
						}
					}
				}
			}
		}
		return actual_poss;
	}
}

function f_legal_moves(this_chessboard, col){
	for(let i = 0; i<8; i++){
		for(let j = 0; j<8; j++){
			if(this_chessboard[i][j] == 0){continue;}
			if(this_chessboard[i][j].get_color()!=col){continue;}
			if(this_chessboard[i][j].moves().length!=0){
				return true;
			}
		}
	}
	return false;
}



//positioning the pieces
initialise(chessboard); 


function coverup(i, j){
//use this as a last resort
	chessboard[i][j] = 0;
	var col;
	if((i+j)%2 == 1){
		col = "#654321";
	}
	else{
		col = "#c4a484";
	}
	var rect = new fabric.Rect({
		left:  CENTERX+SQUARE_WIDTH*(i-4),
		top:  CENTERY+SQUARE_WIDTH*(j-4),
		fill: col,
		width:  SQUARE_WIDTH,
		height:  SQUARE_WIDTH,
		selectable: false
	});
	canvas.remove(shade_piece);
	canvas.add(rect);
	canvas.add(shade_piece);
}

move_to = [8, 8]; //square to which piece is to be moved
//[8,8] means that no move has been chosen yet
selected = false;
white_move = 0;
const w_b=["l","d"]
col=0;
to_be_moved = 0;
legal_moves = [];
var legal_moves_graphics=[];
var shade_piece =new fabric.Rect({fill: "#00cc00", opacity: 0.4 ,selectable: false});
canvas.add(shade_piece);
var bkcastle=true,bqcastle=true,wkcastle=true,wqcastle=true;

canvas.on("mouse:down", function(options) {
//main game loop
	if(selected){
	//moving the piece
		move_to = get_square(options.e.clientX, options.e.clientY);
		for (var indexor=0; indexor<legal_moves_graphics.length; indexor++){
			canvas.remove(legal_moves_graphics[indexor]);
		}
		if(!(move_to[0] == moved_from[0] && move_to[1] == moved_from[1])){
			//console.log(legal_moves);
			if(my_includes(legal_moves, move_to)){ //can't use .includes for n-d arrays
				//console.log(chessboard[moved_from[0]][moved_from[1]]);
				pc = chessboard[moved_from[0]][moved_from[1]].get_piece();
				let nm = chessboard[moved_from[0]][moved_from[1]].get_num_moves();
				coverup(moved_from[0], moved_from[1]);
				//undraw the old thing somehow;
				//console.log(chessboard[move_to[0]][move_to[1]]);
				if(!(chessboard[move_to[0]][move_to[1]]==0)){
					//console.log(options.target.type);
					//console.log(chessboard[move_to[0]][move_to[1]]);
					coverup(move_to[0], move_to[1]);
				}
				if(pc == "p"){
					if((col == "l"&&move_to[1]==0)||(col=="d"&&move_to[1]==7)){	//promotion
						while(true){
							let input = prompt("What do you want to promote this pawn to? Enter 'q' to promote to a Queen, 'b' to promote to a bishop, 'n' to promote to a knight or 'r' to promote to a rook");
							if(input == "q" || input == "b" || input == "n" || input == "r"){
								pc = input;
								break;
							}
							alert("Your input is invalid (You cannot promote to a king or a pawn)");
						}
					}
					//en passant
					else if (moved_from[1]==can_en_passant[1]&&move_to[0]==can_en_passant[0]){
						coverup(can_en_passant[0],can_en_passant[1]);
						can_en_passant=[8,8];
					}
					else{
						if ((col == "d"&&moved_from[1]==1&&move_to[1]==3)||(col=="l"&&moved_from[1]==6&&move_to[1]==4)) {can_en_passant[0]=move_to[0];can_en_passant[1]=move_to[1];}
						else can_en_passant=[8,8];
					}
				}
				if(pc == "k"){
					if(move_to[0] == 6){
					//h-side castling
						if(my_includes(legal_moves, [move_to[0], move_to[1], "ch"])){
							let should_castle = false;
							if(move_to[0]-moved_from[0] == 1 || move_to[0]-moved_from[0] == -1){
								while(true){
									let input = prompt("Do you want to Castle? Enter 'y' if you do and 'n' if you don't");
									if(input == "y"){
										should_castle = true;
										for(let i = moved_from[0]; i<8; i++){
											if(chessboard[i][moved_from[1]]!=0){
												if(chessboard[i][moved_from[1]].get_color()==col && chessboard[i][moved_from[1]].get_piece()=="r"){
													coverup(i, moved_from[1]);
													break;
												}
											}
										}
										break;
									}
									else if(input == "n"){
										break;
									}
									alert("Your input is invalid (Enter either 'y' or 'n')");
								}
							}
							else{
								should_castle = true;
								for(let i = moved_from[0]; i<8; i++){
									if(chessboard[i][moved_from[1]]!=0){
										if(chessboard[i][moved_from[1]].get_color()==col && chessboard[i][moved_from[1]].get_piece()=="r"){
											coverup(i, moved_from[1]);
										}
									}
								}
							}
							if(should_castle){
								chessboard[5][move_to[1]] = new chess_piece(5, move_to[1], col, "r", 1);
								chessboard[5][move_to[1]].draw();
							}
						}
					}
					else if(move_to[0] == 2){
					//a-side castling
						if(my_includes(legal_moves, [move_to[0], move_to[1], "ca"])){
							let should_castle = false;
							if(move_to[0] - moved_from[0] == 1 || move_to[0] - moved_from[0] == -1){
								while(true){
									let input = prompt("Do you want to Castle? Enter 'y' if you do and 'n' if you don't");
									if(input == "y"){
										should_castle = true;
										for(let i = moved_from[0]; i>=0; i--){
											if(chessboard[i][moved_from[1]]!=0){
												if(chessboard[i][moved_from[1]].get_color()==col && chessboard[i][moved_from[1]].get_piece()=="r"){
													coverup(i, moved_from[1]);
													break;
												}
											}
										}
										break;
									}
									else if(input == "n"){
										break;
									}
									alert("Your input is invalid (Enter either 'y' or 'n')");
								}
							}
							else{
								should_castle = true;
								for(let i = moved_from[0]; i>=0; i--){
									if(chessboard[i][moved_from[1]]!=0){
										if(chessboard[i][moved_from[1]].get_color()==col && chessboard[i][moved_from[1]].get_piece()=="r"){
											coverup(i, moved_from[1]);
											break;
										}
									}
								}
							}
							if(should_castle){
								chessboard[3][move_to[1]] = new chess_piece(3, move_to[1], col, "r", 1);
								chessboard[3][move_to[1]].draw();
							}
						}
					}
					/*if(move_to[0]-moved_from[0] == 2){
						chessboard[move_to[0]-1][move_to[1]] = new chess_piece(move_to[0]-1, move_to[1], col, "r", 1);
						chessboard[move_to[0]-1][move_to[1]].draw();
						coverup(7, move_to[1]);
					}
					else if(move_to[0]-moved_from[0] == -2){
						chessboard[move_to[0]+1][move_to[1]] = new chess_piece(move_to[0]+1, move_to[1], col, "r", 1);
						chessboard[move_to[0]+1][move_to[1]].draw();
						coverup(0, move_to[1]);
					}*/
				}
				//console.log(moved_from[0], moved_from[1]);
				chessboard[move_to[0]][move_to[1]] = new chess_piece(move_to[0], move_to[1], col, pc, nm+1);
				chessboard[move_to[0]][move_to[1]].draw();
				chessboard[moved_from[0]][moved_from[1]] = 0;
				legal_moves = [];
				moved_from = 0;
				white_move = 1-white_move;
			}
		}
		else{
			if(chessboard[move_to[0]][move_to[1]]!=0){
				if(chessboard[move_to[0]][move_to[1]].get_piece()=="k"){
					if(move_to[0]==6){
						if(my_includes(legal_moves, [6, move_to[1], "ch"])){
							while(true){
								let input = prompt("Do you want to Castle? Enter 'y' if you do and 'n' if you don't");
								if(input == "y"){
									for(let i = move_to[0]; i<8; i++){
										if(chessboard[i][move_to[1]]!=0){
											if(chessboard[i][move_to[1]].get_color()==chessboard[move_to[0]][move_to[1]].get_color() && chessboard[i][moved_from[1]].get_piece()=="r"){
												coverup(i, move_to[1]);
												break;
											}
										}
									}
									chessboard[5][move_to[1]] = new chess_piece(5, move_to[1], chessboard[move_to[0]][move_to[1]].get_color(), "r", 1);
									chessboard[5][move_to[1]].draw();
									legal_moves = [];
									moved_from = 0;
									white_move = 1-white_move;
									break;
								}
								else if(input == "n"){
									break;
								}
								alert("Your input is invalid (Enter either 'y' or 'n')");
							}
						}
					}
					else if(move_to[0]==2){
						if(my_includes(legal_moves, [2, move_to[1], "ca"])){
							while(true){
								let input = prompt("Do you want to Castle? Enter 'y' if you do and 'n' if you don't");
								if(input == "y"){
									for(let i = move_to[0]; i>=0; i--){
										if(chessboard[i][move_to[1]]!=0){
											if(chessboard[i][move_to[1]].get_color()==chessboard[move_to[0]][move_to[1]].get_color() && chessboard[i][moved_from[1]].get_piece()=="r"){
												coverup(i, move_to[1]);
												break;
											}
										}
									}
									chessboard[3][move_to[1]] = new chess_piece(3, move_to[1], chessboard[move_to[0]][move_to[1]].get_color(), "r", 1);
									chessboard[3][move_to[1]].draw();
									legal_moves = [];
									moved_from = 0;
									white_move = 1-white_move;
									break;
								}
								else if(input == "n"){
									break;
								}
								alert("Your input is invalid (Enter either 'y' or 'n')");
							}
						}
					}
				}
			}
		}
		move_to = [8, 8];
		selected = false;
		shade_piece.set({width:0, height:0});
		to_be_moved = 0;
		if(!f_legal_moves(chessboard, w_b[white_move])){
			if(white_move==0){
				if(is_in_check(chessboard, "l")){
					alert("Checkmate, Black Wins");
				}
				else{
					alert("Tie by Stalemate");
				}
			}
			else{
				if(is_in_check(chessboard, "d")){
					alert("Checkmate, White Wins");
				}
				else{
					alert("Tie by Stalemate");
				}
			}
		}
	}
	else{
	//choosing the piece
		moved_from = get_square(options.e.clientX, options.e.clientY);
		if(options.target.type == "image" && is_in_chessboard(moved_from[0], moved_from[1]) && !(chessboard[moved_from[0]][moved_from[1]]==0)){
			//console.log(moved_from);
			//console.log(chessboard[moved_from[0]][moved_from[1]]);
			col = chessboard[moved_from[0]][moved_from[1]].get_color();	
			if (col==w_b[white_move]){
				to_be_moved = options.target;
				selected = true; 
				legal_moves=chessboard[moved_from[0]][moved_from[1]].moves();
				shade_piece.set({
					left: CENTERX+SQUARE_WIDTH*(moved_from[0]-4),
					top:  CENTERY+SQUARE_WIDTH*(moved_from[1]-4),	
					width:  SQUARE_WIDTH,
					height:  SQUARE_WIDTH
				});
				for (var indexor=0; indexor<legal_moves.length; indexor++){
					legal_moves_graphics[indexor]= new fabric.Circle({radius:SQUARE_WIDTH/8, fill:"#00CC00",opacity:0.3, left: CENTERX+SQUARE_WIDTH*(legal_moves[indexor][0]-4)+3*SQUARE_WIDTH/8,top: CENTERY+SQUARE_WIDTH*(legal_moves[indexor][1]-4)+3*SQUARE_WIDTH/8});
					canvas.add(legal_moves_graphics[indexor]);
				}
			}
		}
		else{
			moved_from = [];
		}
	}
});
