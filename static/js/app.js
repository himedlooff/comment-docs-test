/* ==========================================================================
   comment-docs-test
   Angular
   ========================================================================== */

(function(){

  angular.module( 'doxrayApp', ['ngSanitize'] );

  angular.module('doxrayApp').service( 'dataService', function ( $http, $filter ) {
    var jsonPath = '/static/css/main.json';
    var data = [];
    var addData = function( newObj ) {
        data.push( newObj );
    };
    var fetchData = function() {
      $http.get( jsonPath ).
        success( function( response, status, headers, config ) {
          var cleanResponse = $filter('doxrayClean')( response );
          cleanResponse = $filter('doxrayTrustMarkup')( cleanResponse );
          angular.copy( cleanResponse, data );
        }).
        error( function ( data, status, headers, config ) {
          console.error( 'Error getting', jsonPath );
        });
    };
    fetchData(function(){});
    return {
      data: data,
      fetchData: fetchData,
      addData: addData
    };
  });

  angular.module('doxrayApp').service( 'stateService', function () {
    var currentFamily = '';
    return {
      currentFamily: currentFamily
    };
  });

  angular.module('doxrayApp').controller( 'MastheadCtrl', function ( $scope, $filter, dataService, stateService ) {
    $scope.title = 'Docs:';
    $scope.data = dataService.data;
    $scope.families = [];
    $scope.$watchCollection( 'data', function( newVal, oldVal ) {
      $scope.families = $filter('doxrayFamilies')( newVal );
      stateService.currentFamily = $scope.families[0];
    });
    $scope.currentFamily = stateService.currentFamily;
    $scope.$watch(
      function () {
        return stateService.currentFamily;
      },
      function( newVal, oldVal ) {
        $scope.currentFamily = newVal;
      }
    );
    $scope.setFamily = function( family ) {
      stateService.currentFamily = family;
    };
  });

  angular.module('doxrayApp').controller( 'DocsCtrl', function ( $scope, $filter, dataService, stateService, $sce ) {
    $scope.data = dataService.data;
    $scope.currentFamily = stateService.currentFamily;
    $scope.$watch(
      function () {
        return stateService.currentFamily;
      },
      function( newVal, oldVal ) {
        $scope.currentFamily = newVal;
      }
    );
    $scope.setFamily = function( family ) {
      stateService.currentFamily = family;
    };
  });

  /* Filter a DoxRay array to objects with the same docs.family name
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayFamily', function () {
    return function( items, family ) {
      var output = [];
      angular.forEach( items, function( item ) {
        try {
          if ( item.docs.family === family ) {
            output.push( item );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Filter a DoxRay array by by trusting HTML in docs.patterns[x].markup
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayTrustMarkup', function ( $sce ) {
    return function( items ) {
      var output = items;
      angular.forEach( items, function( item ) {
        try {
          if ( item.docs.patterns ) {
            angular.forEach( item.docs.patterns, function( pattern ) {
              try {
                if ( pattern.markup ) {
                  pattern.markup = $sce.trustAsHtml( pattern.markup );
                }
              } catch ( e ) {
                console.error( e );
              }
            });
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Filter a DoxRay array to a list of unique docs.family names
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayFamilies', function () {
    return function( items ) {
      var output = [];
      angular.forEach( items, function( item, index ) {
        try {
          if ( output.indexOf( item.docs.family ) === -1 ) {
            output.push( item.docs.family );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Filter a DoxRay array by removing anything with docs.name = EOF
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayClean', function () {
    return function( items ) {
      var output = [];
      angular.forEach( items, function( item ) {
        try {
          if ( typeof item.docs.eof === 'undefined' ) {
            output.push( item );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

})();

/* ==========================================================================
   comment-docs-test
   jQuery
   ========================================================================== */

// function initButtons() {
//  $('.btn__less').removeClass('btn__secondary').on('click', function() {
//    $this = $( this );
//    $this.parents('.component_code-col').find('.btn').addClass('btn__secondary');
//    $this.removeClass('btn__secondary');
//    $this.parents('.component_code-col').find('.component_code').hide();
//    $this.parents('.component_code-col').find('.component_code__less').show();
//  });
//  $('.btn__css').on('click', function() {
//    $this = $( this );
//    $this.parents('.component_code-col').find('.btn').addClass('btn__secondary');
//    $this.removeClass('btn__secondary');
//    $this.parents('.component_code-col').find('.component_code').hide();
//    $this.parents('.component_code-col').find('.component_code__css').show();
//  });
// }

// var html = $();
// var families = {};

// $.getJSON("/static/css/main.json", function(json) {
//   var data = json;
//   $.each(json, function(index, item){
//     if ( item.docs.family !== undefined ) {
//       if ( families[item.docs.family] === undefined ) {
//         families[item.docs.family] = [];
//         var $button = $('<button class="nav_btn"></button>');
//         $button.text(item.docs.family);
//         $button.data('family-key', item.docs.family);
//         $button.data('index', index);
//         $button.on('focus', function(){
//           var key = $(this).data('family-key');
//           var index = $(this).data('index');
//           $('#main').empty();
//           $.each(families[key], function(index, item){
//             var componentName = item.docs.name;
//             var $codeCol = $('<div class="component_code-col"></div>');
//             var $codeContainer = $('<div class="component_code-container"></div>');
//             var $code;
//             if ( item.code && item.code.length > 0 ) {
//               $code = $('' +
//                 '<div class="component_code component_code__css">' +
//                   '<pre>' +
//                     '<code class="lang-css">'+
//                       $('<div>').text(item.code).html() +
//                     '</code>' +
//                   '</pre>' +
//                 '</div>'
//               );
//             }
//             var $codeAlt;
//             if ( item.code_alt && item.code_alt.length > 0 ) {
//               $codeAlt = $('' +
//                 '<div class="component_code component_code__less">' +
//                   '<pre>' +
//                     '<code class="lang-less">'+
//                       $('<div>').text(item.code_alt).html() +
//                     '</code>' +
//                   '</pre>' +
//                 '</div>'
//               );
//             }
//             var $docs = $('<div class="component_docs"></div>');
//             if ( item.docs.patterns !== undefined ) {
//               $.each(item.docs.patterns, function(index, item){
//                 if ( item.markup !== undefined ) {
//                   var $component = $('<div class="component"></div>');
//                   $component.append('<h1 class="component_name">'+componentName+': '+item.name+'</h1>');
//                   $component.append('<div class="component_rendered">'+item.markup+'</div>');
//                   $component.append('<pre class="component_markup"><code id="pattern-markup" class="lang-xml">'+$('<div>').text(item.markup).html()+'</code></pre>');
//                   $docs.append( $component );
//                 }
//               });
//             }
//             var $commentDoc = $('<div class="comment-doc"></div>');
//             $commentDoc.append( $docs );
//             if ( $code !== undefined && $codeAlt !== undefined ) {
//               $codeContainer.append('<button class="btn btn__secondary btn__grouped-last btn__css">CSS</button>');
//               $codeContainer.append('<button class="btn btn__secondary btn__grouped-first btn__less">LESS</button>');
//             } else if ( $code !== undefined ) {
//               $codeContainer.append('<button class="btn btn__disabled btn__css">CSS</button>');
//             } else if ( $codeAlt !== undefined ) {
//               $codeContainer.append('<button class="btn btn__disabled btn__less">LESS</button>');
//             }
//             if ( $codeAlt !== undefined && $code !== undefined ) {
//               $codeContainer.append( $codeAlt );
//               $codeContainer.append( $code.hide() );
//             } else if ( $codeAlt !== undefined ) {
//               $codeContainer.append( $codeAlt );
//             } else if ( $code !== undefined ) {
//               $codeContainer.append( $code );
//             }
//             if ( $code !== undefined || $codeAlt !== undefined ) {
//               $codeCol.append( $codeContainer );
//               $commentDoc.append( $codeCol );
//             }
//             $('#main').append( $commentDoc );
//           });
//           $('.lang-css, .lang-less, .lang-xml').each(function(i, block) {
//             hljs.highlightBlock(block);
//           });
//           initButtons();
//         });
//         html = html.add($('<li class="nav_item">').append($button));
//         families[item.docs.family].push(item);
//       } else {
//         families[item.docs.family].push(item);
//       }
//     }
//   });

//   $('#nav').append(html);
//   $('#nav').find('.nav_btn').first().trigger('focus');

//   initButtons();

// });
