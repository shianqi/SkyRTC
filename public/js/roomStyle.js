/**
 * Created by killer on 2017/2/28.
 */
$(document).on("click touchend", ".gridly .brick", function(event) {
    var $this, size;
    event.preventDefault();
    event.stopPropagation();
    $this = $(this);
    $this.toggleClass('small');
    $this.toggleClass('large');
    if ($this.hasClass('small')) {
        size = 280;
    }
    if ($this.hasClass('large')) {
        size = 580;
    }
    $this.data('width', size);
    $this.data('height', size);
    return $('.gridly').gridly('layout');
});

window.onload = function() {
    onResize();
};
var onResize = function(){
    var winWidth = document.body.clientWidth;
    var col = parseInt((winWidth-10)/300);

    $('.gridly').gridly({
        base: 280, // px
        gutter: 20, // px
        columns: col
    });
};
var timer;
window.onresize = function(){
    if(timer!=null){
        clearTimeout(timer);
    }
    timer = setTimeout(onResize,200);
};


