(function () {
  var pubUi = {
    init: function () {
      var self = this;
      self.settings();
      self.bindEvents();
      self.swiperSlideEvent();
    },
    settings: function () {
      var self = this;
      self.$container = $(".container");

      // tab 관련 변수
      self.$tabs = document.querySelectorAll(".tabs-wrap .tabs");
      self.$tabList = document.querySelectorAll(".tabs li");
      self.$tabConts = document.querySelectorAll(".tab-content");

      // swiper 관련 변수
      self.$btnPlay = $(".btn-play");
      self.$btnSound = $(".btn-sound");
    },
    bindEvents: function () {
      var self = this;

      for (var i = 0; i < self.$tabList.length; i++) {
        self.$tabList[i].addEventListener("click", function (e) {
          e.preventDefault();
          pubUi.tabBtnEvent(e);
        });
      }

      // 스와이퍼 재생 버튼 클릭시,
      self.$btnPlay.on("click", function (e) {
        e.preventDefault();
        var targetSwiper = $(this).closest(".swiper");

        if (self.$btnPlay.hasClass("on")) {
          console.log("정지버튼 클릭!");
          self.$btnPlay.removeClass("on");
          targetSwiper[0].swiper.autoplay.stop();
          self.$btnPlay.find(".visually-hidden").text("정지");
        } else {
          console.log("재생버튼 클릭!");
          self.$btnPlay.addClass("on");
          targetSwiper[0].swiper.autoplay.start();
          self.$btnPlay.find(".visually-hidden").text("재생");
        }
      });

      // 스와이퍼 소리 버튼 클릭시, (★ 추후, 재생,정지 기능 추가필요함)
      self.$btnSound.on("click", function (e) {
        e.preventDefault();
        var targetSwiper = $(this).closest(".swiper");

        if (self.$btnSound.hasClass("on")) {
          console.log("소리 끄기 버튼 클릭!");
          self.$btnSound.removeClass("on");
          self.$btnSound.find(".visually-hidden").text("소리 끄기");
        } else {
          console.log("소리 켜기버튼 클릭!");
          self.$btnSound.addClass("on");
          self.$btnSound.find(".visually-hidden").text("소리 켜기");
        }
      });
    },
    swiperSlideEvent: function () {
      var self = this;
      var slideInx = 0; // 현재 슬라이드 index 체크용 변수
      const progressBar = document.querySelector(".autoplay-progress .bar");

      self.swiper1 = new Swiper(".ty01Swiper", {
        centeredSlides: true,
        watchOverflow: true, //pagination 1개 일 경우, 숨김
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".ty01Swiper .swiper-button-next",
          prevEl: ".ty01Swiper .swiper-button-prev",
        },
        on: {
          autoplayTimeLeft(s, time, progress) {
            progressBar.style.setProperty("--progress", 1 - progress);
          },
        },
      });

      self.swiper2 = new Swiper(".ty02Swiper", {
        slidesPerView: 1.5,
        spaceBetween: 80,
        centeredSlides: true,
        loop: true,
        initialSlide: slideInx,
        watchOverflow: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".ty02Swiper .swiper-button-next",
          prevEl: ".ty02Swiper .swiper-button-prev",
        },
        breakpoints: {
          360: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          768: {
            spaceBetween: 12,
          },
          1024: {
            spaceBetween: 80,
          },
        },
        on: {
          autoplayTimeLeft(s, time, progress) {
            progressBar.style.setProperty("--progress", 1 - progress);
          },
          activeIndexChange: function () {
            slideInx = this.realIndex; //현재 슬라이드 index 갱신
          },
        },
      });

      self.swiper3 = new Swiper(".ty03Swiper", {
        slidesPerView: 3,
        spaceBetween: 24,
        watchOverflow: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".ty03Swiper .swiper-button-next",
          prevEl: ".ty03Swiper .swiper-button-prev",
        },
        breakpoints: {
          360: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
      });

      self.swiper4 = new Swiper(".ty04Swiper", {
        slidesPerView: 3.5,
        spaceBetween: 24,
        watchOverflow: true,
        navigation: {
          nextEl: ".ty04Swiper .swiper-button-next",
          prevEl: ".ty04Swiper .swiper-button-prev",
        },
        breakpoints: {
          360: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 12,
          },
          1024: {
            spaceBetween: 24,
          },
        },
      });

      self.swiper5 = new Swiper(".ty05Swiper", {
        spaceBetween: 4,
        watchOverflow: true,
        navigation: {
          nextEl: ".ty05Swiper .swiper-button-next",
          prevEl: ".ty05Swiper .swiper-button-prev",
        },
        breakpoints: {
          360: {
            slidesPerView: 2.1,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 5.5,
            spaceBetween: 4,
          },
        },
      });
    },
    tabBtnEvent: function (e) {
      var self = this;

      const target = e.target;
      const tabs = target.parentNode.parentElement;
      const tabList = tabs.children;
      const tabLabel = target.ariaLabel;

      for (let i = 0; i < tabList.length; i++) {
        tabList[i].classList.remove("on");
      }
      target.parentNode.classList.add("on");

      self.$tabConts.forEach(function (el) {
        el.classList.remove("on");
      });

      document.querySelector("#" + tabLabel).classList.add("on");
    },
  };

  $(document).ready(function () {
    pubUi.init();
  });
})();
// selectbox 컴포넌트
$(".selectbox-trigger").click(function (event) {
  event.stopPropagation();
  var $options = $(this).siblings(".selectbox-options");
  $(".selectbox-options").not($options).hide().attr("aria-hidden", "true");
  $options.toggle().attr("aria-hidden", function (i, attr) {
    return attr === "true" ? "false" : "true";
  });
  $(".selectbox-wrap>div .selectbox-trigger")
    .removeClass("active")
    .attr("aria-expanded", "false");
  $(this)
    .toggleClass("active")
    .attr("aria-expanded", function () {
      return $(this).hasClass("active") ? "true" : "false";
    });
  $options.css({ right: "0" }); // select-trigger 위치 동일하게 맞추기 위해
  $(".selectbox-options li.moclose-btn").hide();
});

$(".option").click(function (event) {
  event.stopPropagation();
  var selectedText = $(this).text();
  $(this)
    .closest(".selectbox-options")
    .hide()
    .attr("aria-hidden", "true")
    .siblings(".selectbox-trigger")
    .text(selectedText);
  $(this)
    .closest(".selectbox-options")
    .find(".option")
    .removeClass("active")
    .attr("aria-selected", "false");
  $(this).addClass("active").attr("aria-selected", "true");
  $(this)
    .closest(".selectbox-wrap>div")
    .find(".selectbox-trigger")
    .removeClass("active")
    .attr("aria-expanded", "false");
});

$(window)
  .resize(function () {
    if (window.innerWidth <= 1023) {
      $(".selectbox-trigger").click(function (event) {
        event.stopPropagation();
        $(".selectbox-overlay").show();
        $(".selectbox-options li.moclose-btn").show();
      });
      $(".option").click(function (event) {
        event.stopPropagation();
        $(".selectbox-overlay").hide();
        $(".selectbox-options li.moclose-btn").hide();
      });
      $(".selectbox-options li.moclose-btn button").click(function (event) {
        event.stopPropagation();
        $(this)
          .closest(".selectbox-wrap>div")
          .find(".selectbox-trigger")
          .removeClass("active");
        $(this).closest(".selectbox-options").hide();
        $(".selectbox-overlay").hide();
      });
    } else {
      $(".selectbox-trigger").click(function () {
        $(".selectbox-options li.moclose-btn").hide();
      });
    }
  })
  .resize();
