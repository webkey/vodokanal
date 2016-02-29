/*resized only width*/
var resizeByWidth = true;

var prevWidth = -1;
$(window).resize(function () {
	var currentWidth = $('body').outerWidth();
	resizeByWidth = prevWidth != currentWidth;
	if(resizeByWidth){
		$(window).trigger('resizeByWidth');
		prevWidth = currentWidth;
	}
});
/*resized only width end*/

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
		$spinner = $preloader.find('.loader__icon'),
			_logoPosTop = $('.logo').offset().top + $('.logo').height()/2,
			_logoPosLeft = $('.logo').offset().left + $('.logo').width()/2;

	$spinner.fadeOut();
	$preloader.addClass('preloader-end');
	$('#preloader-logo').css({
		'position': 'fixed',
		'top': _logoPosTop,
		'left': _logoPosLeft
	});
	$preloader.delay(350).fadeOut(500);
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
			$(this).firstChildElement(self.options.navDropMenu).slideDown(0, function () {
				$(window).trigger('openCurrentNavItem');
			});
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
				currentAccordionItem.removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed, function () {
					//$(window).trigger('openCurrentNavItem');
				});
				currentAccordionItem.removeClass(modifiers.current);
				currentAccordionItem.find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);
				return;
			}

			currentAccordionItem.siblings().removeClass(modifiers.active).find(collapsibleElement).slideUp(animateSpeed);
			currentAccordionItem.siblings().removeClass(modifiers.current);
			currentAccordionItem.siblings().find(anyAccordionItem).removeClass(modifiers.active).removeClass(modifiers.current);

			currentAccordionItem.addClass(modifiers.active);
			current.siblings(collapsibleElement).slideDown(animateSpeed, function () {
				//$(window).trigger('openCurrentNavItem');
			});
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

/*clone and collapse nav items*/
function cloneNavItem() {
	if ($('.nav-main-page').length) {
		$('.nav__list').clone().appendTo('#nav-list-clone');
	}
}

var collapseNavItem = function() {
	var $navContainer = $('.nav-main-page');
	if(!$navContainer.length){return;}

	$(window).on('load resizeByWidth', function () {
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
	})
};
/*clone and collapse nav items end*/

/*nav position*/
function navPosition(){

	if($('.inner-page').length){
		var topFixed = false;
		var bottomFixed = false;
		var footerTouch = false;
		var scrollPositionPrevious = $(window).scrollTop();

		if($('.nav-inner-page').has('.current').length){
			$(window).on('openCurrentNavItem scroll', function () {
				navRelativePosition();
			})
		} else {
			$(window).on('load scroll', function () {
				navRelativePosition();
			})
		}
	}

	function navRelativePosition() {
		if($('.btn-menu').is(':visible')){return;}

		var windowHeight = $(window).outerHeight();
		var scrollPositionCurrent = $(window).scrollTop();
		var windowBottomPosition = scrollPositionCurrent + windowHeight;

		var $floatingElement = $('.nav-inner-page__holder');
		var floatingElementHeight = $floatingElement.outerHeight(true);
		var floatingElementPosition = $floatingElement.offset().top;
		var floatingElementBottomPosition = floatingElementHeight + floatingElementPosition;

		var footerPosition = $('.footer').offset().top;

		var topSpace = scrollPositionCurrent > 140 ? 60 : 200;

		if(floatingElementHeight < windowHeight && !footerTouch ){
			$floatingElement.css({
				'position': 'fixed',
				'top': topSpace,
				'bottom': 'auto'
			});
			bottomFixed = false;
			topFixed = true;
		}

		if (floatingElementHeight >= windowHeight) {
			if (scrollPositionCurrent > scrollPositionPrevious) { // Скроллим вниз
				if (!bottomFixed && floatingElementBottomPosition < windowBottomPosition) {
					$floatingElement.css({
						'position': 'fixed', 'top': 'auto', 'bottom': 0
					});
					bottomFixed = true;
					footerTouch = false;
				} else if (!footerTouch && topFixed && floatingElementBottomPosition > windowBottomPosition) {
					$floatingElement.css({
						'position': 'relative', 'bottom': 'auto', 'top': floatingElementPosition - topSpace
					});
					topFixed = false;
				} else if (!footerTouch && footerPosition <= floatingElementBottomPosition) {
					var delta = floatingElementBottomPosition - footerPosition;
					$floatingElement.css({
						'position': 'relative', 'bottom': 'auto', 'top': floatingElementPosition - topSpace - delta
					});
					footerTouch = true;
				}
			} else if (scrollPositionCurrent < scrollPositionPrevious) { // Скроллим вверх
				if (!footerTouch && bottomFixed) {
					$floatingElement.css({
						'position': 'relative', 'bottom': 'auto', 'top': scrollPositionCurrent + windowHeight - floatingElementHeight - topSpace
					});
					bottomFixed = false;
				} else if (scrollPositionCurrent < floatingElementPosition - topSpace) {
					$floatingElement.css({
						'position': 'fixed', 'top': topSpace, 'bottom': 'auto'
					});
					bottomFixed = false;
					topFixed = true;
					footerTouch = false;
				} else if (scrollPositionCurrent < 140) {
					$floatingElement.css({
						'position': 'relative', 'top': 0, 'bottom': 'auto'
					});
					bottomFixed = false;
					topFixed = true;
					footerTouch = false;
				}
			} else { // До начала скролла
				if (windowBottomPosition < floatingElementHeight) {
					$floatingElement.css({
						'position': 'relative', 'bottom': 'auto', 'top': scrollPositionCurrent
					});
					topFixed = true;
				} else {
					$floatingElement.css({
						'position': 'fixed', 'top': 'auto', 'bottom': 0
					});
					//topFixed = false;
					//bottomFixed = true;
				}
			}
		} else {
			if (scrollPositionCurrent > scrollPositionPrevious) { // Скроллим вниз
				if (!footerTouch && footerPosition <= floatingElementBottomPosition) {
					delta = floatingElementBottomPosition - footerPosition;
					$floatingElement.css({
						'position': 'relative',
						'bottom': 'auto',
						'top': floatingElementPosition - topSpace - delta
					});
					footerTouch = true;
				}
			} else if (scrollPositionCurrent < scrollPositionPrevious) { // Скроллим вверх
				if (scrollPositionCurrent < floatingElementPosition - topSpace) {
					$floatingElement.css({
						'position': 'fixed', 'top': topSpace, 'bottom': 'auto'
					});
					bottomFixed = false;
					topFixed = true;
					footerTouch = false;
				} else if (scrollPositionCurrent < 140) {
					$floatingElement.css({
						'position': 'relative', 'top': 0, 'bottom': 'auto'
					});
					bottomFixed = false;
					topFixed = true;
					footerTouch = false;
				}
			} else { // До начала скролла
				$floatingElement.css({
					'position': 'fixed', 'top': topSpace, 'bottom': 'auto'
				});
				topFixed = true;
				bottomFixed = false;
			}
		}
		scrollPositionPrevious = scrollPositionCurrent;
	}
}
/*nav position end*/

/*footer drop*/
(function ($) {
	var Disperse = function (settings) {
		var options = $.extend({
			wrapperContainer: 'body',
			scrollTo: null,
			otherDrop: null,
			otherSwitcher: null,
			clearOnResize: false,
			animateSpeed: 300
		}, settings || {});

		this.options = options;
		var container = $(options.wrapperContainer);
		this.$switcher = $(options.switcher, container);
		this.$disperseDrop = $(options.disperseDrop, container);
		this.$scrollTo = $(options.scrollTo, container);
		this.$otherDrop = $(options.otherDrop);
		this.$otherSwitcher = $(options.otherSwitcher);
		this.$btnClose = $(options.btnClose, container);

		this._animateSpeed = options.animateSpeed;
		this.modifiers = {
			active: 'active'
		};

		this.switchDrop();

		var md = new MobileDetect(window.navigator.userAgent),
			self = this,
			_activeClass = self.modifiers.active;

		if(options.clearOnResize){
			$(window).on('debouncedresize', function () {
				var minWidth = !md.mobile() && $('body').innerWidth() != window.innerWidth ? 963 : 980;
				if($(window).width() >= minWidth){
					self.$disperseDrop.attr('style','').removeClass(_activeClass);
					self.$switcher.removeClass(_activeClass);
				}
			});
		}
	};

	Disperse.prototype.switchDrop = function () {
		var self = this,
			$drop = self.$disperseDrop,
			$otherDrop = self.$otherDrop,
			$otherSwitcher = self.$otherSwitcher,
			_modifiersActive = this.modifiers.active,
			_animateSpeed = self._animateSpeed;

		self.$switcher.on('click', function (e) {
			e.preventDefault();
			var $currentSwitcher = $(this);

			if($drop.is(':animated')){ return; }

			if($drop.is(':visible')){
				self.dropClose($currentSwitcher);
				return;
			}

			if($otherDrop.length){
				$otherDrop.slideUp(_animateSpeed).removeClass(_modifiersActive);
			}
			if($otherSwitcher.length){
				$otherSwitcher.removeClass(_modifiersActive);
			}

			$currentSwitcher.addClass(_modifiersActive);
			$drop.slideDown(_animateSpeed, function () {
				$drop.addClass(_modifiersActive);
				footerAtBottom($drop.outerHeight(true),self._animateSpeed);
			});

			self.scrollPosition();
		});

		self.$btnClose.on('click', function (e) {
			e.preventDefault();
			self.dropClose(self.$switcher);
			self.scrollPosition();
		})
	};

	Disperse.prototype.dropClose = function (currentSwitcher) {
		var self = this;
		currentSwitcher.removeClass(self.modifiers.active);
		self.$disperseDrop.slideUp(self._animateSpeed).removeClass(self.modifiers.active);
		footerAtBottom(-self.$disperseDrop.outerHeight(true),self._animateSpeed);
	};

	Disperse.prototype.scrollPosition = function () {
		var $scrollTo = this.$scrollTo.length ? this.$scrollTo : this.$switcher;
		$('html, body').animate({ scrollTop: $scrollTo.offset().top }, this._animateSpeed);
	};

	window.Disperse = Disperse;
}(jQuery));

function footerDropInit() {
	if($('.map-site-switcher').length){
		new Disperse({
			switcher: '.map-site-switcher',
			wrapperContainer: '.footer',
			disperseDrop: '.site-map',
			btnClose: '.site-map-close'
		});
	}

	if($('.contact-panel__opener').length){
		new Disperse({
			switcher: '.contact-panel__opener>a',
			wrapperContainer: '.footer',
			disperseDrop: '.contacts-panel__holder',
			scrollTo: '.contacts-panel',
			clearOnResize: true
		});
	}
}
/*footer drop end*/

/*init js drop*/
function initJsDrops(){
	var jsDropWrappers = '.phs__item, .phones-clone';
	var $jsDropWrapper = $(jsDropWrappers);

	$jsDropWrapper.on('click', '.phs__item_opener', function () {
		var $currentJsDropWrapper = $(this).closest(jsDropWrappers);
		var currentWasOpened = $currentJsDropWrapper.hasClass('show-drop');

		$jsDropWrapper.removeClass('show-drop');
		if (!currentWasOpened) {
			$currentJsDropWrapper.addClass('show-drop');

			if($currentJsDropWrapper.closest('.header').length){
				$('html').removeClass('position');
			}
		}
		return false;
	});

	$jsDropWrapper.on('click', '.phones-drop', function (e) {
		e.stopPropagation();
		return false;
	});

	$(document).click(function () {
		$jsDropWrapper.removeClass('show-drop');
	})
}
/*init js drop end*/

/*clone and collapse phones*/
function clonePhones() {
	$('.phs__list').clone().appendTo('#phones-list-clone');
}

function collapsePhones() {
	var $phonesCloneContainer = $('.phones-clone');
	var minWidthItem = 200;

	var $phonesList = $('.phs__container');
	var $phonesItem = $phonesList.children('.phs__list').children('.phs__item');

	var phonesListWidth = $phonesList.outerWidth();
	var lengthPhonesItems = $phonesItem.length;
	// Количество ячеек, которые нужно "переместить" в дроп "все номера"
	var cloneLength = Math.abs(Math.ceil((lengthPhonesItems * minWidthItem - phonesListWidth)/minWidthItem));

	// Изменяем ширину ячеек в зависимости от их количества
	var newWidthItem = (1/(lengthPhonesItems - cloneLength)*100)+'%';
	$phonesItem.css('width', newWidthItem);
	$phonesCloneContainer.css('width', newWidthItem);

	// Изменяем текст кнопки "все номера" в зависимости от того, она одна в хедере, или нет.
	var $phsInnerMain = $phonesCloneContainer.find('.phs-clone__inner-main');
	var $phsInnerAlt = $phonesCloneContainer.find('.phs-clone__inner-alt');
	if(lengthPhonesItems == cloneLength + 1){
		$phsInnerAlt.attr('style','display: inline-block;');
		$phsInnerMain.attr('style','display: none;');
	} else {
		$phsInnerAlt.attr('style','display: none;');
		$phsInnerMain.attr('style','display: inline-block;');
	}

	$phonesCloneContainer.toggleClass('show-clone', lengthPhonesItems * minWidthItem > phonesListWidth);

	$('.phs__item').removeClass('ph-cloned');
	var $phonesCloneItems = $('.phones-clone-drop', $phonesCloneContainer).children('.phs__list').children('.phs__item');

	for(var i = 0; i < cloneLength; i++){
		var indexCloned = lengthPhonesItems - i - 1;
		$($phonesItem[indexCloned]).addClass('ph-cloned');
		$($phonesCloneItems[indexCloned]).addClass('ph-cloned');
	}
}
/*clone and collapse phones*/

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
		var $thisContacts = $(this).closest($contacts);
		if($thisContacts.hasClass('contacts-panel_opened')){
			$thisContacts.removeClass('contacts-panel_opened');
			return;
		}

		$thisContacts.addClass('contacts-panel_opened');
	});
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
		/*set width numbers*/
		function maxCaption() {
			$('.glance__slide').each(function () {
				var $slide = $(this);
				var $captions = $slide.find('.glance__caption');
				var $maxWidth = Math.max.apply(Math, $captions.map(function () {
					return $(this).outerWidth(true);
				}).get());
				$captions.css('width', $maxWidth);
			});
		}
		maxCaption();
		$(window).resize(function () {
			$('.glance__caption').attr('style','');
			maxCaption();
		})
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

			$(this).find('.promo-slider__item').eq(0).addClass('animate-start');
		});
		sliderPromo.slick({
			fade: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 5000,
			pauseOnHover: false,
			speed: 700,
			infinite: true,
			dots: true,
			arrows: true
		}).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
				for(var i = 0; i < slick.slideCount; i++){
					$(slick.$slides[i]).removeClass('animate-end animate-start');
				}
				$(slick.$slides[currentSlide]).addClass('animate-end');
				$(slick.$slides[nextSlide]).addClass('animate-start');
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
		var minWidth = md.mobile() ? 480 : 463;
		if($(window).width() < minWidth){
			caseEqualHeight();
			if(!caseSlider.hasClass('slick-slider')){
				caseSlider.on('init', function () {
					caseEqualHeight();
				}).slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: false,
					dots: false,
					arrows: true
				});
			}
		} else {
			caseEqualHeight();
			if(caseSlider.hasClass('slick-slider')){
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
		15,
		{
			title: 'Минскводоканал',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 327 13 23</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 53.8984, lng: 27.5788},
		{latBias: 0.0015, lngBias: 0},
		smallPinMap,
		15,
		{
			title: 'Минскводопровод',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 233 91 36</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 53.8984, lng: 27.5788},
		{latBias: 0.0015, lngBias: 0},
		smallPinMap,
		15,
		{
			title: 'Водосбыт',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 294 06 96</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 53.8984, lng: 27.5788},
		{latBias: 0.0015, lngBias: 0},
		smallPinMap,
		15,
		{
			title: 'Минскочиствод',
			address: '<b>Адрес:</b> 220088 Беларусь, Минск, ул. Пулихова д.15',
			phone: '<b>Приёмная:</b> <div>+375 17 226 19 33</div>',
			works: '<b>Эл. почта:</b> <div><span>Пн-Пт:</span> 10<sup>00</sup> – 20<sup>00</sup></div> <div><span>Сб-Вс:</span> 10<sup>00</sup> – 18<sup>00</sup></div>'
		}
	],[
		{lat: 53.8782, lng: 27.5897},
		{latBias: 0.0015, lngBias: 0},
		smallPinMap,
		15,
		{
			title: 'Автобаза',
			address: '<b>Адрес:</b> 220033 Беларусь , Минск, ул. Тростенецкая, 22',
			phone: '<b>Отдел снабжения:</b> <div>+375 17 247 95 69</div>',
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

		/*aligned after resize*/
		var resizeTimer1;
		$(window).on('resize', function () {
			clearTimeout(resizeTimer1);
			resizeTimer1 = setTimeout(function () {
				moveToLocation(0,map);
			}, 500);
		});
	}
	if($(elementById[1]).length){
		var map2 = new google.maps.Map(elementById[1], mapOptions);
		addMarker(0,map2);

		/*aligned after resize*/
		var resizeTimer2;
		$(window).on('resize', function () {
			clearTimeout(resizeTimer2);
			resizeTimer2 = setTimeout(function () {
				moveToLocation(0,map2);
			}, 500);
		});
	}
	if($(elementById[2]).length){
		var map3 = new google.maps.Map(elementById[2], mapOptions);
		addMarker(0,map3);
	}

	/*change location*/
	$('.contacts__biz a').on('click', function(e) {
		var index = $(this).data('location');
		deleteMarkers();
		moveToLocation(index,map3);
		addMarker(index,map3);
		e.preventDefault();
	});

	/*move to location*/
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

	/*showed footer map*/
	var $footerMap = $('.footer-local-map'),
		animationSpeed = 300;

	$('.road-view').on('click', function () {
		var $currentBtn = $(this);
		var $footerMapWrap = $footerMap.closest('.footer-map-row');
		var _activeClass = 'active';
		if($footerMap.is(':animated')){ return; }

		if($footerMap.is(':visible')){
			$footerMap.stop().slideUp(animationSpeed, function () {
				footerAtBottom (-$footerMap.outerHeight(true), animationSpeed);
			});
			$footerMapWrap.removeClass(_activeClass);
			return;
		}
		$footerMap.stop().slideDown(animationSpeed, function () {
			google.maps.event.trigger(map2,'resize');
			moveToLocation(0,map2);
			footerAtBottom ($footerMap.outerHeight(true), animationSpeed);
			$footerMapWrap.addClass(_activeClass);
		});

		$('html, body').animate({ scrollTop: $currentBtn.offset().top }, animationSpeed);
	});

	$('.footer-map-close').on('click', function () {
		$footerMap.stop().slideUp(animationSpeed, function () {
			footerAtBottom (-$footerMap.outerHeight(true), animationSpeed);
		});
		$('.footer-map-row').removeClass('active');
	});
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
				current.next('div').slideUp(animateSpeed, function () {
					self.scrollPosition(current);
				}).removeClass(_modifiersActive);
				current.removeClass(_modifiersActive);
				return;
			}
			accordionBody.slideUp(animateSpeed).removeClass(_modifiersActive);
			self.$accordionHeader.removeClass(_modifiersActive);
			current.next('div').slideDown(animateSpeed, function () {
				self.scrollPosition(current);
			}).addClass(_modifiersActive);
			current.addClass(_modifiersActive);
		})
	};

	SimpleAccordion.prototype.scrollPosition = function (scrollElement) {
		$('html, body').animate({ scrollTop: scrollElement.offset().top }, this._animateSpeed);
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

function footerAtBottom (height, speed) {
	$('.footer').animate({
		'margin-top': '-='+height+''
	}, speed);

	$('.spacer').animate({
		'height': '+='+height+''
	}, speed);
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

		this.options = options;
		var mainWrapper = $(options.mainWrapper);
		this.$mainWrapper = mainWrapper;
		var container = $(options.sliderContainer);
		this.$sliderContainer = container;
		this.$sliderInner = $(options.sliderInner, container);
		this.$slide = $(options.slide, container);
		this.$info = $(options.info, container);
		this.$infoBox = $(options.infoBox, mainWrapper);

		this.$arrowPrev = $(options.arrowPrev, container);
		this.$arrowNext = $(options.arrowNext, container);

		this.$asNavFor = $(options.asNavFor);

		this._padding = options.padding;
		this._normWidth = options.normWidth;
		this._zoomWidth = options.zoomWidth;
		this._activeSlide = options.activeSlide;
		this._animateSpeed = options.animateSpeed;
		this._slideIndexing = options.slideIndexing;

		this.slideClases = {
			slideClass: 'history-slide',
			track: 'slider-track',
			beforePosition: 'before-position',
			afterPosition: 'after-position'
		};

		this.modifiers = {
			current: 'slide-current',
			btnHidden: 'btn-hidden'
		};

		this.beforeStart();
		this.disabledArrows(this.$slide.eq(this._activeSlide));
		this.bindEvents();
		this.setInfoOnResize();
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


		if(slideLeftPosition < minPaddingLeft && innerLeftModule !== 0){
			slidePrevWidth = slidePrevWidth == null ? 0 : slidePrevWidth;
			if(innerLeftModule > slidePrevWidth && slidePrevWidth > 0){
				scrollOffset = innerLeftModule - slidePrevWidth;
			} else {
				scrollOffset = 0;
			}

			self.$sliderInner.css('left', -scrollOffset);
			return;
		}

		if(slideLeftPosition < rightEdge || innerLeftModule == innerMaxLeftOffset){
			return;
		}

		slideNextWidth = slideNextWidth == null ? 0 : slideNextWidth;
		if(
				slideNextWidth > innerMaxLeftOffset - innerLeftModule
				|| slideNextWidth == 0
		){
			scrollOffset = innerMaxLeftOffset;
		} else {
			scrollOffset = innerLeftModule + slideNextWidth;
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
		});

		self.$sliderContainer.swipe({
			swipeLeft: function () {
				var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').next();

				if(!currentSlide.length){ return; }

				self.currentSlide(currentSlide);
			},
			swipeRight: function () {
				var currentSlide = self.$sliderContainer.find('.'+_modifiersCurrent+'').prev();

				if(!currentSlide.length){ return; }

				self.currentSlide(currentSlide);
			}
		});
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

	HistorySlider.prototype.setInfoOnResize = function () {
		var self = this;
		$(window).on('debouncedresize', function () {
			self.$infoBox.children().stop().animate({'height': self.$infoBox.find('.info-new:not(.info-old)').outerHeight()});
		})
	};

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
	clonePhones();

	var page = $('.inner-page');
	if (!page.length) {
		$(window).on('load resizeByWidth', function () {
			collapsePhones();
		});
		return;
	}

	var minScrollTop = 140;

	var previousScrollTop = $(window).scrollTop();
	var md = new MobileDetect(window.navigator.userAgent);
	$(window).on('load scroll resizeByWidth', function () {

		var currentScrollTop = $(window).scrollTop();
		var reduceLogo = $('.btn-menu').is(':hidden') && currentScrollTop > minScrollTop;

		page.toggleClass('logo-reduce', reduceLogo);
		var showHeaderPanel = currentScrollTop < minScrollTop || currentScrollTop < previousScrollTop;

		if (md.mobile()) {
			page.find('.header-options').toggle(showHeaderPanel);
		} else {
			page.toggleClass('top-panel-show', showHeaderPanel);
		}
		if(showHeaderPanel && resizeByWidth){
			collapsePhones();
		}
		previousScrollTop = currentScrollTop;
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
	//dropLanguageInit();
	showFormSearch();
	footerDropInit();
	initJsDrops();
	phonesPopupInit();
	cardSwitch();
	contactsSwitcher();
	slickSlidersInit();
	tabsInit();
	simpleTabInit();
	accordionInit();
	historySliderInit();
	fancyboxInit();
	headerFixed();
	cloneNavItem();
	collapseNavItem();
	navPosition();
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
	equalHeightInit();
	caseEqualHeight();
	preloader();
	mapMainInit();
});

$(window).on('resizeByWidth', function () {
	footerBottom();
});