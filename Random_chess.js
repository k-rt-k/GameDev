function remove_from(the_array,black_list){   
    for (var intit=0;intit<the_array.length;intit++){
        if (black_list==the_array[intit]){
            the_array.splice(intit,1);
            break;
        }
    }
    
}
var chessboard = [[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]];
//fischer random chess/ chess 960
//https://en.wikipedia.org/wiki/Fischer_random_chess#Creating_starting_positions
function fischer_random(){
    let free_squares=[0,1,2,3,4,5,6,7]
    for(let i = 0; i<8; i++){
        chessboard[i][6] = new chess_piece(i, 6, "l", "p");
        chessboard[i][6].draw();
    }
    for(let i = 0; i<8; i++){
        chessboard[i][1] = new chess_piece(i, 1, "d", "p");
        chessboard[i][1].draw();
    }
    //enforce bishops occupy diff colours
    let one_bish=2*Math.floor(Math.random()*4);
    let two_bish=2*Math.floor(Math.random()*4)+1;
        chessboard[one_bish][7] = new chess_piece(one_bish, 7, "l", "b");
        chessboard[one_bish][7].draw();
        chessboard[one_bish][0] = new chess_piece(one_bish, 0, "d", "b");
        chessboard[one_bish][0].draw();
        chessboard[two_bish][7] = new chess_piece(two_bish, 7, "l", "b");
        chessboard[two_bish][7].draw();
        chessboard[two_bish][0] = new chess_piece(two_bish, 0, "d", "b");
        chessboard[two_bish][0].draw();

    remove_from(free_squares,one_bish);remove_from(free_squares,two_bish);

    let nnq=["n","n","q"];
    for(let i = 0; i<3; i++){
        var rand_row=free_squares[Math.floor(Math.random()*free_squares.length)]   
        chessboard[rand_row][7]= new chess_piece(rand_row,7,"l",nnq[i]);
        chessboard[rand_row][7].draw();
        chessboard[rand_row][0]= new chess_piece(rand_row,0,"d",nnq[i]);
        chessboard[rand_row][0].draw();
        remove_from(free_squares,rand_row)
    }
    let rkr=["r","k","r"];
    for(let i = 0; i<3; i++){     
        chessboard[free_squares[i]][7]= new chess_piece(free_squares[i],7,"l",rkr[i]);
        chessboard[free_squares[i]][7].draw();
        chessboard[free_squares[i]][0]= new chess_piece(free_squares[i],0,"d",rkr[i]);
        chessboard[free_squares[i]][0].draw();
        
    }
}