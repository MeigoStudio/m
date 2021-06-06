let qx = {

	getUrlParam: function(name){
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return (results == null) ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},

	getUrlParams: function(){
		let string = location.search.split('?')[1];

		let result = {};

		if(string==undefined || string=='undefined'){ return result; }

		$.each(string.split('&'), function(key, val){
			expl = val.split('=');

			result[expl[0]] = expl[1];
		});

		return result;
	},

	changeUrlParam: function(json){
		let get = this.getUrlParams();

		$.each(json, function(key, value){

			get[key] = value;
		});

		if(Object.keys(get).length<=0){ location.search = ''; return false; }

		let string = '?';

		$.each(get, function(key, val){
			string = string+key+'='+val+'&';
		});

		string = string.substring(0, string.length - 1);

		location.search = string;

		return true;
	},

	notify: function(text, title, type){

		let self = this;

		type = (type===true);

		title = (title===undefined) ? '' : title;

		let block = $('.a-alert');

		if(!block.length){
			$('body').append('<div class="a-alert"></div>');

			block = $('.a-alert');
		}

		let id = Math.random();

		block.append('<div class="alert-id" style="display: none;" data-id="'+id+'">' +
			'<div class="wrapper">' +
			'<div class="text">'+text+'</div>' +
			'<div class="footer-block">' +
			'<div class="block-left"><div class="title">'+title+'</div></div>' +
			'<div class="block-right">' +
			'<button class="btn btn-transparent col-white text-upper close-trigger">РЎРљР Р«РўР¬</button>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');

		block.find('.alert-id[data-id="'+id+'"]').fadeIn('fast');

		setTimeout(function(){
			self.notify_close(id);
		}, 3000);

		return type;
	},

	confirm_storage: {},

	confirm: function(text, title, callback_yes, callback_no, timeout){
		let self = this;

		if(timeout===undefined){
			timeout = 10000;
		}

		title = (title===undefined) ? '' : title;

		let block = $('.a-alert');

		if(!block.length){
			$('body').append('<div class="a-alert"></div>');

			block = $('.a-alert');
		}

		let id = 'alert_'+self.randstr(10);

		block.append('<div class="alert-id confirm" style="display: none;" data-id="'+id+'">' +
			'<div class="wrapper">' +
			'<div class="text">'+text+'</div>' +
			'<div class="footer-block">' +
			'<div class="block-left"><div class="title">'+title+'</div></div>' +
			'<div class="block-right">' +
			'<button class="btn btn-transparent col-white text-upper yes-trigger">Р”Р°</button> ' +
			'<button class="btn btn-transparent col-white text-upper no-trigger">РќРµС‚</button>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>');

		let alert = block.find('.alert-id[data-id="'+id+'"]');

		qx.confirm_storage[id] = {
			'yes': function(){ if(typeof callback_yes === 'function'){ callback_yes(); } },
			'no': function(){ if(typeof callback_no === 'function'){ callback_no(); } },
			'timeout': setTimeout(function(){
				delete qx.confirm_storage[id];
				alert.fadeOut('fast', function(){
					if(typeof callback_no === 'function'){ callback_no(); }
				});
			}, timeout)
		};

		alert.fadeIn('fast');
	},

	notify_close: function(id){

		if(id!==undefined){
			let alert = $('.a-alert > .alert-id[data-id="'+id+'"]');

			if(alert.hasClass('confirm')){
				return;
			}

			let closer = alert.find('.close-trigger');

			if(closer.attr('data-disabled')==='true'){
				return false;
			}

			if(!alert.length){
				return false;
			}

			alert.fadeOut('fast', function(){
				$(this).remove();
			});

			return false;
		}

		let alerts = $('.a-alert > .alert-id:not(.confirm)');

		if(!alerts.length){
			return false;
		}

		alerts.fadeOut('fast', function(){
			$(this).remove();
		});

		return false;
	},

	loader: function(to, type){
		if(type===undefined){ type = ''; }

		return $(to).html('<img src="'+this.theme_url+'img/loading'+type+'.gif" alt="Loading..." />');
	},

	loading: function(type){

		type = (type===true);

		if(!type){
			$('#js-loader').hide();
		}else{
			$('#js-notify').hide();

			$('#js-loader').show();
		}

		return type;
	},

	base64: function(string, decode){
		return (decode) ? decodeURIComponent(escape(window.atob(string))) : btoa(unescape(encodeURIComponent(string)));
	},

	array_unique_values: function(input){
		let newlist = [];

		if(!Array.isArray(input)){
			return newlist;
		}

		let size = input.length;

		if(size<=0){
			return newlist;
		}

		for(let i = 0; i < size; i++){
			if(newlist.indexOf(input[i])>=0){
				continue;
			}

			newlist.push(input[i]);
		}
		return newlist;
	},

	array_remove_value: function(array, value){

		let i = array.indexOf(value);

		if(i===-1){
			return array;
		}

		array.splice(i, 1);

		return array;
	},

	randint: function(min, max){
		return Math.round(min - 0.5 + Math.random() * (max - min + 1));
	},

	randstr: function(num){
		let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

		let str = '';

		for(let i = 0; i < num; i++){
			str += chars.charAt(this.randint(0, chars.length));
		}

		return str;
	},

	scrollTo: function(element, speed, complete){

		speed = (speed==undefined) ? 300 : speed;
		complete = (complete==undefined) ? function(){} : complete;

		$('html, body').animate({
			scrollTop: $(element).offset().top
		}, speed, complete);
	},

	load_elements: function(mod, params, success, disable_loading, error){
		let that = this;

		if(disable_loading==undefined){ that.loading(); }

		let formData = (params.toString()=='[object FormData]') ? params : new FormData();

		formData.append('token', meta.token);

		if(params.toString()!='[object FormData]'){
			if(params!==undefined){
				$.each(params, function(key, value){
					formData.append(key, value);
				});
			}
		}

		$.ajax({
			url: mod,
			dataType: 'json',
			type: 'POST',
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			data: formData,

			error: function(data, textStatus, xhr){

				if(error!=undefined){
					error(data, textStatus, xhr);
				}else{
					console.log(data);

					return that.notify('РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РІС‹РїРѕР»РЅРµРЅРёСЏ Р·Р°РїСЂРѕСЃР°. РћР±СЂР°С‚РёС‚РµСЃСЊ Рє Р°РґРјРёРЅРёСЃС‚СЂР°С†РёРё');
				}
			},

			success: function(data, textStatus, xhr){

				success(data, textStatus, xhr);

				if(disable_loading==undefined){ that.loading(false); }
			}
		});
	},

	restyle_inputs: function(){
		$('input[type="file"].styled').each(function(i){
			let that = $(this);

			if(that.hasClass('activated')){ return; }

			let name = (that.attr('data-name')==undefined) ? 'Р’Р«Р‘Р•Р РРўР• Р¤РђР™Р›' : that.attr('data-name');
			that.attr('data-id', i).addClass('activated').before('<button type="button" class="btn block text-upper input-file-styled" data-id="'+i+'">'+name+'</button>');
		});
	},

	translate: function(text){
		let symbols = {
			'Р°':'a','Рђ':'A',
			'Р±':'b','Р‘':'B',
			'РІ':'v','Р’':'V',
			'Рі':'g','Р“':'G',
			'Рґ':'d','Р”':'D',
			'Рµ':'e','Р•':'E',
			'Р¶':'zh','Р–':'ZH',
			'Р·':'z','Р—':'Z',
			'Рё':'i','Р':'I',
			'Р№':'y','Р™':'Y',
			'Рє':'k','Рљ':'K',
			'Р»':'l','Р›':'L',
			'Рј':'m','Рњ':'M',
			'РЅ':'n','Рќ':'N',
			'Рѕ':'o','Рћ':'O',
			'Рї':'p','Рџ':'P',
			'СЂ':'r','Р ':'R',
			'СЃ':'s','РЎ':'S',
			'С‚':'t','Рў':'T',
			'Сѓ':'u','РЈ':'U',
			'С„':'f','Р¤':'F',
			'С…':'h','РҐ':'H',
			'С†':'c','Р¦':'TS',
			'С‡':'ch','Р§':'CH',
			'С€':'sh','РЁ':'SH',
			'С‰':'sch','Р©':'SHC',
			'СЉ':'','РЄ':'',
			'С‹':'i','Р«':'I',
			'СЊ':'','Р¬':'',
			'СЌ':'e','Р­':'E',
			'СЋ':'yu','Р®':'YU',
			'СЏ':'ya','РЇ':'YA',
			'С–':'i','Р†':'I',
			'С—':'yi','Р‡':'YI',
			'С”':'e','Р„':'E',
			' ':'-'
		};

		let len = text.length;
		let res = '';

		for(let i = 0; i<len; i++){
			if(symbols[text[i]] == undefined){
				if(text[i].match(/^[a-z0-9]+$/i)){
					res += text[i];
				}else{
					res += '';
				}
			}else{
				res += symbols[text[i]];
			}
		}

		return res;
	},

	getFormValues: function(form){
		return new FormData(form[0]);
	},

	objectLength: function(object){
		if(object===undefined){
			return 0;
		}
		let length = Object.keys(object).length;
		return (length===undefined) ? 0 : length;
	}
};

$(function(){

	$('form[method="POST"], form[method="post"]').prepend('<input name="token" value="'+meta.token+'" type="hidden">');

	qx.restyle_inputs();

	setTimeout(function(){
		qx.notify_close();
	}, 3500);
	// JS Notify -

	$(window).on("scroll", function(){

		if(typeof global_scroll != 'undefined'){ clearTimeout(global_scroll); }

		global_scroll = setTimeout(function(){
			if($(window).scrollTop() <= 0){
				$(".global-scroll").fadeOut("slow");
			}else{
				$(".global-scroll").fadeIn("fast");
			}
		}, 50);
	});

	$('body').fadeIn().on('click', '.select-style-render > .select-style-selected', function(e){
		e.preventDefault();

		let that = $(this);

		that.closest('.select-style-render').toggleClass('open');
	}).on('click', '.a-alert > .alert-id:not(.confirm) .close-trigger', function(e){
		e.preventDefault();

		qx.notify_close($(this).closest('.alert-id').attr('data-id'));

	}).on('click', '.a-alert > .alert-id.confirm .yes-trigger, .a-alert > .alert-id.confirm .no-trigger', function(e){
		e.preventDefault();

		let that = $(this), yes;

		if(that.hasClass('yes-trigger')){
			yes = true;
		}else if(that.hasClass('no-trigger')){
			yes = false;
		}else{
			return;
		}

		let alert = that.closest('.alert-id');

		let id = alert.attr('data-id');
		clearTimeout(qx.confirm_storage[id].timeout);

		alert.fadeOut('fast', function(){
			$(this).remove();

			if(yes){
				qx.confirm_storage[id].yes();
			}else{
				qx.confirm_storage[id].no();
			}

			delete qx.confirm_storage[id];
		});

	}).on('click', '.input-file-styled', function(e){
		e.preventDefault();

		let that = $(this);

		let id = that.attr('data-id');

		$('input[type="file"][data-id="'+id+'"].styled').trigger('click');
	}).on('click', '.scroll-to', function(e){
		e.preventDefault();

		let that = $(this);

		let element = that.attr('href');

		let scroll = $(element).offset().top;

		$('html').animate({
			scrollTop: scroll
		}, 300);

		//return false;
	}).on('click', 'a[href="#control-menu-resize"]', function(e){
		e.preventDefault();

		let block = $(this).closest('.block-left');

		if(block.hasClass('min')){
			Cookies.remove('control-menu-resize');
		}else{
			Cookies.set('control-menu-resize', 'true');
		}

		block.toggleClass('min');
	}).on('click', '.modal-trigger', function(e){
		e.preventDefault();

		let that = $(this);

		let id = that.attr('data-modal-id');

		if(id===undefined){ return false; }

		let modal = $('.modal[data-target-id="'+id+'"]');

		if(modal.is(':visible')){ return false; }

		$('.modal').fadeOut('fast');

		let body = $('body');

		modal.fadeIn('fast');

		if(!body.hasClass('modal-opened')){
			body.addClass('modal-opened');
		}
	}).on('click', '.modal .close-modal', function(e){
		e.preventDefault();

		$(this).closest('.modal').fadeOut('fast');

		$('body').removeClass('modal-opened');
	}).on('click', '.modal', function(e){

		let target = $(e.target);

		if(target.closest('.modal-container').length<=0){

			e.preventDefault();
			$(this).closest('.modal').fadeOut('fast');
			$('body').removeClass('modal-opened');
		}
	}).on('click', '.tabs > .tab-links > li > a', function(e){
		e.preventDefault();

		let that = $(this);

		let tabs = that.closest('.tabs');

		let li = that.closest('li');

		if(li.hasClass('active')){ return; }

		tabs.find('.tab-list > .tab-id').removeClass('active');
		that.closest('.tab-links').children('li').removeClass('active');

		tabs.find('.tab-list > .tab-id[data-id="'+li.attr('data-id')+'"]').addClass('active');
		li.addClass('active');
	}).on('keydown', 'textarea[data-ctrl="true"]', function(e){
		if(e.keyCode==17){
			ctrl_press = true;
		}
	}).on('keyup', 'textarea[data-ctrl="true"]', function(e){
		if(e.keyCode==17){
			ctrl_press = false;
		}

		if(ctrl_press && e.keyCode==13){
			$(this).closest('form').find('[type="submit"]:visible:first-child').trigger('click');
		}
	}).on('click', 'form[method="GET"][data-form-route="1"] [type="submit"],form[method="get"][data-form-route="1"] [type="submit"]', function(e){
		e.preventDefault();

		let that = $(this);

		let form = that.closest('form');

		let separator = form.attr('data-form-separator');

		let values = qx.getFormValues(form);

		if(!$.isEmptyObject(values)){
			let str = '';

			let error = false;

			$.each(values, function(k, v){

				let input = form.find('[name="'+k+'"]');

				if(!v.match(input.attr('pattern'))){
					let error_text = input.attr('data-pattern-text');
					error = (error_text!==undefined) ? error_text : 'Р¤РѕСЂРјР° Р·Р°РїРѕР»РЅРµРЅР° РЅРµРІРµСЂРЅРѕ';
					return false;
				}

				str += separator+k+separator+v;
			});

			if(error){
				return qx.notify(error, 'РћС€РёР±РєР°!');
			}
		}

		window.location.href = form.attr('action')+str.substring(separator.length);
	}).on('click', '.preventDefault', function(e){
		e.preventDefault();
	}).on('click', '.copy-clipboard', function(e){
		e.preventDefault();

		let that = $(this);

		let text = that.text();

		that.text('РЎРєРѕРїРёСЂРѕРІР°РЅРѕ!');

		setTimeout(function(){
			that.text(text);
		}, 1000);
	}).on('click', '.navbar a.mobile', function(e){
		e.preventDefault();

		$(this).closest('.navbar').find('.navbar-wrapper > .block-right').toggleClass('active');
	});

	new ClipboardJS('.copy-clipboard');

	let ctrl_press = false;
});
