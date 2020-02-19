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
            }
          });
        });

        // Slider tutorial
        calc.$sliderPopover.popover();

        // Go btn
        calc.$calcBtn.click(function(e) {
          e.stopPropagation();
          e.preventDefault();

          calc.decayCashFlow(calc.$rateDecay);
          calc.totalsCashFlows();
          calc.displayRes(calc.$rateDecay, calc.$cashFlowsTotals[2]);

          $(calc.$chart).addClass('chart--active');

          Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
          });

          var chart = Highcharts.chart('chart-container', {
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

          // Hidden chart

          var finalData = [],
              posTotal = calc.$cashFlowsTotals[0],
              negTotal = calc.$cashFlowsTotals[1];

          if (!(posTotal === 'NaN')) {
            finalData.push(posTotal);
          }

          if (!(negTotal === 'NaN')) {
            finalData.push(negTotal);
          }

          var hiddenChart = Highcharts.chart('hidden-final-chart', {
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
              data: finalData,
              threshold: 0
            }]
          });



          setTimeout(function() {
            console.log('updating data');
            chart.series[0].update({
              data: calc.$cashFlowsCalculated
            });
          }, 3000);

          setTimeout(function() {
            var bars = $($('.highcharts-tracker')[0]).children();

            $(bars).attr('style', 'opacity: 0;');

            setTimeout(function() {
              $($('.highcharts-container svg .highcharts-series-group g')[0]).attr('style', 'transform: translateY(100%)');
            }, 250);
          }, 5000);

          // console.log(chart.options.plotOptions);

          setTimeout(function() {
            // // console.log(chart.plotOptions);
            // var data = [],
            //     posTotal = calc.$cashFlowsTotals[0],
            //     negTotal = calc.$cashFlowsTotals[1];

            // if (!(posTotal === 'NaN')) {
            //   data.push(posTotal);
            // }

            // if (!(negTotal === 'NaN')) {
            //   data.push(negTotal);
            // }

            $(calc.$chart).addClass('step-3');

            // console.log('stacking chart');
            // console.log('posTotal');
            // console.log(posTotal);
            // console.log(posTotal == NaN);

            // console.log('negTotal');
            // console.log(negTotal);
            // console.log(negTotal == NaN);
            
            // chart.series[0].update({
            //   data: data
            // });
            // chart.options.plotOptions.column.stacking = 'normal';
            // chart.options.plotOptions.column.threshold = 0;

            // console.log(chart.series[0].data);

            var firstBar = $($('.highcharts-tracker')[0]).children()[0],
                // otherChildren = $($('.highcharts-tracker')[0]).children().not(firstBar),
                otherChildren = $($('.highcharts-tracker')[0]).children(),
                hiddenPos = $($('.highcharts-tracker')[1]).children()[0],
                hpHeight = hiddenPos.getAttribute('height'),
                hpXPos = hiddenPos.getAttribute('x'),
                hpYPos = hiddenPos.getAttribute('y'),
                hiddenNeg = $($('.highcharts-tracker')[1]).children()[1],
                hnHeight = hiddenNeg.getAttribute('height'),
                hnXPos = hiddenNeg.getAttribute('x'),
                hnYPos = hiddenNeg.getAttribute('y'),
                hnFill = hiddenNeg.getAttribute('fill'),
                hnStroke = hiddenNeg.getAttribute('stroke'),
                hnStrokeWidth = hiddenNeg.getAttribute('stroke-width');

            // var posPath = document.createElement('path');

            // $(posPath).attr('id', 'pos-wave');

            // var posPath = '<svg id="pos-wave-svg"><path id="pos-wave" style="color: #707070;"></svg>';
            // var posPath = '<path id="pos-wave">';

            var posPath = document.createElementNS("http://www.w3.org/2000/svg", "path"),
                negPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

            posPath.setAttribute('id', 'pos-wave');
            negPath.setAttribute('id', 'neg-wave');
            negPath.setAttribute('style', 'transform: translateY(' + Math.round(hnYPos - 60) + 'px);');

            $($('.highcharts-container svg .highcharts-series-group g')[0]).prepend(posPath);
            $($('#hidden-final-chart .highcharts-series-group g')[0]).append(negPath);

            // var newHTML = $($('.highcharts-container svg')[0]).html();

            // $($('.highcharts-container svg')[0]).children()

            // setTimeout(function() {
              var posWave = $('#pos-wave').wavify({
                height: 30,
                bones: 7,
                amplitude: 40,
                color: '#4F5366',
                // color: '#000000',
                speed: .55
              });

              var negWave = $('#neg-wave').wavify({
                height: 15,
                bones: 7,
                amplitude: 40,
                color: '#E43B3F',
                speed: .55
              });
            // }, 1000);

            setTimeout(function() {
              // posWave.kill();
              // negWave.kill();
            }, 2000);

            // $(otherChildren).attr('style', 'opacity: 0;');

            // $('#hidden-final-chart').attr('style', 'transform: translate(0, -400px);');

            // Modify positive bar
            $('.highcharts-container svg .highcharts-series-group g')[0].setAttribute('width', '100%');
            $('.highcharts-container svg .highcharts-series-group g')[0].setAttribute('height', hpHeight);
            $('.highcharts-container svg .highcharts-series-group g')[0].setAttribute('x', hpXPos);
            $('.highcharts-container svg .highcharts-series-group g')[0].setAttribute('y', hpYPos);

            $('.highcharts-container svg .highcharts-series-group g')[0].setAttribute('style', 'transform: translate(' + Math.round(hpXPos / 2) + ', 0);');

            // Create and animate negative bar

            // var newNegBar = document.createElement('rect');

            // newNegBar.setAttribute('x', hpXPos);
            // newNegBar.setAttribute('y', hnYPos);
            // newNegBar.setAttribute('height', hnHeight);
            // newNegBar.setAttribute('width', '100%');
            // newNegBar.setAttribute('fill', hnFill);
            // newNegBar.setAttribute('stroke', hnStroke);
            // newNegBar.setAttribute('stroke-width', hnStrokeWidth);
            // newNegBar.setAttribute('opacity', '1');
            // newNegBar.setAttribute('class', 'highcharts-point highcharts-negative');

            // var newNegBar = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
            //   x: hpXPos,
            //   y: hnYPos,
            //   width: '100%',
            //   height: hnHeight,
            //   stroke: hnStroke,
            //   strokeWidth: hnStrokeWidth,
            //   opacity: 1,
            //   fill: hnFill,
            //   class: 'highcharts-point highcharts-negative'
            // });

            // setTimeout(function() {
              // $('.highcharts-tracker')[0].append(newNegBar);
              
              // $($('.highcharts-tracker')[0]).html(function() { return this.innerHTML; });
            //   console.log('append');
            // }, 2000);

          }, 6000);
        });
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
        console.log("rate decay");
        console.log(calc.$rateDecay);
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
        calc.$rateDecay = currentDecayVal / 100;

        console.log(calc.$rateDecay);
      },

      decayCashFlow: function (val) {
        var i, newVal, finalVal;

        for (i = 0; i < calc.$cashFlows.length; i++) {
          if (i == 0) {
            // index 0: decay rate not applied for the inital cashflow
            calc.$cashFlowsCalculated.push(calc.$cashFlows[i]);
          } else {
            // convert current cashflow val to decayed cashflow val 
            newVal = calc.$cashFlows[i] / (Math.pow((1 - val), i));

            finalVal = Number(newVal.toFixed(2));

            calc.$cashFlowsCalculated.push(finalVal);
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

        console.log((decayRate * 100), npv);
      }
    };
  
    // Initialize calculator
    calc.init();
  });
})( jQuery );
