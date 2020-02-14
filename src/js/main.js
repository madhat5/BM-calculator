// console.log("black math calculator");

// RANGE SLIDER
var rangeSlider = function () {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        growthValue = $('.range-slider__value'),
        decayValue = $('.decay-rate__value');

    var currentGrowthVal, currentDecaythVal;

    slider.each(function () {

        growthValue.each(function () {
            // intital growth slider value
            var gValue = $(this).next().attr('value');
            $(this).html(gValue + '%');

            console.log('intital growth slider value: ' + $('input[type=range]').val())

            // intital decay slider value
            var dValue = ((1 - (1 / (1 + gValue / 100))) * 100).toFixed(0);
            $(decayValue).html(dValue + '%');

            console.log('intital decay slider value: ' + dValue)

        });

        range.on('input', function () {

            // current growth slider value
            $(this).prev(growthValue).html(this.value + '%');

            console.log('current growth slider value: ' + $('input[type=range]').val());
            currentGrowthVal = $('input[type=range]').val();

            // current decay slider value
            currentDecayVal = ((1 - (1 / (1 + currentGrowthVal / 100))) * 100).toFixed(0);

            $(decayValue).text(currentDecayVal + '%');
            console.log('current decay slider value: ' + currentDecayVal);

            // return [currentGrowthVal, ];

        });
    });



};

rangeSlider();





// CASHLOW HISTORY
var decayRate = 12,
    npv = 44000;

var displayRes = function (decayRate, npv) {
    $('#cashflow-list')
        .append(' <li><span class="cashflow-list-left">' + decayRate + '%</span> &nbsp;<span class="cashflow-list-right">' + npv + '</span></li>')
};

displayRes(25, 60000)

/*
get res vals for 
  - decay rate (pull from slider)
  - net present val (NPV) (set temp val)
assign res to html li (within ul)
display new res in new lines


function endRes (decayRate, npv) {
  append as li to ul
  <li><span>decay rate</span><span>npv</span></li>
}
*/