(function ($) {
  $( document ).ready(function() {
    const calc = {
      // 
      // Calc properties - default values so nothing breaks
      // 

      // Cash flows
      $cashFlows: [],
      $cashFlowsPos: [],
      $cashFlowInput: null,
      $cashFlowList: null,
      $cashFlowAddBtn: null,
      $cashFlowRemoveBtn: null,
      $cashFlowsCalculated: [],
      $cashFlowsCalculatedPos: [],
      $cashFlowsTotals: [],
      $maxCashFlow: null,
      $rateGrowth: null,
      $rateDecay: null,

      // Charts
      $calcBtn: null,
      $chartObj: null,
      $stackedChart: null,
      $stackedData: [],
      // 
      // Methods
      // 

      // Init
      init: function() {
        console.log("calc init");

        // On init, assign the prop variables to actual HTML elements
        calc.$cashFlowInput = $('#cash-flow-input');
        calc.$cashFlowList = $('#cash-flow-list');
        // calc.$cashFlowListItems = $('#cash-flow-list li');
        calc.$cashFlowAddBtn = $('#cash-flow-add-btn');
        calc.$calcBtn = $('#calc-btn');
        calc.$resetBtn = $('#app-reset-btn');
        calc.$runAgainBtn = $('#run_again-btn');

        calc.$slider = $('.range-slider');
        calc.$range = $('.range-slider__range');
        calc.$growthValue = $('.range-slider__value');
        calc.$decayValue = $('.decay-rate__value');
        calc.$resList = $('#calc-res');
        // calc.$resListItems = $('#calc-res li');
        calc.$chart = $('#chart-main');

        calc.$sliderPopover = $("[data-toggle=popover]");

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

            console.log("slider triggered");

            if ( !($(calc.$calcBtn).hasClass('calc-btn--active')) ) {
              $(calc.$calcBtn).addClass('calc-btn--active');
              // $(calc.$resetBtn).addClass('reset-btn--active');
            }
          });
        });

        // Slider tutorial
        calc.$sliderPopover.popover();

        // Go btn
        calc.$calcBtn.click(function(e) {
          e.stopPropagation();
          e.preventDefault();

          calc.step_1();

          setTimeout(function() { calc.step_2(); }, 3000);
          setTimeout(function() { calc.step_3(); }, 5000);
          setTimeout(function() { calc.step_4(); }, 5300);
          setTimeout(function() { calc.step_5(); }, 8500);

          setTimeout(function() {
            $(calc.$resetBtn).addClass('reset-btn--active');
            calc.$runAgainBtn.removeClass('redo-btn-hide');
            calc.$runAgainBtn.addClass('redo-btn--active');
          }, 8500);
          
        });

      // Reset btn
        calc.$resetBtn.click(function (e) {
          e.preventDefault();
          e.stopPropagation();
      
          //   > reset chart to Go screen

          calc.resetApp();
        });

         // Go btn
         calc.$runAgainBtn.click(function(e) {
          e.stopPropagation();
          e.preventDefault();

          calc.step_1();

          setTimeout(function() { calc.step_2(); }, 3000);
          setTimeout(function() { calc.step_3(); }, 5000);
          setTimeout(function() { calc.step_4(); }, 5300);
          setTimeout(function() { calc.step_5(); }, 8500);

          setTimeout(function() {
            $(calc.$resetBtn).addClass('reset-btn--active');  
          }, 8500);
          
        });
      },

      // Chart
      step_1: function() {
        if ($('#bar-style')) {
          var barStyle = document.createElement('style');

          barStyle.id = 'bar-style';
          barStyle.type = 'text/css';

          document.getElementsByTagName('head')[0].appendChild(barStyle);
        } else {
          $('#bar-style').remove();
        }

        // Set largest cash flow

        calc.$maxCashFlow = calc.$cashFlowsPos.reduce(function(a, b) {
          return Math.max(a, b);
        });

        calc.$cashFlows.forEach(function(cashFlow, index) {
          if (cashFlow < 0) {
            var barCss = '#chart-container .highcharts-series rect:nth-child(' + (index + 1) + ') { fill: #E43B3F; }';

            barStyle.appendChild(document.createTextNode(barCss));
          }
        })

        calc.decayCashFlow(calc.$rateDecay);
        calc.totalsCashFlows();
        // calc.displayRes(calc.$rateGrowth, calc.$cashFlowsTotals[2]);

        $(calc.$chart).addClass('chart--active');

        Highcharts.setOptions({
          lang: {
              thousandsSep: ','
          }
        });

        calc.$chartObj = Highcharts.chart('chart-container', {
          chart: {
              type: 'column'
          },
          title: {
            text:''
          },
          tooltip: {
              headerFormat: '',
              pointFormat: '<strong style="font-size:10px">{point.y}</strong>',
              useHTML: true
          },
          yAxis: {
            visible: false,
            softMax: calc.$maxCashFlow
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
            data: calc.$cashFlowsPos,
            threshold: null
          }]
        });

        // Stacked chart
        var posTotal = calc.$cashFlowsTotals[0],
            negTotal = calc.$cashFlowsTotals[1];

        if (!(posTotal === 'NaN')) {
          calc.$stackedData.push(posTotal);
        }

        if (!(negTotal === 'NaN')) {
          calc.$stackedData.push(negTotal);
        }

        calc.$stackedChart = Highcharts.chart('hidden-final-chart', {
          chart: {
              type: 'column'
          },
          title: {
            text:''
          },
          tooltip: {
              headerFormat: '',
              pointFormat: '<strong style="font-size:10px">{point.y}</strong>',
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
                  borderWidth: 1,
                  stacking: 'normal'
              }
          },
          series: [{
            showInLegend: false,
            color: '#4F5366',
            negativeColor: '#E43B3F',
            data: calc.$stackedData,
            threshold: 0
          }]
        });
      },

      step_2: function() {
        calc.$chartObj.series[0].update({
          data: calc.$cashFlowsCalculatedPos
        });
      },

      step_3: function() {
        var bars = $($('.highcharts-tracker')[0]).children();

        $(bars).attr('style', 'transform: scaleY(0); transform-origin: bottom;');

        setTimeout(function() {
          $($('.highcharts-container svg .highcharts-series-group g')[0]).attr('style', 'transform: translateY(100%)');
        }, 250);
      },

      step_4: function() {
        $(calc.$chart).addClass('step-3');

        var hiddenNeg = $($('.highcharts-tracker')[1]).children()[1],
            hnYPos = hiddenNeg.getAttribute('y');

        var posPath = document.createElementNS("http://www.w3.org/2000/svg", "path"),
            negPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

        posPath.setAttribute('id', 'pos-wave');
        negPath.setAttribute('id', 'neg-wave');
        negPath.setAttribute('style', 'transform: translateY(' + Math.round(hnYPos - 60) + 'px);');

        $($('#hidden-final-chart .highcharts-series-group g')[0]).prepend(posPath);
        $($('#hidden-final-chart .highcharts-series-group g')[0]).append(negPath);

        // setTimeout(function() {
          // var posWave = $('#pos-wave').wavify({
          //   height: 30,
          //   bones: 7,
          //   amplitude: 40,
          //   color: '#4F5366',
          //   // color: '#000000',
          //   speed: .55
          // });

          // var negWave = $('#neg-wave').wavify({
          //   height: 15,
          //   bones: 7,
          //   amplitude: 40,
          //   color: '#E43B3F',
          //   speed: .55
          // });
        // }, 1000);

        // setTimeout(function() {
        //   $('#pos-wave').attr('style', 'transform: scaleY(0)');
        //   $('#neg-wave').attr('style', 'transform: scaleY(0)');
        // }, 1000);
      },

      step_5: function() {
        const finalSum = calc.$cashFlowsTotals[2],
              finalHTML = '<div class="chart-final-message"><p class="final-header">Net Present Value</p><span id="final-value">$' + calc.addCommas(calc.$cashFlowsTotals[2]) + '</span><p class="final-message">You\'ve found the IRR!</p></div>';

        calc.$stackedChart.series[0].update({
          data: [finalSum, finalSum]
        });

        $('#hidden-final-chart').prepend(finalHTML);
        $('#hidden-final-chart .highcharts-series .highcharts-point:not(.highcharts-negative)').css('transform', 'translateY(100px)');

        calc.displayRes(calc.$rateGrowth, calc.$cashFlowsTotals[2]);
      },

      // Cash Flows
      addCommas: function(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      },

      addCashFlow: function(val) {
        const valNoCommas = val.replace(',', ''),
              valInt = new Number(valNoCommas), // convert val string to a number
              decimalInt = valInt.toFixed(2), // ensures 2 decimal places, returns string
              finalVal = new Number(decimalInt); // converting string back to number

        if (decimalInt === 'NaN') {
          alert('Please enter a valid number');
        } else {
          const newCashFlowEl = '<li>$' + calc.addCommas(decimalInt) + '<a href="#" class="remove-cash-flow"></a>';

          $(calc.$cashFlowList).append(newCashFlowEl);
          
          calc.$cashFlows.push(finalVal.valueOf());
          calc.$cashFlowsPos.push(Math.abs(finalVal.valueOf()));
  
          calc.$cashFlowInput.val('');

          $(calc.$cashFlowList).scrollTop($(calc.$cashFlowList)[0].scrollHeight);
          
          calc.$cashFlowInput.focus();
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
        var gValue, dValue, dValueCalc;

        // intital growth slider value
        gValue = calc.$growthValue.next().attr('value');
        calc.$growthValue.html(gValue + '%');
        calc.$rateGrowth = gValue / 100;
        //  console.log('calc.$rateGrowth initial ' + calc.$rateGrowth);

        // intital decay slider value
        dValue = (1 - (1 / (1 + calc.$rateGrowth))) * 100;
        // console.log('dValue: ' + dValue);
        dValueCalc = (Math.round(dValue)).toFixed(0);
        // console.log('dValueCalc: ' + dValueCalc);
        calc.$rateDecay = dValueCalc / 100;
        console.log("rate decay " + calc.$rateDecay);
        calc.$decayValue.html((1 - calc.$rateDecay).toFixed(2) + '%');
        console.log("discount factor " + (1 - calc.$rateDecay).toFixed(2));
      },

      currentRates: function () {
        var currentGrowthVal, currentDecayVal, currentDecayValCalc;

        // current growth slider value
        currentGrowthVal = $('input[type=range]').val();
        calc.$growthValue.text(currentGrowthVal + '%');
        calc.$rateGrowth = currentGrowthVal / 100;
        // console.log('calc.$rateGrowth current ' + calc.$rateGrowth);

        // current decay slider value
        currentDecayVal = (1 - (1 / (1 + calc.$rateGrowth))) * 100;
        currentDecayValCalc = (Math.round(currentDecayVal)).toFixed(0)
        // console.log('currentDecayValCalc: ' + currentDecayValCalc);
        calc.$rateDecay = currentDecayValCalc / 100;
        // console.log("rate decay " + calc.$rateDecay);
        calc.$decayValue.html((1 - calc.$rateDecay).toFixed(2) + '%');
        // console.log('discount factor ' + (1 - calc.$rateDecay));
      },

      decayCashFlow: function (val) {
        var i, newVal, finalVal;

        for (i = 0; i < calc.$cashFlows.length; i++) {
          if (i == 0) {
            // index 0: decay rate not applied for the inital cashflow
            calc.$cashFlowsCalculated.push(calc.$cashFlows[i]);
            calc.$cashFlowsCalculatedPos.push(calc.$cashFlows[i]);
          } else {
            // convert current cashflow val to decayed cashflow val 

            newVal = calc.$cashFlows[i] * (Math.pow((1 - val), i));
            // console.log('calc.$cashFlows[i]: ' + calc.$cashFlows[i])
            // console.log('val: ' + val)
            // console.log('count: ' + i)
            // console.log('newVal: ' + newVal);
            finalVal = Number(newVal.toFixed(2));
            // console.log('finalVal: ' + finalVal);

            calc.$cashFlowsCalculated.push(finalVal);
            calc.$cashFlowsCalculatedPos.push(Math.abs(finalVal));
          }
        }

        // console.log('cashFlowsCalculated: ' + calc.$cashFlowsCalculated);
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
            console.log('0 or NaN entered');
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
          //  return Math.abs(a - b);
          if (Math.abs(a) > Math.abs(b)) {
            return a - b;
          } else if (Math.abs(b) > Math.abs(a)) {
            return b + a;
          }
        };
        calc.$cashFlowsTotals.push(
          Number(
            diff(posSumAvg, negSumAvg).toFixed(2)
          ));

        // console.log('$cashFlowsTotals: ' + calc.$cashFlowsTotals);
      },

      displayRes: function (growthRate, npv) {
        var startHtml, midHtml, endHtml;

        startHtml = '<li><span class="cashflow-list-left">';
        midHtml = '%</span> &nbsp;<span class="cashflow-list-right">$';
        endHtml = '</span></li>';
        
        calc.$resList.append(startHtml + (growthRate * 100) + midHtml + npv + endHtml);

        console.log((growthRate * 100), npv);
      },

      resetApp: function() {
        // remove all history
        $('#calc-res li').remove()

        // remove all cashflow elements
        $('#cash-flow-list li').remove()

        // reset slider to default
        calc.initialRates();

        // reset charts to Go
        $(calc.$chart).removeClass('chart--active');
        $(calc.$chart).removeClass('step-3');
        // calc.$chart.load(location.href + " #chart-main");
        $(calc.$calcBtn).removeClass('calc-btn--active');

        calc.$cashFlowInput.focus();
      },

      runAgain: function() {
      }
    };
  
    // Initialize calculator
    calc.init();
  });
})( jQuery );
