(function ($) {
  $(document).ready(function () {
    const calc = {
      // Calc properties - default values so nothing breaks
      $cashFlows: [],
      $cashFlowInput: null,
      $cashFlowList: null,
      $cashFlowAddBtn: null,
      $cashFlowRemoveBtn: null,
      $cashFlowsCalculated: [],
      $cashFlowsTotals: [],
      $rateGrowth: null,
      $rateDecay: null,


      // Methods
      init: function () {
        console.log("calc init");

        // On init, assign the prop variables to actual HTML elements
        calc.$cashFlowInput = $('#cash-flow-input');
        calc.$cashFlowList = $('#cash-flow-list');
        calc.$cashFlowAddBtn = $('#cash-flow-add-btn');
        calc.$calcStartBtn = $('.calc-btn');
        calc.$slider = $('.range-slider');
        calc.$range = $('.range-slider__range');
        calc.$growthValue = $('.range-slider__value');
        calc.$decayValue = $('.decay-rate__value');

        // Input should be focused on load
        calc.$cashFlowInput.focus();

        // Event listeners
        // Add cash flow click
        calc.$cashFlowAddBtn.click(function (e) {
          e.preventDefault();
          e.stopPropagation();

          const cashFlowVal = $(calc.$cashFlowInput).val();

          calc.addCashFlow(cashFlowVal);
        });

        // Remove cash flow click
        calc.$cashFlowList.click(function (e) {
          const target = e.target;

          if (target.classList.contains('remove-cash-flow')) {
            const parent = target.parentElement;

            calc.removeCashFlow(parent);
          }
        });

        // Enter key press
        calc.$cashFlowInput.keypress(function (e) {
          const keycode = (event.keyCode ? event.keyCode : event.which);

          if (keycode === 13) {
            const cashFlowVal = $(calc.$cashFlowInput).val();

            calc.addCashFlow(cashFlowVal);
          }
        });

        // slider trigger
        calc.$slider.each(function () {

          calc.$growthValue.each(function () {
            calc.initialRates();
          });

          calc.$range.on('input', function () {
            calc.currentRates();
          });
        });

        // Go key press
        calc.$calcStartBtn.click(function (e) {
          calc.decayCashFlow(.12)
          calc.totalsCashFlows();
        });
      },

      addCashFlow: function (val) {
        const valInt = new Number(val), // convert val string to a number
          decimalInt = valInt.toFixed(2), // ensures 2 decimal places, returns string
          finalVal = new Number(decimalInt); // converting string back to number

        if (decimalInt === 'NaN') {
          alert('Please enter a valid number');
        } else {
          const newCashFlowEl = '<li>$' + decimalInt + '<a href="#" class="remove-cash-flow"></a>';

          $(calc.$cashFlowList).append(newCashFlowEl);

          calc.$cashFlows.push(finalVal);

          calc.$cashFlowInput.val('');

          $(calc.$cashFlowList).scrollTop($(calc.$cashFlowList)[0].scrollHeight);

          calc.$cashFlowInput.focus();

          console.log(calc.$cashFlows);
        }
      },

      removeCashFlow: function (el) {
        const index = $(el).index();

        calc.$cashFlows.splice(index, 1);

        el.remove();

        calc.$cashFlowInput.focus();

        console.log(calc.$cashFlows);
      },

      initialRates: function () {
        // intital growth slider value
        var gValue = calc.$growthValue.next().attr('value');
        calc.$growthValue.html(gValue + '%');
        // console.log('intital growth slider value: ' + $('input[type=range]').val())

        // intital decay slider value
        var dValue = ((1 - (1 / (1 + gValue / 100))) * 100).toFixed(0);
        calc.$decayValue.html(dValue + '%');
        // console.log('intital decay slider value: ' + dValue)
      },

      currentRates: function() {
        var currentGrowthVal, currentDecayVal;

         // current growth slider value
        //  $(this).prev(calc.$growthValue).html(this.value + '%');       
          
        //  console.log('current growth slider value: ' + $('input[type=range]').val());
         currentGrowthVal = $('input[type=range]').val();
         calc.$growthValue.text(currentGrowthVal+ '%' );

         // current decay slider value
         currentDecayVal = ((1 - (1 / (1 + currentGrowthVal / 100))) * 100).toFixed(0);
         //  console.log('current decay slider value: ' + currentDecayVal);
         calc.$decayValue.text(currentDecayVal + '%');
      },

      decayCashFlow: function (val) {
        var i, newVal, finalVal;

        for (i = 0; i < calc.$cashFlows.length; i++) {
          if (i == 0) {
            // index 0: decay rate not applied for the inital cashflow
            calc.$cashFlowsCalculated.push(calc.$cashFlows[i])
          } else {
            // convert current cashflow val to decayed cashflow val 
            newVal = calc.$cashFlows[i] / (Math.pow((1 - val), i));

            finalVal = Number(newVal.toFixed(2));

            calc.$cashFlowsCalculated.push(finalVal)
          }
        }

        console.log(calc.$cashFlowsCalculated);
      },

      totalsCashFlows: function () {
        var i, posVal, negVal, posSum, negSum, diff;
        var posVals = [];
        var negVals = [];

        // sort values by pos/neg
        for (i = 0; i < calc.$cashFlowsCalculated.length; i++) {
          if (Math.sign(calc.$cashFlowsCalculated[i]) == 1) {
            // push to posVals
            posVal = calc.$cashFlowsCalculated[i];
            posVals.push(posVal);

          } else if (Math.sign(calc.$cashFlowsCalculated[i]) == -1) {
            // push to negVals
            negVal = calc.$cashFlowsCalculated[i];
            negVals.push(negVal);
          } else {
            console.log('0 or NaN entered')
          }
        }

        // array sums
        const arrSum = arr => arr.reduce((a, b) => a + b, 0);

        // positive sum + push
        posSum = Number(arrSum(posVals).toFixed(2));
        calc.$cashFlowsTotals.push(posSum);

        // negative sum + push
        negSum = Number(arrSum(negVals).toFixed(2));
        calc.$cashFlowsTotals.push(negSum);

        // pos/neg difference
        diff = function (a, b) {
          return Math.abs(a - b);
        };
        calc.$cashFlowsTotals.push(Number(diff(posSum, negSum).toFixed(2)));

        console.log(calc.$cashFlowsTotals);
      }
    };

    // Initialize calculator
    calc.init();
  });
})(jQuery);