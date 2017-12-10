var myName = "Nick Piscitelli";
var scrollWidth = 5;
var gutterWidth = 3.5; // This is half of the width
var typeInterval;
var selectedTheme = 'monokai';
var selectedFile = 'index';

var themes = [
  "3024-day",
  "3024-night",
  "abcdef",
  "ambiance",
  "ambiance-mobile",
  "base16-dark",
  "base16-light",
  "bespin",
  "blackboard",
  "cobalt",
  "colorforth",
  "dracula",
  "duotone-dark",
  "duotone-light",
  "eclipse",
  "elegant",
  "erlang-dark",
  "hopscotch",
  "icecoder",
  "isotope",
  "lesser-dark",
  "liquibyte",
  "material",
  "mbo",
  "mdn-like",
  "midnight",
  "monokai",
  "neat",
  "neo",
  "night",
  "panda-syntax",
  "paraiso-dark",
  "paraiso-light",
  "pastel-on-dark",
  "railscasts",
  "rubyblue",
  "seti",
  "solarized",
  "the-matrix",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "ttcn",
  "twilight",
  "vibrant-ink",
  "xq-dark",
  "xq-light",
  "yeti",
  "zenburn"
];

var $select = $('select[name="theme-picker"]');
for (var i = 0; i < themes.length; ++i){
  var $option = document.createElement("option");
  $option.value = themes[i];
  $option.text = themes[i].replace(/-/g, ' ');
  if (themes[i] === selectedTheme){
    $option.selected = "selected";
  }
  $select.add($option)
}
// Set active theme as selected
$select.value = selectedTheme;

ready(function(){

  var vp = viewport();
  var $mainNav = $('#mainNav');

  var $firstName = $('#nameType');
  $firstName['codeMirror'] = CodeMirror($firstName, {
    mode:  "javascript",
  });
  $firstName['codeMirror'].setSize(200, 25);

  
  typeInterval = setInterval(typeName, 250);

  var $leftCode = $('#leftCode');
  $leftCode['codeMirror'] = CodeMirror($leftCode, {
    value: $('#leftCodeContent').innerHTML,
    mode:  "javascript",
    theme: "monokai",
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });
  $leftCode['codeMirror'].setSize((vp.w / 2) - gutterWidth - scrollWidth, vp.h - $mainNav.offsetHeight)

  var $rightCode = $('#rightCode');
  var html = $('html').cloneNode(true);
  html.querySelector('#leftCode').innerHTML = '';
  html.querySelector('#rightCode').innerHTML = '';
  html.querySelector('#nameType').innerHTML = '';
  html = html.outerHTML;
  html = html.replace('<style></style></head>', '</head>');
  html = html.replace('<html><head>', '<html>\n<head>');
  $rightCode['codeMirror'] = CodeMirror($rightCode, {
    value: html,
    mode:  "htmlmixed",
    htmlMode: true,
    theme: "monokai",
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });

  $rightCode['codeMirror'].setSize((vp.w / 2) - gutterWidth - scrollWidth, vp.h - $mainNav.offsetHeight)

  $("select[name='theme-picker']").addEventListener('change',function(e){
    var $link = $('#themeLink'),
        href = $link.href;

    $link.href = href.replace(new RegExp(selectedTheme), this.value);

    selectedTheme = this.value;
    $('#leftCode')['codeMirror'].setOption("theme", selectedTheme);
    $('#rightCode')['codeMirror'].setOption("theme", selectedTheme);
  });

  $$(".tabs li").forEach(function(elem) {
    elem.addEventListener("click", function() {
      var 
          tab = this
          file = this.innerHTML,
          active = /\bactive\b/.test(this.className);

      if (!active){
        var components = file.split('.');
        file = encodeURIComponent(components[0]);
        if (file !== selectedFile){
          ajax({
            url: 'files.php?file='+file,
            success: function(data){
              
              data = JSON.parse(data);

              $('#rightCode')['codeMirror'].setValue(data['content']);
              $('#rightCode')['codeMirror'].setOption("mode", data['mode']);

              $$(".tabs li").forEach(function(elem) {
                elem.className = '';
              });
              tab.className = 'active';
              selectedFile = file
            }
          })
        }
      }

    });
  });
});

function typeName(){
  var editor = $('#nameType')['codeMirror'];
  editor['nameIndex'] = editor['nameIndex'] || 0;
  var index = editor['nameIndex']++;
  if (index + 1 <= myName.length){
    editor.setValue(editor.getValue() + myName[index]);
  }
  else {
    editor.focus();
    editor.setCursor({
      line: 1,
      ch: myName.length + 1
    });
    clearInterval(typeInterval);
  }
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}


function $$(query){
  return document.querySelectorAll(query)
}

function $(query){
  return document.querySelector(query)
}

function viewport(){
  return {
    w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  };
}

function ajax(opt){
  var request = new XMLHttpRequest();
  request.open('GET', opt.url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

      // Success!
      var resp = request.responseText;
      typeof opt.success === "function" && opt.success(resp);

    } else {
      // We reached our target server, but it returned an error
      typeof opt.error === "function" && opt.error();
    }
  };

  request.onerror = typeof error === "function" ?
    opt.error : function() {};

  request.send();
}