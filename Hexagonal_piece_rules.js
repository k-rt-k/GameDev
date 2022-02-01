//chess piece class
//refer Hexagonal_chess.png
var canvas = new fabric.Canvas('c', {
	preserveObjectStacking: true
  });
/*let shadow = new fabric.Rect({
	left:0,
	top:0,
	width:canvas.width,
	height:canvas.height,
	fill:"#000000",
	opacity=0.4,
	selectable:false
});
	canvas.add(shadow);*/
/* coordinates
         y10/\
          y0| |
         x0 \/ x10
*/
/*tranformation from coord to location:
	x=CENTERX+UNIT_LENGTH*((x-5)+y/2-z/2)
	y=CENTERY-UNIT_LENGTH*((y+z-10)*SQRT3/2)
*/
//white taken towards 0 side
let z =(x,y)=>5+y-x;
let y=(x,z)=>x+z-5;
const CENTERX= canvas.width/2;//change
const CENTERY= canvas.height/2;
const UNIT_LENGTH=canvas.height/20;
const SQRT3=Math.sqrt(3);

function is_in_check(chessboard, col){
	//console.log(chessboard);
	let k_coords = [-1,-1];
	for(let i = 0; i<11; i++){
		for(let j = 0; j<11; j++){
			if((!all_in_bounds(i,j))){continue;}
			if(chessboard[i][j]==0){continue;}
			//console.log(i, j, all_in_bounds(i, j));
			//console.log(chessboard[3][8]);
			if(!(chessboard[i][j].get_color()==col)){continue;}
			if(chessboard[i][j].get_piece()!="k"){continue;}
			k_coords = [i, j];
			break;
		}
		if(k_coords[0]!=-1){break;}
	}
	for(let i = 0; i<11; i++){
		for(let j = 0; j<11; j++){
			//console.log(chessboard[i][j]);
			if(!all_in_bounds(i,j)||chessboard[i][j]==0){continue;}
			if(chessboard[i][j].get_color()==col){continue;}
			//console.log(i, j);
			//console.log(chessboard[i][j].poss_moves(chessboard), k_coords);
			//console.log(chessboard);
			if(my_includes(chessboard[i][j].poss_moves(chessboard), k_coords)){return true;}
		}
	}
	return false;
}


let hekcenterx=(x,y)=>CENTERX+UNIT_LENGTH*3*(x-5)/2;
let hekcentery=(x,y)=>CENTERY-UNIT_LENGTH*(2*y-x-5)*SQRT3/2;

function all_in_bounds(x,y){
    zee=z(x,y);
    return (x>=0 && x<11 && y>=0 && y<11 && zee>=0 && zee<11);
}
function dis2center(X,Y,x_coord,y_coord){
	return (x_coord-hekcenterx(X,Y))*(x_coord-hekcenterx(X,Y))+(y_coord-hekcentery(X,Y))*(y_coord-hekcentery(X,Y));
}
function get_hex(x_coord,y_coord){
	var X = Math.floor(2*(x_coord+UNIT_LENGTH-CENTERX)/(UNIT_LENGTH*3))+5;
	var Y = Math.floor((X+6+(2*CENTERY/SQRT3 -y_coord)/UNIT_LENGTH)/2);
	var closest=[X,Y]; var mind= dis2center(X,Y,x_coord,y_coord);
	for (i=-2;i<3;i++){
		for (j=-2;j<3;j++){
			var dis=dis2center(X-i,Y-j,x_coord,y_coord);
			if (mind>dis){
				closest=[X-i,Y-j];
				mind=dis;
			}
		}
	}
	return closest;
}

function my_includes(legal_moves, move_to){
	for(let i = 0; i<legal_moves.length; i++){
		if(legal_moves[i][0] == move_to[0]  &&  legal_moves[i][1] == move_to[1]){
			return true;
		}
	}
	return false;
}
function coverup(i, j){
	//use this as a last resort (or not ;) )
		chessboard[i][j] = 0;
		let X=hekcenterx(i,j);
		let Y=hekcentery(i,j);
		let col = "#c4a484";
		if((i+j)%3 == 2){
			col = "#654321";
		}
		else if((i+j)%3==1){
			col="#875d33";
		}
		/*else{
			col = "#c4a484";
		}*/
		var hexy = new fabric.Polygon([
			{ x: X-UNIT_LENGTH, y: Y },
			{ x: X-UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2 },
			{ x: X+UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2},
			{ x: X+UNIT_LENGTH, y: Y},
			{ x: X+UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2},
			{ x: X-UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2}],{
			fill: col,
			selectable: false
		});
		canvas.add(hexy);
	}


var can_en_passant=[-1,-1];//which pawn can be en passanted

class chess_piece{
	constructor(x, y, color, piece){
		this.x = x;
        this.y = y;
		this.color = color;
		this.piece = piece;
	}
	draw(){
		let x=this.x,y=this.y;
		fabric.Image.fromURL(this.piece+this.color+"t.png", function(img){
			img.set({
				left: CENTERX+UNIT_LENGTH*3*(x-5)/2 -UNIT_LENGTH*0.75,
				top:  CENTERY-UNIT_LENGTH*(2*y-x-5)*SQRT3/2 -UNIT_LENGTH*0.75 ,
				scaleX:1.5*UNIT_LENGTH/68,
				scaleY:1.5*UNIT_LENGTH/68,
				selectable: false,
				opacity: 1
			});
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
	poss_moves(chessboard){
		var poss = []
		if (this.piece=="r"||this.piece=="q"){
			for(let x_inc=this.x+1;all_in_bounds(x_inc,this.y);x_inc++){
				if (chessboard[x_inc][this.y]==0) poss.push([x_inc,this.y]);
				else if (this.opp_colour(chessboard[x_inc][this.y])){
					poss.push([x_inc,this.y]);
					break;
				}
				else break;
			}
			for(let x_dec=this.x-1;all_in_bounds(x_dec,this.y);x_dec--){
				if (chessboard[x_dec][this.y]==0) poss.push([x_dec,this.y]);
				else if (this.opp_colour(chessboard[x_dec][this.y])){
					poss.push([x_dec,this.y]);
					break;
				}
				else break;
			}
			for(let y_inc=this.y+1;all_in_bounds(this.x,y_inc);y_inc++){
				if (chessboard[this.x][y_inc]==0) poss.push([this.x,y_inc]);
				else if (this.opp_colour(chessboard[this.x][y_inc])){
					poss.push([this.x,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1;all_in_bounds(this.x,y_dec);y_dec--){
				if (chessboard[this.x][y_dec]==0) poss.push([this.x,y_dec]);
				else if (this.opp_colour(chessboard[this.x][y_dec])){
					poss.push([this.x,y_dec]);
					break;
				}
				else break;
			}
            for(let y_inc=this.y+1,x_inc=this.x+1;all_in_bounds(x_inc,y_inc);y_inc++, x_inc++){
				if (chessboard[x_inc][y_inc]==0) poss.push([x_inc,y_inc]);
				else if (this.opp_colour(chessboard[x_inc][y_inc])){
					poss.push([x_inc,y_inc]);
					break;
				}
				else break;
			}
            for(let y_dec=this.y-1,x_dec=this.x-1;all_in_bounds(x_dec,y_dec);y_dec--, x_dec--){
				if (chessboard[x_dec][y_dec]==0) poss.push([x_dec,y_dec]);
				else if (this.opp_colour(chessboard[x_dec][y_dec])){
					poss.push([x_dec,y_dec]);
					break;
				}
				else break;
			}

		}
		if (this.piece=="b"||this.piece=="q"){
			for(let y_inc=this.y+1,x_inc=this.x+2;all_in_bounds(x_inc,y_inc);y_inc++, x_inc+=2){
				if (chessboard[x_inc][y_inc]==0) poss.push([x_inc,y_inc]);
				else if (this.opp_colour(chessboard[x_inc][y_inc])){
					poss.push([x_inc,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_dec=this.x-2;all_in_bounds(x_dec,y_dec);y_dec--, x_dec-=2){
				if (chessboard[x_dec][y_dec]==0) poss.push([x_dec,y_dec]);
				else if (this.opp_colour(chessboard[x_dec][y_dec])){
					poss.push([x_dec,y_dec]);
					break;
				}
				else break;
			}
            for(let y_inc=this.y+2,x_inc=this.x+1;all_in_bounds(x_inc,y_inc);y_inc+=2, x_inc++){
				if (chessboard[x_inc][y_inc]==0) poss.push([x_inc,y_inc]);
				else if (this.opp_colour(chessboard[x_inc][y_inc])){
					poss.push([x_inc,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-2,x_dec=this.x-1;all_in_bounds(x_dec,y_dec);y_dec-=2, x_dec--){
				if (chessboard[x_dec][y_dec]==0) poss.push([x_dec,y_dec]);
				else if (this.opp_colour(chessboard[x_dec][y_dec])){
					poss.push([x_dec,y_dec]);
					break;
				}
				else break;
			}
            for(let y_inc=this.y+1,x_dec=this.x-1;all_in_bounds(x_dec,y_inc);y_inc++, x_dec--){
				if (chessboard[x_dec][y_inc]==0) poss.push([x_dec,y_inc]);
				else if (this.opp_colour(chessboard[x_dec][y_inc])){
					poss.push([x_dec,y_inc]);
					break;
				}
				else break;
			}
			for(let y_dec=this.y-1,x_inc=this.x+1;all_in_bounds(x_inc,y_dec);y_dec--, x_inc++){
				if (chessboard[x_inc][y_dec]==0) poss.push([x_inc,y_dec]);
				else if (this.opp_colour(chessboard[x_inc][y_dec])){
					poss.push([x_inc,y_dec]);
					break;
				}
				else break;
            }
		}

		else if (this.piece=="p"){
			if (this.color=="l"){
				if (chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if ((this.y==4&&z(this.x,this.y)<=4||z(this.x,this.y)==4&&this.y<=4) && chessboard[this.x][this.y+2]==0) poss.push([this.x,this.y+2]);
				if (all_in_bounds(this.x+1,this.y+1) && this.opp_colour(chessboard[this.x+1][this.y+1])) poss.push([this.x+1,this.y+1]);
				if (all_in_bounds(this.x-1,this.y) && this.opp_colour(chessboard[this.x-1][this.y])) poss.push([this.x-1,this.y]);
				//if (this.y==3 && can_en_passant[1]==3 && (this.x-can_en_passant[0]==1||this.x-can_en_passant[0]==-1)) poss.push([can_en_passant[0],2]);
				if (((this.x-1==can_en_passant[0] && this.y-1==can_en_passant[1])||(this.x+1==can_en_passant[0] && this.y==can_en_passant[1])) && this.opp_colour(chessboard[can_en_passant[0]][can_en_passant[1]])) poss.push([can_en_passant[0],can_en_passant[1]+1]);

			}
			else{
				if (chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-1]);
				if ((this.y==6&&z(this.x,this.y)>=6||z(this.x,this.y)==6&&this.y>=6) && chessboard[this.x][this.y-2]==0) poss.push([this.x,this.y-2]);
				if (all_in_bounds(this.x+1,this.y) && this.opp_colour(chessboard[this.x+1][this.y])) poss.push([this.x+1,this.y]);
				if (all_in_bounds(this.x-1,this.y-1) && this.opp_colour(chessboard[this.x-1][this.y-1])) poss.push([this.x-1,this.y-1]);
				if ((((this.x+1)==can_en_passant[0] && (this.y+1)==can_en_passant[1])||((this.x-1)==can_en_passant[0] && this.y==can_en_passant[1])) && this.opp_colour(chessboard[can_en_passant[0]][can_en_passant[1]])) poss.push([can_en_passant[0],can_en_passant[1]-1]);
			}
//if (this.y==3 && can_en_passant[1]==3 && (this.x-can_en_passant[0]==1||this.x-can_en_passant[0]==-1)) poss.push([can_en_passant[0],2]);

		}
		else if (this.piece=="n"){
			let all_poss=[[this.x-1,this.y+2],[this.x+1,this.y-2],[this.x-1,this.y-3],[this.x+1,this.y+3],[this.x+2,this.y+3],[this.x+2,this.y-1],[this.x-2,this.y+1],[this.x-2,this.y-3],[this.x+3,this.y+1],[this.x-3,this.y-1],[this.x-3,this.y-2],[this.x+3,this.y+2]];
			for (let i=0; i<12;i++){
				let condition=(all_in_bounds(all_poss[i][0],all_poss[i][1])) && !this.same_color(chessboard[all_poss[i][0]][all_poss[i][1]]);
				if (condition){poss.push(all_poss[i]);}
			}
		}
		else if (this.piece=="k"){
			let all_poss=[[this.x+1,this.y+1],[this.x+1,this.y-1],[this.x-1,this.y+1],[this.x-1,this.y-1],[this.x,this.y+1],[this.x,this.y-1],[this.x-1,this.y],[this.x+1,this.y],[this.x+2,this.y+1],[this.x-2,this.y-1],[this.x-1,this.y-2],[this.x+1,this.y+2]];
			for (let i=0; i<8;i++){
				let condition=(all_in_bounds(all_poss[i][0],all_poss[i][1])) && !this.same_color(chessboard[all_poss[i][0]][all_poss[i][1]]);
				if (condition){poss.push(all_poss[i]);}
			}
		}

		return poss;
	}
	moves(){
		let poss = this.poss_moves(chessboard);
		//console.log(poss);
		var actual_poss = [];
		for(let i = 0; i<poss.length; i++){
			var new_chessboard = [[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]];
			for(let p = 0; p<11; p++){
				for(let q = 0; q<11; q++){
					if(!all_in_bounds(p,q)){continue;}
					if(p==this.x && q==this.y){
						new_chessboard[p][q] = 0;
					}
					else if(p==poss[i][0]  &&  q==poss[i][1]){
						new_chessboard[p][q] = new chess_piece(p, q, this.color, this.piece);
					}
					else{
						new_chessboard[p][q] = chessboard[p][q];
					}
				}
			}
			//console.log(new_chessboard);
			//console.log(is_in_check(new_chessboard, this.color));
			if(!is_in_check(new_chessboard, this.color)){actual_poss.push(poss[i]);}
		}
		return actual_poss;
	}
};



var chessboard=[[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]];
//only 91 possible coordinates exist, either enforce that here, or in subsequent steps
/*
draw the chessboard here
*/
for(let i = 0; i < 11; i++){
	for(let j = 0; j < 11; j++){
		if (all_in_bounds(i,j)){
			let col;
			let X=hekcenterx(i,j);
			let Y=hekcentery(i,j);
			if((i+j)%3 == 2){
				col = "#654321";
			}
			else if((i+j)%3==1){
				col="#875d33";
			}
			else{
				col = "#c4a484";
			}
			var hexy = new fabric.Polygon([
				{ x: X-UNIT_LENGTH, y: Y },
				{ x: X-UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2 },
				{ x: X+UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2},
				{ x: X+UNIT_LENGTH, y: Y},
				{ x: X+UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2},
				{ x: X-UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2}],{
				fill: col,
				selectable: false
			});
			canvas.add(hexy);
			/*var test=new fabric.Circle({
				radius:5,
				left: hekcenterx(i+0.5,j+0.5)-5,
				top: hekcentery(i+0.5,j+0.5)-5,
			});
			canvas.add(test);*/
	}
	}
}
//console.log(chessboard[3][8]);
//This is Glinsky's Hexagonal chess variant, many others exist
//piece initialisation

//pawns
for(var eks=1;eks<6;eks++){
	chessboard[eks][6]=new chess_piece(eks,6,"d","p");
	chessboard[eks][6].draw();
	chessboard[10-eks][4]=new chess_piece(10-eks,4,"l","p");
	chessboard[10-eks][4].draw();
}
for(var eks=1,vai=0;vai<4;eks++,vai++){
	chessboard[eks][vai]=new chess_piece(eks,vai,"l","p");
	chessboard[eks][vai].draw();
	chessboard[10-eks][10-vai]=new chess_piece(10-eks,10-vai,"d","p");
	chessboard[10-eks][10-vai].draw();
}
//rooks
	chessboard[2][0]=new chess_piece(2,0,"l","r");
	chessboard[2][0].draw();
	chessboard[2][7]=new chess_piece(2,7,"d","r");
	chessboard[2][7].draw();
	chessboard[8][3]=new chess_piece(8,3,"l","r");
	chessboard[8][3].draw();
	chessboard[8][10]=new chess_piece(8,10,"d","r");
	chessboard[8][10].draw();
//knights
	chessboard[3][0]=new chess_piece(3,0,"l","n");
	chessboard[3][0].draw();
	chessboard[3][8]=new chess_piece(3,8,"d","n");
	chessboard[3][8].draw();
	chessboard[7][2]=new chess_piece(7,2,"l","n");
	chessboard[7][2].draw();
	chessboard[7][10]=new chess_piece(7,10,"d","n");
	chessboard[7][10].draw();
//bishops
for (var it=0;it<3;it++){
	chessboard[5][it]=new chess_piece(5,it,"l","b");
	chessboard[5][it].draw();
	chessboard[5][10-it]=new chess_piece(5,10-it,"d","b");
	chessboard[5][10-it].draw();
}
//queen
	chessboard[4][0]=new chess_piece(4,0,"l","q");
	chessboard[4][0].draw();
	chessboard[4][9]=new chess_piece(4,9,"d","q");
	chessboard[4][9].draw();
//king
	chessboard[6][1]=new chess_piece(6,1,"l","k");
	chessboard[6][1].draw();
	chessboard[6][10]=new chess_piece(6,10,"d","k");
	chessboard[6][10].draw();



function f_legal_moves(this_chessboard, col){
	for(let i = 0; i<11; i++){
		for(let j = 0; j<11; j++){
			if(!all_in_bounds(i,j)||this_chessboard[i][j] == 0){continue;}
			if(!(this_chessboard[i][j].get_color()==col)){continue;}
			if(this_chessboard[i][j].moves().length!=0){
				//console.log(i, j);
				return true;
			}
		}
	}
	return false;
}

//main game->
move_to = [-1,-1]; //square to which piece is to be moved
//[-1,-1] means that no move has been chosen yet
selected = false;
white_move = 0;
const w_b=["l","d"]
col=0;
to_be_moved = 0;
legal_moves = [];
var legal_moves_graphics=[];
var shade_piece = new fabric.Polygon([
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0},
	{ x: 0, y: 0},
	{ x: 0, y: 0},
	{ x: 0, y: 0}],{
	fill: "#00cc00",
	opacity: 0.4,
	selectable: false
});
canvas.add(shade_piece);


canvas.on("mouse:down", function(options) {
	//console.log(get_hex(options.e.clientX, options.e.clientY));
//main game loop
	if(selected){
		move_to = get_hex(options.e.clientX, options.e.clientY);
		for (var indexor=0; indexor<legal_moves_graphics.length; indexor++){
			canvas.remove(legal_moves_graphics[indexor]);
		}
		if(!(move_to[0] == moved_from[0]  &&  move_to[1] == moved_from[1])){
			//legal_moves = chessboard[moved_from[0]][moved_from[1]].moves();
			//console.log(legal_moves);
			if(my_includes(legal_moves, move_to)){ //can't use .includes for n-d arrays
				pc = chessboard[moved_from[0]][moved_from[1]].get_piece();
				coverup(moved_from[0], moved_from[1]);
				if(!(chessboard[move_to[0]][move_to[1]]==0)) coverup(move_to[0], move_to[1]);
				if(pc == "p"){
					z_move_to=z(move_to[0],move_to[1]);
					/* promotion:
						for white- (y==10)||(z==10)
						for black  (y==0)||(z==0)
					*/
					if((col == "l" && (move_to[1]==10||z_move_to==10))||((col=="d" && (move_to[1]==10||z_move_to==10)))){
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

					else if ((moved_from[1]==can_en_passant[1]||z(moved_from[0],moved_from[1])==z(can_en_passant[0],can_en_passant[1])) && move_to[0]==can_en_passant[0]){
						coverup(can_en_passant[0],can_en_passant[1]);
						can_en_passant=[-1,-1];
					}
					else{
						if ((col == "d" && (moved_from[1]-move_to[1]==2))||(col=="l" && (move_to[1]-moved_from[1]==2))) {can_en_passant[0]=move_to[0];can_en_passant[1]=move_to[1];}
						else can_en_passant=[8,8];
					}

				}
				//console.log(col);
				chessboard[move_to[0]][move_to[1]] = new chess_piece(move_to[0], move_to[1], col, pc);
				chessboard[move_to[0]][move_to[1]].draw();
				chessboard[moved_from[0]][moved_from[1]] = 0;
				legal_moves = [];
				moved_from = 0;
				white_move = 1-white_move;
			}
		}
		move_to = [-1,-1];
		selected = false;
		shade_piece.set([]);
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
		moved_from = get_hex(options.e.clientX, options.e.clientY);
		//console.log(chessboard[moved_from[0]][moved_from[1]]);
		if(options.target.type == "image" && !(chessboard[moved_from[0]][moved_from[1]]==0)){
			col = chessboard[moved_from[0]][moved_from[1]].get_color();
			if (col==w_b[white_move]){
				to_be_moved = options.target;
				selected = true;
				legal_moves=chessboard[moved_from[0]][moved_from[1]].moves();
				//console.log(chessboard[moved_from[0]][moved_from[1]].moves());
				let X=hekcenterx(moved_from[0],moved_from[0]), Y=hekcentery(moved_from[0],moved_from[0]);
				shade_piece.set([{ x: X-UNIT_LENGTH, y: Y },
					{ x: X-UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2 },
					{ x: X+UNIT_LENGTH/2, y: Y+UNIT_LENGTH*SQRT3/2},
					{ x: X+UNIT_LENGTH, y: Y},
					{ x: X+UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2},
					{ x: X-UNIT_LENGTH/2, y: Y-UNIT_LENGTH*SQRT3/2}]);
				//console.log(legal_moves);
				for (var indexor=0; indexor<legal_moves.length; indexor++){
					legal_moves_graphics[indexor]= new fabric.Circle({radius:10, fill:"#00CC00",opacity:0.3, left:CENTERX+UNIT_LENGTH*3*(legal_moves[indexor][0]-5)/2 -10 ,top:CENTERY-UNIT_LENGTH*(2*legal_moves[indexor][1]-legal_moves[indexor][0]-5)*SQRT3/2 -10});
					canvas.add(legal_moves_graphics[indexor]);
				}


			}
		}
		else{
			moved_from = [];
		}
	}
});