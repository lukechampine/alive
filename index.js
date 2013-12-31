var canvas, ctx, age, curViz;

// draw remaining years as a column of rectangles
function drawYears() {
    // resize canvas
    canvas.height = 500;
    canvas.width = 92;
    // past years
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
    for (var i = 0; i < age.years; i++)
    	ctx.fillRect((i % 5) * 20, Math.floor(i/5) * 20, 10, 10);
    // current year
    ctx.fillStyle = "rgba(200, 0, 0," + 0.5 * (age.months % 12) / 12 + ")";
    ctx.fillRect((age.years % 5) * 20, Math.floor(age.years/5) * 20, 10, 10);
    ctx.fillStyle = "rgba(0, 0, 200," + 0.5 * (1 - (age.months % 12) / 12) + ")";
    ctx.fillRect((age.years % 5) * 20, Math.floor(age.years/5) * 20, 10, 10);
    // future years
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    for (var i = age.years + 1; i < 100; i++)
		ctx.fillRect((i % 5) * 20, Math.floor(i/5) * 20, 10, 10);
}

// calculate age and store various increments in an object
function calcAge() {
    var birthday = +new Date(document.getElementById("dob").value);
    var s = (Date.now() - birthday) / 1000;
    age = {
        seconds: Math.floor(s),
        days: Math.floor(s / (60*60*24)),
        weeks: Math.floor(s / (60*60*24*7)),
        months: Math.floor(s / (60*60*24*30.42)),
        years: Math.floor(s / (60*60*24*365.25)),
    }
}

// recalculate age, clear canvas, and call current visualization function
function update() {
	calcAge();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	curViz();
}

// initialize global variables and update
function main() {
	canvas = document.getElementById("canvas");
    if (!canvas.getContext) return;
    ctx = canvas.getContext("2d");
    curViz = drawYears;
    update();
}
