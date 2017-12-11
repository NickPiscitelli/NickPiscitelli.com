var myName = "Nick Piscitelli";
var scrollWidth = 0;
var editorGutterWidth = 0;
var typeInterval;

// Defaults
var activeTheme = 'ambiance';
var activeFile = 'index';

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
  if (themes[i] ===  activeTheme){
    $option.selected = "selected";
  }
  $select.add($option)
}
// Set active theme as selected
$select.value =  activeTheme;

ready(function(){

  var $firstName = $('#name-type');
  $firstName.CodeMirror = CodeMirror($firstName, {
    mode:  "javascript",
    scrollbarStyle: "null",
    lineWrapping: true,
  });
  $firstName.CodeMirror.setSize(350, 25);

  

  hackerType({
    editor: $firstName.CodeMirror,
    text: "Nick Piscitelli"
  });


  var $leftCode = $('#left-code-pad');
  $leftCode.CodeMirror = CodeMirror($leftCode, {
    mode:  "javascript",
    theme:  activeTheme,
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });

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
    theme:  activeTheme,
    lineNumbers: true,
    scrollbarStyle: "overlay"
  });

  getFile({
    file: 'index',
    success: function(data){
      $rightCode.CodeMirror.setValue(data.content);
    }
  });

  $("select[name='theme-picker']").addEventListener('change',function(){
    updateTheme(this.value);
  });

  $$(".tabs .tab").forEach(function(elem) {
    elem.addEventListener("click", function() {
      var 
          tab = this
          file = this.innerHTML,
          active = /\bactive\b/.test(this.className);

      if (!active){
        var components = file.split('.');
        file = components[0];
        if (file !== activeFile){
          getFile({
            file: file,
            success: function(data){

              $('#right-code-pad').CodeMirror.setValue(data.content);
              $('#right-code-pad').CodeMirror.setOption("mode", data.mode);

              $$(".tabs .tab").forEach(function(elem) {
                elem.className = elem.className.replace(/\bactive\b/,' ');
              });
              tab.className += ' active';
              setActiveTab();
              activeFile = file;
            }
          });
        }
      }

    });
  });

  window.addEventListener('resize',resizeCodePads);
  resizeCodePads();
  
  //new Siema({
  //  selector: '.siema',
  //  duration: 200,
  //  easing: 'ease-out',
  //  perPage: 1,
  //  startIndex: 0,
  //  draggable: false,
  //  threshold: 20,
  //  loop: true,
  //  onInit: () => {},
  //  onChange: () => {},
  //});

  updateTheme(activeTheme);
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

function activeBreakpoint(num) {
  var envs = ['xs', 'sm', 'md', 'lg'];

  var el = document.createElement('div');
  document.body.appendChild(el)

  for (var i = envs.length - 1; i >= 0; i--) {
    var env = envs[i];

    el.className = 'hidden-'+env;
    if (getComputedStyle(el).display === 'none'){
      el.parentNode.removeChild(el);
      return num ? i : env;
    }
  }
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
      ch: myName.length - 1
    });
    $('.name-type').style.marginTop = '-4px';
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

function getThemeColor(){
  return tinycolor(getComputedStyle($('.editor .CodeMirror')).backgroundColor)
}

function syncWithTheme(){
  var
    backgroundColor = getThemeColor();

  var textColor = tinycolor(backgroundColor.isLight() ? '#000' : '#fff');

  var tabs = $('.tabs');
  tabs.style.backgroundColor = backgroundColor.isLight() ?
    backgroundColor.clone().darken(5) : backgroundColor.clone().lighten(5);
  tabs.style.color = backgroundColor.isLight() ?
    textColor.clone().lighten(25) : textColor.clone().darken(25);

  var mainNav = $('#main-nav');
  mainNav.style.backgroundColor = backgroundColor.isLight() ?
    backgroundColor.clone().lighten(5) : backgroundColor.clone().darken(5);

  var light = backgroundColor.isLight();
  document.body.className = document.body.className.replace(/\blight\b/, ' ');
  document.body.className += ' ' + (light ? 'light' : '');

  setActiveTab(backgroundColor);
}

function setActiveTab(color){
  if (!color) color = getThemeColor();

  $$('.tabs .tab').forEach(function(e){
    e.style.backgroundColor = 'inherit';
    e.style.color = 'inherit';
  });

  var textColor = tinycolor(color.isLight() ? '#000' : '#fff');
  var activeTab = $('.tabs .active');
  activeTab.style.backgroundColor = color;
  activeTab.style.color = textColor;
}
 
function updateTheme(theme){

  var $link = $('#theme-link'),
    href = $link.href;

  $link.href = href.replace(new RegExp( activeTheme), theme);

   activeTheme = theme;
  $('#left-code-pad').CodeMirror.setOption("theme", theme);
  $('#right-code-pad').CodeMirror.setOption("theme", theme);
  
  // Make sure computed style has updated
  setTimeout(function(){
    syncWithTheme();
  }, 0);
}

function resizeCodePads(){

  var viewportDimensions = viewport(),
      navHeight = $('#main-nav').offsetHeight

  $('#left-code-pad').CodeMirror.setSize(
    '100%',//(viewportDimensions.w / 2) - (editorGutterWidth / 2) - scrollWidth,
    viewportDimensions.h - navHeight
  );
  $('#right-code-pad').CodeMirror.setSize(
    '100%',//(viewportDimensions.w / 2) - (editorGutterWidth / 2) - scrollWidth,
    viewportDimensions.h - navHeight - $('.tabs').offsetHeight
  );

}