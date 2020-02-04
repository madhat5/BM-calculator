// console.log("black math calculator");

var rangeSlider = function () {
    $('input[type="range"]').rangeslider({
        rangeClass: 'rangeslider',
        horizontalClass: 'rangeslider--horizontal',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        // onSlide: function(position, value) {
        //     assign value to HTML
        // },

        // onSlideEnd: function(position, value) {
        //     return value + assign to object?
        // }
    });
};

rangeSlider();