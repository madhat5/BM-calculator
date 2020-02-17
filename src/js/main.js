// // console.log("black math calculator");

// // RANGE SLIDER
// var rangeSlider = function () {
//     var slider = $('.range-slider'),
//       range = $('.range-slider__range'),
//       value = $('.range-slider__value');

//   slider.each(function () {

//       value.each(function () {
//           var value = $(this).next().attr('value');
//           $(this).html(value);

//           // onclick?
//           range.click(function() {
//               console.log(value.innerHTML)
//             });
//           console.log($('input[type=range]').val())
//           console.log($('.range-slider__value').val())

//           // var curerntVal = $(this)[0].innerHTML;
//           // console.log(value) 
//           // console.log(curerntVal);
//       });        

//       range.on('input', function () {
//           $(this).prev(value).html(this.value);
//       });

//       // return rate value
//   });
  
// };

// rangeSlider();



// // CASHLOW HISTORY
// var decayRate = 12,
//   npv = 44000;

// var displayRes = function (decayRate, npv) {
//   $('#cashflow-list')
//       .append(' <li><span class="cashflow-list-left">' + decayRate + '%</span> &nbsp;<span class="cashflow-list-right">' + npv + '</span></li>')
// };

// displayRes(25, 60000)

// /*
// get res vals for 
//   - decay rate (pull from slider)
//   - net present val (NPV) (set temp val)
// assign res to html li (within ul)
// display new res in new lines


// function endRes (decayRate, npv) {
//   append as li to ul
//   <li><span>decay rate</span><span>npv</span></li>
// }
// */