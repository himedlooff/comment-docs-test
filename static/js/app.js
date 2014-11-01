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
          var cleanResponse = $filter('doxrayAppData')( response );
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

  angular.module('doxrayApp').controller( 'DocsCtrl', function ( $scope, $filter, dataService ) {
    // Properties
    $scope.title = 'Docs:';
    $scope.data = dataService.data;
    $scope.families = [];
    $scope.currentFamily = '';
    // Events
    $scope.$watchCollection( 'data', function( newData, oldData ) {
      $scope.families = $filter('doxrayFamilies')( newData );
      $scope.currentFamily = $scope.families[ 0 ];
    });
    $scope.$on( 'onRepeatLast', function( scope, element, attrs ){
      var code = document.querySelectorAll('.lang-css, .lang-less, .lang-xml');
      angular.forEach( code, function( element ) {
        hljs.highlightBlock( element );
      });
    });
    // Functions
    $scope.setFamily = function ( family ) {
      $scope.currentFamily = family;
    };
    $scope.toggleCSS = function ( pattern ) {
      pattern.showCSS = true;
      pattern.showLESS = false;
    };
    $scope.toggleLESS = function ( pattern ) {
      pattern.showCSS = false;
      pattern.showLESS = true;
    };
  });

  /* Return an array of Dox-ray objects prepped for use in doxrayApp.
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayAppData', function ( $sce ) {
    return function( patterns ) {
      var output = [];
      angular.forEach( patterns, function( subPattern ) {
        try {
          // Convert subPattern[x].docs.patterns[y].markup into "trusted HTML".
          if ( subPattern.docs.patterns ) {
            angular.forEach( subPattern.docs.patterns, function( subPattern ) {
              try {
                if ( subPattern.markup ) {
                  subPattern.markup = $sce.trustAsHtml( subPattern.markup );
                }
              } catch ( e ) {
                console.error( e );
              }
            });
          }
          // Filter out any EOF Dox-ray objects.
          if ( typeof subPattern.docs.eof === 'undefined' ) {
            output.push( subPattern );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Return an array of Dox-ray objects of the same family.
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayFamily', function () {
    return function( patterns, family ) {
      var output = [];
      angular.forEach( patterns, function( subPattern ) {
        try {
          if ( subPattern.docs.family === family ) {
            output.push( subPattern );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Return an array of unique Dox-ray item[x].docs.family names
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayFamilies', function () {
    return function( patterns ) {
      var output = [];
      angular.forEach( patterns, function( subPattern, index ) {
        try {
          if ( output.indexOf( subPattern.docs.family ) === -1 ) {
            output.push( subPattern.docs.family );
          }
        } catch ( e ) {
          console.error( e );
        }
      });
      return output;
    };
  });

  /* Creates a hook when ng-repeat finishes
     ========================================================================== */
  angular.module('doxrayApp').directive( 'onLastRepeat', function () {
    return function( scope, element, attrs ) {
      if ( scope.$last ) {
        setTimeout(function () {
          scope.$emit( 'onRepeatLast', element, attrs );
        }, 1);
      }
    };
  });

})();
