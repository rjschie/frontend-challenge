
/**
 * Slide new list into view
 */
function advanceMenu(from, toward, options) {
  var options = options || {};
  options.offset = options.offset || '120%';
  options.direction = options.direction || 'left';
  options.speed = options.speed || 500;
  options.hideClass = options.hideClass || 'list__group--hidden';

  toward.removeClass(options.hideClass);
  toward.css({
    position: 'absolute',
    top: 0,
    left: options.offset
  });
  from.css('height', toward.height());
  toward.animate({
    left: 0
  }, options.speed);
  from.hide('slide', {direction: options.direction}, options.speed, function() {
    from.addClass(options.hideClass);
    from.removeAttr('style');
    toward.removeAttr('style');
  });
}



$(function() {

  /** Toggle popovers */
  $('[data-toggle=popover]').popover({
    placement: 'bottom',
    container: '.list'
  });


  /** Make List Sortable */
  $('.js-list-sortable').sortable({
    items: "> .list__item",
    forcePlaceholderSize: true,
    placeholder: "list__item list__item--placeholder",
    tolerance: "pointer",
    distance: 10,
    cancel: '.js-list-item-back,.list__action-wrap',
    start: function(e, ui) {
      ui.item.addClass('list__item--grabbing');
    },
    stop: function(e, ui) {
      ui.item.removeClass('list__item--grabbing');
    }
  });


  /** List menu'ing */
  $('.js-list-item-menu').on('click', function(e) {
    var self = $(this);
    var parent = self.parent();
    var target = $('#' + self.data('target'));

    if( typeof(e.target.className) == 'string'
      && e.target.className.indexOf('list__action-button') > -1 ) {

      return false;
    }

    if( target.find('.js-list-item-back').length == 0 ) {
      var backButton = $(target.data('back-template')) || $('<li></li>');
      target.prepend(backButton);

      backButton.on('click', function() {
        advanceMenu(target, parent, {
          offset: '-150%',
          direction: 'right'
        });
      });
    }

    advanceMenu(parent, target);
  });

});