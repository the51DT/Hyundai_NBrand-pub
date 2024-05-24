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

      // swiper 변수
    },
    bindEvents: function () {
      var self = this;

      //문의하기
      self.$container.on("click", function () {
        var mode = self.$reqBtn.attr("data-name");
        //console.log(mode);
        self.requestQnaReadPop({ mode: mode });
      });

      for (var i = 0; i < self.$tabList.length; i++) {
        self.$tabList[i].addEventListener("click", function (e) {
          e.preventDefault();
          pubUi.tabBtnEvent(e);
        });
      }
    },
    swiperSlideEvent: function () {
      const progressCircle = document.querySelector(".autoplay-progress svg");
      const progressContent = document.querySelector(".autoplay-progress span");
      var swiper = new Swiper(".ty01Swiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 30000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        on: {
          autoplayTimeLeft(s, time, progress) {
            progressCircle.style.setProperty("--progress", 1 - progress);
            progressContent.textContent = `${Math.ceil(time / 1000)}s`;
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
