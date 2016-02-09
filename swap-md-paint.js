/**
 * swap-md-paint.js
 *
 * Released under MIT License.
 * Copyright (c) 2016 Rémi Becheras All rights reserved
 *
 */


(function(){
  'use strict';

  function setRGB(element,styled,themeProvider,input,directiveName) {

    var themeName     = 'default';
    var hueName       = 'default';
    var intentionName = 'primary';
    var hueKey,theme,hue,intention;
    var shades = {
      '50' :'50' ,'100':'100','200':'200','300':'300','400':'400',
      '500':'500','600':'600','700':'700','800':'800','A100':'A100',
      'A200':'A200','A400':'A400','A700':'A700'
    };
    var intentions = {
      primary:'primary',
      accent:'accent',
      warn:'warn',
      background:'background'
    };
    var hues = {
      'default':'default',
      'hue-1':'hue-1',
      'hue-2':'hue-2',
      'hue-3':'hue-3'
    };

    // Do our best to parse out the attributes
    angular.forEach(input.split(' '), function(value, key) {
      if (0 === key && 'default' === value) {
        themeName = value;
      } else
      if (intentions[value]) {
        intentionName = value;
      } else if (hues[value]) {
        hueName = value;
      } else if (shades[value]) {
        hueKey = value;
      }
    });

    // Lookup and assign the right values
    if ((theme = themeProvider._THEMES[themeName])) {
      if ((intention = theme.colors[intentionName]) ) {
        if (!hueKey) {
          hueKey = intention.hues[hueName];
        }
        if ((hue = themeProvider._PALETTES[intention.name][hueKey]) ) {
          element.css(styled,'rgb('+hue.value[0]+','+hue.value[1]+','+hue.value[2]+')');
          return;
        }
      }
    }
    reportError( '%s=\'%s\' bad or missing attributes', directiveName, input );
  }

  function reportError(errString,name,input) {
    console.error(errString,name,input);
    console.log('usage %s="[theme] intention [hue]"',name);
    console.log('acceptable intentions : primary,accent,warn,background');
    console.log('acceptable hues       : default,hue-1,hue-2,hue-3');
  }

  angular.module('swapMdUtil', ['ngMaterial'])

  .directive('swapMdPaintFg',function(SwapMd) {
    return {
      restrict : 'A',
      link     : function(scope, element, attributes) {
        setRGB(element,'color',SwapMd.themeColors,attributes.swapMdPaintFg,'swap-md-paint-fg');
      }
    };
  })

  .directive('swapMdPaintBg',function(SwapMd) {
    return {
      restrict : 'A',
      link     : function(scope, element, attributes) {
        setRGB(element,'background-color',SwapMd.themeColors,attributes.swapMdPaintBg,'swap-md-paint-bg');
      }
    };
  })

  .directive('swapMdPaintSvg',function(SwapMd) {
    return {
      restrict : 'A',
      link     : function(scope, element, attributes) {
        setRGB(element,'fill',SwapMd.themeColors,attributes.swapMdPaintSvg,'swap-md-paint-svg');
      }
    };
  })

  // Couldn't get access to _PALETTES any other way?
  .provider('SwapMd',function($mdThemingProvider){
    return {
      $get : function() {
        return {
          themeColors : $mdThemingProvider
        };
      }
    };
  });

})();
