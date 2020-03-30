(function ($) {
  $( document ).ready(function() {
    const calc = {
      // 
      // Calc properties - default values
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

      // Chart
      $chartContainer: null,
      $resetBtn: null,
      $runAgainBtn: null,
      $calcBtn: null,
      $chartObj: null,
      $stackedChart: null,
      $stackedData: [],
      $activeStep: 1,
      $hiddenChart: null,
      
      // 
      // Methods
      // 

      // Init
      init: function() {
        // On init, assign the prop variables to actual HTML elements
        calc.$cashFlowInput = $('#cash-flow-input');
        calc.$cashFlowList = $('#cash-flow-list');
        calc.$cashFlowAddBtn = $('#cash-flow-add-btn');
        calc.$calcBtn = $('#calc-btn');
        calc.$resetBtn = $('#app-reset-btn');
        calc.$runAgainBtn = $('#run_again-btn');
        calc.$chartContainer = $('#chart-container');
        calc.$hiddenChart = $('#hidden-chart');

        calc.$slider = $('.range-slider');
        calc.$range = $('.range-slider__range');
        calc.$growthValue = $('.range-slider__value');
        calc.$decayValue = $('.decay-rate__value');
        calc.$resList = $('#calc-res');
        calc.$chart = $('#chart-main');
        calc.$chartControls = $('#chart-controls');
        calc.$progressBar = $('#step-progress-bar');

        calc.$sliderPopover = $(".slider_tutorial");
        calc.$resultsPopover = $(".results_tutorial");

        calc.$stepMessage = $('#step-message');
        calc.$prevBtn = $('#prev-btn');
        calc.$nextBtn = $('#next-btn');

        calc.$stepMessages = [
          "Multiply each year by it's discount factor",
          "Sum together all positive and negative cash flows.",
          "Subtract negative cash flows from positive cash flows."
        ];

        calc.$timeouts = [];

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

            if ( !($(calc.$calcBtn).hasClass('calc-btn--active')) ) {
              $(calc.$calcBtn).addClass('calc-btn--active');
              $(calc.$calcBtn).removeAttr('disabled');
            }
          });
        });

        // Slider tutorial
        calc.$sliderPopover.popover();
        calc.$resultsPopover.popover();

        // Go btn
        calc.$calcBtn.click(function(e) {
          e.stopPropagation();
          e.preventDefault();

          calc.step_1();

          calc.$timeouts.push(setTimeout(function() { calc.step_2(); }, 3000));
          calc.$timeouts.push(setTimeout(function() { calc.step_3(); }, 6000));
          calc.$timeouts.push(setTimeout(function() { calc.step_4(); }, 6300));
          calc.$timeouts.push(setTimeout(function() { calc.step_5(); }, 9500));
        });

        // Prev and next btn

        calc.$prevBtn.click(function(e) {
          e.preventDefault();
          e.stopPropagation();

          for (var x = 0; x < calc.$timeouts.length; x++) {
            clearTimeout(calc.$timeouts[x]);
          }

          if (calc.$activeStep == 2) {
            calc.$activeStep = 1;

            calc.$stepMessage.html(calc.$stepMessages[0]);
            calc.$prevBtn.attr('disabled', 'disabled');

            for (let i = 0; i < calc.$cashFlowsPos.length; i++) {
              const curr = calc.$cashFlowsPos[i];
              const height = (curr / calc.$maxCashFlow) * 100;

              $('#chart-container .chart-bar--top')[i].setAttribute('style', 'height: ' + height + '%');
            }

          } else if (calc.$activeStep == 3 || calc.$activeStep == 4) {
            $(calc.$chart).removeClass('step-3');

            setTimeout(function() {
              calc.step_2();
            }, 750);

            $(calc.$hiddenChart).css('transform', 'translateY(420px)');
          } else if (calc.$activeStep == 5) {
            calc.$activeStep = 4;
            calc.$nextBtn.removeAttr('disabled');

            $('#hidden-chart .chart-final-message').css('display', 'none');
            $('#hidden-chart .highcharts-container').css('transform', 'translateY(0)');

            for (let i = 0; i < calc.$stackedData.length; i++) {
              const currData = Math.abs(calc.$stackedData[i]);
              const height = Math.floor((currData / calc.$maxCashFlow) * 100);
              const stackedBars = $('#hidden-chart .chart-bar');

              $(stackedBars[i]).css('height', height + '%');
            }
          }

          calc.$progressBar.attr('data-active-step', calc.$activeStep);
        });

        calc.$nextBtn.click(function(e) {
          e.preventDefault();
          e.stopPropagation();

          for (var x = 0; x < calc.$timeouts.length; x++) {
            clearTimeout(calc.$timeouts[x]);
          }

          if (calc.$activeStep == 1) {
            calc.step_2();
          } else if (calc.$activeStep == 2) {
            calc.step_3();
            setTimeout(function() {
              calc.step_4();
            }, 300);
          } else if (calc.$activeStep == 4) {
            calc.step_5();
          }
        });

        calc.$runAgainBtn.click(function (e) {
          e.stopPropagation();
          e.preventDefault();

          calc.runAgain();

          calc.step_1();

          setTimeout(function () {
            calc.step_2();
          }, 3000);
          setTimeout(function () {
            $('#hidden-chart').removeClass('runAgainTransform');
            calc.step_3();
          }, 5000);
          setTimeout(function () {
            calc.step_4();
          }, 5300);
          setTimeout(function () {
            calc.step_5();
          }, 8500);
        });

        // Reset btn
        calc.$resetBtn.click(function (e) {
          e.preventDefault();
          e.stopPropagation();

          //   > reset chart to Go screen

          calc.resetApp();
        });
      },

      // Chart
      step_1: function() {
        calc.$chartControls.addClass('chart-controls--active');
        calc.$stepMessage.html(calc.$stepMessages[0]);
        calc.$prevBtn.attr('disabled', 'disabled');

        // Set largest cash flow

        calc.$maxCashFlow = calc.$cashFlowsPos.reduce(function(a, b) {
          return Math.max(a, b);
        });

        calc.decayCashFlow(calc.$rateDecay);
        calc.totalsCashFlows();

        for (let i = 0; i < calc.$cashFlows.length; i++) {
          const curr = calc.$cashFlows[i];
          const currPos = Math.abs(curr);
          const height = Math.floor((currPos / calc.$maxCashFlow) * 100);
          const className = curr < 0 ? 'chart-bar--negative' : '';
          const bar = '<div class="chart-bar chart-bar--top ' + className + '" style="height: ' + height + '%;"></div>';
          
          calc.$chartContainer.append(bar);

          if (curr > 0) {
            $($('#chart-container .chart-bar--top')[i]).html('<div class="chart-bar chart-bar--bottom chart-bar--negative"></div>');
          }
        }

        $(calc.$chart).addClass('chart--active');

        setTimeout(function() {
          $(calc.$chart).addClass('step-1');
        }, 500);

        // Stacked chart
        var posTotal = calc.$cashFlowsTotals[0],
            negTotal = calc.$cashFlowsTotals[1];

        if (!(posTotal === 'NaN')) {
          calc.$stackedData.push(posTotal);
        }

        if (!(negTotal === 'NaN')) {
          calc.$stackedData.push(negTotal);
        }

        for (let i = 0; i < calc.$stackedData.length; i++) {
          const currData = Math.abs(calc.$stackedData[i]);
          const height = Math.floor((currData / calc.$maxCashFlow) * 100);
          const bar = i > 0 ? 
            '<div class="chart-bar chart-bar--stacked chart-bar--negative" style="height: ' + height + '%;"></div>'
            : '<div class="chart-bar chart-bar--stacked" style="height: ' + height + '%;"></div>';

          calc.$hiddenChart.append(bar);
        }
      },

      step_2: function() {
        calc.$stepMessage.html(calc.$stepMessages[1]);
        calc.$activeStep = 2;
        calc.$progressBar.attr('data-active-step', calc.$activeStep);
        calc.$prevBtn.removeAttr('disabled');

        for (let i = 0; i < calc.$cashFlowsCalculatedPos.length; i++) {
          const curr = calc.$cashFlowsCalculatedPos[i];
          const height = (curr / calc.$maxCashFlow) * 100;

          $('#chart-container .chart-bar--top')[i].setAttribute('style', 'height: ' + height + '%');
        }
      },

      step_3: function() {
        var bars = $($('.highcharts-tracker')[0]).children();
        calc.$prevBtn.removeAttr('disabled');
        
        calc.$activeStep = 3;
        calc.$progressBar.attr('data-active-step', calc.$activeStep);

        for (let i = 0; i < $('#chart-container .chart-bar--top').length; i++) {
          const currBar = $('#chart-container .chart-bar--top')[i];

          $(currBar).css('transform', 'scaleY(0)');
        }
      },

      step_4: function() {
        calc.$stepMessage.html(calc.$stepMessages[2]);
        calc.$prevBtn.removeAttr('disabled');
        calc.$nextBtn.removeAttr('disabled');

        calc.$activeStep = 4;
        calc.$progressBar.attr('data-active-step', calc.$activeStep);

        setTimeout(function() {
          $(calc.$hiddenChart).css('transform', 'translateY(0)');
        }, 450);
      },

      step_5: function() {
        const finalSum = calc.$cashFlowsTotals[2],
              finalMessage = '<div class="chart-final-message" id="chart-final-message"><p class="final-header">Net Present Value</p><span id="final-value">$' + calc.addCommas(calc.$cashFlowsTotals[2]) + '</span>';
              finalMessageAddOn = '<p class="final-message" id="final-message">You\'ve found the IRR!</p></div>';
        
        let finalHTML;

        if (finalSum === 0) {
          finalHTML = finalMessage + finalMessageAddOn;
        } else {
          finalHTML = finalMessage;
        }

        $(calc.$resetBtn).removeAttr('disabled');
        $(calc.$resetBtn).addClass('reset-btn--active');
        calc.$runAgainBtn.removeClass('redo-btn-hide');
        calc.$runAgainBtn.addClass('redo-btn--active');
        calc.$nextBtn.attr('disabled', 'disabled');
        calc.$activeStep = 5;
        calc.$progressBar.attr('data-active-step', calc.$activeStep);

        const stackedBars = $('#hidden-chart .chart-bar');
        const stackedHeight = (finalSum / calc.$maxCashFlow) * 100 / 2;
        const stackedIndex = finalSum > 0 ? 0 : 1;
        const stackedIndexRemove = finalSum > 0 ? 1: 0;

        $(stackedBars[stackedIndex]).css('height', stackedHeight + '%');
        $(stackedBars[stackedIndexRemove]).css('height', 0);

        setTimeout(function() {
          $('#hidden-chart').prepend(finalHTML);
          
          setTimeout(function() {
            $('#chart-final-message').css('opacity', '1');
          }, 200);
        }, 1000);

        calc.displayRes(calc.$rateGrowth, calc.$cashFlowsTotals[2]);
      },

      // Cash Flows
      addCommas: function(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
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
        calc.$cashFlowsPos.splice(index, 1);

        el.remove();

        calc.$cashFlowInput.focus();
      },

      initialRates: function () {
        var gValue, dValue, dValueCalc;

        // intital growth slider value
        gValue = calc.$growthValue.next().attr('value');
        calc.$growthValue.html(gValue + '%');
        calc.$rateGrowth = gValue / 100;

        // intital decay slider value
        dValue = (1 - (1 / (1 + calc.$rateGrowth))) * 100;
        dValueCalc = (Math.round(dValue)).toFixed(0);
        calc.$rateDecay = dValueCalc / 100;
        calc.$decayValue.html((1 - calc.$rateDecay).toFixed(1));
      },

      currentRates: function () {
        var currentGrowthVal, currentDecayVal, currentDecayValCalc;

        // current growth slider value
        currentGrowthVal = $('input[type=range]').val();
        calc.$growthValue.text(currentGrowthVal + '%');
        calc.$rateGrowth = currentGrowthVal / 100;

        // current decay slider value
        currentDecayVal = (1 - (1 / (1 + calc.$rateGrowth))) * 100;
        currentDecayValCalc = (Math.round(currentDecayVal)).toFixed(0);
        calc.$rateDecay = currentDecayValCalc / 100;
        calc.$decayValue.html((1 - calc.$rateDecay).toFixed(1));
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
            finalVal = Number(newVal.toFixed(2));

            calc.$cashFlowsCalculated.push(finalVal);
            calc.$cashFlowsCalculatedPos.push(Math.abs(finalVal));
          }
        }
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
        if (posVals.length == 0 || posVals === undefined) {
          posSumAvg = 0;
          calc.$cashFlowsTotals.push(posSumAvg);
        } else {
          posSum = Number(arrSum(posVals).toFixed(2));
          posSumAvg = Number((posSum / posVals.length).toFixed(2));
          calc.$cashFlowsTotals.push(posSumAvg);
        }

        // negative sum + push
        if (negVals.length == 0 || negVals === undefined) {
          negSumAvg = 0;
          calc.$cashFlowsTotals.push(negSumAvg);
        } else {
          negSum = Number(arrSum(negVals).toFixed(2));
          negSumAvg = Number((negSum / negVals.length).toFixed(2));
          calc.$cashFlowsTotals.push(negSumAvg);
        }

        // pos/neg difference
        diff = function (a, b) {
          //  return Math.abs(a - b);
          if (Math.abs(a) > Math.abs(b)) {
            return Math.abs(a) - Math.abs(b);
          } else if (Math.abs(b) > Math.abs(a)) {
            return Math.abs(b) + Math.abs(a);
          }
        };
        calc.$cashFlowsTotals.push(
          Number(
            diff(posSumAvg, negSumAvg).toFixed(2)
          ));
      },

      displayRes: function (growthRate, npv) {
        var startHtml, midHtml, endHtml;

        startHtml = '<li><span class="cashflow-list-left">';
        midHtml = '%</span> &nbsp;<span class="cashflow-list-right">$';
        endHtml = '</span></li>';
        
        calc.$resList.append(startHtml + (growthRate * 100).toFixed(0) + midHtml + npv + endHtml);
      },

      resetApp: function () {
        // remove all history
        $('#calc-res li').remove();

        // remove all cashflow elements
        $('#cash-flow-list li').remove();

        // reset slider to default
        calc.initialRates();

        // cashflows empty
        calc.$cashFlows = [];
        calc.$cashFlowsPos = [];
        calc.$cashFlowsCalculated = [];
        calc.$cashFlowsCalculatedPos = [];
        calc.$cashFlowsTotals = [];

        // chart data empty
        calc.$chartObj = {};
        calc.$stackedChart = {};
        calc.$stackedData = [];
        calc.$activeStep = 1;

        // btns reset
        calc.$runAgainBtn.addClass('redo-btn-hide');
        $(calc.$calcBtn).removeClass('calc-btn--active');

        // chart visual reset
        $(calc.$chart).removeClass('chart--active');
        $(calc.$chart).removeClass('step-3');
        // calc.$chart.load(location.href + " #chart-main");
        $(calc.$chartControls).removeClass('chart-controls--active');
        $('#hidden-chart .chart-final-message').css('display', 'none');
        $('.highcharts-container').css('display', 'none');

        calc.$cashFlowInput.focus();
      },

      runAgain: function () {
        // chart move
        $('#hidden-chart').addClass('runAgainTransform');
        // $('#hidden-chart .highcharts-container').css('transform', 'translateY(400px)');

        // cashflow empty
        calc.$cashFlowsCalculated = [];
        calc.$cashFlowsCalculatedPos = [];
        calc.$cashFlowsTotals = [];
        calc.$stackedData = [];

        // charts empty
        calc.$chartObj = {};
        calc.$stackedChart = {};
        calc.$stackedData = [];
        calc.$activeStep = 1;
      }
    };
  
    // Initialize calculator
    calc.init();
  });
})( jQuery );
