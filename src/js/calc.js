(function ($) {
  $( document ).ready(function() {
    const calc = {
      // 
      // Calc properties - default values so nothing breaks
      // 

      // Cash flows
      $cashFlows: [],
      $cashFlowInput: null,
      $cashFlowList: null,
      $cashFlowAddBtn: null,
      $cashFlowRemoveBtn: null,
      $cashFlowsCalculated: [],
      $cashFlowsTotals: [],
      $rateGrowth: null,
      $rateDecay: null,

      // Charts
      $calcBtn: null,
    
      // 
      // Methods
      // 

      // Init
      init: function() {
        console.log("calc init");

        // On init, assign the prop variables to actual HTML elements
        calc.$cashFlowInput = $('#cash-flow-input');
        calc.$cashFlowList = $('#cash-flow-list');
        calc.$cashFlowAddBtn = $('#cash-flow-add-btn');
        calc.$calcBtn = $('#calc-btn');

        calc.$slider = $('.range-slider');
        calc.$range = $('.range-slider__range');
        calc.$growthValue = $('.range-slider__value');
        calc.$decayValue = $('.decay-rate__value');
        calc.$resList = $('#calc-res');

        // Input should be focused on load
        calc.$cashFlowInput.focus();

        // Event listeners
        // Add cash flow click
        calc.$cashFlowAddBtn.click(function(e) {
          e.preventDefault();
          e.stopPropagation();

          const cashFlowVal = $(calc.$cashFlowInput).val();

          calc.addCashFlow(cashFlowVal);
        });

        // Remove cash flow click
        calc.$cashFlowList.click(function(e) {
          const target = e.target;
          
          if (target.classList.contains('remove-cash-flow')) {
            const parent = target.parentElement;

            calc.removeCashFlow(parent);
          }
        });

        // Enter key press
        calc.$cashFlowInput.keypress(function(e) {
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

        // Go btn
        calc.$calcBtn.click(function(e) {
          e.stopPropagation();
          e.preventDefault();

          calc.decayCashFlow(calc.$rateDecay);
          calc.totalsCashFlows();
          calc.displayRes(calc.$rateDecay, calc.$cashFlowsTotals[2]);

          var chart = Highcharts.chart('chart-main', {
            chart: {
                type: 'column'
            },
            tooltip: {
                // headerFormat: '<span style="font-size:10px">{point.y}</span>',
                useHTML: true
            },
            yAxis: {
              visible: false
            },
            xAxis: {
              visible: false
            },
            plotOptions: {
                column: {
                    // pointPadding: 0.2,
                    groupPadding: 0,
                    borderWidth: 1
                }
            },
            series: [{
              showInLegend: false,
              color: '#4F5366',
              negativeColor: '#E43B3F',
              data: calc.$cashFlows,
              threshold: null
        
            }]
          });

          setTimeout(function() {
            console.log('updating data');
            chart.series[0].update({
              data: calc.$cashFlowsCalculated
            });
          }, 2000);

          console.log(chart.options.plotOptions);


          setTimeout(function() {
            // console.log(chart.plotOptions);
            var data = [],
                posTotal = calc.$cashFlowsTotals[0],
                negTotal = calc.$cashFlowsTotals[1];

            if (!(posTotal === 'NaN')) {
              data.push(posTotal);
            }

            if (!(negTotal === 'NaN')) {
              data.push(negTotal);
            }


            console.log('stacking chart');
            console.log('posTotal')
            console.log(posTotal);
            console.log(posTotal == NaN)

            console.log('negTotal')
            console.log(negTotal);
            console.log(negTotal == NaN)
            
            chart.series[0].update({
              data: data
            });
            chart.options.plotOptions.column.stacking = 'normal';

            console.log(chart.series[0].data);
          }, 4000);
        });
      },

      // Cash Flows
      addCashFlow: function(val) {
        const valInt = new Number(val), // convert val string to a number
              decimalInt = valInt.toFixed(2), // ensures 2 decimal places, returns string
              finalVal = new Number(decimalInt); // converting string back to number

        if (decimalInt === 'NaN') {
          alert('Please enter a valid number');
        } else {
          const newCashFlowEl = '<li>$' + decimalInt + '<a href="#" class="remove-cash-flow"></a>';

          $(calc.$cashFlowList).append(newCashFlowEl);
          
          calc.$cashFlows.push(finalVal.valueOf());
  
          calc.$cashFlowInput.val('');

          $(calc.$cashFlowList).scrollTop($(calc.$cashFlowList)[0].scrollHeight);
          
          calc.$cashFlowInput.focus();
  
          console.log(calc.$cashFlows);
        }
      },

      removeCashFlow: function(el) {
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
        calc.$rateGrowth = gValue / 100;
        //  console.log(calc.$rateGrowth);

        // intital decay slider value
        var dValue = ((1 - (1 / (1 + gValue / 100))) * 100).toFixed(0);
        calc.$decayValue.html(dValue + '%');
        // console.log('intital decay slider value: ' + dValue)
        calc.$rateDecay = dValue / 100;
        //  console.log(calc.$rateDecay);
      },

      currentRates: function () {
        var currentGrowthVal, currentDecayVal;

        // current growth slider value
        //  $(this).prev(calc.$growthValue).html(this.value + '%');       

        //  console.log('current growth slider value: ' + $('input[type=range]').val());
        currentGrowthVal = $('input[type=range]').val();
        calc.$growthValue.text(currentGrowthVal + '%');
        calc.$rateGrowth = currentGrowthVal / 100;
        console.log(calc.$rateGrowth);

        // current decay slider value
        currentDecayVal = ((1 - (1 / (1 + currentGrowthVal / 100))) * 100).toFixed(0);
        //  console.log('current decay slider value: ' + currentDecayVal);
        calc.$decayValue.text(currentDecayVal + '%');
        calc.$rateDecay = currentDecayVal / 100

        console.log(calc.$rateDecay);
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

        console.log("cash flows calculated:");
        console.log(calc.$cashFlowsCalculated);
      },

      totalsCashFlows: function () {
        var i, posVal, negVal, posSum, posSumAvg, negSum, negSumAvg, diff;
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
        posSumAvg = Number((posSum / posVals.length).toFixed(2));
        calc.$cashFlowsTotals.push(posSumAvg);

        // negative sum + push
        negSum = Number(arrSum(negVals).toFixed(2));
        negSumAvg = Number((negSum / negVals.length).toFixed(2));
        calc.$cashFlowsTotals.push(negSumAvg);

        // pos/neg difference
        diff = function (a, b) {
          return Math.abs(a - b);
        };
        calc.$cashFlowsTotals.push(Number(diff(posSumAvg, negSumAvg).toFixed(2)));

        console.log(calc.$cashFlowsTotals);
      },

      displayRes: function (decayRate, npv) {
        var startHtml, midHtml, endHtml;

        startHtml = '<li><span class="cashflow-list-left">';
        midHtml = '%</span> &nbsp;<span class="cashflow-list-right">';
        endHtml = '</span></li>';
        
        calc.$resList.append(startHtml + (decayRate * 100) + midHtml + npv + endHtml);

        console.log((decayRate * 100), npv)
      }
    };
  
    // Initialize calculator
    calc.init();
  });
})( jQuery );
