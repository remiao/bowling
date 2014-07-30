// Variables
var myFrames = [];
var totalFrames = 10;
var throwsPerFrame = 2;
var minPins = 0;
var maxPins = 10;

function frame(frameNumber,frameThrows,frameTotal){
	this.frameNumber = frameNumber;
	this.frameThrows = frameThrows;
	this.frameTotal = frameTotal;
}

// Populate template to print out formatted scores

function populateTemplate(template){
	var html = "";
	var gameTotal = 0;
	$(myFrames).each(
		function(index,frame){
			var printOut = template;
			gameTotal += frame.frameTotal;
			if( (frame.frameThrows[0] < maxPins) && (frame.frameTotal >= maxPins) )
				frame.frameThrows = [frame.frameThrows[0],"/"];
			else if(frame.frameThrows[0] == maxPins)
				frame.frameThrows = ["","X"];
			for(var name in frame)
				printOut = printOut.replace(name, eval("frame."+name));
			$(frame.frameThrows).each(
				function(frameThrowIndex){
					printOut = printOut.replace(("frameThrow"+frameThrowIndex), frame.frameThrows[frameThrowIndex]);		
				}
			);
			html += printOut;
		}
	);
	$("#frameBody").html(html);
	$("#gameTotal").html(gameTotal);
}

// Fetch template for print-out of score

function printScore(){
	$.ajax({
		url: "template/frame.html",
		cache: false
	}).done(function(data) {
		populateTemplate(data);
	});
}

// Check previous for strike/spare to see if extra points should be added

function checkForExtraPoints(index){
	var previousFrame = myFrames[(index-2)];
	var currentFrame = myFrames[(index-1)];
	if( (previousFrame.frameTotal == maxPins) )
		previousFrame.frameTotal += (currentFrame.frameThrows[0] + currentFrame.frameThrows[1]);
}

// Create frames

function createFrames(frameNumber,throwsPerFrame){
	var numberOfPins = maxPins;
	var numberOfThrows = throwsPerFrame;
	var frameTotal = 0;
	var frameThrows = [];
	while (numberOfThrows > 0){
		var ballTotal = Math.floor( (Math.random() * ((numberOfPins+1) - minPins) + minPins) );
		frameThrows.push(ballTotal);
		numberOfPins = numberOfPins - ballTotal;
		if ( (numberOfThrows == throwsPerFrame) && (numberOfPins == minPins) ) {
			frameThrows.push(0);
			numberOfThrows = 0;
		} else
			numberOfThrows--;
		frameTotal = frameTotal + ballTotal;
	}
	if(throwsPerFrame == 1) frameThrows[frameThrows.length] = 0;
	var thisFrame = new frame(frameNumber, frameThrows, frameTotal);
	myFrames.push(thisFrame);
	if(frameNumber > 1)
		checkForExtraPoints(frameNumber);
	if( (frameNumber == totalFrames) && (frameThrows[0] == maxPins) )
		createFrames((frameNumber+1),throwsPerFrame);
	else if( (frameNumber == totalFrames) && (frameThrows[0] < maxPins) && (frameTotal >= maxPins) )
		createFrames((frameNumber+1), 1);
}

// Play Game

function playGame(){
	myFrames = [];
	for(var i = 1; i <= totalFrames; i ++)
		createFrames(i,throwsPerFrame);
	printScore();	
}

$(document).ready(
	function(){
		$("button").click(
			function(){
				playGame();
			}
		);
		playGame();
	}
);