/* ==========================================================================
   comment-docs-test
   ========================================================================== */

function initButtons() {
 $('.btn__less').removeClass('btn__secondary').on('click', function() {
   $this = $( this );
   $this.parents('.component_code-col').find('.btn').addClass('btn__secondary');
   $this.removeClass('btn__secondary');
   $this.parents('.component_code-col').find('.component_code').hide();
   $this.parents('.component_code-col').find('.component_code__less').show();
 });
 $('.btn__css').on('click', function() {
   $this = $( this );
   $this.parents('.component_code-col').find('.btn').addClass('btn__secondary');
   $this.removeClass('btn__secondary');
   $this.parents('.component_code-col').find('.component_code').hide();
   $this.parents('.component_code-col').find('.component_code__css').show();
 });
}

var html = $();
var families = {};

$.getJSON("/static/css/main.json", function(json) {
  var data = json;
  $.each(json, function(index, item){
    if ( item.docs.family !== undefined ) {
      if ( families[item.docs.family] === undefined ) {
        families[item.docs.family] = [];
        var $button = $('<button class="nav_btn"></button>');
        $button.text(item.docs.family);
        $button.data('family-key', item.docs.family);
        $button.data('index', index);
        $button.on('focus', function(){
          var key = $(this).data('family-key');
          var index = $(this).data('index');
          $('#main').empty();
          $.each(families[key], function(index, item){
            var componentName = item.docs.name;
            var $codeCol = $('<div class="component_code-col"></div>');
            var $codeContainer = $('<div class="component_code-container"></div>');
            var $code;
            if ( item.code && item.code.length > 0 ) {
              $code = $('' +
                '<div class="component_code component_code__css">' +
                  '<pre>' +
                    '<code class="lang-css">'+
                      $('<div>').text(item.code).html() +
                    '</code>' +
                  '</pre>' +
                '</div>'
              );
            }
            var $codeAlt;
            if ( item.code_alt && item.code_alt.length > 0 ) {
              $codeAlt = $('' +
                '<div class="component_code component_code__less">' +
                  '<pre>' +
                    '<code class="lang-less">'+
                      $('<div>').text(item.code_alt).html() +
                    '</code>' +
                  '</pre>' +
                '</div>'
              );
            }
            var $docs = $('<div class="component_docs"></div>');
            if ( item.docs.patterns !== undefined ) {
              $.each(item.docs.patterns, function(index, item){
                if ( item.markup !== undefined ) {
                  var $component = $('<div class="component"></div>');
                  $component.append('<h1 class="component_name">'+componentName+': '+item.name+'</h1>');
                  $component.append('<div class="component_rendered">'+item.markup+'</div>');
                  $component.append('<pre class="component_markup"><code id="pattern-markup" class="lang-xml">'+$('<div>').text(item.markup).html()+'</code></pre>');
                  $docs.append( $component );
                }
              });
            }
            var $commentDoc = $('<div class="comment-doc"></div>');
            $commentDoc.append( $docs );
            if ( $code !== undefined && $codeAlt !== undefined ) {
              $codeContainer.append('<button class="btn btn__secondary btn__grouped-last btn__css">CSS</button>');
              $codeContainer.append('<button class="btn btn__secondary btn__grouped-first btn__less">LESS</button>');
            } else if ( $code !== undefined ) {
              $codeContainer.append('<button class="btn btn__disabled btn__css">CSS</button>');
            } else if ( $codeAlt !== undefined ) {
              $codeContainer.append('<button class="btn btn__disabled btn__less">LESS</button>');
            }
            if ( $codeAlt !== undefined && $code !== undefined ) {
              $codeContainer.append( $codeAlt );
              $codeContainer.append( $code.hide() );
            } else if ( $codeAlt !== undefined ) {
              $codeContainer.append( $codeAlt );
            } else if ( $code !== undefined ) {
              $codeContainer.append( $code );
            }
            if ( $code !== undefined || $codeAlt !== undefined ) {
              $codeCol.append( $codeContainer );
              $commentDoc.append( $codeCol );
            }
            $('#main').append( $commentDoc );
          });
          $('.lang-css, .lang-less, .lang-xml').each(function(i, block) {
            hljs.highlightBlock(block);
          });
          initButtons();
        });
        html = html.add($('<li class="nav_item">').append($button));
        families[item.docs.family].push(item);
      } else {
        families[item.docs.family].push(item);
      }
    }
  });

  $('#nav').append(html);
  $('#nav').find('.nav_btn').first().trigger('focus');

  initButtons();

});
