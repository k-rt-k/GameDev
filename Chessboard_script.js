var canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

/*function get_image(x, y) {
//use this only if you are sure that an image exists at that point
	var objArray = canvas.getObjects();
    for(let i = 0; i<objArray.length; i++){
		if(objArray[i].left == -3 + 62.5*x && objArray[i].top == -3 + 62.5*y){
			return objArray[i];
		}
	}
}*/

function get_square(coor_x, coor_y){
//returns the square in which (coor_x, coor_y) 
	p = Math.floor(coor_x/62.5);
	q = Math.floor(coor_y/62.5);
	return [p, q];
}


function my_includes(legal_moves, move_to){
	for(let i = 0; i<legal_moves.length; i++){
		if(legal_moves[i][0] == move_to[0] && legal_moves[i][1] == move_to[1]){
			return true;
		}
	}
	return false;
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
	get_num_moves(){
		return this.num_moves;
	}
	is_white(){
		return (this.color=="l");
	} //why?
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
			if (this.is_white()){
				if (my_chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-1]);
				if (this.y==6&&my_chessboard[this.x][this.y-2]==0) poss.push([this.x,this.y-2]);
				if (this.x<7&&this.opp_colour(my_chessboard[this.x+1][this.y-1])) poss.push([this.x+1,this.y-1]);
				if (this.x>0&&this.opp_colour(my_chessboard[this.x-1][this.y-1])) poss.push([this.x-1,this.y-1]);
				if (this.y==3&&can_en_passant[1]==3&&(this.x-can_en_passant[0]==1||this.x-can_en_passant[0]==-1)) poss.push([can_en_passant[0],2]);
			}
			else{
				if (my_chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if (this.y==1&&my_chessboard[this.x][this.y+2]==0) poss.push([this.x,this.y+2]);
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
				let k_row = 0;
				if(this.color=="l"){
					k_row = 7;
				}
				if(chessboard[7][k_row]!=0){
					if(chessboard[7][k_row].get_num_moves()==0){
						if(chessboard[5][k_row]==0 && chessboard[6][k_row]==0){
							let chessboard1 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard1[i][j] = 0;
									}
									else if(i == 5 && j == k_row){
										chessboard1[i][j] = chessboard[4][7];
									}
									else{
										chessboard1[i][j] = chessboard[i][j];
									}
								}
							}
							let chessboard2 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard2[i][j] = 0;
									}
									else if(i == 6 && j == k_row){
										chessboard2[i][j] = chessboard[4][7];
									}
									else{
										chessboard2[i][j] = chessboard[i][j];
									}
								}
							}
							let chessboard3 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard3[i][j] = 0;
									}
									else if(i == 7 && j == k_row){
										chessboard3[i][j] = chessboard[4][7];
									}
									else{
										chessboard3[i][j] = chessboard[i][j];
									}
								}
							}
							if(!is_in_check(chessboard, this.color) && !is_in_check(chessboard1, this.color) && !is_in_check(chessboard2, this.color) && !is_in_check(chessboard3, this.color) && !is_in_check(chessboard4, this.color)]){
								actual_poss.push([6, k_row]);
							}
						}
					}
				}
				if(chessboard[0][k_row]!=0){
					if(chessboard[0][k_row].get_num_moves()==0){
						if(chessboard[1][k_row] == 0 && chessboard[2][k_row] == 0 && chessboard[3][k_row] == 0){
							let chessboard1 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard1[i][j] = 0;
									}
									else if(i == 3 && j == k_row){
										chessboard1[i][j] = chessboard[4][7];
									}
									else{
										chessboard1[i][j] = chessboard[i][j];
									}
								}
							}
							let chessboard2 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard2[i][j] = 0;
									}
									else if(i == 2 && j == k_row){
										chessboard2[i][j] = chessboard[4][7];
									}
									else{
										chessboard2[i][j] = chessboard[i][j];
									}
								}
							}
							let chessboard3 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard3[i][j] = 0;
									}
									else if(i == 1 && j == k_row){
										chessboard3[i][j] = chessboard[4][7];
									}
									else{
										chessboard3[i][j] = chessboard[i][j];
									}
								}
							}
							let chessboard4 = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
							for(let i = 0; i<8; i++){
								for(let j = 0; j<8; j++){
									if(i == 4 && j == k_row){
										chessboard4[i][j] = 0;
									}
									else if(i == 0 && j == k_row){
										chessboard4[i][j] = chessboard[4][7];
									}
									else{
										chessboard4[i][j] = chessboard[i][j];
									}
								}
							}
							if(!is_in_check(chessboard, this.color) && !is_in_check(chessboard1, this.color) && !is_in_check(chessboard2, this.color) && !is_in_check(chessboard3, this.color) && !is_in_check(chessboard4, this.color)){
								actual_poss.push([2, k_row]);
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
for(let i = 0; i<8; i++){
	chessboard[i][6] = new chess_piece(i, 6, "l", "p", 0);
	chessboard[i][6].draw();
}
for(let i = 0; i<8; i++){
	chessboard[i][1] = new chess_piece(i, 1, "d", "p", 0);
	chessboard[i][1].draw();
}
for(let i = 0; i<2; i++){
	chessboard[7*i][7] = new chess_piece(7*i, 7, "l", "r", 0);
	chessboard[7*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[7*i][0] = new chess_piece(7*i, 0, "d", "r", 0);
	chessboard[7*i][0].draw();
}
for(let i = 0; i<2; i++){
	chessboard[1+5*i][7] = new chess_piece(1+5*i, 7, "l", "n", 0);
	chessboard[1+5*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[1+5*i][0] = new chess_piece(1+5*i, 0, "d", "n", 0);
	chessboard[1+5*i][0].draw();
}
for(let i = 0; i<2; i++){
	chessboard[2+3*i][7] = new chess_piece(2+3*i, 7, "l", "b", 0);
	chessboard[2+3*i][7].draw();
}
for(let i = 0; i<2; i++){
	chessboard[2+3*i][0] = new chess_piece(2+3*i, 0, "d", "b", 0);
	chessboard[2+3*i][0].draw();
}
chessboard[3][7] = new chess_piece(3, 7, "l", "q", 0);
let x = chessboard[3][7].draw();
chessboard[3][0] = new chess_piece(3, 0, "d", "q", 0);
chessboard[3][0].draw();
chessboard[4][7] = new chess_piece(4, 7, "l", "k", 0);
chessboard[4][7].draw();
chessboard[4][0] = new chess_piece(4, 0, "d", "k", 0);
chessboard[4][0].draw();

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
		left: 62.5*i,
		top: 62.5*j,
		fill: col,
		width: 62.5,
		height: 62.5,
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
					if(move_to[0]-moved_from[0] == 2){
						chessboard[move_to[0]-1][move_to[1]] = new chess_piece(move_to[0]-1, move_to[1], col, "r", 1);
						chessboard[move_to[0]-1][move_to[1]].draw();
						coverup(7, move_to[1]);
					}
					else if(move_to[0]-moved_from[0] == -2){
						chessboard[move_to[0]+1][move_to[1]] = new chess_piece(move_to[0]+1, move_to[1], col, "r", 1);
						chessboard[move_to[0]+1][move_to[1]].draw();
						coverup(0, move_to[1]);
					}
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
		if(options.target.type == "image" && !(chessboard[moved_from[0]][moved_from[1]]==0)){
			//console.log(moved_from);
			//console.log(chessboard[moved_from[0]][moved_from[1]]);
			col = chessboard[moved_from[0]][moved_from[1]].get_color();	
			if (col==w_b[white_move]){
				to_be_moved = options.target;
				selected = true; 
				legal_moves=chessboard[moved_from[0]][moved_from[1]].moves();
				shade_piece.set({
					left: 62.5*moved_from[0],
					top: 62.5*moved_from[1],	
					width: 62.5,
					height: 62.5
				});
				for (var indexor=0; indexor<legal_moves.length; indexor++){
					legal_moves_graphics[indexor]= new fabric.Circle({radius:11.25, fill:"#00CC00",opacity:0.3, left:62.5*legal_moves[indexor][0]+20,top:62.5*legal_moves[indexor][1]+20});
					canvas.add(legal_moves_graphics[indexor]);
				}
			}
		}
		else{
			moved_from = [];
		}
	}
});
