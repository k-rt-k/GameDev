const screen = document.getElementById("gameScreen");

screen.width= innerWidth;
screen.height= innerHeight;

class piece{
    constructor(x,y,is_white,type){
        this.x=x;
        this.y=y;
        this.white=is_white;//boolean
        this.type=type;
        this.active=true; //still on the board
    
    }
    set moveto(X,Y){
        this.x=X; this.y=Y;
    }
    set promote(new_type){ //pawn promotion
        if (this.type=='p') this.type=new_type;
    }
    set kill(){ 
        this.active=false;
    }
    opp(it_white){ //returns if two pieces are of opposite colour
        return (it_white^this.white);
    }
}

class board{




}



//game loop

while (true){ //turns

    //white moves
/*  white clock ,if, resumes
    compute if stalemate?
    wait for piece click
    show possible moves->check??/checkmate/legal moves?
    move
*/
    //black moves
    //same as white

}