var canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

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


//chess piece class
class chess_piece{
	constructor(x, y, color, piece){
		this.x = x; //origin at the top left corner, x - axis goes right, y - axis goes down
		this.y = y; //counting starts from 0 for x and y
		this.color = color;
		this.piece = piece;
		//this.id = id;
	}
	draw(){
		let x = this.x;
		let y = this.y;
		this.image=fabric.Image.fromURL(this.piece+this.color+"t.png", function(img){
			img.set({
				//id: this.id,
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
	/*get_id(){
		return this.id;
	}*/
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
			}
			else{
				if (my_chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if (this.y==1&&my_chessboard[this.x][this.y+2]==0) poss.push([this.x,this.y+2]);
				if (this.x<7&&this.opp_colour(my_chessboard[this.x+1][this.y+1])) poss.push([this.x+1,this.y+1]);
				if (this.x>0&&this.opp_colour(my_chessboard[this.x-1][this.y+1])) poss.push([this.x-1,this.y+1]);
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
		//console.log("ayy lmao", poss);
		var actual_poss = [];
		/*for(let i = 0; i<8; i++){
			for(let j = 0; j<8; j++){
				new_chessboard[i][j] = chessboard[i][j];
			}
		}*/
		//console.log(this.x, this.y);
		for(let i = 0; i<poss.length; i++){
			var new_chessboard = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
			//console.log(chessboard[this.x][this.y]);
			//console.log(this.x, this.y);
			//new_chessboard[this.x][this.y] = 0;
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
			//console.log(new_chessboard);
			//new_chessboard[poss[i][0]][poss[i][1]] = new chess_piece(poss[i][0], poss[i][1], this.color, this.piece);
			if(!is_in_check(new_chessboard, this.color)){actual_poss.push(poss[i]);}
			/*new_chessboard[this.x][this.y] = chessboard[this.x][this.y];
			new_chessboard[poss[i][0]][poss[i][1]] = chessboard[poss[i][0]][poss[i][1]];*/
		}
		//console.log(actual_poss);
		return actual_poss;
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


canvas.on("mouse:down", function(options) {
//main game loop
	if(selected){
		move_to = get_square(options.e.clientX, options.e.clientY);
		for (var indexor=0; indexor<legal_moves_graphics.length; indexor++){
			canvas.remove(legal_moves_graphics[indexor]);
		}
		if(!(move_to[0] == moved_from[0] && move_to[1] == moved_from[1])){
			//legal_moves = chessboard[moved_from[0]][moved_from[1]].moves();
			//console.log(legal_moves);
			if(my_includes(legal_moves, move_to)){ //can't use .includes for n-d arrays
				/*to_be_moved.set("left", -3+62.5*8);
				to_be_moved.set("top", -3+62.5*8);*/
				//console.log(chessboard[moved_from[0]][moved_from[1]]);
				pc = chessboard[moved_from[0]][moved_from[1]].get_piece();	
				canvas.remove(to_be_moved);
				//undraw the old thing somehow;
				//console.log(chessboard[move_to[0]][move_to[1]]);
				if(!(chessboard[move_to[0]][move_to[1]]==0)){
					//console.log(options.target.type);
					//canvas.remove(options.target);
					canvas.remove(options.target);
				}
				chessboard[move_to[0]][move_to[1]] = new chess_piece(move_to[0], move_to[1], col, pc);
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
	}
	else{
		moved_from = get_square(options.e.clientX, options.e.clientY);
		if(options.target.type == "image" && !(chessboard[moved_from[0]][moved_from[1]]==0)){
			//console.log(moved_from);
			//console.log(chessboard[moved_from[0]][moved_from[1]]);
			col = chessboard[moved_from[0]][moved_from[1]].get_color();	
			if (col==w_b[white_move]){
				to_be_moved = options.target;
				selected = true; 
				legal_moves=chessboard[moved_from[0]][moved_from[1]].moves();
				if(legal_moves.length == 0){
					if(white_move==0){
						if(is_in_check(chessboard, "l")){
							console.log("Checkmate, Black Wins");
						}
						else{
							console.log("Tie by Stalemate");
						}
					}
					else{
						if(is_in_check(chessboard, "d")){
							console.log("Checkmate, White Wins");
						}
						else{
							console.log("Tie by Stalemate");
						}
					}
				}
				shade_piece.set({
					left: 62.5*moved_from[0],
					top: 62.5*moved_from[1],	
					width: 62.5,
					height: 62.5
				});
				for (var indexor=0; indexor<legal_moves.length; indexor++){
					legal_moves_graphics[indexor]= new fabric.Circle({radius:11.25, fill:"#00CC00",opacity:0.3, left:62.5*legal_moves[indexor][0]+20,top:62.5*legal_moves[indexor][1]+20});
					canvas.add(legal_moves_graphics[indexor]);
					canvas.sendToBack(legal_moves_graphics[indexor]);
				}
			}
		}
		else{
			moved_from = [];
		}
	}
});
