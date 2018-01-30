var $we10 = document.querySelector("#we10");
var $we5 = document.querySelector("#we5");
var $we1 = document.querySelector("#we1");

var $total = document.querySelector("#total");
var $clear = document.querySelector("#clear");

var $they1 = document.querySelector("#they1");
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
scores = []

maxBid = 42
minBid = 30

$we1.addEventListener("click", function(){
    weCount ++;
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

$they1.addEventListener("click", function(){
    theyCount ++;
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
    if (!testPassed) {
        if (confirm("invalid score; add anyway?")) {
            rackScores(weCount, theyCount)
        } else {
            renderCount(0, 0)
        }

    } 
    // if the score is valid put 
    else{ rackScores(weCount, theyCount) };

});

$countSum.addEventListener("click", function () {
    if ((weCount == 0) && (theyCount > 0)) {
        renderCount(maxBid - theyCount, theyCount)
    }
    else if ((theyCount == 0) && (weCount > 0)) {
        renderCount(weCount, maxBid - weCount)
    }
});

$weCounter.addEventListener("click", function() {
    if ((weCount == 0) && (theyCount == 0)) {
        renderCount(maxBid, 0)
    }
});

$theyCounter.addEventListener("click", function() {
    if ((weCount == 0) && (theyCount == 0)) {
        renderCount(0, maxBid)
    }
});

$clear.addEventListener("click", function() {
    console.log('clear')
    renderCount(0, 0)}
);

function rackScores(weVal, theyVal) {
    weTotal += weVal;
    theyTotal += theyVal

    scores.push({'we': weVal, 'they': theyVal})

    weCount = 0
    theyCount = 0

    renderCount(weCount, theyCount);
    renderTotal();
}

function renderCount (weVal, theyVal) {
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
};

function populateTable (scoreDict) {
    $baseTable = document.querySelector('tbody');
    $tr = document.createElement('tr');
    $tr.innerHTML = `<th style="width:100%;"> ${scoreDict.we}</th><th style="width:100%;">${scoreDict.they}</th>`
    $baseTable.appendChild($tr);
    weTotal += scoreDict.we
    theyTotal += scoreDict.they
};

function scoreTest(high, low){
    //scores must be positive or zero
    if (low < 0) { 
        console.log('failed nonzero score test')
        return false;}

    // high score must be above minBid
    if ((high + low) == maxBid) {
        if (high >= minBid) {
            console.log('passed made bid test')
            return true;} 
        else { 
            console.log('failed made bid test')
            return false; };
    } 

    // checks for set conditions
    else if ((maxBid<high) && (high<(2*maxBid))) {
        if (low == 0) {
            console.log('passed set test')
            return true;}
        else {
            console.log('failed set test')
            return false}
    }

    // checks for multiples of 42
    // already tested for nonzero high value
    if (high % maxBid == 0) {
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

$table.addEventListener('click', function removeLast(){
    scores.splice(-1,1)
    renderTotal()
});