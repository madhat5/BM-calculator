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


      // Methods
      init: function () {
        console.log("calc init");

        // On init, assign the prop variables to actual HTML elements
        calc.$cashFlowInput = $('#cash-flow-input');
        calc.$cashFlowList = $('#cash-flow-list');
        calc.$cashFlowAddBtn = $('#cash-flow-add-btn');
        calc.$calcStartBtn = $('.calc-btn');

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

        // Go key press
        calc.$calcStartBtn.click(function (e) {
          calc.decayCashFlow(.12)
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
        // pass in $cashFlowsCalculated array
        // $cashFlowsCalculated array has: [posVal, negVal, diffVal]

        // identify positive and negative cashflows 

        // sum up pos and neg cashflows seperately
        // push values to $cashFlowsSums array

        // calc difference between both
        // pass to array

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
        posSum = arrSum(posVals);
        calc.$cashFlowsTotals.push(posSum);

        // negative sum + push
        negSum = arrSum(negVals);
        calc.$cashFlowsTotals.push(negSum);

        // pos/neg difference
        diff = function (a, b) {
          return Math.abs(a - b);
        };
        calc.$cashFlowsTotals.push(diff(posSum, negSum));

        console.log(calc.$cashFlowsTotals);
      }
    };

    // Initialize calculator
    calc.init();
  });
})(jQuery);