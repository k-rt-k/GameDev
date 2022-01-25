const canvas = document.querySelector('canvas');
var c = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500
canvas.height = 500
for(let i = 0; i < 8; i++){
	for(let j = 0; j < 8; j++){
		ctx.beginPath();
		ctx.rect(62.5*i, 62.5*j, 62.5, 62.5);
		if((i+j)%2 == 1){
			ctx.fillStyle = "#654321";
		}
		else{
			ctx.fillStyle = "#c4a484";
		}
		ctx.fill();
	}
}
console.log(canvas)