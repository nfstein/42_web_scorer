var $we10 = document.querySelector("#we10");
var $we5 = document.querySelector("#we5");
var $weTrick = document.querySelector("#weTrick");

var $total = document.querySelector("#total");
var $clear = document.querySelector("#clear");

var $switch = document.querySelector('#switch');

var $theyTrick = document.querySelector("#theyTrick");
var $they5 = document.querySelector("#they5");
var $they10 = document.querySelector("#they10");

var $weTotal = document.querySelector("#weTotal");
var $theyTotal = document.querySelector("#theyTotal");

var $weCounter = document.querySelector("#weCounter");
var $theyCounter = document.querySelector("#theyCounter");
var $countSum = document.querySelector("#countSum");

var $table = document.querySelector('table')

var weCount = 0;
var theyCount = 0;

var weTotal = 0;
var theyTotal = 0;

var scores = [];
var roundCounter = 0;

var tableBottom = 0;

var debugMessages = true;
var gameLogic = true;

var rules42 = {
    maxBid: 42,
    minBid:  30,
    trickValue: 1,
    numPlayers: 4
}

var rules88 = {
    maxBid: 88,
    minBid:  60,
    trickValue: 2,
    numPlayers: 6
}

var gameStats = rules42

init(rules42)


$weTrick.addEventListener("click", function(){
    weCount += gameStats.trickValue;
    renderCount(weCount, theyCount);
});

$we5.addEventListener("click", function(){
    weCount += 5;
    renderCount(weCount, theyCount);
});

$we10.addEventListener("click", function(){
    weCount += 10;
    renderCount(weCount, theyCount);
});

$theyTrick.addEventListener("click", function(){
    theyCount += gameStats.trickValue;
    renderCount(weCount, theyCount);
});

$they5.addEventListener("click", function(){
    theyCount += 5;
    renderCount(weCount, theyCount);
});

$they10.addEventListener("click", function(){
    theyCount += 10;
    renderCount(weCount, theyCount);
});

$countSum.addEventListener("click", function () {
    //complete scores so they add up to gameStats.maxBid
    if ((weCount == 0) && (theyCount > 0)) {
        renderCount(gameStats.maxBid - theyCount, theyCount)
    }
    else if ((theyCount == 0) && (weCount > 0)) {
        renderCount(weCount, gameStats.maxBid - weCount)
    }
});

$weCounter.addEventListener("click", function() {
    //autofill 42 on click when scores are empty
    if ((weCount % gameStats.maxBid == 0) && (theyCount == 0)) {
        weCount += gameStats.maxBid;
        renderCount(weCount, 0);
    };
});

$theyCounter.addEventListener("click", function() {
    //autofill 42 on click when scores are empty
    if ((weCount == 0) && (theyCount % gameStats.maxBid == 0)) {
        theyCount += gameStats.maxBid;
        renderCount(0, theyCount);
    };
});

$switch.addEventListener("click", function () {
    if (gameStats == rules42) {
        if (confirm("Switch from 42 to 88?")) {
            clearTable();
            renderCount(0,0);
            init(rules88);
        }
    } else if (gameStats == rules88) {
        if (confirm("Switch from 88 to 42?")) {
            clearTable();
            renderCount(0,0);
            init(rules42);
        }
    }
    
    
    ;
})

$total.addEventListener("click", function(){
    console.log(weCount + ' - ' + theyCount)
    if ((weCount == 0) && (theyCount == 0)) {
        return console.log('empty score')
    }

    // test for rules compliance and pottentially break without scoring
    if (weCount >= theyCount) {
        testPassed = scoreTest(weCount, theyCount) 
    } else {testPassed = scoreTest(theyCount, weCount)};

    //if the score is potentially invalid raise alert to proceed or reset
    if (!testPassed && gameLogic) {
        if (confirm("invalid score; add anyway?")) {
            rackScores(weCount, theyCount)
        } else {
            renderCount(0, 0)
        }

    } 
    // if the score is valid put 
    else{ rackScores(weCount, theyCount) };

});

$clear.addEventListener("click", function() {

    console.log('clear counts')
    renderCount(0, 0)
});

$clear.addEventListener("dblclick", clearTable);

$table.addEventListener("dblclick", clearTable);

$table.addEventListener('click', function removeLast(){
    
    if (confirm("Delete last row?")) {
        scores.splice(-1,1)
        renderTotal()
        roundCounter = parseInt(roundCounter) - 1
        if (debugMessages) { console.log('deleted last row',scores,roundCounter)};
    }

});

function init(rules) {
    try {
        scores = JSON.parse(localStorage.scores);
        roundCounter = localStorage.counter;
        console.log(scores, roundCounter)
        if (scores == null) {
            scores = []
            roundCounter = 0
            if (debugMessages) {
                console.log("initializing empty variables", roundCounter, scores)
            }
        } else {renderTotal()}
    }
    catch (error) {
        scores = []
        roundCounter = 0
        if (debugMessages) {
            console.log("initializing empty variables", roundCounter, scores)
            console.log(error)
        }
    };

    gameStats = rules

    $weTrick.innerHTML = gameStats.trickValue
    $theyTrick.innerHTML = gameStats.trickValue
    $switch.innerHTML = gameStats.maxBid
}

function rackScores(weVal, theyVal) {
    if (debugMessages) {`rackScores(${weVal},${theyVal})`}
    weTotal += weVal;
    theyTotal += theyVal;

    scores[roundCounter] = {'we': weVal, 'they': theyVal};
    if (debugMessages) {console.log('roundCounter before', roundCounter)};
    // roundCounter was periodically being converted to a string somewhere
    roundCounter = parseInt(roundCounter) + 1;
    if (debugMessages) {console.log('roundCounter after', roundCounter)};


    weCount = 0
    theyCount = 0

    renderCount(weCount, theyCount);
    renderTotal();
}

function renderCount (weVal, theyVal) {
    //if (debugMessages) {`renderCount(${weVal},${theyVal})`}
    weCount = weVal;
    theyCount = theyVal;
    $weCounter.innerHTML = "<h2>" + weCount + "</h2>";
    $theyCounter.innerHTML = "<h2>" + theyCount + "</h2>";
    $countSum.innerHTML = (weCount + theyCount);
};

function renderTotal () {
    d3.selectAll('tr').remove();
    weTotal = 0;
    theyTotal = 0;
    // recount totals in populateTable
    scores.forEach(populateTable);

    $weTotal.innerHTML = "<h3>" + weTotal + "</h3>";
    $theyTotal.innerHTML = "<h3>" + theyTotal + "</h3>";

    //$table.scrollTo(0,$table.scrollHeight);
    var $tableRow = document.querySelector('#tableRow')
    $tableRow.scrollTop = tableBottom;

    localStorage.setItem("scores", JSON.stringify(scores));
    localStorage.setItem("counter", roundCounter);

    console.log(scores)
};

function populateTable (scoreDict) {
    //if (debugMessages) { console.log(scoreDict)}
    $baseTable = document.querySelector('tbody');
    $tr = document.createElement('tr');
    $tr.innerHTML = `<td style="width:50%; text-align: center;"> ${scoreDict.we}</td><td style="width:50%; text-align: center;">${scoreDict.they}</td>`
    $tr.style.height = '20px'
    $baseTable.appendChild($tr);
    weTotal += scoreDict.we;
    theyTotal += scoreDict.they;
    scrollBottom = $table.scrollHeight;
    if (debugMessages) { console.log('scroll: ',scrollBottom)}


    //$tr.scrollIntoView(); //not a great solution, scrolls outside window as well, I only want to scroll the table

};

function clearTable () {
    if (confirm('Clear whole table?')) {
        localStorage.clear();
        roundCounter = 0;
        scores = [];
        renderCount(0,0);
        renderTotal();
        console.log('cleared table')
    }
    else if (debugMessages) {console.log('clearTable canceled')}
};

function scoreTest(high, low){
    //scores must be positive or zero
    if (low < 0) { 
        console.log('failed nonzero score test')
        return false;
    }
    //high score must be below cap
    if (high > gameStats.maxBid*gameStats.numPlayers) {
        console.log('score too high')
        return false;
    }
    // high score must be above gameStats.minBid
    if ((high + low) == gameStats.maxBid) {
        if (high >= gameStats.minBid) {
            console.log('passed made bid test')
            return true;} 
        else { 
            console.log('failed made bid test')
            return false; };
    } 

    // checks for set conditions
    else if ((gameStats.maxBid<high) && (high<(2*gameStats.maxBid))) {
        if (low == 0) {
            console.log('passed set test')
            return true;}
        else {
            console.log('failed set test')
            return false}
    }

    // checks for multiples of 42
    // already tested for nonzero high value
    if (high % gameStats.maxBid == 0) {
        if (low == 0) {
            console.log('passed 42/nil test')
            return true;} 
        else {
            console.log('failed 42/nil test')            
            return false;}
    } 

    console.log('failed general test')
    return false;

}

//$tr.addEventListener('click', function () {console.log(this)});