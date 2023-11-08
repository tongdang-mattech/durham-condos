jQuery(function(jQuery){
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
      menuRight.hide();           
    };

    menuRight.onclick = function() {
      classie.toggle( this, 'active' );
      classie.toggle( menuRight, 'menu-open' );       
    };
  };
});