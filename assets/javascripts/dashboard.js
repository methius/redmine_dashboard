(function($) {

	var rdbInits = [];

	$.fn.rdbAny = function(selector) {
		return $(this).length > 0;
	};

	$.fn.rdbEmpty = function(selector) {
		return $(this).length == 0;
	};

	$.fn.rdbFindUp = function(selector) {
		var el = $(this);
		if(el.is(selector))
			return $(this);
		return el.parents(selector);
	};

	$.fn.rdbInit = function(fn) {
		if(fn) {
			rdbInits.push(fn);
		} else {
			for(var i in rdbInits) {
				rdbInits[i].call(this);
			}
		}
	};

	$.fn.rdbIssue = function() {
		return $(this).rdbFindUp('[data-rdb-issue-id]');
	}

	$.fn.rdbIssueId = function() {
		return $(this).rdbIssue().data('rdb-issue-id');
	}

	$.fn.rdbError = function(message) {
		var box = $('#rdb-errors');
		var msg = $('<div class="rdb-error" />').html(message).hide();

		msg.append('<a class="close">❌</a>')

		msg.find('a.close').click(function(e) {
			e.preventDefault();
			msg.fadeOut(function() {
				msg.remove();
			});
		});

		msg.appendTo(box).fadeIn(function() {
			setTimeout(function() {
				msg.fadeOut(function() {
					msg.remove();
				});
			}, 7000);
		});
	}

	$.fn.rdbStorageAdd = function(id, value) {
		var storage = $.totalStorage('rdb-' + id);
		if(!storage) storage = new Array;
		storage.push(value);
		$.totalStorage('rdb-' + id, storage);
		return true;
	};

	$.fn.rdbStorageRemove = function(id, value) {
		var storage = $.totalStorage('rdb-' + id);
		if(!storage) return false;
		for(var i in storage) {
			if(storage[i] == value) {
        		storage.splice(i, 1);
				break;
			}
		}
		$.totalStorage('rdb-' + id, storage);
		return true;
	};

	$.fn.rdbStorageHas = function(id, value) {
		var storage = $.totalStorage('rdb-' + id);
		if(!storage) return false;
		for(var i in storage) {
			if(storage[i] == value) {
				return true;
			}
		}
		return false;
	};

	/*
	 * Ajax Filter / Options
	 */
	$(document).ready(function() {
		$(document).click(function(e) {
			var link = $(e.target).rdbFindUp('a').first();
			if(link.rdbFindUp('.rdb-async').rdbAny() && link.attr('href') != '#' && !link.is('.rdb-sync')) {
				e.preventDefault();
				$.getScript(link.attr('href'));
			}
		});
	})

	/* Issue subject text ellipsis */
	$(document).ready(function () {
		var resizeActions = function() {
			$('.rdb-property-subject').ellipsis();

		};

		$().rdbInit(resizeActions);
		$(window).resize(resizeActions);

		$('#rdb').rdbInit();
	});

})(jQuery);;