// console.log("black math calculator");



// RANGE SLIDER
var rangeSlider = function () {
      var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {

        value.each(function () {
            var value = $(this).next().attr('value');
            $(this).html(value);



            // var curerntVal = $(this)[0].innerHTML;
            // console.log(value) 
            // console.log(curerntVal);
        });        

        range.on('input', function () {
            $(this).prev(value).html(this.value);
        });

        // return rate value
    });
    
};

rangeSlider();



// CASHLOW HISTORY
/*
get res vals for 
    - decay rate (pull from slider)
    - net present val (NPV) (set temp val)
assign res to html div
display new res in new lines
*/