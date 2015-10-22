//https://github.com/xuqingkai/jquery.ajax.js
;(function ($) {
	$.fn.extend({
		ajax: function (callback) {
			if (!callback) {
				callback = function (json) {
					if (json.message) { window.alert(json.message); }
					if (json.result !== undefined) {
						if (json.result == null) {
						} else if (json.result == '') {
							window.location.reload();
						} else {
							window.location.href = json.result.url || json.result;
						}
					}
				};
			}
			return $(this).each(function (i) {
				if ($(this).is('form')) {
					var iframe = 'ajax_post_iframe_' + i;
					$(this).attr('target', iframe).next('iframe').remove();
					$(this).after('<iframe id="' + iframe + '" name="' + iframe + '" style="display:none"></iframe>')
					$(this).next().load(function () {
						var html = $(window.frames[iframe].document).find('body').html();
						if (html) { callback($.parseJSON(html)); }
					});
					$(this).submit(function (e) {
						if ($(this).find(':file').length > 0) { $(this).attr("enctype", "multipart/form-data"); }
						var action = $(this).attr('action') || '';
						if (action.length == 0) { action = '?'; }
						if (action.substring(0, 1) == '?') { action = window.location.pathname + action; }
						if (action.indexOf('?') < 0) { action += '?'; }
						if (action.substr(-1) != '&') { action += '&'; }
						action += 'random=' + Math.random();
						$(this).attr('action', action);
						var ajax = $(this).attr('data-ajax');
						if (ajax && (ajax.toLowerCase() == 'false' || ajax.toLowerCase() == '0')) { e.preventDefault(); }
					});
				} else {
					$(this).click(function (e) {
						var ajax = ($(this).attr('data-ajax') || '').toLowerCase();
						if (ajax != 'false' && ajax != '0') {
							e.preventDefault();
							var confirm = $(this).attr('data-confirm');
							if (confirm == null || window.confirm(confirm.length > 0 ? confirm : '确定要进行此操作吗？')) {
								var url = $(this).attr('href') || $(this).attr('data-href');
								if (!url) { url = '?'; }
								if (url.substring(0, 1) == '?') { url = window.location.pathname + url; }
								if (url.indexOf('?') < 0) { url += '?'; }
								if (url.substr(-1) != '&') { url += '&'; }
								url += 'random=' + Math.random();
								$.post(url, {}, callback, 'json');
							}
						}
					});
				}
			});
		}
	});
})(window.jQuery);
