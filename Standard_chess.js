//Regular chessboard
function initialise(chessboard){
    
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
    chessboard[3][7].draw();
    chessboard[3][0] = new chess_piece(3, 0, "d", "q", 0);
    chessboard[3][0].draw();
    chessboard[4][7] = new chess_piece(4, 7, "l", "k", 0);
    chessboard[4][7].draw();
    chessboard[4][0] = new chess_piece(4, 0, "d", "k", 0);
    chessboard[4][0].draw();


};