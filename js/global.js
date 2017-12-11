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

  var
      viewportDimensions = viewport(),
      $mainNav = $('#main-nav');

  var $firstName = $('#name-type');
  $firstName.CodeMirror = CodeMirror($firstName, {
    mode:  "javascript",
  });
  $firstName.CodeMirror.setSize(200, 25);

  

  hackerType({
    editor: $firstName.CodeMirror,
    text: "Nick Piscitelli"
  });


  var $leftCode = $('#left-code-pad');
  $leftCode.CodeMirror = CodeMirror($leftCode, {
    mode:  "javascript",
    theme: "monokai",
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });
  $leftCode.CodeMirror.setSize(
    (viewportDimensions.w / 2) - gutterWidth - scrollWidth,
    viewportDimensions.h - $mainNav.offsetHeight
  );

  getFile({
    file: 'resume',
    success: function(data){
      $('#left-code-pad').CodeMirror.setValue(data.content);
    }
  });

  var $rightCode = $('#right-code-pad');
  $rightCode.CodeMirror = CodeMirror($rightCode, {
    value: "",
    mode:  "htmlmixed",
    htmlMode: true,
    theme: "monokai",
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });

  getFile({
    file: 'index',
    success: function(data){
      $rightCode.CodeMirror.setValue(data.content);
    }
  });

  console.log($('.tabs').offsetHeight);

  $rightCode.CodeMirror.setSize(
    (viewportDimensions.w / 2) - gutterWidth - scrollWidth,
    viewportDimensions.h - $mainNav.offsetHeight - $('.tabs').offsetHeight
  );

  $("select[name='theme-picker']").addEventListener('change',updateTheme);

  $$(".tabs li").forEach(function(elem) {
    elem.addEventListener("click", function() {
      var 
          tab = this
          file = this.innerHTML,
          active = /\bactive\b/.test(this.className);

      if (!active){
        var components = file.split('.');
        file = components[0];
        if (file !== selectedFile){
          getFile({
            file: file,
            success: function(data){

              $('#right-code-pad').CodeMirror.setValue(data.content);
              $('#right-code-pad').CodeMirror.setOption("mode", data.mode);

              $$(".tabs li").forEach(function(elem) {
                elem.className = '';
              });
              tab.className = 'active';
              selectedFile = file;
            }
          });
        }
      }

    });
  });

  new Siema({
    selector: '.siema',
    duration: 200,
    easing: 'ease-out',
    perPage: 1,
    startIndex: 0,
    draggable: false,
    threshold: 20,
    loop: true,
    onInit: () => {},
    onChange: () => {},
  });

  syncWithTheme();
});

function getFile(opt){
  var obj = localGet(opt.file);
  if (obj){
    typeof opt.success === 'function' && opt.success(obj);
    return obj;
  } else {
    opt.file = encodeURIComponent(opt.file);
    ajax({
      url: 'files.php?file='+opt.file,
      success: function(data){
        data = JSON.parse(data)
        localSet(opt.file, data);
        typeof opt.success === 'function' && opt.success(data);
      }
    });
  }
}

function hackerType(opt){
  opt.text = opt.text.split("");
  var counter = 0;
  typeInterval = setInterval(function(){
    typeLetter(opt.editor, opt.text[counter++]);
  }, 250);
}

function typeLetter(editor, letter){
  var index = editor.nameIndex++;
  if (letter && letter.length){
    editor.setValue(editor.getValue() + letter);
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

function localGet(key){
  var record = JSON.parse(localStorage.getItem(key)); 
  if (record){
    if (record.timestamp > new Date().getTime()){
      return JSON.parse(record.value);
    } else {
      localStorage.removeItem(key);
    }
  }
  return undefined;
}

function localSet(key, data, minutes){
  var expiration = (minutes || 20) * 60 * 1000;
  localStorage.setItem(key, JSON.stringify({
    value: JSON.stringify(data),
    timestamp: new Date().getTime() + expiration
  }));
  return true;
}

function syncWithTheme(){
  var
    background = getComputedStyle($('.editor .CodeMirror')).backgroundColor,
    backgroundColor = tinycolor(background);

  var textColor = tinycolor(backgroundColor.isLight() ? '#000' : '#fff');

  var activeTab = $('.tabs .active');
  activeTab.style.backgroundColor = background;
  activeTab.style.color = textColor;

  var tabs = $('.tabs');
  tabs.style.backgroundColor = backgroundColor.lighten(5);
  tabs.style.color = backgroundColor.isLight() ?
    textColor.clone().lighten(25) : textColor.clone().darken(25);

  var mainNav = $('#main-nav');
  mainNav.style.backgroundColor = backgroundColor.isLight() ?
    backgroundColor.clone().lighten(5) : backgroundColor.clone().darken(5);

  var light = backgroundColor.isLight();
  mainNav.className = mainNav.className.replace(light ? 'dark' : 'light', '');
  mainNav.className += ' ' + (light ? 'light' : 'dark');

}

function updateTheme(){
  var $link = $('#theme-link'),
    href = $link.href;

  $link.href = href.replace(new RegExp(selectedTheme), this.value);

  selectedTheme = this.value;
  $('#left-code-pad').CodeMirror.setOption("theme", selectedTheme);
  $('#right-code-pad').CodeMirror.setOption("theme", selectedTheme);
  
  // Make sure computed style has updated
  setTimeout(function(){
    syncWithTheme();
  }, 0);
}