/* ==========================================================================
   comment-docs-test
   Angular
   ========================================================================== */

(function(){

  angular.module( 'doxrayApp', ['ngSanitize'] );

  angular.module('doxrayApp').controller( 'DocsCtrl', function ( $scope, $http, $filter ) {
    // Properties
    $scope.jsonPath = '/static/css/main.json';
    $scope.title = 'Docs:';
    $scope.data = [];
    $scope.families = [];
    $scope.currentFamily = '';
    // Events
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
    // Init
    $http.get( $scope.jsonPath ).
      success( function( response, status, headers, config ) {
        var filteredResponse = $filter('doxrayAppData')( response );
        angular.copy( filteredResponse, $scope.data );
        $scope.families = $filter('doxrayFamilies')( $scope.data );
        $scope.currentFamily = $scope.families[ 0 ];
      });
  });

  /* Return an array of Dox-ray objects prepped for use in doxrayApp.
     ========================================================================== */
  angular.module('doxrayApp').filter( 'doxrayAppData', function ( $sce ) {
    return function( patterns ) {
      var output = [];
      angular.forEach( patterns, function( pattern ) {
        try {
          if ( pattern.docs.patterns ) {
            angular.forEach( pattern.docs.patterns, function( subPattern ) {
              // Convert subPattern[x].docs.patterns[y].markup into "trusted HTML".
              if ( subPattern.markup ) {
                subPattern.markup = $sce.trustAsHtml( subPattern.markup );
              }
            });
          }
          // Filter out any EOF Dox-ray objects.
          if ( typeof pattern.docs.eof === 'undefined' ) {
            output.push( pattern );
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
      angular.forEach( patterns, function( pattern ) {
        try {
          if ( pattern.docs.family === family ) {
            output.push( pattern );
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
      angular.forEach( patterns, function( pattern, index ) {
        try {
          if ( output.indexOf( pattern.docs.family ) === -1 ) {
            output.push( pattern.docs.family );
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
