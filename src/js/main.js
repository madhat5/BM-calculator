// console.log("black math calculator");

var rangeSlider = function () {
    // $('input[type="range"]').rangeslider({
    //     rangeClass: 'rangeslider',
    //     horizontalClass: 'rangeslider--horizontal',
    //     fillClass: 'rangeslider__fill',
    //     handleClass: 'rangeslider__handle',

    //     onSlide: function(position, value) {
    //         console.log(value)
    //     },

    //     // onSlideEnd: function(position, value) {
    //     //     return value + assign to object?
    //     // }
    // });

    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {

        value.each(function () {
            var value = $(this).next().attr('value');
            $(this).html(value);
            console.log(value) 
        });

        console.log(value.innerHTML) 

        range.on('input', function () {
            $(this).prev(value).html(this.value);
        });
    });
};

rangeSlider();