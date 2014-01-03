var canvas, ctx, age, curViz;
var maxAge = {
    seconds: 60*60*24*365.25*80,
    minutes: 60*24*365.25*80,
    hours: 24*365.25*80,
    days: 365.25*80,
    weeks: 365.25*80/7,
    months: 365.25*80/30.41,
    years: 80
};

// draw remaining hours as a stack of bars
function drawHours() {
    // update every hour
    setTimeout(update, (60 - new Date().getMinutes())*60*1000);
    // parameters
    var cols = 974;
    var barHeight = 24*365.25/cols;
    var spacing = barHeight + 1;
    // resize canvas
    var numBars = Math.ceil(maxAge.years - age.years);
    canvas.height = numBars*spacing - (spacing - barHeight);
    canvas.width = cols;
    // draw future years' hours from bottom up
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    for (var i = 0; i < numBars; i++)
        ctx.fillRect(0, canvas.height - spacing*i + 1, canvas.width, barHeight);
    // draw current year's hours
    var excess = (maxAge.hours - age.hours) % (24*365.25);
    ctx.fillRect(0, barHeight - Math.floor(excess/cols), canvas.width, Math.floor(excess/cols));
    ctx.fillStyle = "rgba(200, 0, 0, 0.8)";
    ctx.fillRect(canvas.width - Math.floor(excess % cols), barHeight - Math.floor(excess/cols) - 1, canvas.width, 1);
}

// draw remaining years as a grid of circles, 13 wide
function drawWeeks() {
    // update every hour
    setTimeout(update, (60 - new Date().getMinutes())*60*1000);
    // parameters
    var cols = 52;
    var radius = 3;
    var spacing = 2*radius + 4;
    // resize canvas
    canvas.height = Math.ceil((maxAge.weeks - age.weeks)/cols)*spacing - (spacing - 2*radius);
    canvas.width = cols*spacing - (spacing - 2*radius);
    // draw future weeks from bottom up
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    for (var i = 0; i < Math.floor(maxAge.weeks - age.weeks); i++) {
        var x = canvas.width - (i % cols)*spacing;
        var y = canvas.height - Math.floor(i/cols)*spacing;
        ctx.beginPath();
        ctx.arc(x - radius, y - radius, radius, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    // draw current week
    ctx.beginPath();
    x = canvas.width - (Math.floor(maxAge.weeks - age.weeks) % cols)*spacing;
    y = canvas.height - Math.floor((maxAge.weeks - age.weeks)/cols)*spacing;
    var frac = ((maxAge.hours - age.hours) % (24*7)) / (24*7);
    ctx.arc(x - radius, y - radius, radius, -Math.PI/2, -Math.PI/2 + 2*Math.PI*frac, false);
    ctx.lineTo(x - radius, y - radius);
    ctx.closePath();
    ctx.fill();
}

// draw remaining years as a column of rectangles
function drawYears() {
    // update every day
    setTimeout(update, (24 - new Date().getHours())*60*60*1000);
    // parameters
    var cols = 5;
    var size = 10;
    var spacing = 20;
    // resize canvas
    canvas.height = Math.ceil(maxAge.years/cols)*spacing - (spacing - size);
    canvas.width = cols*spacing - (spacing - size);
    // past years
    ctx.fillStyle = "rgba(200, 0, 0, 0.6)";
    for (var i = 0; i < Math.floor(age.years); i++)
    	ctx.fillRect((i % cols)*spacing, Math.floor(i/cols)*spacing, size, size);
    // current year
    ctx.fillStyle = "rgba(200, 0, 0," + 0.6*(age.months % 12) / 12 + ")";
    ctx.fillRect((Math.floor(age.years) % cols)*spacing, Math.floor(age.years/cols)*spacing, size, size);
    ctx.fillStyle = "rgba(0, 0, 200," + 0.6*(1 - (age.months % 12) / 12) + ")";
    ctx.fillRect((Math.floor(age.years) % cols)*spacing, Math.floor(age.years/cols)*spacing, size, size);
    // future years
    ctx.fillStyle = "rgba(0, 0, 200, 0.6)";
    for (var i = Math.ceil(age.years); i < maxAge.years; i++)
		ctx.fillRect((i % cols)*spacing, Math.floor(i/cols)*spacing, size, size);
}

// calculate age and store various increments in an object
function calcAge() {
    var birthday = +new Date(document.getElementById("dob").value);
    var s = (Date.now() - birthday) / 1000;
    age = {
        seconds: s,
        minutes: s/60,
        hours: s/(60*60),
        days: s/(60*60*24),
        weeks: s/(60*60*24*7),
        months: s/(60*60*24*30.42),
        years: s/(60*60*24*365.25),
    };
}

// message displayed for centenarians
function dead() {
    canvas.width = 123;
    canvas.height = 15;
    ctx.font = "20px Arial";
    ctx.fillText("You are dead!", 0, 15);
}

// message displayed for potential uploads
function immortal() {
    canvas.width = 327;
    canvas.height = 50;
    ctx.font = "20px Arial";
    ctx.fillText("You will live to see the singularity.", 15, 15);
    ctx.fillText("Your lifespan is impossible to predict.", 0, 40);
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
    if (age.years === NaN)
        return;
    else if (age.years >= maxAge.years)
        dead();
    else if (age.years < 10)
        immortal();
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
