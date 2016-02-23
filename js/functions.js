/**!
 * first child method
 */
(function ($) {
	$.fn.firstChildElement = function(filter) {
		var $found = $(),
				$currentSet = this; // Current place
		while ($currentSet.length) {
			$found = $currentSet.filter(filter);
			if ($found.length) break;  // At least one match: break loop
			// Get all children of the current set
			$currentSet = $currentSet.children();
		}
		return $found.first(); // Return first match of the collection
	};
}(jQuery));
/**first child method end*/

/* placeholder */
function placeholderInit(){
	$('[placeholder]').placeholder();
}
/* placeholder end */

/*preloader*/
function preloader(){
	var $preloader = $('#preloader'),
			$spinner = $preloader.find('.loader__icon');
	$spinner.fadeOut();
	$preloader.delay(350).fadeOut('slow');
}
/*preloader */

/*drop language*/
var closeDropLong = function () {
	$('.lang').removeClass('lang-opened');
};
function dropLanguageInit() {
	var $langList = $('.lang-list');
	if(!$langList.length){return;}

	var $html = $('html');
	$('.lang-active').on('click', function (e) {
		e.preventDefault();
		// Удалить класс позицирования хедера относительно контента
		// Добавляется в функции mainNavigation
		if($html.hasClass('position')){
			$html.removeClass('position');
		}
		$(this).closest('.lang').toggleClass('lang-opened');
		e.stopPropagation();
	});

	$langList.on('click', function (e) {
		e.stopPropagation();
	});

	$(document).on('click', function () {
		closeDropLong();
	});

	$('.phs__item_opener').on('click', function () {
		closeDropLong();
	})
}
/*drop language end*/

/*show form search */
function showFormSearch(){
	var searchForm = $('.search-form__header');
	if(!searchForm.length){ return; }

	var $body = $('body');
	$body.on('click', '.btn-search-open', function(){
		var $currentBtnOpen = $(this);
		var $currentWrap = $currentBtnOpen.closest('.header-options');
		var $searchFormContainer = $currentWrap.find('.search-form__header');

		var $searchForm = $searchFormContainer.find('form');
		if ( $searchForm.find('input:not(:submit)').val().length && $searchFormContainer.is(':visible') ){
			$searchForm.submit();
			return;
		}

		if ($currentWrap.hasClass('form-opened')){
			closeSearchForm($searchFormContainer,$('.header-options'));
			return;
		}

		$currentWrap.addClass('form-opened');
		$searchFormContainer.find('input[type="search"], input[type="text"]').trigger('focus');
	});

	$body.on('click', '.js-btn-search-close', function(){
		var $searchFormContainer = $(this).closest('.search-form__header');
		$searchFormContainer.find('input:not(:submit)').val('');

		closeSearchForm($searchFormContainer,$('.header-options'));
	});

	function closeSearchForm(form, wrapper){
		form.closest(wrapper).removeClass('form-opened')
	}
}
/*show form search end*/

/*hover class*/
(function ($) {
	var HoverClass = function (settings) {
		var options = $.extend({
			container: 'ul',
			item: 'li',
			drop: 'ul'
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.container);
		self.$container = container;
		self.$item = $(options.item, container);
		self.$drop = $(options.drop, container);

		self.modifiers = {
			hover: 'hover'
		};

		self.md = new MobileDetect(window.navigator.userAgent);

		self.addClassHover();

		if (self.md.mobile()) {
			$(window).on('debouncedresize', function () {
				self.removeClassHover();
			});
		}
	};

	HoverClass.prototype.addClassHover = function () {
		var self = this,
				_hover = this.modifiers.hover,
				$item = self.$item,
				item = self.options.item,
				$container = self.$container;

		if (self.md.mobile() && $('.btn-menu').is(':hidden') && $('body').hasClass('main-page')) {
			$container.on('click', ''+item+'', function (e) {
				var $currentAnchor = $(this);
				var currentItem = $currentAnchor.closest($item);

				if (!currentItem.has(self.$drop).length){ return; }


				e.stopPropagation();

				if (currentItem.hasClass(_hover)){
					currentItem.removeClass(_hover).find('.'+_hover+'').removeClass(_hover);
					return;
				}

				$('.'+_hover+'').not($currentAnchor.parents('.'+_hover+''))
						.removeClass(_hover)
						.find('.'+_hover+'')
						.removeClass(_hover);
				currentItem.addClass(_hover);

				e.preventDefault();
			});

			$container.on('click', ''+self.options.drop+'', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$item.removeClass(_hover);
			});
		} else {
			$container.on('mouseenter', ''+item+'', function () {
				var currentItem = $(this);

				if (currentItem.prop('hoverTimeout')) {
					currentItem.prop('hoverTimeout',
							clearTimeout(currentItem.prop('hoverTimeout')
							)
					);
				}

				currentItem.prop('hoverIntent', setTimeout(function () {
					currentItem.addClass(_hover);
				}, 50));

			});
			$container.on('mouseleave', ''+ item+'', function () {
				var currentItem = $(this);

				if (currentItem.prop('hoverIntent')) {
					currentItem.prop('hoverIntent',
							clearTimeout(currentItem.prop('hoverIntent')
							)
					);
				}

				currentItem.prop('hoverTimeout', setTimeout(function () {
					currentItem.removeClass(_hover);
				}, 100));
			});

		}
	};

	HoverClass.prototype.removeClassHover = function () {
		var self = this;
		self.$item.removeClass(self.modifiers.hover );
	};

	window.HoverClass = HoverClass;

}(jQuery));

function hoverClassInit(){
	var $navList = $('.nav');
	if($navList.length){
		new HoverClass({
			container: $navList,
			drop: '.js-nav-drop'
		});
	}

	var $nav = $('.nav');
	if($nav.length){
		new HoverClass({
			container: $nav,
			item: '.nav-cloned',
			drop: '.nav-cloned__drop'
		});
	}
}
/*hover class end*/

/*main navigation*/
(function ($) {
	var MainNavigation = function (settings) {
		var options = $.extend({
			navList: '.nav__list',
			btnMenu: '.btn-menu',
			btnClose: '.btn-nav-close',
			navMenuItem: 'li',
			navMenuAnchor: 'a',
			navDropMenu: '.js-nav-drop',
			overlayClass: '.nav-overlay-page',
			classNoClick: '.no-click', // Класс, при наличии которого дроп не буте открываться по клику
			classReturn: null,
			overlayBoolean: false,
			animationSpeed: 300,
			minWidthItem: 100
		},settings || {});

		var self = this;
		self.options = options;

		var container = $(options.navContainer);
		self.$navContainer = container;
		self.$navList = $(options.navList);
		self.$btnMenu = $(options.btnMenu);                        // Кнопка открытия/закрытия меню для моб. верси.
		self.$btnClose = $(options.btnClose);                      // Кнопка закрытия меню для моб. верси.
		self.$navMenuItem = $(options.navMenuItem, container);     // Пункты навигации.
		self.$navMenuAnchor = $(options.navMenuAnchor, container); // Элемент, по которому производится событие (клик).
		self.$navDropMenu = $(options.navDropMenu, container);     // Дроп-меню всех уровней.
		self._animateSpeed = options.animationSpeed;
		self._classNoClick = options.classNoClick;

		self._overlayClass = options.overlayClass;                // Класс оверлея.
		self._overlayBoolean = options.overlayBoolean;            // Добавить оверлей (по-умолчанию == false). Если не true, то не будет работать по клику вне навигации.
		self._minWidthItem = options.minWidthItem;

		self.modifiers = {
			active: 'active',
			hover: 'hover',
			opened: 'nav-opened',
			position: 'position',
			current: 'current',
			alignRight: 'align-right'
		};

		self.md = new MobileDetect(window.navigator.userAgent);

		self.addOverlayPage();
		self.openCurrentNavItem();
		self.mainNavigationAccordion();
		self.addAlignDropClass();
		self.removeAlignDropClass();
		self.navSwitcher();
	};

	//добавить <div class="overlay-page"></div>
	MainNavigation.prototype.addOverlayPage = function () {
		var self = this,
				_overlayClass = self._overlayClass;

		if (self._overlayBoolean) {
			var overlayClassSubstring = _overlayClass.substring(1);
			var tplNavOverlay = '<div class="' + overlayClassSubstring + '"></div>';
			//self.$navContainer.after(tplNavOverlay);
			$('.header-holder').append(tplNavOverlay);
			$('.content-wrap').append(tplNavOverlay);
		}
	};

	MainNavigation.prototype.openCurrentNavItem = function () {
		// Открываем активный аккордеон
		// Скриптом. Чтобы можно было плавно закрыть
		var self = this;
		var $currentElements = self.$navMenuItem.filter('.'+self.modifiers.current+'');
		$.each($currentElements, function () {
			$(this).firstChildElement(self.options.navDropMenu).slideDown(0);
		});
	};
	
	MainNavigation.prototype.mainNavigationAccordion = function () {

		var self = this,
			modifiers = this.modifiers,
			animateSpeed = this._animateSpeed,
			anyAccordionItem = this.$navMenuItem,
			collapsibleElement = this.$navDropMenu,
			noClick = self._classNoClick.substring(1);
		
		self.$navContainer.on('click', ''+self.options.navMenuAnchor+'', function (e) {
			var current = $(this);
			var currentAccordionItem = current.closest(anyAccordionItem);

			if (!currentAccordionItem.has(collapsibleElement).length){ return; }

			e.preventDefault();

			if (self.$navContainer.hasClass(noClick) && self.$btnMenu.is(':hidden')){ return; }

			if (current.parent().prop("tagName") != currentAccordionItem.prop("tagName")) {
				current = current.parent();
			}

			if (current.siblings(collapsibleElement).is(':visible')){
				currentAccordionItem.removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
				currentAccordionItem.removeClass(modifiers.current);
				currentAccordionItem.find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);
				return;
			}

			currentAccordionItem.siblings().removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
			currentAccordionItem.siblings().removeClass(modifiers.current);
			currentAccordionItem.siblings().find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);

			currentAccordionItem.addClass(modifiers.active);
			current.siblings(collapsibleElement).slideDown(animateSpeed);
		})
	};

	MainNavigation.prototype.createAlignDropClass = function (item, drop) {
		var self = this,
			alightRight = self.modifiers.alignRight,
			$navContainer = self.$navContainer;

		if(!drop.length){
			return;
		}

		var navContainerPosRight = $navContainer.offset().left + $navContainer.outerWidth();
		var navDropPosRight = drop.offset().left + drop.outerWidth();

		if(item.hasClass(alightRight)){
			return;
		}

		if(navContainerPosRight < navDropPosRight){
			item.addClass(alightRight);
		}
	};

	MainNavigation.prototype.addAlignDropClass = function () {
		var self = this,
				$navContainer = self.$navContainer,
				navMenuItem = self.options.navMenuItem;

		if (self.md.mobile()) {
			$navContainer.on('click', ''+navMenuItem+'', function () {
				var currentItem = $(this);
				var $currentDrop = currentItem.find(self.$navDropMenu);

				self.createAlignDropClass(currentItem, $currentDrop);
			});
			return;
		}

		$navContainer.on('mouseenter', ''+ navMenuItem+'', function () {
			var $currentItem = $(this);

			var $currentDrop = $currentItem.find(self.$navDropMenu);

			self.createAlignDropClass($currentItem, $currentDrop)
		});
	};

	MainNavigation.prototype.removeAlignDropClass = function () {
		var self = this;
		$(window).on('debouncedresize', function () {
			self.$navMenuItem.removeClass(self.modifiers.alignRight );
		});
	};

	MainNavigation.prototype.navSwitcher = function () {
		var self = this,
			$html = $('html'),
			$buttonMenu = self.$btnMenu,
			modifiers = self.modifiers,
			_activeClass = modifiers.active,
			_positionClass = modifiers.position;

		$buttonMenu.on('click', function (e) {
			// Закрываем форму поиска, если открытас
			var $searchForm = $('.search-form');
			if($searchForm.is(':visible')){
				$searchForm.find('.js-btn-search-close').trigger('click');
			}

			var thisBtnMenu = $(this);

			if (!thisBtnMenu.hasClass(_activeClass)) {
				self.closeNav($html,$buttonMenu);
			}

			// Удаляем с пунктов меню всех уровней активный и текущий классы
			//self.$navMenuItem.removeClass(_activeClass);
			//self.$navMenuItem.removeClass(_current);

			// Переключаем класс открывающий меню. Открытие через CSS3 translate
			$html.toggleClass(modifiers.opened);

			// Добавляем класс меняющий относительное позиционирование хедера
			$html.addClass(_positionClass);

			// Переключаем на кнопке меню активный класс
			thisBtnMenu.toggleClass(_activeClass);

			e.preventDefault();
		});

		// По клику на область вне меню, закрываем меню
		$(document).on('click', self._overlayClass, function () {
			self.closeNav($html,$buttonMenu);
		});

		// скрываем меню при ресайзе на десктопе
		if(!self.md.mobile()){
			$(window).on('debouncedresize', function () {
				self.closeNav($html,$buttonMenu);
			});
		}

		//Скрываем меню по клику на кнопку закрытия
		self.$btnClose.on('click', function () {
			self.closeNav($html,$buttonMenu);
		});

		// Удаляем класс позиционирования хедера при скролле
		$(window).scroll(function () {
			if($html.hasClass(_positionClass) && !$buttonMenu.hasClass(_activeClass)) {
				$html.removeClass(_positionClass);
			}
		});
	};

	MainNavigation.prototype.closeNav = function(container,btn) {
		var self = this;
		container.removeClass(self.modifiers.opened);
		btn.removeClass(self.modifiers.active);
	};

	window.MainNavigation = MainNavigation;

}(jQuery));

function mainNavigationInit(){
	var $nav = $('.nav');
	if(!$nav.length){ return; }
	new MainNavigation({
		navContainer: $nav,
		classNoClick: '.nav-main-page',
		animationSpeed: 300,
		overlayBoolean: true
	});
}
/*main navigation end*/

/*clone nav items*/
$(window).load(function () {
	if($('.nav-main-page').length){
		$('.nav__list').clone().appendTo('#nav-list-clone');
	}
	cloneNavItem();
});

$(window).on('debouncedresize', function () {
	cloneNavItem();
});

var cloneNavItem = function() {
	var $navContainer = $('.nav-main-page');
	if(!$navContainer.length){return;}

	var $nav = $('.nav__holder', $navContainer),
			$navListItems = $nav.children('.nav__list').children('li'),
			$navCloneListItems = $('.nav-cloned__drop').children('.nav__list').children('li'),
			minWidth = 130;

	$($navListItems).removeClass('nc-clone');
	$($navCloneListItems).removeClass('nc-clone');

	var widthContainer = $nav.outerWidth(),
			lengthNavListItems = $navListItems.length,
			hideLength = (lengthNavListItems * minWidth - widthContainer)/minWidth,
			hideLengthCeil = Math.ceil(hideLength);

	if(lengthNavListItems * minWidth <= widthContainer ){
		$navContainer.removeClass('show-clone');
		return;
	}

	$navContainer.addClass('show-clone');

	for(var i = 0; i < hideLengthCeil + 1; i++){
		var indexCloned = lengthNavListItems - i - 1;
		$($navListItems[indexCloned]).addClass('nc-clone');
		$($navCloneListItems[indexCloned]).addClass('nc-clone');
	}
};
/*cloned nav items end*/

/*nav position*/
function navPosition(){
	var $navHolder = $('.nav-inner-page__holder');
	if(!$navHolder.length){return;}

	var $window = $(window),
		$logo = $('.logo'),
		logoHeight = $logo.height(),
		logoHeightNew,
		$navContainer = $('nav.nav'),
		navContainerTop = $navContainer.offset().top,
		navHolderOffsetTop = $navHolder.offset().top,
		navHolderHeight,
		$footer = $('footer.footer'),
		footerOffsetTop = $footer.offset().top,
		windowWidth,
		windowHeight = $window.height(),
		windowScrollTop,
		contentHeight,
		lastWindowPos = 0,
		topOffset = 0,
		top = false,
		bottom = false,
		footerVisible = false,
		resizeTimer;

	$window.on('scroll', scroll).on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resizeAndScroll, 500);
	});

	resizeAndScroll();

	function resizeAndScroll() {
		resize();
		scroll();
	}

	function scroll() {
		if($('.btn-menu').is(':visible')){return;}
		//if (1500 > windowWidth) {
		//	return;
		//}

		navHolderHeight = $navHolder.outerHeight();
		navHolderOffsetTop = $navHolder.offset().top;
		navContainerTop = $navContainer.offset().top;
		footerOffsetTop = $footer.offset().top;     console.log('AFTER SCROLL: navHolderHeight = ' + navHolderHeight + ', navHolderOffsetTop = ' + navHolderOffsetTop +', navContainerTop = ' + navContainerTop + ', footerOffsetTop = ' + footerOffsetTop);

		logoHeightNew = $logo.height();     console.log('logoHeightNew = ', logoHeightNew);

		windowScrollTop = $window.scrollTop();
		var windowsHeightNew = footerOffsetTop - windowScrollTop; console.log('windowHeight = ' + windowHeight + ', windowScrollTop = ' + windowScrollTop + ', windowsHeightNew = ' + windowsHeightNew);

		var topOffset = windowScrollTop < navHolderOffsetTop ? navHolderOffsetTop - windowScrollTop : 0;
		console.log('Ω topOffset before: ', topOffset);

		//if (windowHeight < windowsHeightNew) { // Футер находится вне окна
		//if (windowHeight < windowsHeightNew || footerOffsetTop > navHolderOffsetTop + navHolderHeight) { // Пока футер находится вне окна, но не соприкасается с навигацией
		if (windowHeight < windowsHeightNew || navHolderHeight + topOffset < windowsHeightNew || navHolderHeight + logoHeightNew < windowsHeightNew) { // Пока футер находится вне окна, но не соприкасается с навигацией
			console.log('•footer HIDDEN•');

			if (topOffset + navHolderHeight > windowHeight) { // Условие 1. Если общая высота занимаемая навигацией больше высоты окна.
				console.log('•1•');

				if (windowScrollTop > lastWindowPos) { // Условие 1.1. Скроллим вниз
					console.log('scroll ▼ •1.1•');

					if (top && windowHeight + windowScrollTop > navHolderHeight + navHolderOffsetTop) { // Условие 1.1.1. Навигация зафиксированна вверху
						//                И общая высота видимой части окна с проскролленой
						//                Больше, чем общая высота навигации и ее позиция
						topOffset = navHolderOffsetTop - navContainerTop;
						console.log('•1.1.1• ⇒ position: relative; top: ' + topOffset + 'px;');

						top = false;

						$navHolder.attr('style', 'position: relative; top: ' + topOffset + 'px;');

					} else if (!bottom && windowScrollTop + windowHeight > navHolderHeight + navHolderOffsetTop) { // Условие 1.1.2. Зафиксированна внизу
						//                И общая высота видимой части окна с проскролленой
						//                Больше, чем общая высота навигации и ее позиция
						console.log('•1.1.2• ⇒ position: fixed; bottom: 0; top: auto;');

						bottom = true;
						$navHolder.attr('style', 'position: fixed; bottom: 0; top: auto;');
					} else if (top && windowHeight + windowScrollTop < navHolderHeight + navHolderOffsetTop) {// Условие 1.1.2. Зафиксированна внизу
						//                И общая высота видимой части окна с проскролленой
						//                Меньше, чем общая высота навигации и ее позиция
						topOffset = navHolderOffsetTop - navContainerTop;
						console.log('•1.1.3• ⇒ position: relative; top: ' + topOffset + 'px;');
						top = bottom = false;

						$navHolder.attr('style', 'position: relative; top: ' + topOffset + 'px;');
					}
				} else if (windowScrollTop < lastWindowPos) { // Условие 1.2. Скроллим вверх
					console.log('scroll ▲ •1.2•');

					if (bottom) { // Условие 1.2.1. Навигация зафиксированна внизу
						console.log('Ω lastWindowPos - windowScrollTop: ', lastWindowPos - windowScrollTop);
						topOffset = navHolderOffsetTop - navContainerTop + lastWindowPos - windowScrollTop;
						console.log('Ω topOffset: ', topOffset);
						console.log('•1.2.1• ⇒ position: relative; top: ' + topOffset + 'px;');

						bottom = false;

						$navHolder.attr('style', 'position: relative; top: ' + topOffset + 'px;');
					} else if (!top && navHolderOffsetTop - windowScrollTop > logoHeightNew) { // Условие 1.2.2. Навигация не зафиксированна вверх
						//               Не зафиксированна внизу
						console.log('•1.2.2• ⇒ position: fixed;');

						top = true;
						$navHolder.attr('style', 'position: fixed;');
					} else if (navHolderOffsetTop == navContainerTop) { // Условие 1.2.3.
						console.log('•1.2.3• ⇒ position: relative; top: 0');

						top = false;
						$navHolder.attr('style', 'position: relative; top: 0');
					}
				} else { // Условие 1.3. При загрузке страницы, до начала скролла
					topOffset = navHolderOffsetTop - navContainerTop;
					console.log('scroll ▲▼ •1.3• ⇒ position: relative; top: ' + topOffset + 'px;');

					top = bottom = false;
					$navHolder.attr('style', 'position: relative; top: '+ topOffset +'px;');
				}

			} else if (!top && logoHeightNew + navHolderHeight > windowHeight) { // Условие 2. Если общая высота занимаемая навигацией меньше высоты окна, но высота навигации в сумме с лого больше высоты окна и навигация не зафиксированна вверху.
				console.log('•2• ⇒ position: fixed; bottom: 0; top: auto;');

				bottom = true;
				$navHolder.attr('style', 'position: fixed; bottom: 0; top: auto;');
			} else if (!top) { // Условие 3. Если общая высота навигации или высота навигации в сумме с лого меньше высоты окна и навигация не зафиксированна вверху.
				console.log('•3• ⇒ position: fixed;');

				top = true;
				bottom = false;
				$navHolder.attr('style', 'position: fixed;');
			}

			footerVisible = false;
		} else if (!footerVisible ) {
			topOffset = footerOffsetTop - navHolderHeight - navContainerTop;
			console.log('•footer VISIBLE• ⇒ position: relative; top: ' + topOffset + 'px;');

			top = bottom = false;
			footerVisible = true;
			$navHolder.attr('style', 'position: relative; top: '+ topOffset +'px;');
		}

		console.log('**********************************');

		lastWindowPos = windowScrollTop;
	}

	function resize() {
		windowWidth = $window.width();
		$navHolder.removeAttr('style');
		if (1500 > windowWidth) {
			top = bottom = false;
		}
	}
}
/*nav position end*/

/*site map*/
(function ($) {
	var Disperse = function (settings) {
		var options = $.extend({
			wrapperContainer: 'body',
			footer: '.footer',
			scrollTo: null,
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.wrapperContainer);
		this.$wrapperContainer = container;
		this.$switcher = $(options.switcher, container);
		this.$footer = $(options.footer);
		this.$disperseWrapper = $(options.disperseWrapper, container);
		this.$disperseDrop = $(options.disperseDrop, container);
		this.$scrollTo = $(options.scrollTo, container);
		this._disperseHeight = this.$disperseDrop.outerHeight();

		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'active',
			drop: 'disperseDropJs'
		};

		this.bindAnimate();
		//this.onResize();
	};

	Disperse.prototype.bindAnimate = function () {
		var self = this,
				_modifiersActive = this.modifiers.active,
				_modifiersDrop = this.modifiers.drop,
				_animateSpeed = this._animateSpeed,
				$disperseWrapper = self.$disperseWrapper;

		self.$switcher.on('click', function (e) {
			e.preventDefault();
			var $switcher = $(this);

			var _height = self._disperseHeight;

			if($switcher.hasClass(_modifiersActive)){
				$disperseWrapper.animate({'height':0},_animateSpeed).removeClass(''+_modifiersActive+' '+_modifiersDrop+'');
				self.footerAtBottom(-(_height));

				$switcher.removeClass(_modifiersActive);
				return;
			}

			$disperseWrapper.animate({'height':_height},_animateSpeed).addClass(''+_modifiersActive+' '+_modifiersDrop+'');
			self.footerAtBottom(_height);

			$switcher.addClass(_modifiersActive);

			var $scrollTo = $disperseWrapper;
			if(self.$scrollTo.length){
				$scrollTo = self.$scrollTo;
			}
			$('html, body').animate({ scrollTop: $scrollTo.offset().top }, _animateSpeed);
		})
	};

	Disperse.prototype.onResize = function () {
		var self = this,
				_modifiersActive = this.modifiers.active,
				_animateSpeed = this._animateSpeed,
				$disperseWrapper = self.$disperseWrapper,
				_footerHeight,
				_footerHeightNew;

		_footerHeight = $disperseWrapper.find(self.$disperseDrop).outerHeight();
		console.log('_footerHeight: ', _footerHeight);
		$(window).resize(function () {
			_footerHeightNew = $disperseWrapper.find(self.$disperseDrop).outerHeight();
			if($disperseWrapper.hasClass(_modifiersActive)){
				var _height = _footerHeightNew - _footerHeight;
				console.log('_footerHeightNew: ', _footerHeightNew);
				console.log('_height: ', _height);
				$disperseWrapper.animate({'height':_footerHeightNew},_animateSpeed);
				self.footerAtBottom(_height);
			}
		})
	};

	Disperse.prototype.footerAtBottom = function (height) {
		var self = this;

		self.$footer.animate({
			'margin-top': '-='+height+''
		}, self._animateSpeed);

		$('.spacer').animate({
			'height': '+='+height+''
		}, self._animateSpeed);
	};

	window.Disperse = Disperse;
}(jQuery));

function footerDropInit() {
	if($('.footer-site-map').length){
		new Disperse({
			switcher: '.map-site-switcher',
			wrapperContainer: '.footer',
			disperseWrapper: '.footer-site-map',
			disperseDrop: '.site-map',
			scrollTo: '.map-site-switcher',
			animateSpeed: 400
		});
	}
	if($('.footer-map-row').length){
		new Disperse({
			switcher: '.road-view',
			wrapperContainer: '.footer',
			disperseWrapper: '.footer-map-row',
			disperseDrop: '.footer-local-map',
			animateSpeed: 400
		});
	}
}
/*site map end*/

/*phones drop*/
function phonesDrop(){
	var $phonesItem = $('.phs__item, .phones-clone');
	if(!$phonesItem.length){return;}

	var $html = $('html'),
		$phonesDrop = $('.phones-drop');

	$phonesDrop.on('click', '.phs__item_opener', function (e) {
		e.stopPropagation();
	});

	$phonesItem.on('click', '.phs__item_opener', function (e) {
		e.preventDefault();

		// Удалить класс позицирования хедера относительно контента
		// Добавляется в функции mainNavigation
		if($html.hasClass('position')){
			$html.removeClass('position');
		}

		var $phonesOpener = $(this),
			$currentItem = $phonesOpener.closest($phonesItem);

		if($currentItem.hasClass('show-drop')){
			closeDropPhones();
			return;
		}
		closeDropPhones();
		$currentItem.addClass('show-drop');

		e.stopPropagation();
	});

	$phonesDrop.on('click', function (e) {
		e.stopPropagation();
	});

	$('.lang-active').on('click', function (e) {
		closeDropPhones();
	});

	$(document).on('click', function () {
		closeDropPhones();
	});

	function closeDropPhones(){
		$phonesItem.removeClass('show-drop');
	}
}
/*phones drop end*/

/*clone phones*/
$(window).load(function () {
	$('.phs__list').clone().appendTo('#phones-list-clone');
	clonePhones();
});

var clonePhones = function() {
	var $container = $('.phones'),
			$phonesList = $('.phs__container', $container),
			$phonesItem = $phonesList.children('.phs__list').children('.phs__item'),
			$phonesCloneContainer = $('.phones-clone', $container),
			$phonesCloneList = $('.phones-clone-drop', $phonesCloneContainer),
			$phonesCloneItems = $phonesCloneList.children('.phs__list').children('.phs__item'),
			minWidthItem = 200;

	$($phonesItem).removeClass('ph-cloned');
	$($phonesCloneItems).removeClass('ph-cloned');

	var phonesListWidth = $phonesList.outerWidth(),
			lengthPhonesListItems = $phonesItem.length,
			cloneLength = Math.ceil((lengthPhonesListItems * minWidthItem - phonesListWidth)/minWidthItem);

	var newWidthItem = (1/(lengthPhonesListItems - cloneLength)*100)+'%';
	$phonesItem.css('width', newWidthItem);
	$phonesCloneContainer.css('width', newWidthItem);

	var $label = $phonesCloneContainer.find('.phs-clone__btn .phs__label');
	var $labelText = $label.find('.txt-inner');
	if(lengthPhonesListItems == cloneLength + 1){
		$labelText.text($label.data('text2'));
	} else {
		$labelText.text($label.data('text1'));
	}

	if(lengthPhonesListItems * minWidthItem <= phonesListWidth){
		$container.removeClass('show-clone');
		return;
	}

	$container.addClass('show-clone');

	for(var i = 0; i <= cloneLength; i++){
		var indexCloned = lengthPhonesListItems - i - 1;
		$($phonesItem[indexCloned]).addClass('ph-cloned');
		$($phonesCloneItems[indexCloned]).addClass('ph-cloned');
	}
};

$(window).on('debouncedresize', function () {
	clonePhones();
});
/*clone phones*/

/*phones popup*/
(function ($) {
	var PhonesPopup = function (setting){
		var options = $.extend({
			container: 'body',
			opener: null,
			row: null,
			box: null
		}, setting || {});

		this.options = options;
		var container = options.container;
		this.$opener = $(options.opener, container);
		this.$row = $(options.row, container);
		this.$box = $(options.box, container);

		this.modifiers = {
			active: 'active',
			opened: 'opened'
		};

		this.bindEvents();
	};

	PhonesPopup.prototype.bindEvents = function () {
		var self = this,
			modifiers = self.modifiers;

		$(self.$opener).on('click', function (e) {
			e.preventDefault();


			var $currentOpener = $(this),
				$currentContainer = $currentOpener.closest(self.$row);

			if($currentOpener.hasClass(modifiers.active)){
				self.closePopup();
				return;
			}

			self.closePopup();
			$currentOpener.addClass(modifiers.active);
			$currentContainer.addClass(modifiers.opened);

			e.stopPropagation();
		});

		self.$box.on('click', function (e) {
			e.stopPropagation();
		});

		$(document).on('click', function () {
			self.closePopup();
		});

	};

	PhonesPopup.prototype.closePopup = function(){
		var self = this,
			modifiers = self.modifiers;

		self.$opener.removeClass(modifiers.active);
		self.$row.removeClass(modifiers.opened);
	};

	window.PhonesPopup = PhonesPopup;
}(jQuery));

function phonesPopupInit(){
	/** contacts phones*/
	var $contactsPhones = $('.contacts-phones');
	if($contactsPhones.length){
		new PhonesPopup({
			container: $contactsPhones,
			opener: '.cph__number_opener',
			row: '.cph__row',
			box: '.cph__numbers'
		})
	}

	/** contacts panel phones*/
	var $container = $('.contacts-panel__phones');
	if($container.length){
		new PhonesPopup({
			container: $container,
			opener: '.tel-more',
			row: '>li',
			box: '.cont-numbers'
		})
	}
}
/*phones popup end*/

/*card switch*/
function cardSwitch(){
	var $caseList = $('.case__list');
	if(!$caseList.length){return;}

	$('.card-switcher-js').on('click', function () {
		var $switcher = $(this);
		var $itemCard = $switcher.closest('.case__item').siblings();
		$itemCard.removeClass('contacts-opened');

		var $itemCardCurrent = $switcher.closest('.case__item');
		if($itemCardCurrent.hasClass('contacts-opened')){
			$itemCardCurrent.removeClass('contacts-opened');
			return;
		}

		$itemCardCurrent.addClass('contacts-opened');
	})
}
/*card switch end*/

/*contacts switcher*/
function contactsSwitcher(){
	var $contacts = $('.main-contacts');
	if(!$contacts.length){return;}

	$('.contacts-panel__switcher').on('click', function () {
		var $switcher = $(this);
		var $itemCardCurrent = $switcher.closest($contacts);
		if($itemCardCurrent.hasClass('contacts-panel_opened')){
			$itemCardCurrent.removeClass('contacts-panel_opened');
			return;
		}

		$itemCardCurrent.addClass('contacts-panel_opened');
	})
}
/*contacts switcher end*/

/*equal height initial*/
/*case list*/
function caseEqualHeight(){
	var caseList = $('.case__list');
	if(caseList.length){
		var $caseItem = $('.case__item');
		caseList.find('.photo-card__img, .contacts-card__caption').equalHeight({
			//amount: 8,
			ratio: 2,
			item: $caseItem,
			useParent: true,
			parent: caseList,
			resize: true
		});
		caseList.find('.photo-card__name, .contacts-card__share').equalHeight({
			//amount: 12,
			ratio: 2,
			item: $caseItem,
			useParent: true,
			parent: caseList,
			resize: true
		});
		caseList.find('.photo-card__post, .contacts-card__works').equalHeight({
			//amount: 12,
			ratio: 2,
			item: $caseItem,
			useParent: true,
			parent: caseList,
			resize: true
		});
		caseList.find('.contacts-card__post').equalHeight({
			ratio: 1,
			item: $caseItem,
			useParent: true,
			parent: caseList,
			resize: true
		});
		caseList.find('.contacts-card__name').equalHeight({
			ratio: 1,
			item: $caseItem,
			useParent: true,
			parent: caseList,
			resize: true
		});
	}
}
/*case list end*/

function equalHeightInit(){
	/*parents*/
	var parents = $('.parents');
	if(parents.length){
		parents.find('.parents__item a').equalHeight({
			useParent: true,
			parent: parents,
			resize: true
		});
	}
	/*parents end*/

	/*previews list*/
	var previewsList = $('.press-adt__list');
	if(previewsList.length){
		previewsList.find('.press-adt__title').equalHeight({
			useParent: true,
			parent: previewsList,
			resize: true
		});
		previewsList.find('.press-adt__text').equalHeight({
			useParent: true,
			parent: previewsList,
			resize: true
		});
	}
	/*previews list end*/

	/*previews list*/
	var columnsBox = $('.columns-box');
	if(columnsBox.length){
		columnsBox.find('.columns-box__column').equalHeight({
			useParent: true,
			//parent: columnsBox,
			resize: true
		});
	}
	/*previews list end*/
}
/*equal height initial end*/

/*slick sliders init*/
function slickSlidersInit(){
	/*glance slider*/
	var sliderDepartments = $('.glance__slider');
	if(sliderDepartments.length){
		sliderDepartments.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderDepartments.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 200,
			infinite: false,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 1279,
				settings: {
					slidesToShow: 3
				}
			},{
				breakpoint: 1039,
				settings: {
					slidesToShow: 2
				}
			},{
				breakpoint: 980,
				settings: {
					slidesToShow: 3
				}
			},{
				breakpoint: 768,
				settings: {
					slidesToShow: 2
				}
			},{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					dots: true
				}
			}]
		});
	}
	/*glance slider end*/

	/*questions slider*/
	var sliderQuestions = $('.questions-slider');
	if(sliderQuestions.length){
		sliderQuestions.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderQuestions.slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			speed: 200,
			infinite: true,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 3
				}
			},{
				breakpoint: 640,
				settings: {
					slidesToShow: 2
				}
			},{
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}]
		});
	}
	/*questions slider end*/

	/*promo slider*/
	var sliderPromo = $('.promo-slider');
	if(sliderPromo.length){
		sliderPromo.on('init', function () {
			$(this).css({'visibility':'visible'});
		});
		sliderPromo.slick({
			fade: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 3000,
			speed: 500,
			infinite: true,
			dots: true,
			arrows: true
		});
	}
	/*promo slider end*/

	/*uncos slider*/
	var $uncosSlider = $('.uncos-slider');
	if($uncosSlider.length){
		$uncosSlider.on('init', function (event, slick) {
			if (slick.currentSlide == 0) {
				$(this).css({'visibility':'visible'});
				slick.$prevArrow.addClass('made-arrow-disabled');
			}
		});
		$uncosSlider.slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			speed: 200,
			dots: true,
			arrows: true,
			responsive: [{
				breakpoint: 1280,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},{
				breakpoint: 880,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false
				}
			}]
		}).on('afterChange', function (event, slick, currentSlide) {
			var slidesLength = slick.$slides.length;
			var $prevArrow = slick.$prevArrow;
			var $nextArrow = slick.$nextArrow;
			if(currentSlide > 0 && currentSlide < slidesLength - 1){
				$prevArrow.removeClass('made-arrow-disabled');
				$nextArrow.removeClass('made-arrow-disabled');
				return;
			}
			if(currentSlide == 0){
				$prevArrow.addClass('made-arrow-disabled');
				return;
			}
			if(currentSlide == slidesLength - 1){
				$nextArrow.addClass('made-arrow-disabled');
			}
		});
	}
	/*uncos slider end*/

	/*meter*/
	var meterCounter = $('.meter-counter').jOdometer({
		increment: 1,
		counterStart: '000000',
		speed:1000,
		numbersImage: 'img/jodometer-numbers.png',
		heightNumber: 27,
		widthNumber: 20,
		formatNumber: true,
		spaceNumbers: 1,
		widthDot: 3
	});

	var $meterSlider = $('.meter-slider');
	if($meterSlider.length){
		$meterSlider.on('init', function (event, slick) {
			if (slick.currentSlide == 0) {
				$(this).css({'visibility':'visible'});
			}
			changeCounter(slick.$slides[slick.currentSlide]);
			changeUnit(slick.$slides[slick.currentSlide]);
		});
		$meterSlider.slick({
			fade: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 6000,
			infinite: true,
			speed: 500,
			dots: true,
			arrows: true,
			swipe: false
		}).on('beforeChange', function (event, slick, currentSlide, nextSlider) {
			changeCounter(slick.$slides[nextSlider]);
			changeUnit(slick.$slides[nextSlider]);
		});
	}

	function changeCounter(currentSlider){
		var dataCount = $(currentSlider).data('count');
		meterCounter.goToNumber(dataCount);
		var meterImg = $('.meter-counter img');
		meterImg.attr('src','img/jodometer-numbers.png');
		for(var i = 0; i < String(dataCount).length; i++){
			meterImg.eq(i).attr('src','img/jodometer-numbers-color.png');
		}
	}

	function changeUnit(currentSlider){
		var dataUnit = $(currentSlider).data('unit');
		$('.meter-unit__text').stop().fadeOut('200', function () {
			$(this).text(dataUnit);
		}).delay(100).fadeIn('200');
	}
	/*meter end*/

	/*gallery slider*/
	var gallerySlider = $('.gallery__previews');
	if(gallerySlider.length){
		gallerySlider.on('init', function (event, slick) {
			$(this).closest('.gallery').find('.gallery__title-count').text('('+slick.slideCount+' фото)');
		});
		gallerySlider.slick({
			slidesToShow: 5,
			slidesToScroll: 1,
			speed: 200,
			infinite: false,
			dots: false,
			arrows: true,
			responsive: [{
				breakpoint: 1102,
				settings: {
					slidesToShow: 4
				}
			},{
				breakpoint: 980,
				settings: {
					slidesToShow: 5
				}
			},{
				breakpoint: 768,
				settings: {
					slidesToShow: 4
				}
			},{
				breakpoint: 640,
				settings: {
					slidesToShow: 3
				}
			},{
				breakpoint: 440,
				settings: {
					slidesToShow: 2
				}
			}]
		});
	}
	/*gallery slider end*/

	/*gallery slider*/
	var caseSlider = $('.case__list');
	if(caseSlider.length){
		caseSlideBehavior();
		$(window).resize(function () {
			caseSlideBehavior();
		});
	}

	function caseSlideBehavior(){
		var md = new MobileDetect(window.navigator.userAgent);
		if(md.mobile()){
			$('body').addClass('mobile-device');
		}
		var minWidth = md.mobile() ? 480 : 463;
		if($(window).width() < minWidth){
			if(!caseSlider.hasClass('slick-slider')){
				caseSlider.on('init', function () {
					caseEqualHeight();
				});
				caseSlider.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					dots: false,
					arrows: true
				});
			}
		} else {
			if(caseSlider.hasClass('slick-slider')){
				caseEqualHeight();
				caseSlider.slick('unslick');
			}
		}
	}
	/*gallery slider end*/
}
/*slick sliders init end*/

/*map init*/
var smallPinMap = 'img/map-pin-sm.png',
	largePinMap = 'img/map-pin.png';

var localObjects = [
	[
		{lat: 53.8984, lng: 27.5788}, //coordinates of marker
		{latBias: 0.0020, lngBias: 0}, //bias coordinates for center map
		largePinMap, //image pin
		7,
		{
			title: 'Минскводоканал',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 327 37 04</div> <div>+375 17 327 37 04</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 52.799394, lng: 27.558581},
		{latBias: 0.1, lngBias: -2.5},
		smallPinMap,
		7,
		{
			title: 'Минскводоканал 2',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 327 37 04</div> <div>+375 17 327 37 04</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	]
];

var styleMap = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}];

function mapMainInit(){
	if (!$('[id*="-map"]').length) {return;}

	function mapCenter(index){
		var localObject = localObjects[index];

		return{
			lat: localObject[0].lat + localObject[1].latBias,
			lng: localObject[0].lng + localObject[1].lngBias
		};
	}

	var mapOptions = {
		zoom: 15,
		center: mapCenter(0),
		styles: styleMap,
		mapTypeControl: false,
		scaleControl: false,
		scrollwheel: false
	};

	var markers = [],
		elementById = [
		document.getElementById('main-map'),
		document.getElementById('footer-main-map'),
		document.getElementById('contacts-map')
	];
	if($(elementById[0]).length){
		var map = new google.maps.Map(elementById[0], mapOptions);
		addMarker(0,map);
	}
	if($(elementById[1]).length){
		var map2 = new google.maps.Map(elementById[1], mapOptions);
		addMarker(0,map2);
	}
	if($(elementById[2]).length){
		var map3 = new google.maps.Map(elementById[2], mapOptions);
		addMarker(0,map3);
	}

	$('.location-link>a').click( function(e) {
		var index = $(this).data('location');
		deleteMarkers();
		moveToLocation(index,map);
		addMarker(index);
		e.preventDefault();
	});

	function moveToLocation(index, map){
		var object = localObjects[index];
		var center = new google.maps.LatLng(mapCenter(index));
		map.panTo(center);
		map.setZoom(object[3]);
	}

	function addMarker(index,map) {
		var object = localObjects[index];
		var marker = new google.maps.Marker({
			position: object[0],
			//animation: google.maps.Animation.DROP,
			map: map,
			icon: object[2],
			title: object[4].title
		});
		markers.push(marker);

		var infoWindow = new google.maps.InfoWindow({
			content: '<div class="map-popup">' +
			'<h4>'+object[4].title+'</h4>' +
			'<div class="map-popup__list">' +
				'<div class="map-popup__row">'+object[4].address+'</div>' +
				'<div class="map-popup__row">'+object[4].phone+'</div>' +
				'<div class="map-popup__row">'+object[4].works+'</div>' +
			'</div>' +
			'</div>',
			maxWidth: 220
		});

		marker.addListener('click', function() {
			infoWindow.open(map, marker);
		});
	}

	function setMapOnAll(map) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	function deleteMarkers() {
		setMapOnAll(null);
		//markers = [];
	}
}
/*map init end*/

/*simple tabs*/
function tabsInit() {
	var tabWrap = $('.tabs-wrap');
	if (!tabWrap) { return; }

	/*скрыть неактивные табы*/
	tabWrap.each(function () {
		var thisTabWrap = $(this);
		var activeControlIndex = thisTabWrap.first('.tab-controls-list').find('li.active').index();
		var tab = thisTabWrap.children('.tabs').children('.tab');
		tab.fadeOut(0).eq(activeControlIndex).fadeIn(0).addClass('tab-active');
	});

	/*по клику скрываем все табы и показываем активный*/
	$('.tab-controls-list').on('click', 'a', function (e) {
		var current = $(this);
		/*если таб активный, функиця клика отменяется*/
		if (current.parent('li').hasClass('active')) {
			e.preventDefault();
			return;
		}

		var index = current.parent().index();
		current.closest('li').addClass('active').siblings().removeClass('active');
		var tab = current.closest('.tabs-wrap').children('.tabs').children('.tab');
		tab.fadeOut(0).removeClass('tab-active');
		var currentTab = tab.eq(index);
		currentTab.fadeIn(0).addClass('tab-active');

		e.preventDefault();
	});
}

(function ($) {
	var SimpleTabs = function (settings) {
		var options = $.extend({
			tabContainer: '.tabs-wrap',
			tabControls: '.tab-controls-list',
			tabControlsItem: 'a',
			tabControlsAnchor: 'a',
			tabs: '.tabs',
			tab: '.tab',
			activeTabIndex: '0',
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.tabContainer);
		this.$tabContainer = container;
		this.$tabControls = $(options.tabControls, container);
		this.$tabControlsItem = $(options.tabControlsItem, container);
		this.$tabControlsAnchor = $(options.tabControlsAnchor, container);
		this.$tabs = options.tabs;
		this.$tab = options.tab;
		//this.$tab = $(options.tab, container);
		this._activeTabIndex = options.activeTabIndex;
		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'tab-active',
			opened: 'tab-opened',
			current: 'tab-current'
		};

		this.wrappers = {
			tabs: 'tab-item-wrap',
			tab: 'tab-item'
		};

		this.bindEvents();
		this.beforeStart();
		this.onResize()
	};

	SimpleTabs.prototype.beforeStart = function () {
		var self = this;
		var _activeTabIndex = self._activeTabIndex;
		var _modifiersActive = self.modifiers.active;

		$(document).ready(function () {
			self.$tabControlsItem.eq(_activeTabIndex).addClass(_modifiersActive);

			for (var i = 0; i < self.$tabs.length; i++) {
				var $tabs = $(self.$tabs[i]);
				$tabs.wrapInner('<div class="'+self.wrappers.tabs+'" />');
				$tabs.find('.tab-item-wrap').css({
					'height': $(self.$tab[i]).eq(_activeTabIndex).outerHeight(),
					'position': 'relative'
				});

				var $tab = $(self.$tab[i]);
				//var maxHeight = Math.max.apply(Math,$tab.map(function(){return $(this).outerHeight();}).get());

				$tab.wrap('<div class="'+self.wrappers.tab+'" />');
				var $tabWrap = $tab.closest('.tab-item');
				$tabWrap.css({
					'position': 'absolute',
					'width': '100%',
					'left': 0,
					'top': 0,
					'opacity': 0,
					'z-index': 998,
					'transform': 'translateZ(0px)'
				});

				$tabWrap.eq(_activeTabIndex).css({
					'opacity': 1,
					'z-index': 999
				}).addClass(_modifiersActive);
			}
		});
	};

	SimpleTabs.prototype.onResize = function () {
		var self = this;

		$(window).resize(function () {
			for (var i = 0; i < self.$tabs.length; i++) {
				var $tabs = $(self.$tabs[i]);
				$tabs.find('.tab-item-wrap').css({
					'height': $tabs.find('.'+self.modifiers.active+'').outerHeight()
				});
			}
		});
	};

	SimpleTabs.prototype.bindEvents = function () {
		var self = this,
				_modifiersActive = this.modifiers.active;

		self.$tabControlsAnchor.on('click', function (e) {
			e.preventDefault();
			var currentTabControlsItem = $(this).closest(self.$tabControlsItem);
			if (currentTabControlsItem.hasClass(_modifiersActive)) {
				e.preventDefault();
				return;
			}

			self.$tabControlsItem.removeClass(_modifiersActive);
			currentTabControlsItem.addClass(_modifiersActive);

			var _currentTabItem = currentTabControlsItem.index();


			for(var i = 0; i < self.$tabs.length; i++) {
				var $tabs = $(self.$tabs[i]).find('.'+self.wrappers.tabs+'');
				var $tab = $(self.$tab[i]).closest('.'+self.wrappers.tab+'');

				$tab.removeClass(_modifiersActive);
				$tab.eq(_currentTabItem).addClass(_modifiersActive);


				$tab.css({
					'z-index': 998, 'opacity': 0
				});
				$tab.eq(_currentTabItem).css({
					'z-index': 999, 'opacity': 1
				});

				$tabs.animate({
					'height': $tab.eq(_currentTabItem).outerHeight()
				}, self._animateSpeed);
			}
		});

	};

	window.SimpleTabs = SimpleTabs;
}(jQuery));

function simpleTabInit() {
	if($('.contacts').length){
		new SimpleTabs({
			tabContainer: '.contacts',
			tabControlsItem: '.contacts__biz li',
			tabs: [
				'.contacts__address',
				'.contacts-share-container',
				'.contacts-phones-container'
			],
			tab: [
				'.contacts-adr',
				'.contacts-share',
				'.contacts-phones'
			],
			animateSpeed: 300
		});
	}
}
/*simple tabs end*/

/*simple accordion*/
(function ($) {
	var SimpleAccordion = function (settings) {
		var options = $.extend({
			accordionHeader: 'h3',
			active: '0',
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.accordionContainer);
		this.$accordionContainer = container;
		this.$accordionHeader = $(options.accordionHeader, container);
		this.$accordionBody = $(this.$accordionHeader.next('div'));
		this._active = options.active;
		this._animateSpeed = options.animateSpeed;

		this.modifiers = {
			active: 'active',
			current: 'current'
		};

		this.bindEvents();
		this.beforeStart();
	};

	SimpleAccordion.prototype.beforeStart = function () {
		var self = this,
				_modifiersActive = 	self.modifiers.active,
				_indexActive = self._active;
		self.$accordionBody.eq(_indexActive).slideDown(0).addClass(_modifiersActive);
		self.$accordionHeader.eq(_indexActive).addClass(_modifiersActive);
	};

	SimpleAccordion.prototype.bindEvents = function () {
		var self = this,
				_modifiersActive = this.modifiers.active,
				animateSpeed = this._animateSpeed,
				accordionBody = this.$accordionBody;

		self.$accordionHeader.on('click', function (e) {
			e.preventDefault();
			var current = $(this);
			if(current.hasClass(_modifiersActive)){
				current.next('div').slideUp(animateSpeed).removeClass(_modifiersActive);
				current.removeClass(_modifiersActive);
				return;
			}
			accordionBody.slideUp(animateSpeed).removeClass(_modifiersActive);
			self.$accordionHeader.removeClass(_modifiersActive);
			current.next('div').slideDown(animateSpeed).addClass(_modifiersActive);
			current.addClass(_modifiersActive);
		})
	};

	window.SimpleAccordion = SimpleAccordion;
}(jQuery));

function accordionInit() {
	if($('.faq-list').length){
		new SimpleAccordion({
			accordionContainer: '.faq-list',
			animateSpeed: 200
		});
	}
}
/*simple accordion end*/

/* footer at bottom */
function footerBottom(){
	var footer = $('.footer');
	var footerOuterHeight = footer.outerHeight();
	footer.css({
		'margin-top': -footerOuterHeight
	});
	$('.spacer').css({
		'height': footerOuterHeight
	});
}
/* footer at bottom end */

(function ($) {
	var HistorySlider = function (settings) {
		var options = $.extend({
			mainWrapper: '.history',
			sliderContainer: '.history-slider',
			sliderInner: '.history-sldr__holder',
			slide: '.history-sldr__item',
			info: null,
			infoBox: '.history-info',

			arrowPrev: '.history-sldr__prev-btn',
			arrowNext: '.history-sldr__next-btn',

			asNavFor: null,

			padding: 80,
			normWidth: 80,
			zoomWidth: 250,
			activeSlide: 0,
			animateSpeed: 200,
			slideIndexing: false
		}, settings || {});

		var _ = this;

		_.options = options;
		var mainWrapper = $(options.mainWrapper);
		_.$mainWrapper = mainWrapper;
		var container = $(options.sliderContainer);
		_.$sliderContainer = container;
		_.$sliderInner = $(options.sliderInner, container);
		_.$slide = $(options.slide, container);
		_.$info = $(options.info, container);
		_.$infoBox = $(options.infoBox, mainWrapper);

		_.$arrowPrev = $(options.arrowPrev, container);
		_.$arrowNext = $(options.arrowNext, container);

		_.$asNavFor = $(options.asNavFor);

		_._padding = options.padding;
		_._normWidth = options.normWidth;
		_._zoomWidth = options.zoomWidth;
		_._activeSlide = options.activeSlide;
		_._animateSpeed = options.animateSpeed;
		_._slideIndexing = options.slideIndexing;

		_.slideClases = {
			slideClass: 'history-slide',
			track: 'slider-track',
			beforePosition: 'before-position',
			afterPosition: 'after-position'
		};

		_.modifiers = {
			current: 'slide-current',
			btnHidden: 'btn-hidden'
		};

		_.beforeStart();
		_.disabledArrows(_.$slide.eq(_._activeSlide));
		_.bindEvents();

		//$('body').prepend('<div id="console"></div>');
	};

	HistorySlider.prototype.beforeStart = function () {
		var self = this,
			$slide = self.$slide;

		$slide.addClass(self.slideClases.slideClass);

		var $activeSlide = $slide.eq(self._activeSlide);

		$activeSlide.css('width',self._zoomWidth);

		var sumWidth = 0;
		for(var i = 0; i < $slide.length; i++){
			sumWidth += $slide.eq(i).outerWidth();
		}
		self.$sliderInner.addClass(self.slideClases.track).css({
			'width': sumWidth
		});

		$activeSlide.addClass(self.modifiers.current);
		self.indexSlide($activeSlide);
		self.setInfo($activeSlide);
	};

	HistorySlider.prototype.disabledArrows = function (slide) {
		var self = this;
		if(self.$sliderInner.outerWidth() <= self.$sliderContainer.outerWidth()){
			var modifiersBtnHidden = self.modifiers.btnHidden;
			self.$arrowPrev.addClass(modifiersBtnHidden);
			self.$arrowNext.addClass(modifiersBtnHidden);
		}

		self.$sliderContainer.removeClass('left-stop');
		self.$sliderContainer.removeClass('right-stop');

		var slidePrevWidth = slide.prev(),
			slideNextWidth = slide.next();
		if(slidePrevWidth.length == 0){
			self.$sliderContainer.addClass('left-stop');
		}
		if(slideNextWidth.length == 0){
			self.$sliderContainer.addClass('right-stop');
		}
	};

	HistorySlider.prototype.currentSlide = function ($currentSlide) {
		var self = this,
			_modifiersCurrent = this.modifiers.current;

		if($currentSlide.hasClass(_modifiersCurrent)){ return; }

		self.$slide.removeClass(_modifiersCurrent).css({
			'width': self._normWidth
		});

		$currentSlide.addClass(_modifiersCurrent).css({
			'width': self._zoomWidth
		});

		self.scrollToCurrentSlide($currentSlide.index());
		self.disabledArrows($currentSlide);

		self.indexSlide($currentSlide);
		self.setInfo($currentSlide);
		self.asNavForSlide($currentSlide);
	};

	HistorySlider.prototype.scrollToCurrentSlide = function (index) {
		var self = this;
		var slideWidth = self.$slide.eq(index).outerWidth(),
			slideNextWidth = self.$slide.eq(index).next().outerWidth(),
			slidePrevWidth = self.$slide.eq(index).prev().outerWidth(),
			slideLeftOffset = self.$slide.eq(index).offset().left,
			containerWidth = self.$sliderContainer.outerWidth(),
			containerLeftOffset = self.$sliderContainer.offset().left,
			slideLeftPosition = slideLeftOffset - containerLeftOffset,

			minPaddingLeft = self._padding,
			minPaddingRight = slideWidth + self._padding,

			rightEdge = containerWidth - minPaddingRight,
			innerWidth = self.$sliderInner.outerWidth(),
			innerLeftOffset = self.$sliderInner.offset().left,
			innerLeftPosition = innerLeftOffset - containerLeftOffset,
			innerLeftModule = Math.sqrt(Math.pow(innerLeftPosition,2)),
			innerMaxLeftOffset = innerWidth - containerWidth,
			scrollOffset = 0;


		//self.getLog('scrollOffset',scrollOffset);
		//self.getLog('--slide','***');
		//self.getLog('index',index);
		//self.getLog('slideWidth',slideWidth);
		//self.getLog('slideLeftOffset',slideLeftOffset);
		//self.getLog('slideLeftPosition',slideLeftPosition);
		//self.getLog('slideNextWidth',slideNextWidth,'#808080');
		//self.getLog('slidePrevWidth',slidePrevWidth,'#808080');
		//self.getLog('--container','***');
		//self.getLog('containerWidth',containerWidth);
		//self.getLog('containerLeftOffset',containerLeftOffset);
		//self.getLog('a','------');
		//self.getLog('rightEdge',rightEdge,'#333');
		//self.getLog('innerWidth',innerWidth,'#333');
		//self.getLog('innerLeftOffset',innerLeftOffset,'#333');
		//self.getLog('innerLeftPosition',innerLeftPosition,'#333');
		//self.getLog('innerLeftModule',innerLeftModule,'#333');
		//self.getLog('innerMaxLeftOffset',innerMaxLeftOffset,'#333');
		//self.getLog('b','------');
		//self.getLog('minPaddingLeft',minPaddingLeft);
		//self.getLog('minPaddingRight',minPaddingRight);
		//self.getLog('c','------');

		if(slideLeftPosition < minPaddingLeft && innerLeftModule !== 0){
			//console.log(0);
			slidePrevWidth = slidePrevWidth == null ? 0 : slidePrevWidth;
			if(innerLeftModule > slidePrevWidth && slidePrevWidth > 0){
				//console.log(2);
				scrollOffset = innerLeftModule - slidePrevWidth;
			} else {
				//console.log(3);
				scrollOffset = 0;
			}

			//self.getLog('scrollOffset',scrollOffset, 'lightblue');
			self.$sliderInner.css('left', -scrollOffset);
			return;
		}

		if(slideLeftPosition < rightEdge || innerLeftModule == innerMaxLeftOffset){
			//console.log(1);
			//self.getLog('scrollOffset',scrollOffset, 'green');

			return;
		}

		slideNextWidth = slideNextWidth == null ? 0 : slideNextWidth;
		if(
				slideNextWidth > innerMaxLeftOffset - innerLeftModule
				|| slideNextWidth == 0
		){
			//console.log(4);
			scrollOffset = innerMaxLeftOffset;

			//self.getLog('scrollOffset',scrollOffset,'lightred');
		} else {
			//console.log(5);
			scrollOffset = innerLeftModule + slideNextWidth;

			//self.getLog('scrollOffset',scrollOffset,'red');
		}

		self.$sliderInner.css('left', -scrollOffset);
	};

	HistorySlider.prototype.bindEvents = function () {
		var self = this,
			_modifiersCurrent = this.modifiers.current;

		self.$slide.on('click', function () {
			self.currentSlide($(this));
		});

		self.$arrowPrev.on('click', function(){
			var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').prev();

			if(!currentSlide.length){ return; }

			self.currentSlide(currentSlide);
		});

		self.$arrowNext.on('click', function(){
			var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').next();

			if(!currentSlide.length){ return; }

			self.currentSlide(currentSlide);
		})
	};

	HistorySlider.prototype.indexSlide = function (currentSlide) {
		var self = this,
			$slide = self.$slide,
			_beforePosition = self.slideClases.beforePosition,
			_afterPosition = self.slideClases.afterPosition;

		if(self._slideIndexing){
			$slide.removeClass(_beforePosition);
			$slide.removeClass(_afterPosition);
			$slide.css({
				'z-index':0,
				'opacity':1
			});
			currentSlide.css('z-index', $slide.length);

			var indexCurrentSlide = currentSlide.index();
			var maxOpacity = 0.8,
				minOpacity = 0.2,
				opacityValue = maxOpacity - minOpacity,
				opacityStepBefore = opacityValue/(indexCurrentSlide - 1),
				opacityStepAfter = opacityValue/($slide.length - indexCurrentSlide - 2);

			for(var i = 0; i < $slide.length; i++){
				var lastCount = $slide.length - indexCurrentSlide - 1;

				var zIndex;
				if(i < indexCurrentSlide){
					zIndex = i;
					$slide.eq(i).addClass(_beforePosition).css({
						'z-index': zIndex,
						'opacity': minOpacity + zIndex * opacityStepBefore
					});
					$slide.eq(indexCurrentSlide - 1).css('opacity',maxOpacity);
					$slide.eq(indexCurrentSlide + 1).css('opacity',maxOpacity);
				}
				if(i > indexCurrentSlide){
					zIndex = $slide.length - 1 - i;
					$slide.eq(i).addClass(_afterPosition).css({
						'z-index': zIndex,
						'opacity': minOpacity + zIndex * opacityStepAfter
					});
				}
			}
		}
	};

	HistorySlider.prototype.asNavForSlide = function (currentSlide) {
		var self = this;
		if (self.$asNavFor.length) {
			var triggerSlide = self.$asNavFor.find('.' + self.slideClases.slideClass + '').eq(currentSlide.index());

			if (triggerSlide.hasClass(self.modifiers.current)) {
				return;
			}

			triggerSlide.trigger('click');
		}
	};

	HistorySlider.prototype.setInfo = function (currentSlide) {
		var self = this;
		if (self.$info.length){
			var cloneInfo = currentSlide.find(self.$info).contents().clone();

			self.$infoBox.find('.info-new:not(.info-old)').addClass('info-old');
			self.$infoBox.children().append('<div class="info-new"></div>');
			cloneInfo.appendTo(self.$infoBox.find('.info-new:not(.info-old)')).parent().css('opacity',0);

			setTimeout(function () {
				cloneInfo.parent().animate({'opacity':1});
				self.$infoBox.children().stop().animate({'height': self.$infoBox.find('.info-new:not(.info-old)').outerHeight()});
			}, self._animateSpeed);

			self.$infoBox.find('.info-old').animate({'opacity':0}, 200, function () {
				$(this).remove();
			});
		}
	};

	/*** !!!FOR VIEW DATE LOG!!! */
	/***Delete*/
	HistorySlider.prototype.getLog = function (_class,log,color) {
		var tpl = '<div />';
		var $console = $('#console');
		var tplLog = '<b>' + _class + ': ' + '</b>' + log;
		if($console.has('.'+_class).length){
			$console.find('.'+_class).html(tplLog).css('color',color);
			return;
		}
		$(tpl).appendTo('#console').addClass(_class).html(tplLog).css('color',color);
	};
	/*** !!!FOR VIEW DATE LOG end!!! */

	window.HistorySlider = HistorySlider;
}(jQuery));

function historySliderInit() {
	if($('.history-slider').length){
		new HistorySlider({
			sliderContainer: '.history-slider',
			info: '.history-sldr__info',
			asNavFor: '.years-slider',
			slideIndexing: true
		});
		new HistorySlider({
			sliderContainer: '.years-slider',
			sliderInner: '.years-sldr__holder',
			slide: '.years-sldr__item',
			asNavFor: '.history-slider'
		});
	}
}

/*header fixed*/
function headerFixed(){
	var page = $('.inner-page');
	if(!page.length){return;}

	var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop,
		minScrollTop = 140;

	function logoScale(scrollTop){
		if($('.btn-menu').is(':visible')){return;}
		if(scrollTop > minScrollTop){
			page.addClass('logo-reduce');
		} else {
			page.removeClass('logo-reduce');
		}
	}

	logoScale(currentScrollTop);

	$(window).scroll(function () {
		var newScrollTop = $(window).scrollTop();

		logoScale(newScrollTop);

		if (newScrollTop < minScrollTop || currentScrollTop - newScrollTop > 10) {
			page.addClass('top-panel-show');
		} else if (newScrollTop > currentScrollTop) {
			page.removeClass('top-panel-show');
		}
		currentScrollTop = newScrollTop;
	});
}
/*header fixed end*/

/* fancybox initial */
function fancyboxInit(){
	/*modal window*/
	var popup = $('.fancybox-open');
	if (popup.length) {
		popup.fancybox({
			wrapCSS: 'fancybox-modal',
			padding: 0,
			openEffect: 'none',
			closeEffect: 'none'
		});
	}

	/*fancybox media*/
	var $fancyboxMedia = $('.fancybox-media');
	if ($fancyboxMedia.length) {
		$fancyboxMedia.fancybox({
			openEffect  : 'none',
			closeEffect : 'none',
			closeBtn  : false,
			helpers : {
				media : {}
			},
			beforeShow: function(){
				$('<div class="fancybox-close-custom"></div>').appendTo('body').on('click', function(){
					$.fancybox.close();
				});
				$('.fancybox-close-custom').show(0);
			},
			beforeClose: function(){
				$('.fancybox-close-custom').hide(0);
			}
		});
	}

	/*fancybox gallery*/
	var $fancyboxGallery = $('.fancybox-gallery');
	if ($fancyboxGallery.length) {
		$fancyboxGallery.fancybox({
			wrapCSS: 'fancybox-custom',
			openEffect: 'none',
			closeEffect: 'none',
			padding: 0,
			margin: [65,20,5,20],
			loop: true,
			closeBtn  : false,
			arrows: false,
			helpers: {
				title: {
					type: 'outside',
					overlay : {
						showEarly : false
					}
				}, thumbs: {
					width: 50,
					height: 50
				}
			},
			beforeShow: function(){
				$('.fancybox-custom-btn').remove();
				$('<div class="fancybox-custom-btn fancybox-custom-prev"><span></span></div>').appendTo('body').on('click', function(){
					$.fancybox.prev();
				});
				$('<div class="fancybox-custom-btn fancybox-custom-next"><span></span></div>').appendTo('body').on('click', function(){
					$.fancybox.next();
				});
				$('<div class="fancybox-close-custom"></div>').appendTo('body').on('click', function(){
					$.fancybox.close();
				});
				$('.fancybox-custom-btn, .fancybox-close-custom').show(0);
				$(this.locked).find('.fancybox-counter').remove();
				$(this.locked).prepend('<div class="fancybox-counter"><i class="depict-icons-view"></i><span class="fancybox-counter-text">'+(this.index + 1) + ' / ' + this.group.length +'</span></div>');
			},
			beforeClose: function(){
				$('.fancybox-custom-btn, .fancybox-close-custom').hide(0);
			},
			afterShow: function() {
				$('.fancybox-wrap').swipe({
					swipe : function(event, direction) {
						if (direction === 'left' || direction === 'up') {
							$.fancybox.next( direction );
						} else {
							$.fancybox.prev( direction );
						}
					}
				});
			},
			afterLoad : function() {}
		});
		$('.gallery__title a').on('click', function (e) {
			e.preventDefault();
			$(this).closest('.gallery').find('.gallery__img').eq(0).find('a').trigger('click');
		})
	}

	/*fancybox photos*/
	var $case = $('.case');
	if ($case.length) {
		$('.photo-card__img a').fancybox({
			wrapCSS: 'fancybox-photo-popup',
			openEffect: 'none',
			closeEffect: 'none',
			padding: 0,
			margin: 20,
			closeBtn  : false,
			helpers: {
				title: {
					type: 'outside'
				}
			},
			beforeShow: function(){
				$('<div class="fancybox-close-custom"></div>').appendTo('body').on('click', function(){
					$.fancybox.close();
				});
				$('.fancybox-close-custom').show(0);
			},
			beforeClose: function(){
				$('.fancybox-close-custom').hide(0);
			}
		});
	}
}
/* fancybox initial */

/**!
 * ready/load/resize document
 */

$(document).ready(function () {
	placeholderInit();
	dropLanguageInit();
	showFormSearch();
	footerDropInit();
	phonesDrop();
	phonesPopupInit();
	cardSwitch();
	contactsSwitcher();
	slickSlidersInit();
	mapMainInit();
	tabsInit();
	simpleTabInit();
	accordionInit();
	historySliderInit();
	headerFixed();
	fancyboxInit();
});

$(window).load(function () {
	// Если девайс, то при загрузке добавляем класс. Важно!
	var md = new MobileDetect(window.navigator.userAgent);
	if(md.mobile()){
		$('body').addClass('mobile-device');
	}
	footerBottom();
	hoverClassInit();
	mainNavigationInit();
	navPosition();
	equalHeightInit();
	caseEqualHeight();
	preloader();
});

$(window).resize(function(){
	footerBottom();
});