function calcAge(dateString) {
	var birthday = +new Date(dateString);
	return ~~((Date.now() - birthday) / (31557600000));
}

function draw() {
    var canvas = document.getElementById("canvas");
    var age = calcAge(document.getElementById("dob").value);
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(200,0,0,0.5)";
        ctx.fillRect (0, 0, 73, age*5);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (0, age*5, 73, 500);
    }
}