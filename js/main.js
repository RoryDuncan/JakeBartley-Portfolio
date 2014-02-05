


var NUMBER_OF_IMAGES = 9;  // Count 0 as a number

    /* * helpers * */

var gethref = function($el){
  return $el.attr("href");

};    
//determining certain functionality
var isMobile = function(){
  if (window.innerWidth <= 480) return true;
  else return false;
};



var setSlideHeight = function() {
  // Adjust the .slide class to be the size of the viewport
  var h = $(window).height(),
      w = $(window).width(),
      slide = $('.slide'),
      nav = $('div.header-container');
    
  h = h - nav.innerHeight();
  // window.slideHeight = h;

  // pad the content 10% from the top 
  slide.css({
    "min-height": (h) + "px",
    "padding-top": (h * 0.10) + "px",
  });

  // The maximum size of the gallery



  $(".gallery ul.horizontal-view").css({
    "max-height": (h) + "px",
  });


  //$(".about").css({"background":"url('img/backdrop.png') 0 0px no-repeat fixed"});

};


var loadImages = function(result, prefix, path, max, suffix, callback) {
  /*
  
  WARNING:

  this method is kind of hacky, ideally it would use a server to determine the images to be loaded, etc.
  

  */
  window.loadedImages = 0;

  var pre = prefix || "",
      path = path || "",
      results = [];

  for (x = 0, xx = max || 100; x <= xx; x++) {

    //lambda so closures dont fuck shit up

    (function() {
      var file = new Image();

      var suffixes = ["png", "jpg", "jpeg", "gif"];
      var filename = path + "/" + pre + x.toString() + "." + suffix;

      file.src = filename;



      file.onload = function(e) {

        var index = this.src
            index = index.split(prefix)[1].split(".")[0];

        results[index] = this;
        
        //add to our results, at the specific index so that order is maintained
        window[result] = results;

        //update the global counter
        window.loadedImages = window.loadedImages + 1;



        if (window.loadedImages === NUMBER_OF_IMAGES ) {
          // call if all images have been loaded

          callback.call(null, window[result]);

        }

      };

    })();
  };

};

var toggleGalleryLoading = function() {

};

var renderImages = function(gallery) {
  
  console.log(window.loadedImages + "/" + NUMBER_OF_IMAGES  + " gallery images loaded.");

  $("#itemcount").text(window.loadedImages + " photos" );

  for ( x = 0, xx = gallery.length; x< xx; x++ ) {

    $(gallery[x]).attr("id", "gallery-item-" + x );
    // convert from DOM object to html string
    var image = $(gallery[x])[0].outerHTML;

    // give the first two images the 'active' class
    $(".gallery-wrapper ul ").append("<li class='gallery-item'>" + image + "</li>");

    $(".gallery-nav").append("<a href='#gallery-item-" + x + "'> </a>")
  }

  // delegated events
    var throttle = 1;
    var current = null;
    // use a throttle to limit the amount of calculations

    var clientW = $(".gallery ul.horizontal-view")[0].clientWidth;
    $(".gallery ul.horizontal-view li").click( (function(e){
      if ($(e.currentTarget).parent().hasClass("overview")) return;
      $(e.currentTarget).addClass("current");
      var parent = $(e.currentTarget).parent();
      var children = parent.children();

      for (x = 0, xx = children.length; x < xx; x++) {

        if ( $(children[x]).hasClass("current")) {
          current = x;
        }
      }

      $(e.currentTarget).removeClass("current");


    if (e.clientX <= (clientW / 2) ) {


      // case where it's the first item

      if (current !== 0 ) {
        $(children[current - 1] ).fadeIn();
      }

    } 
    else {

      $(e.currentTarget).fadeOut();
      if ((current+1) === children.length) {

        $(".gallery ul.horizontal-view li").fadeIn(500);
      }
        
    } 




    }));
};


$(document).ready(
  (function() {

    var gallery;

    setSlideHeight();

    // name, prefix, path, max, suffix, callback
    loadImages("portfolio", "photo_", "img/portfolio", NUMBER_OF_IMAGES - 1, "jpg", renderImages);
    // will load into window.gallery


  /*  * EVENTS *  */ 

    // for changing the view in the gallery
    $(".change-mode").click(function(e){
      e.preventDefault();
      $(".gallery ul").toggleClass("horizontal-view");
      $(".gallery ul").toggleClass("overview");
      $("#itemcount").fadeToggle(800);
      if ( $(".change-mode").text() === "overview" ) {
        $(".change-mode").text("gallery");
        $(".gallery-nav").hide();
        $(".gallery > .wrapper > h1").animate({"top": "0px"})
        $(".gallery .overview li").show();
        $(".gallery .overview").css({"max-height":"none"});
      }
      else {
        $(".gallery .horizontal-view").css({"max-height":"700px"});
        $(".change-mode").text("overview");
        $(".gallery > .wrapper > h1").animate({"top": "100px"})
        $(".gallery-nav").show();
      }
    });




     var scroll = function(e) {
        e.preventDefault();
        var href = gethref( $(e.target) );
        $.scrollTo(href, 800);
      };

    if (!isMobile()) {

      //only use this functionality if on desktop
      $("nav a").click(scroll);
      $(".about p a").click(scroll);

    } // end of isMobile condition




  })()
);
