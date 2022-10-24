const videoBeforeAnimation = 300,
    $window = $(window),
    verticalHeight = $window.innerHeight(),
    numbersBeforeAnimation = verticalHeight / 1.3;

let windowWidth = $window.outerWidth(),
    numbersAnimated = false;

class Slider {

    $items;
    $activeItem;
    $slideNumber;
    isChangingSlide = false;

    constructor($items, $controls) {
        this.$items = $items;
        this.$activeItem = this.$items.first();
        this.$activeItem.addClass("slide-active");
        this.$activeItem.find(".healthcare__slider--item-image").addClass("image-from-left");
        let thisSlider = this,
            $arrowPrev = $controls.find(".healthcare__slider--info-controls-prev"),
            $arrowNext = $controls.find(".healthcare__slider--info-controls-next");

        this.$slideNumber = $controls.find(".js-slides-counter");
        this.updateSlideNumber(this.$activeItem.index());
        $arrowPrev.on("click", function () {
            if (!thisSlider.isChangingSlide) {
                thisSlider.blockControls();
                thisSlider.prev();
                thisSlider.updateSlideNumber(thisSlider.$activeItem.index());
            }
        });

        $arrowNext.on("click", function () {
            if (!thisSlider.isChangingSlide) {
                thisSlider.blockControls();
                thisSlider.next();
                thisSlider.updateSlideNumber(thisSlider.$activeItem.index());
            }
        });
    }

    next() {
        let $next = this.$activeItem.next();
        this.clearClasses();
        this.$activeItem = $next.length > 0 ? $next : this.$items.first();
        this.$activeItem.addClass("slide-active");
        this.$activeItem.find(".healthcare__slider--item-image").addClass("image-from-left");
    }

    prev() {
        let $prev = this.$activeItem.prev();
        this.clearClasses();
        this.$activeItem.find(".healthcare__slider--item-image").addClass("image-to-right");
        this.$activeItem = $prev.length > 0 ? $prev : this.$items.last();
        this.$activeItem.addClass("slide-active");
    }

    updateSlideNumber($index) {
        this.$slideNumber.text(($index + 1).toString().padStart(2, "0"));
    }

    clearClasses() {
        this.$items.removeClass("slide-active");
        this.$items.find(".healthcare__slider--item-image").removeClass("image-to-right image-from-left image-active");
    }

    blockControls() {
        let thisSlider = this;
        thisSlider.isChangingSlide = true;
        setTimeout(function () {
            thisSlider.isChangingSlide = false;
        }, 1000);
    }
}

class AnimatedNumber {

    $numberWrapper;
    $number;
    sEndValue;
    isAnimated = false;

    constructor($numberWrapper) {
        const regExp = new RegExp('[0-9]+');
        let offset = $numberWrapper.offset().top,
            animatedNumber = this,
            sNumber = $numberWrapper.data("number").toString(),
            arSymbals = sNumber.replace(regExp, "").split("");
        this.$numberWrapper = $numberWrapper;
        this.$number = $numberWrapper.find(".number");
        this.sEndValue = sNumber.match(regExp);
        $numberWrapper.find(".number-prefix").text(arSymbals[0]);
        $numberWrapper.find(".number-suffix").text(arSymbals[1]);
        $window.on("scroll", function () {
            if ($(this).scrollTop() > offset - numbersBeforeAnimation && !animatedNumber.isAnimated) {
                animatedNumber.animate();
            }
        });
    }


    animate() {
        this.isAnimated = true;
        let $number = this.$number,
            animatedNumber = this;
        this.$number.easy_number_animate({
            start_value: 0,
            end_value: animatedNumber.sEndValue,
            duration: 800,
            delimiter: '',
        });
    }
}


$(function () {
    let $videoWrappers = $(".js-wider"),
        scrollBarWidth = window.innerWidth - $window.width(),
        $numbers = $(".js-number"),
        $sliders = $(".js-slider");

    $sliders.each(function () {
        $this = $(this);
        new Slider(
            $this.find(".healthcare__slider--items .healthcare__slider--item"),
            $this.find(".healthcare__slider--controls")
        );
    });

    $numbers.each(function () {
        new AnimatedNumber($(this));
    });

    $window.on("scroll", function () {
        let scroll = $(this).scrollTop();

        $videoWrappers.each(function () {
            let $videoWrapper = $(this),
                offset = $videoWrapper.offset().top,
                width = windowWidth - scrollBarWidth,
                $video = $videoWrapper.find("video");
            if (scroll > offset - videoBeforeAnimation) {
                $video.css("max-width", width + "px");
            } else {
                $video.css("max-width", "");
            }
        });
    });
});