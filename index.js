var canvas, ctx, age, curViz;

// draw remaining years as a grid of circles, 13 wide
function drawWeeks() {
    // parameters
    var cols = 52;
    var radius = 3;
    var spacing = 2*radius + 4;
    // resize canvas
    canvas.height = Math.ceil((5218 - age.weeks)/cols)*spacing - (spacing - 2*radius);
    canvas.width = cols*spacing - (spacing - 2*radius);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    // draw past weeks from bottom up
    for (var i = 0; i < 5217 - age.weeks; i++) {
        var x = canvas.width - (i % cols)*spacing;
        var y = canvas.height - Math.floor(i/cols)*spacing;
        ctx.beginPath();
        ctx.arc(x - radius, y - radius, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    // draw current week
    ctx.beginPath();
    x = canvas.width - ((5217 - age.weeks) % cols)*spacing;
    y = canvas.height - Math.floor((5217 - age.weeks)/cols)*spacing;
    var frac = ((24*365.25*100 - age.hours) % (24*7)) / (24*7);
    ctx.arc(x - radius, y - radius, radius, -Math.PI/2, -Math.PI/2 + 2*Math.PI*frac, false);
    ctx.lineTo(x - radius, y - radius);
    ctx.closePath();
    ctx.fill();
}

// draw remaining years as a column of rectangles
function drawYears() {
    // parameters
    var cols = 5;
    var size = 10;
    var spacing = 20;
    // resize canvas
    canvas.height = Math.ceil(100/cols)*spacing - (spacing - size);
    canvas.width = cols*spacing - (spacing - size);
    // past years
    ctx.fillStyle = "rgba(200, 0, 0, 0.6)";
    for (var i = 0; i < age.years; i++)
    	ctx.fillRect((i % cols)*spacing, Math.floor(i/cols)*spacing, size, size);
    // current year
    ctx.fillStyle = "rgba(200, 0, 0," + 0.6*(age.months % 12) / 12 + ")";
    ctx.fillRect((age.years % cols)*spacing, Math.floor(age.years/cols)*spacing, size, size);
    ctx.fillStyle = "rgba(0, 0, 200," + 0.6*(1 - (age.months % 12) / 12) + ")";
    ctx.fillRect((age.years % cols)*spacing, Math.floor(age.years/cols)*spacing, size, size);
    // future years
    ctx.fillStyle = "rgba(0, 0, 200, 0.6)";
    for (var i = age.years + 1; i < 100; i++)
		ctx.fillRect((i % cols)*spacing, Math.floor(i/cols)*spacing, size, size);
}

// calculate age and store various increments in an object
function calcAge() {
    var birthday = +new Date(document.getElementById("dob").value);
    var s = (Date.now() - birthday) / 1000;
    age = {
        seconds: Math.floor(s),
        minutes: Math.floor(s/60),
        hours: Math.floor(s/(60*60)),
        days: Math.floor(s/(60*60*24)),
        weeks: Math.floor(s/(60*60*24*7)),
        months: Math.floor(s/(60*60*24*30.42)),
        years: Math.floor(s/(60*60*24*365.25)),
    }
}

// error message displayed for centenarians
function dead() {
    canvas.width = 123;
    canvas.height = 15;
    ctx.font = "20px Arial";
    ctx.fillText("You are dead!", 0, 15);
}

// change the visualization function and update
function setViz(drawFn) {
    curViz = drawFn;
    update();
}

// recalculate age, clear canvas, and call current visualization function
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	calcAge();
    // check pulse
    if (age.years >= 100)
        dead();
    else
	   curViz();
}

// initialize global variables and update
function main() {
	canvas = document.getElementById("canvas");
    if (!canvas.getContext) return;
    ctx = canvas.getContext("2d");
    curViz = drawWeeks;
    update();
}
