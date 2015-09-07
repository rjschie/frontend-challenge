$(function() {

	/** Toggle popovers */
	$('[data-toggle=popover]').popover({
		placement: 'bottom'
	});

	/** Make List Sortable */
	$('.js-list-sortable').sortable({
		items: "> .list__item",
		forcePlaceholderSize: true,
		placeholder: "list__item list__item--highlight",
		tolerance: "pointer",
		start: function(e, ui) {
			ui.item.addClass('list__item--grabbing');
		},
		stop: function(e, ui) {
			ui.item.removeClass('list__item--grabbing');
		}
	});

});