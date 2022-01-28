//chess piece class
//refer Hexagonal_chess.png
/* coordinates
         y10/\
          y0| |
         x0 \/ x10
*/
//white taken towards 0 side
let z =(x,y)=>5+y-x;
function all_in_bounds(x,y){
    zee=5+y-x;
    return (x>=0&&x<11&&y>=0&&y<11&&zee>=0&&zee<11)
}
class chess_piece{
	constructor(x, y, color, piece){
		this.x = x; 
        
		this.color = color;
		this.piece = piece;
	}
/*	draw(){              must find transformation
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
*/
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
	moves(){
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
			if (this.is_white()){
				if (chessboard[this.x][this.y+1]==0) poss.push([this.x,this.y+1]);
				if ((this.y==4||z(this.x,this.y)==4)&&chessboard[this.x][this.y+2]==0) poss.push([this.x,this.y+2]);
				if (all_in_bounds(this.x+1,this.y)&&this.opp_colour(chessboard[this.x+1][this.y])) poss.push([this.x+1,this.y]);
				if (all_in_bounds(this.x-1,this.y-1)&&this.opp_colour(chessboard[this.x-1][this.y-1])) poss.push([this.x-1,this.y-1]);
			}
			else{
				if (chessboard[this.x][this.y-1]==0) poss.push([this.x,this.y-1]);
				if ((this.y==6||z(this.x,this.y)==6)&&chessboard[this.x][this.y-2]==0) poss.push([this.x,this.y-2]);
				if (all_in_bounds(this.x+1,this.y+1)&&this.opp_colour(chessboard[this.x+1][this.y+1])) poss.push([this.x+1,this.y+1]);
				if (all_in_bounds(this.x-1,this.y)&&this.opp_colour(chessboard[this.x-1][this.y])) poss.push([this.x-1,this.y]);
			}


		}
		else if (this.piece=="n"){
			let all_poss=[[this.x-1,this.y+2],[this.x+1,this.y-2],[this.x-1,this.y-3],[this.x+1,this.y+3],[this.x+2,this.y+3],[this.x+2,this.y-1],[this.x-2,this.y+1],[this.x-2,this.y-3],[this.x+3,this.y+1],[this.x-3,this.y-1],[this.x-3,this.y-2],[this.x+3,this.y+2]];
			for (let i=0; i<12;i++){
				let condition=(all_in_bounds(all_poss[0],all_poss[1]))&&!this.same_color(chessboard[all_poss[i][0]][all_poss[i][1]]);
				if (condition){poss.push(all_poss[i]);}
			}
		}
		else if (this.piece=="k"){
			let all_poss=[[this.x+1,this.y+1],[this.x+1,this.y-1],[this.x-1,this.y+1],[this.x-1,this.y-1],[this.x,this.y+1],[this.x,this.y-1],[this.x-1,this.y],[this.x+1,this.y],[this.x+2,this.y+1],[this.x-2,this.y-1],[this.x-1,this.y-2],[this.x+1,this.y+2]];
			for (let i=0; i<8;i++){
				let condition=(all_in_bounds(all_poss[0],all_poss[1]))&&!this.same_color(chessboard[all_poss[i][0]][all_poss[i][1]]);
				if (condition){poss.push(all_poss[i]);}
			}
		}
		
		return poss;
	}
}
