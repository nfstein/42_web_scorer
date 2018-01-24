var $we10 = document.querySelector("#we10");
var $we5 = document.querySelector("#we5");
var $we1 = document.querySelector("#we1");
var $they1 = document.querySelector("#they1");
var $they5 = document.querySelector("#they5");
var $they10 = document.querySelector("#they10");
var $weCounter = document.querySelector("#weCounter");
var $theyCounter = document.querySelector("#theyCounter");

var weCount = 0;
var theyCount = 0;

$we1.addEventListener("click", function(){
    weCount ++;
    console.log(event)
    renderCount(count);
});

$we5.addEventListener("click", function(){
    weCount += 5;
    console.log(event)
    renderCount(count);
});

$we10.addEventListener("click", function(){
    weCount += 10;
    console.log(event)
    renderCount(count);
});

$they1.addEventListener("click", function(){
    theyCount ++;
    console.log(event)
    renderCount(count);
});

$they5.addEventListener("click", function(){
    theyCount += 5;
    console.log(event)
    renderCount(count);
});

$they10.addEventListener("click", function(){
    theyCount += 10;
    console.log(event)
    renderCount(count);
});

function renderCount (num) {
    $counter.innerHTML = num;
};