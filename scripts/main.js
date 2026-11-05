
(function ($) {
    "use strict";

    $(window).on('load', function () {

        /* 01. PreLoader Init
        ============================ */
        function preLoader() {
            setTimeout(function () {
                $('#preloader .scroll-static').addClass('loaded');
                setTimeout(function () {
                    $('#preloader').addClass('loaded');

                    splitInit();
                    $('.loader__content').addClass('loaded');

                    setTimeout(function () {
                        $('#preloader').remove();
                    }, 300);
                }, 250);
            }, 150);
        }
        preLoader();

        // 02. splitInit init
        function splitInit() {
            Splitting();
        }

        function scrollToHashTarget() {
            var hash = window.location.hash;
            var target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;

            if (target) {
                setTimeout(function() {
                    window.scrollTo(0, target.offsetTop);
                }, 100);
            }
        }

        scrollToHashTarget();

    });


    $(document).ready(function () {

        darkModeActive();
        menuInit();
        pageTransition();
        keyboardButtons();
        contactForm();
        reactJournal();
        testimonialCarouselInit();
        projectDetails();
        bgImage();


        // 03. darkModeActive init
        function darkModeActive() {
            function isDarkModeSaved() {
                try {
                    var savedMode = window.localStorage.getItem("isDarkModeActive");
                    if (savedMode !== null) {
                        return savedMode === "1";
                    }
                } catch (error) {
                    // Fall back to the cookie when local storage is unavailable.
                }

                return $.cookie("isDarkModeActive") == 1;
            }

            function saveDarkMode(isDarkMode) {
                var savedMode = isDarkMode ? "1" : "0";
                try {
                    window.localStorage.setItem("isDarkModeActive", savedMode);
                } catch (error) {
                    // The cookie below remains available on hosted pages.
                }
                $.cookie("isDarkModeActive", savedMode, {expires: 365});
            }

            function syncPressed() {
                $(".color__chooser_toggle").attr("aria-pressed", $("body").hasClass("dark__mode") ? "true" : "false");
            }

            if(isDarkModeSaved()) {
                $("body").addClass("dark__mode");
            }
            syncPressed();
            $(".color__chooser_toggle").on('click', function() {
                if($("body").hasClass("dark__mode") == true) {
                    $("body").removeClass("dark__mode");
                    saveDarkMode(false);
                } else {
                    $("body").addClass("dark__mode");
                    saveDarkMode(true);
                }
                syncPressed();
            });
        }


        // 04. menu-wrapper init
        function menuInit() {
            $('.navigation__toggle').on('click', function() {
                $(this).toggleClass('navigation__close');
                var open = $('.navigation').toggleClass('navigation_show').hasClass('navigation_show');
                $(this).attr('aria-expanded', open ? 'true' : 'false');
                $('.main__content').toggleClass('main__content_hide');
            });

            // Escape closes the menu
            $(document).on('keydown', function (e) {
                if (e.key === 'Escape' && $('.navigation').hasClass('navigation_show')) {
                    $('.navigation__toggle').trigger('click').trigger('focus');
                }
            });
        }

        // 05. page transition init (internal links only)
        function pageTransition() {
            $('a').on('click', function (e) {
                var href = this.getAttribute('href');
                if (!href || href.charAt(0) === '#') { return; }
                if (this.target && this.target !== '_self') { return; }
                if (this.hasAttribute('download')) { return; }
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.which > 1) { return; }
                if (/^(mailto:|tel:|sms:)/i.test(href)) { return; }
                // external links keep native behaviour
                if (this.hostname && this.hostname !== window.location.hostname) { return; }
                if (/\.pdf($|[?#])/i.test(href)) { return; }
                if ($(this).hasClass('ajax-popup-link')) { return; }

                e.preventDefault();
                $('body').addClass('page__tran');
                setTimeout(function() {
                    window.location = href;
                }, 320);
            });

            // bfcache: remove the transition curtain when coming back with the Back button
            $(window).on('pageshow', function (e) {
                if (e.originalEvent && e.originalEvent.persisted) {
                    $('body').removeClass('page__tran');
                }
            });
        }

        // Make div/span "buttons" operable with the keyboard
        function keyboardButtons() {
            $('.navigation__toggle, .color__chooser_toggle').on('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
        }

        // Contact form: posts to an endpoint when data-endpoint is set (Formspree, Web3Forms, ...),
        // otherwise opens the visitor's mail app with the message pre-filled.
        function contactForm() {
            var $form = $('.contact__form');
            if (!$form.length) { return; }
            var $status = $form.find('.form__status');

            function say(text, isError) {
                $status.text(text).toggleClass('form__status_error', !!isError);
            }

            $form.on('submit', function (e) {
                e.preventDefault();
                var form = this;
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                var endpoint = form.getAttribute('data-endpoint');
                var mailto = form.getAttribute('data-mailto');

                if (endpoint) {
                    say('Sending…');
                    fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: new FormData(form)
                    }).then(function (res) {
                        if (!res.ok) { throw new Error('bad status'); }
                        form.reset();
                        say('Thanks! Your message has been sent.');
                    }).catch(function () {
                        say('Sorry, something went wrong. Please email me directly at ' + mailto + '.', true);
                    });
                    return;
                }

                var services = [];
                $form.find('input[name="services"]:checked').each(function () { services.push(this.value); });
                var name = form.elements['name'].value;
                var email = form.elements['email'].value;
                var message = form.elements['message'].value;
                var body = message +
                    (services.length ? '\n\nInterested in: ' + services.join(', ') : '') +
                    '\n\n— ' + name + ' (' + email + ')';
                say('Opening your email app…');
                window.location.href = 'mailto:' + mailto +
                    '?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) +
                    '&body=' + encodeURIComponent(body);
            });
        }

        // 06. reactJournal init
        function reactJournal() {
            $('.react__btn').on('click', function(){
                $(this).addClass('active');
            });
        }

        // 07. testimonialCarousel init
        function testimonialCarouselInit() {
            $('.owl-carousel.testimonials__carousel').owlCarousel({
                nav:true,
                loop:true,
                dots:false,
                navText: ["<span class='ti-angle-left'></span>", "<span class='ti-angle-right'></span>"],
                items:1
            });
            $('.testimonials__carousel .owl-nav button').on('mouseenter',function(){$('.cursor').css('opacity','0')});
            $('.testimonials__carousel .owl-nav button').on('mouseleave',function(){$('.cursor').css('opacity','.1')});
        }


        /* 08. ProjectDetails Init
        ============================ */
        function projectDetails() {
            $('.ajax-popup-link').magnificPopup({
                settings: null,
                type: 'ajax',
                closeOnContentClick: false,
                closeBtnInside:false,
                callbacks:{
                    ajaxContentAdded: function() {
                      $(".mfp-content").find("*").addClass("mfp-prevent-close");
                    }
                 }
            });
        }

        /* 09. BackgroundImage Init
        ============================ */
        function bgImage() {
            $('[data-bgi]').each(function () {
                var src = $(this).attr('data-bgi');
                $(this).css({
                    'background-image': 'url(' + src + ')'
                });
            });
        }

    });


})(jQuery);
