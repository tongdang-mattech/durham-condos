jQuery(function($){

// Preloader
	jQuery(window).load(function() { // makes sure the whole site is loaded
      $('#status').fadeOut(); // will first fade out the loading animation
      $('#preloader').delay(100).fadeOut('slow'); // will fade out the white DIV that covers the website.
      $('body').delay(100).css({'overflow':'visible'});
    })

  /* ----------------------------------------------------------- */
  /*  1. MENU SLIDE
  /* ----------------------------------------------------------- */ 

  var menuRight = document.getElementById( 'main-menu' ),
    showRight = document.getElementById( 'menu-btn' ),
    close = document.getElementById( 'close' ),
    body = document.body;

  window.onload = function() {
    showRight.onclick = function(e) {
      e.preventDefault();
      classie.toggle( this, 'active' );
      classie.toggle( menuRight, 'menu-open' );     
    };

    close.onclick = function() {
      classie.removeClass( showRight, 'active' );
      classie.removeClass( menuRight, 'menu-open' );  
    };

    menuRight.onclick = function(e) {
      if ( e.target == this ) {
        classie.removeClass( this, 'active' );
        classie.removeClass( menuRight, 'menu-open' );       
      }
    };
  };
      
  
  $(document).ready(function (){
    $('.mobile__menu #menu-btn').click(function (){
      $('body').toggleClass('menuShow_mobile');
    });
    $('.mobile_menu_top_logo #close').click(function (){
      $('body').removeClass('menuShow_mobile');
    });
    $('.mobile_menu_overlay').click(function (){
      $('body').removeClass('menuShow_mobile');
      $('#menu-btn').removeClass('active');
      $('#main-menu').removeClass('menu-open');
    });
  });

});
