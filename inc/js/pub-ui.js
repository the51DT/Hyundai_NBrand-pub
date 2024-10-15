var pubUi = {
  init: function () {
    var self = this;
    self.settings();
    self.bindEvents();
    self.swiperSlideEvent();
    self.masonryLayout();
    btnNaviCheck();

    if ($(".evt-map-wrap").length > 0) {
      scrollToCenter(".list-content.active .event-box .evt-map-img");
    }

    if ($(".ty01Swiper:not(.banner-swiper)") != undefined && $(".ty01Swiper:not(.banner-swiper)").length > 0) {
      var typeChk = "";
      if ($(".ty01Swiper:not(.banner-swiper) .swiper-slide-active").find("img").length) {
        typeChk = "image";
        // 1015 추가 : 이미지 케이스 1개일 경우, bottom 영역 비노출 - S
        if ($(".ty01Swiper:not(.banner-swiper) .swiper-slide").length === 1) {
          $(".ty01Swiper:not(.banner-swiper) .swiper-bottom-wrap").hide();
        } else {
          $(".ty01Swiper:not(.banner-swiper) .swiper-bottom-wrap").show();
        }
        // 1015 추가 - E
      } else {
        typeChk = "video";
        $(".ty01Swiper:not(.banner-swiper) .swiper-slide-active")
          .find("video")
          .get(0)
          .addEventListener("loadeddata", function () {
            self.videoBulletChk(".ty01Swiper:not(.banner-swiper)", 0, typeChk);
          });
      }
      self.videoBulletChk(".ty01Swiper:not(.banner-swiper)", 0, typeChk);
    }
  },
  settings: function () {
    var self = this;
    self.$container = $(".container");

    // tab 관련 변수
    self.$tabs = document.querySelectorAll(".tabs-wrap .tabs");
    self.$tabList = document.querySelectorAll(".tabs li");

    // button
    self.$btnPlay = $(".btn-play");
    self.$btnSound = $(".btn-sound");
    self.$btnReset = $(".btn-reset");

    // search
    self.$searchBox = document.querySelector(".search-input-box");

    // swiper
    self.swiper2;
    self.swiper3;
    self.swiper4;
    self.typeChk = $(".ty01Swiper").find(".swiper-slide video");

    // 스와이퍼 비디오관련
    self.video = "";
    self.pauseFlag = 0;
    self.timer = "";
    self.maxVideoW = 84; //pagination width 값
    self.dataSecond = 0;
    self.curTime = 0;
    self.per = 0;
    self.typeIdx = 0;
    // self.perWrap = 0;
  },
  bindEvents: function () {
    var self = this;

    // 탭버튼 수정
    $(".tabs li").on("click", function (e) {
      e.preventDefault();
      var target = e.target;
      var tabContainer = $(this).closest(".tab-container");
      tabBtnEvent(target, tabContainer);
    });

    // 스와이퍼 재생 버튼 클릭시, 동영상 재생, 정지
    $(".btn-play").on("click", function (e) {
      e.preventDefault();
      var targetSwiper = $(this).closest(".swiper");
      var videoChk = targetSwiper.find(".swiper-slide-active video");
      // var swiperIndex = targetSwiper.find(".swiper-slide-active").index();

      if (targetSwiper.hasClass("ty01Swiper")) {
        if ($(this).hasClass("on")) {
          // console.log("정지버튼 클릭!");
          $(this).removeClass("on");
          $(this).attr("title", "영상 일시정지 상태, 재생 하기");
          if (videoChk.length > 0) {
            videoChk[0].pause();
            videoChk[0].currentTime = 0;
            stopTimer("", "video");
          } else {
            stopTimer("", "image");
          }
        } else {
          // console.log("재생버튼 클릭!");
          $(this).addClass("on");
          $(this).attr("title", "영상 재생 상태, 일시정지 하기");
          if (videoChk.length > 0) {
            videoChk[0].play();
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              self.typeIdx,
              "video"
            );
          } else {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              self.typeIdx,
              "image"
            );
          }
        }
      } else {
        if ($(this).hasClass("on")) {
          // console.log("정지버튼 클릭!");
          $(this).removeClass("on");
          $(this).attr("title", "영상 일시정지 상태, 재생 하기");
          targetSwiper[0].swiper.autoplay.stop();
        } else {
          // console.log("재생버튼 클릭!");
          $(this).addClass("on");
          $(this).attr("title", "영상 재생 상태, 일시정지 하기");
          targetSwiper[0].swiper.autoplay.start();
        }
      }
    });

    // 스와이퍼 소리 버튼 클릭시, 음소거 / 음소거 해제
    self.$btnSound.on("click", function (e) {
      e.preventDefault();
      var targetSwiper = $(this).closest(".swiper");

      if (self.$btnSound.hasClass("on")) {
        // console.log("소리 끄기 버튼 클릭!");
        self.$btnSound.removeClass("on");
        self.$btnSound.attr("title", "현재 사운드 꺼진 상태, 사운드 켜기");
        targetSwiper.find("video").prop("muted", true);
      } else {
        // console.log("소리 켜기버튼 클릭!");
        self.$btnSound.addClass("on");
        self.$btnSound.attr("title", "현재 사운드 켜진 상태, 사운드 끄기");
        targetSwiper.find("video").prop("muted", false);
      }
    });

    // 리셋 버튼 클릭시,
    self.$btnReset.on("click", function (e) {
      e.preventDefault();
      var tagList = $(this)
        .closest(".search-container")
        .find(".tag-list-wrap .tag-list");

      if (self.$searchBox != null) {
        self.$searchBox.querySelector("input").value = "";
        self.$searchBox.classList.remove("on");
        self.$searchBox.querySelector(".clear-text").style.display = "none";
      }
      // self.tagBtnEvent("", tagList, "reset"); 07.04 수정 : 태그 리셋 비활성화
    });

    // 검색 창 입력값 존재 시, 리셋 버튼 활성화
    if (self.$searchBox != null) {
      self.$searchBox.querySelector("input").oninput = function (e) {
        var searchBoxValue = e.target.value;
        if (searchBoxValue) {
          self.$searchBox.classList.add("on");
          self.$searchBox.querySelector(".clear-text").style.display = "block";
        } else {
          self.$searchBox.classList.remove("on");
          self.$searchBox.querySelector(".clear-text").style.display = "none";
        }
      };
    }

    // 태그 버튼 클릭시,
    $(".tag-list li label").click(function (e) {
      e.preventDefault();
      var tagList = $(this).closest(".tag-list-wrap").find(".tag-list");
      self.tagBtnEvent(e.target, tagList);
    });

    // 이벤트 레이아웃 + 버튼 클릭시,
    $(".event-box .btn-wrap.plus").click(function (e) {
      $(this).closest(".evt-map-wrap").addClass("active");
      $(this)
        .closest(".evt-map-wrap")
        .find(".evt-map-img.active .evt-map-default-box > button")
        .hide();
      $(this)
        .closest(".evt-map-wrap")
        .find(".evt-map-img.active .evt-map-active-box > button")
        .show();
    });

    // 이벤트 레이아웃 - 버튼 클릭시,
    $(".event-box .btn-wrap.minus").click(function (e) {
      $(this).closest(".evt-map-wrap").removeClass("active");
      $(this)
        .closest(".evt-map-wrap")
        .find(".evt-map-img.active .evt-map-default-box > button")
        .show();
      $(this)
        .closest(".evt-map-wrap")
        .find(".evt-map-img.active .evt-map-active-box > button")
        .hide();
    });

    $(".tit-btn-wrap button").click(function (e) {
      $(".tit-btn-wrap button").attr("aria-pressed", "false");
      $(".tit-btn-wrap button").removeClass("on");

      $(this).addClass("on");
      if ($(this).attr("aria-pressed") == "false") {
        $(this).attr("aria-pressed", "true");
      } else {
        $(this).attr("aria-pressed", "false");
      }
    });

    $(".rending-wrap > li button").on("click", function (e) {
      e.preventDefault();
      var scrollTarget = $(this).data("scroll");

      pubUi.pageScrollChk(scrollTarget);
    });

    $("#topBtn").on("click", function () {
      $("body").animate({ scrollTop: 0 }, 300);
    });
    if ($(".onlyOneSwiper .swiper-slide").length === 1) {
      $(".onlyOneSwiper .swiper-slide .swiper-status-wrap .btn-wrap").hide();
      // console.log($(".onlyOneSwiper .swiper-status-wrap .btn-wrap").hide());
      $(
        ".nflmain_wrap .content-item03 .banner-box .swiper-container .swiper"
      ).addClass("onlyone-swiper");
    }

    $(".lang-btn").on("click", function () {
      webAccessibilityChk();
    });

    // selectbox keyboard 제어 옵션 엔터키 클릭 시,
    $(".selectbox-options li.option").keydown(function (e) {
      if (e.keyCode == 13) {
        handleOptionClick(event);
      }
    });

    $(".tag-list li input").keydown(function (e) {
      var parentSelector = "";
      if ($(".search-container .tag-list").length > 0) {
        parentSelector = $(this).closest(".search-container");
      } else if ($(".wrap-inner-category").length > 0) {
        parentSelector = $(this).closest(".wrap-inner-category");
      }
      if (e.keyCode == 13) {
        keydownTagEvent(parentSelector, $(this));
      }
    });

    if (pubUi.windowSize()) {
      //pc
    } else {
      //mobile
      // $(".ty04Swiper .swiper-slide").on("focusin mouseenter touchstart", function () {
      //   $(this).siblings().find(".card_more").attr("aria-hidden", true);
      //   $(this).siblings().find(".card_more").attr("aria-expanded", "false");
      //   $(this).siblings().find(".card_more").css("display", "none");
      // });

      $(".ty04Swiper .swiper-slide .btn-arrow-down").on("click", function () {
        activeCardMoreBtn($(this));
      });
    }
  },
  swiperSlideEvent: function () {
    var self = this;

    var swiper1 = new Swiper(".ty01Swiper:not(.banner-swiper)", {
      slidesPerView: 1,
      watchOverflow: true, //pagination 1개 일 경우, 숨김
      initialSlide: 0,
      touchRatio: 1, // 드래그 X : 0 , 드래그 O : 1
      loop: true,
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".ty01Swiper .swiper-button-next",
        prevEl: ".ty01Swiper .swiper-button-prev",
      },

      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        init: function () {
          $(".swiper-pagination-custom .swiper-pagination-bullet").html(
            "<i class='seek-bar' aria-hidden='true'></i>"
          );
        },
        afterInit: function () {
          swiperCtrlInert($(".ty01Swiper:not(.banner-swiper)"));
        },
        slideChangeTransitionEnd: function () {
          self.typeIdx = this.realIndex;
          var currentIndex = swiper1.activeIndex;

          $(".ty01Swiper:not(.banner-swiper) video").each(function () {
            var videoIdEach = $(this).attr("id");
            var videoAll = document.querySelector(`#${videoIdEach}`);
            videoAll.currentTime = 0;
            videoAll.pause();
          });
          if (
            $(".ty01Swiper:not(.banner-swiper) .swiper-slide")[
              currentIndex
            ].querySelector("video")
          ) {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              this.realIndex,
              "video"
            );
          } else {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              this.realIndex,
              "image"
            );
          }

          swiperCtrlInert($(".ty01Swiper:not(.banner-swiper)"));
        },
      },
    });

    var swiper1_1 = new Swiper(".banner-swiper", {
      slidesPerView: 1,
      watchOverflow: true, //pagination 1개 일 경우, 숨김
      initialSlide: 0,
      touchRatio: 1, // 드래그 X : 0 , 드래그 O : 1
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".ty01Swiper .swiper-button-next",
        prevEl: ".ty01Swiper .swiper-button-prev",
      },
      breakpoints: {
        360: {
          //touchRatio: 1, // 드래그 O
        },
        768: {
          //touchRatio: 1, // 드래그 O
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".banner-swiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".banner-swiper"));
        },
      },
    });    

    swiper2SlideEvt(); //swiper2 이벤트 실행
    swiper4SlideEvt(); //swiper4 이벤트 실행
    swiper12SlideEvt(); //swiper12 이벤트 실행

    var swiper3 = new Swiper(".ty03Swiper.rankswiper", {
      slidesPerView: 3,
      spaceBetween: 24,
      loop: true,
      watchOverflow: true,
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".ty03Swiper .swiper-button-next",
        prevEl: ".ty03Swiper .swiper-button-prev",
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        slideChangeTransitionStart: function () {
          if ($(".ty03Swiper .profile-open").length) {
            NbrandUI.profileCloseOption($(".ty03Swiper .club-popup"));
          }
        },
      },
      breakpoints: {
        360: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        400: {
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

    var swiper5 = new Swiper(".ty05Swiper", {
      slidesPerView: "auto",
      spaceBetween: 4,
      slidesOffsetAfter: 24,
      navigation: {
        nextEl: ".ty05Swiper .swiper-button-next",
        prevEl: ".ty05Swiper .swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {},
    });
    var swiper6 = new Swiper(".onlyOneSwiper", {
      slidesPerView: 1,
      spaceBetween: 80,
      centeredSlides: true,
      loop: true,
      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: false,
      // },
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      navigation: {
        nextEl: ".onlyOneSwiper .swiper-button-next",
        prevEl: ".onlyOneSwiper .swiper-button-prev",
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      breakpoints: {
        360: {
          slidesPerView: 1,
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
        afterInit: function () {
          swiperCtrlInert($(".onlyOneSwiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".onlyOneSwiper"));
        },
      },
    });
    var swiper7 = new Swiper(".editor-box-wrap .swiper-container", {
      slidesPerView: 1,
      spaceBetween: 80,
      centeredSlides: true,
      touchRatio: 0,
      pagination: {
        el: ".editor-box-wrap .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".editor-box-wrap .swiper-button-next",
        prevEl: ".editor-box-wrap .swiper-button-prev",
      },
      breakpoints: {
        360: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        768: {
          spaceBetween: 12,
        },
        1024: {
          spaceBetween: 80,
        },
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".editor-box-wrap .swiper-container"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".editor-box-wrap .swiper-container"));
        },
      },
    });
    var swiper8 = new Swiper(".configurator_list_swiper", {
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: ".configurator_list_swiper .swiper-button-next",
        prevEl: ".configurator_list_swiper .swiper-button-prev",
      },
      breakpoints: {
        1024: {
          slidesPerView: 2,
        },
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".configurator_list_swiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".configurator_list_swiper"));
        },
      },
    });
    var swiper10 = new Swiper(".wrc_swiper", {
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: ".wrc_swiper .swiper-button-next",
        prevEl: ".wrc_swiper .swiper-button-prev",
      },
      pagination: {
        el: ".wrc_swiper .swiper-pagination-custom",
        clickable: true,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".wrc_swiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".wrc_swiper"));
        },
      },
    });
    var swiper11 = new Swiper(".merchandise_swiper", {
      slidesPerView: 1,
      centeredSlides: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".merchandise_swiper .swiper-button-next",
        prevEl: ".merchandise_swiper .swiper-button-prev",
      },
      pagination: {
        el: ".merchandise_swiper .swiper-pagination-custom",
        clickable: true,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "이전 슬라이드",
        nextSlideMessage: "다음 슬라이드",
        slideLabelMessage:
          "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
        paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
      },
      on: {
        afterInit: function () {
          swiperCtrlInert($(".merchandise_swiper"));
        },
        slideChangeTransitionEnd: function () {
          swiperCtrlInert($(".merchandise_swiper"));
        },
      },
    });
  },
  videoBulletChk: function (targetSwiper, targetIdx, type) {
    var self = this;
    if (!targetSwiper.length > 0) {
      return;
    }

    var slide = $(targetSwiper);
    var slideActive = slide.find(".swiper-slide-active");

    var videoId = slideActive.find(".video").attr("id");
    var video = document.querySelector(`#${videoId}`);
    // alert("d");
    stopTimer(video, type);
    if (slideActive) {
      startTimer(slide, video, self.maxVideoW, type, targetIdx);
    }
  },
  tagBtnEvent: function (e, list, param) {
    var listItem = list.find("li");

    //search input reset 클릭시, 하단 태그 초기화
    if (param == "reset") {
      for (var i = 0; i < listItem.length; i++) {
        listItem[i].classList.remove("on");
        listItem[i].children[0].checked = "false";
        listItem[i].children[1].dataset.check = false;
      }
    } else {
      var targetisChecked = e.dataset.check;
      var targetList = e.parentElement;

      if (list.hasClass("multi")) {
        if (targetisChecked == "true") {
          e.dataset.check = false;
          targetList.firstElementChild.checked = false;
          targetList.classList.remove("on");
        } else {
          e.dataset.check = true;
          targetList.firstElementChild.checked = true;
          targetList.classList.add("on");
        }
      } else {
        for (var i = 0; i < listItem.length; i++) {
          listItem[i].classList.remove("on");
          listItem[i].children[0].checked = "false";
          listItem[i].children[1].dataset.check = false;
        }

        if (targetisChecked == "false") {
          targetList.classList.add("on");
          targetList.children[0].checked = true;
          targetList.children[1].dataset.check = true;
        } else {
          targetList.classList.add("on");
          targetList.children[0].checked = true;
          targetList.children[1].dataset.check = true;
        }
      }
    }
  },
  masonryLayout: function () {
    const masonry_item = $(".masonry_item");
    if (masonry_item.length < 1) {
      return;
    }
    // const img = $(".card_thumbnail img");
    const row_gap = parseInt(24);
    masonry_item.each(function () {
      let _this = $(this);

      let scrHeight = parseInt(_this.find(".masonry_con").prop("scrollHeight"));
      _this.css("grid-row-end", "span " + (scrHeight + row_gap));
      _this.find(".card_thumbnail img").ready(function () {
        let scrHeight = parseInt(
          _this.find(".masonry_con").prop("scrollHeight")
        );
        _this.css("grid-row-end", "span " + (scrHeight + row_gap));
      });
    });
  },
  // masonrySet: function () {
  //   let scrHeight = parseInt(_this.find(".masonry_con").prop("scrollHeight"));
  //   _this.css("grid-row-end", "span " + (scrHeight + row_gap));
  // },
  textReset: function (el) {
    const btn = el.target.nextElementSibling;
    if (0 < el.target.value.length) {
      btn.classList.remove("visually-hidden");
      btn.addEventListener("click", () => {
        el.target.value = "";
        el.target.focus();
        btn.classList.add("visually-hidden");
      });
    } else {
      btn.classList.add("visually-hidden");
    }
  },
  windowSize: function () {
    var $win_W = window.innerWidth;
    return $win_W >= 1024 ? true : false;
  },
  pageScrollChk: function (dataScroll) {
    var contentItem = document.querySelectorAll(
      ".content-wrap [class*=content-item]"
    );
    var headerHeight = document.querySelector(".header-cont").offsetHeight;
    var navBarHeight = document.querySelector(".header-wrap").offsetHeight;
    var scrllNow = document.querySelector("body").scrollTop;
    var navHeight = headerHeight + navBarHeight;

    // var leftScrollData = $(this).offset().left;
    contentItem.forEach((evt, idx) => {
      if (contentItem[idx].querySelector(".blue-title")) {
        contentItem[idx].classList.add("active");
      }
      //contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성
    });

    var contentActiveItem = document.querySelectorAll(
      ".content-wrap [class*=content-item].active .blue-title"
    );

    contentActiveItem.forEach((evt, idx) => {
      contentActiveItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성

      if (evt.dataset.scroll == dataScroll) {
        //nav data-scroll과 값비교 후 동일 대상 체크
        var offsetTopVal =
          evt.getBoundingClientRect().top - navBarHeight - 150 + scrllNow;
        // alert(evt);
      }

      $("body").animate({ scrollTop: offsetTopVal }, 300);
    });
  },
  listContsActive: function (target) {
    var targetSwiper = $(target).parents(".swiper-slide");
    var targetData = targetSwiper.attr("data-content");
    var targetContent = $(".list-content[data-content=" + targetData + "]");

    // ty05Swiper, 슬라이드 클릭 시, active 처리
    targetSwiper.siblings().removeClass("active");
    targetSwiper.addClass("active");

    setTimeout(function () {
      document.querySelector(".ty05Swiper").swiper.update();
    }, 500);
    $(".list-content").removeClass("active");
    targetContent.addClass("active");

    contsItemGridSizeChk(); // jira ICTQMSCHE-6339 대응 : event guide에서 상단 스와이퍼 클릭 시, 해당 함수(contsItemGridSizeChk) 호출
    scrollToCenter(".list-content.active .event-box .evt-map-img");
  },
  overScroll: function (cl) {
    const slider = document.querySelectorAll(cl);
    if (!slider) return;
    slider.forEach((el) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      el.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      });

      el.addEventListener("mouseleave", () => {
        isDown = false;
      });

      el.addEventListener("mouseup", () => {
        isDown = false;
      });

      el.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - startX;
        el.scrollLeft = scrollLeft - walk;
      });
    });
  },
};
let resizeTimer = null;
$(window).resize(function () {
  clearTimeout(resizeTimer);
  deviceChk();
  resizeTimer = setTimeout(hasTagFunResize(), perforSlideMoveFun(), 10);
});
$(document).ready(function () {
  deviceChk();
  pubUi.init();
  $(window).on("resize", pubUi.masonryLayout);
  $(window).resize(() => DropdownFooter());
  DropdownFooter();
  $(".clear-text")
    .siblings('input[type="text"]')
    .on("propertychange change keyup paste input", pubUi.textReset);
  $(".selectbox-js").on("click", function () {
    $this = $(this);
    handleSelectboxClick(event);
  });
  $(".option-click").on("click", function () {
    handleOptionClick(event);
  });
  //hasTagFun();
  perforSlideMoveFun();
  footerScrollTop();
  modelsVideoPlay();
  configuratorEvent();
  pubUi.overScroll(".overScroll");
  pubUi.overScroll(".grid_mo_scroll");
  pubUi.overScroll(".configurator_list");
  pubUi.overScroll(".__bottom");
  pubUi.overScroll(".evt-map-img");
  pubUi.overScroll(".card-list");
  pubUi.overScroll(".txt-list-wrap");
  pubUi.overScroll(".header__event-wrap");
  pubUi.overScroll(".table-scrollx");
  pubUi.overScroll(".roundresult-wrap");
  pubUi.overScroll(".related-wrap .models-nofull-box");

  toggleFullscreen();

  btnNaviCheck();
  var ty02Swiper = $(".ty02Swiper");
  var ty04Swiper = $(".ty04Swiper");
  var ty12Swiper = $(".collection_swiper");
  var playBtn = $(".btn-play");
  var cardType01Box = $(".card_type01");

  $(window).resize(function () {
    if ($(window).innerWidth() < 1024) {
      if (ty02Swiper.length > 0) {
        for (var i = 0; i < ty02Swiper.length; i++) {
          ty02Swiper[i].swiper.destroy();
        }

        if (playBtn.hasClass("on")) {
          swiper2SlideEvt();
          ty02Swiper[0].swiper.autoplay.start();
        } else {
          swiper2SlideEvt();
          ty02Swiper[0].swiper.autoplay.stop();
        }
      }

      //07.29 추가
      if ($(".evt-map-wrap").length > 0) {
        scrollToCenter(".list-content.active .event-box .evt-map-img");
      }
    }

    if ($(window).innerWidth() < 600) {
      if ($(".content-item04 .grid_3").hasClass("center")) {
        $(".content-item04 .grid_3.center").removeClass("center");
      }
      if ($(".content-item07 .grid_3").hasClass("center")) {
        $(".content-item07 .grid_3.center").removeClass("center");
      }
    } else {
      contsItemGridSizeChk();
    }

    // 08.09 추가 - EP010101 (N Festival 메인에 resize 시 발생하는 Next races 영역 결함 처리 위함 - destory 후 ty04Swiper 재호출)
    if (ty04Swiper.length > 0) {
      for (var i = 0; i < ty04Swiper.length; i++) {
        ty04Swiper[i].swiper.destroy();
      }
      swiper4SlideEvt();
    }

    // 09.25 추가 - BR050101 (운영 요구사항 처리 : resize할때 swiper 깨지는 문제 방지하기위해 destory 후 재호출 되도록 수정)
    if (ty12Swiper.length > 0) {
      for (var i = 0; i < ty12Swiper.length; i++) {
        ty12Swiper[i].swiper.destroy();
      }
      swiper12SlideEvt();
    }

    btnNaviCheck();
    if (
      $(".navigation_bar-wrap .navigation-item02").length > 0 &&
      $(window).width() < 1024
    ) {
      $(".wrap .content-area").css("padding-top", "96px");
    } else if (
      $(".btn-navi-wrap.mo-only button").length == 2 &&
      $(window).width() < 1024
    ) {
      $(".wrap .content-area").css("padding-top", "88px");
    } else if ($(".navigation_bar-wrap").length > 0) {
      $(".wrap .content-area").css("padding-top", "48px");
    } else {
      $(".wrap .content-area").css("padding-top", "0");
    }
  });

  // 07.03 추가 - models-wrap 클래스 존재하는 페이지 일 경우, 하단 img loading 속성 제거
  if ($(".content-wrap").hasClass("models-wrap")) {
    var contsImages = document.querySelectorAll(
      ".content-wrap .content-area img"
    );
    for (var i = 0; i < contsImages.length; i++) {
      contsImages[i].removeAttribute("loading");
    }
  }

  // 09.25 추가 - BR050101 (운영 요구사항 처리 : 현대 N 컬렉션 영역 탭 눌러서 컨텐츠 변경 시 좌/우 네비게이션 버튼 간헐적으로 사라졌다가 나타남)
  $(".merchandise-wrap .collectiontab-wrap .tab-head .tabs li").on(
    "click",
    function () {
      for (var i = 0; i < ty12Swiper.length; i++) {
        ty12Swiper[i].swiper.destroy();
      }
      swiper12SlideEvt();
    }
  );

  // 08.20 수정 : 함수 형태로 구조 변경
  contsItemGridSizeChk();

  // 09.27 수정 : 웹접근성 처리용
  webAccessibilityChk();
  webAccessAddTabindex();

  // 09/29 추가 : dropdown-menu 관련 label 추가
  inputLabelToTitle(
    ".dropdown-menu input[type = checkbox], .dropdown-menu input[type = radio]",
    "p"
  );
  // 10/02 추가 : 팝업 input title, label 수정
  inputLabelToTitle(".popup .wrap-radio input", "span");
  // 10/02 추가 : 회원가입(join) 체크박스 input title, label 수정
  inputLabelToTitle(".join_form_checkbox input", "span");
  // 10/02 추가 : 검색 영역 하단 태그 라디오 input title, label 수정
  inputLabelToTitle(".search-container .tag-list input", "");
});

function btnNaviCheck() {
  //nav-bar 버튼 갯수에 따른 노출형식 처리
  var $navBarWrap = $(".navigation_bar-wrap");
  var $navItem03 = $navBarWrap.find(".navigation-item03");
  var $btnNaviBtnPC = $navItem03.find(".btn-navi-wrap:not(.mo-only)");
  var $btnNaviBtnMO = $navBarWrap.find(".btn-navi-wrap.mo-only");
  var $btnNaviBox = $navItem03.find(".btn-navi-wrap:not(.mo-only) .btn-box");
  var $sharingBtn = $(".sharing-btn");

  if (pubUi.windowSize()) {
    //pc
    if ($btnNaviBox.find(".btn").length > 0 || $btnNaviBox.find(".btn")) {
      $btnNaviBox.show();
    }
    $sharingBtn.html("Sharing");
  } else {
    //mobile
    if ($btnNaviBox.find(".btn").length > 1) {
      $btnNaviBox.hide();
      $btnNaviBtnMO.show();
    } else {
      $btnNaviBtnMO.hide();
      $btnNaviBox.show();
    }
    $sharingBtn.html("");
  }
}

// ty02Swiper swiper 이벤트 분리
function swiper2SlideEvt() {
  // console.log("swiper2 이벤트 실행");
  // alert("d");
  var slideLenth = $(".ty02Swiper .swiper-slide").length;
  var ty02SwiperPlayBtn = $(".ty02Swiper .swiper-status-wrap .btn-play");
  var autoplayVal = "";

  // 08.09 추가 : 재생 버튼 여부에 따라, autoplay 값 다르게 적용
  if (ty02SwiperPlayBtn.length > 0) {
    //재생 버튼 있는 ty02Swiper 케이스
    autoplayVal = {
      delay: 3000,
      disableOnInteraction: false,
    };
  } else {
    //재생 버튼 없는 ty02Swiper 케이스
    autoplayVal = false;
  }

  // 08.07 수정 : jira 422 대응 : 3개보다 클 경우 loop:true 실행 -> 3개미만일 때 결함 체크하기 위함/ 3개 이하 컨텐츠일시 loop가 true상태로 적용되면 autoplay 안되는 문제 있어 3개보다 클 경우 loop 적용되도록 수정하였음
  if (slideLenth >= 4) {
    loopVal = true;
  } else {
    loopVal = false;
  }

  // swiper-slide 배너 1개 이하일 경우 재생/멈춤 버튼 삭제
  if (slideLenth < 2) {
    $(".ty02Swiper .btn-play").hide();
  }

  // if ($(".ty02Swiper .swiper-slide").length == 3) {
  //   console.log($(".ty02Swiper .swiper-slide:first-child").html());
  //   $(".ty02Swiper .swiper-wrapper").append(
  //     '<div class="swiper-slide">' +
  //       $(".ty02Swiper .swiper-slide:first-child").html() +
  //       "</div>"
  //   );
  // }
  self.swiper2 = new Swiper(".ty02Swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: loopVal, // 08.07 수정
    autoplay: autoplayVal,
    coverflowEffect: {
      rotate: 0, //각도
      // stretch: -80, //간격
      // depth: 0, // z축 깊이
      // modifier: 0,
      scale: 0.87, //배율
      slideShadows: false, //그림자
    },
    pagination: {
      el: ".swiper-pagination-custom",
      clickable: true,
    },
    navigation: {
      nextEl: ".ty02Swiper .swiper-button-next",
      prevEl: ".ty02Swiper .swiper-button-prev",
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "이전 슬라이드",
      nextSlideMessage: "다음 슬라이드",
      slideLabelMessage:
        "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
      paginationBulletMessage: "{{index}}번째 슬라이드로 가기",
    },
    breakpoints: {
      280: {
        effect: "slide",
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      768: {
        effect: "slide",
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      1023: {
        effect: "slide",
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      1269: {
        effect: "coverflow",
        slidesPerView: "auto",
        spaceBetween: 12,
      },
      1399: {
        effect: "coverflow",
        slidesPerView: "auto",
        spaceBetween: 12,
      },
    },
    on: {
      afterInit: function () {
        swiperCtrlInert($(".ty02Swiper"));
      },
      slideChangeTransitionEnd: function () {
        swiperCtrlInert($(".ty02Swiper"));
      },
    },
  });
}

// ty04Swiper swiper 이벤트 분리
function swiper4SlideEvt() {
  // console.log("swiper4 이벤트 실행");
  var swiper4Wrapper = $(".ty04Swiper .swiper-wrapper").innerWidth();
  var raceBoxWidth = $(".next-race-box").outerWidth();
  var leftSpaceVal = "";

  if (window.innerWidth > 1799) {
    leftSpaceVal = Number((raceBoxWidth - 1440) / 2);
  } else {
    leftSpaceVal = Number((raceBoxWidth - swiper4Wrapper) / 2);
    if (leftSpaceVal < 80) {
      leftSpaceVal = 80;
    }
  }

  self.swiper4 = new Swiper(".ty04Swiper", {
    slidesPerView: "auto",
    spaceBetween: 24,
    observer: true,
    observeParents: true,
    slidesOffsetBefore: leftSpaceVal,
    navigation: {
      nextEl: ".ty04Swiper .swiper-button-next",
      prevEl: ".ty04Swiper .swiper-button-prev",
    },
    breakpoints: {
      280: {
        slidesPerView: "auto",
        spaceBetween: 12,
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
      },
      360: {
        slidesPerView: "auto",
        spaceBetween: 12,
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
      },
      1024: {
        slidesPerView: "auto",
        spaceBetween: 24,
        slidesOffsetBefore: leftSpaceVal,
        slidesOffsetAfter: 80,
      },
      1280: {
        slidesPerView: "auto",
        spaceBetween: 24,
        slidesOffsetBefore: leftSpaceVal,
        slidesOffsetAfter: 80,
      },
      2100: {
        slidesPerView: "auto",
        spaceBetween: 24,
        slidesOffsetBefore: leftSpaceVal,
        slidesOffsetAfter: 80,
      },
    },
    on: {
      afterInit: function () {
        // webAccessAddTabindex();
      },
    },
  });
}

// N Collection collection Swiper 분리
function swiper12SlideEvt() {
  var swiper12 = new Swiper(".collection_swiper", {
    slidesPerView: 1.15,
    spaceBetween: 24,
    watchOverflow: true,
    // centeredSlides: true,
    // slidesOffsetBefore: 24,
    // slidesOffsetAfter: 24,
    pagination: {
      el: ".collection_swiper .swiper-pagination-custom",
      clickable: true,
    },
    navigation: {
      nextEl: ".collection_swiper .swiper-button-next",
      prevEl: ".collection_swiper .swiper-button-prev",
    },
    breakpoints: {
      360: {
        slidesPerView: 1.13,
        spaceBetween: 12,
        // slidesOffsetBefore: 24,
        // slidesOffsetAfter: 24,
        centeredSlides: true,
      },
      400: {
        slidesPerView: 1.1,
        spaceBetween: 12,
        // slidesOffsetBefore: 24,
        // slidesOffsetAfter: 24,
        centeredSlides: true,
      },
      550: {
        slidesPerView: 1.07,
        spaceBetween: 12,
        // slidesOffsetBefore: 24,
        // slidesOffsetAfter: 24,
        centeredSlides: true,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
        // slidesOffsetBefore: 0,
        // slidesOffsetAfter: 0,
      },
    },
  });
}

// [Start] : selectbox 컴포넌트
function handleSelectboxClick(event) {
  // event.stopPropagation();
  var $trigger = $(event.target).closest(".selectbox-trigger");
  var $options = $trigger.siblings(".selectbox-options");
  if ($this.parents(".dropdown-menu").length) {
    $(".dropdown-menu").addClass("non-sticky");
  }
  $(".selectbox-options").not($options).hide().attr("aria-hidden", "true");
  $(".selectbox-trigger")
    .not($trigger)
    .removeClass("active")
    .attr("aria-expanded", "false");

  $options.toggle().attr("aria-hidden", function (i, attr) {
    return attr === "true" ? "false" : "true";
  });

  $trigger
    .toggleClass("active")
    .focus()
    .attr("aria-expanded", function () {
      return $(this).hasClass("active") ? "true" : "false";
    });

  if ($trigger[0].classList.contains("selectbox-left")) {
    $options.css({ left: "0" });
  } else {
    $options.css({ right: "0" });
  }

  function moSelectSize() {
    if (window.innerWidth <= 1023) {
      if ($options.is(":visible")) {
        $(".selectbox-options").each(function () {
          dataBtn = $(this).find(".moclose-btn");
          $(this).find(".moclose-btn").remove();
          $(this).append(dataBtn);
        });
        $(".selectbox-options .moclose-btn").show();
        $(".selectbox-overlay").show();
        targetFocus = $options;
        Nbrand.uiFocusTab({
          selector: targetFocus,
          type: "hold",
        });
        NbrandUI.focusNonout(targetFocus);
      } else {
        $(".selectbox-overlay").hide();
        $(".selectbox-options .moclose-btn").hide();
      }
      $(".selectbox-options .moclose-btn button").click(function (event) {
        event.stopPropagation();

        if ($this.parents(".dropdown-menu").length) {
          $(".dropdown-menu").removeClass("non-sticky");
        }
        $(this)
          .closest(".selectbox-wrap>div")
          .find(".selectbox-trigger")
          .removeClass("active")
          .focus(); // close 버튼 클릭 시 모든 trigger의 active가 제거
        $(this)
          .closest(".selectbox-wrap>div")
          .find(".selectbox-options")
          .attr("aria-hidden", "true");
        $(this).closest(".selectbox-options").hide();
        $(".selectbox-overlay").hide();

        // targetFocus = $options;
        NbrandUI.focusNonoutReset(targetFocus);
        targetFocus.find(".ui-fctab-s").remove();
        targetFocus.find(".ui-fctab-e").remove();
      });
    } else {
      $(".selectbox-options .moclose-btn").hide();
      $(".selectbox-overlay").hide();
    }
  }
  moSelectSize();
  $(window).resize(function () {
    moSelectSize();
  });
  // .resize();
}

function handleOptionClick(event) {
  event.stopPropagation();
  if ($this.parents(".dropdown-menu").length) {
    $(".dropdown-menu").removeClass("non-sticky");
  }
  var $selectboxWrap = $(event.target).closest(".selectbox-wrap");
  var selectedText = $(event.target).text();
  // select-type04 클래스(아이콘만 존재하는 경우의 타입)가 없는 경우에만 버튼 텍스트 변경
  if (!$selectboxWrap.hasClass("select-type04")) {
    $(event.target)
      .closest(".selectbox-options")
      .hide()
      .attr("aria-hidden", "true")
      .siblings(".selectbox-trigger")
      .text(selectedText);
  } else {
    $(event.target)
      .closest(".selectbox-options")
      .hide()
      .attr("aria-hidden", "true");
  }
  function moOptionSize() {
    if (window.innerWidth <= 1023) {
      // alert("d")
      $(".selectbox-overlay").hide();
      $(".selectbox-options li.moclose-btn").hide();
      targetFocus = $(event.target);
      NbrandUI.focusNonoutReset(targetFocus);
      targetFocus.closest(".selectbox-options").find(".ui-fctab-s").remove();
      targetFocus.closest(".selectbox-options").find(".ui-fctab-e").remove();
    }
  }
  moOptionSize();
  $(window).resize(function () {
    moOptionSize();
  });
  $(event.target)
    .closest(".selectbox-options")
    .find(".option")
    .not(event.target)
    .removeClass("active")
    .attr("aria-selected", "false");
  $(event.target).addClass("active").attr("aria-selected", "true");
  $(event.target)
    .closest(".selectbox-wrap>div")
    .find(".selectbox-trigger")
    .removeClass("active")
    .attr("aria-expanded", "false")

  if ($selectboxWrap.hasClass("evtLayout-type")) {
    var option1 = $(
      ".list-content.active .selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options"
    ).find(".option-click.active");

    var optionDataType = $(
      ".list-content.active .selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options"
    )
      .find(".option-click.active")
      .data("type");

    var evtMapWrap = $(".list-content.active .evt-map-wrap");

    for (var i = 0; i < evtMapWrap.length; i++) {
      if (evtMapWrap[i].classList.contains("active") == false) {
        $(evtMapWrap[i]).addClass("active");
        $(evtMapWrap[i])
          .find(".evt-map-img .evt-map-default-box > button")
          .hide();
        $(evtMapWrap[i])
          .find(".evt-map-img .evt-map-active-box > button")
          .show();
      }
    }
    evtImgMapChk(optionDataType, option1);
  }
}
// [End] : selectbox 컴포넌트

// event guide > event layout 함수
function evtImgMapChk(optionDataType, option1) {
  var evtMapWrap = $(".list-content.active .evt-map-wrap");
  var selectboxEvtLayout = $(
    ".list-content.active .selectbox-wrap.evtLayout-type"
  );
  var selectboxGroupItem = selectboxEvtLayout.find(".selectbox-group > div");

  var option1Idx = "";

  if (optionDataType == "") {
    optionDataType = $(
      ".list-content.active .selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options"
    )
      .find(".option-click.active")
      .data("type");
  }

  if (option1 == "") {
    option1Idx = $(
      ".list-content.active .selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options"
    )
      .find(".option-click.active")
      .index();
  } else {
    option1Idx = option1.index();
  }

  if (selectboxGroupItem.length > 0) {
    // 2번째 selectbox 존재할 경우,
    selectboxGroupItem.removeClass("on");
    for (var i = 0; i < selectboxGroupItem.length; i++) {
      var selectbox2Idx = $(selectboxGroupItem[i]).index() + 1;
      var activeOption = "";

      if (option1Idx == selectbox2Idx) {
        // selectbox 1번 선택한 인덱스값과 2번째 index값 비교
        $(selectboxGroupItem[i]).addClass("on"); // 1번째 선택한 인덱스 값에 맞는 2번째 selectbox 활성화
      } else {
        $(selectboxGroupItem[i]).removeClass("on");
      }

      if ($(selectboxGroupItem[i]).hasClass("on")) {
        var selbox2Option = $(
          ".list-content.active .selectbox-group > div.on .selectbox-options .option"
        );
        for (var i = 0; i < selbox2Option.length; i++) {
          if ($(selbox2Option[i]).hasClass("active")) {
            activeOption = $(selbox2Option[i]).index();
            //console.log(activeOption);
          }
        }

        // 클래스 초기화
        evtMapWrap.removeClass("on");
        evtMapWrap.removeClass("active");
        evtMapWrap.find(".evt-map-img").removeClass("active");

        for (var i = 0; i < evtMapWrap.length; i++) {
          var mapDataType = Math.floor(evtMapWrap[i].dataset.type);
          if (mapDataType == optionDataType) {
            evtMapWrap[i].classList.add("on");
            evtMapWrap[i].classList.add("active");
            $(evtMapWrap[i])
              .find(".evt-map-img")
              .eq(activeOption - 1)
              .addClass("active");
          }
        }
      }
    }
  } else {
    // 1번째 selectbox만 존재할 경우,
    for (var i = 0; i < evtMapWrap.length; i++) {
      var mapDataType = Math.floor(evtMapWrap[i].dataset.type);
      if (mapDataType == optionDataType) {
        evtMapWrap[i].classList.add("on");
        evtMapWrap[i].classList.add("active");
        $(evtMapWrap[i]).find(".evt-map-img").addClass("active");
      } else {
        evtMapWrap[i].classList.remove("on");
        evtMapWrap[i].classList.remove("active");
        $(evtMapWrap[i]).find(".evt-map-img").removeClass("active");
      }
    }
  }

  scrollToCenter(".list-content.active .event-box .evt-map-img");
}

// 07.29 추가 : mobile 일 경우, 스크롤 가운데 위치하도록 적용
function scrollToCenter(el) {
  let $element = document.querySelector(el);
  let scrollFullWidth = $element.scrollWidth;
  let scrollClientWidth = $element.clientWidth;
  let calWidth = (scrollFullWidth - scrollClientWidth) / 2;

  //console.log(calWidth);
  if (pubUi.windowSize()) {
    // pc
    // console.log("pc");
  } else {
    // mobile
    $element.scrollLeft = calWidth;
  }
}

// 필터 컴포넌트 아코디언
const dropdownFilter = document.querySelectorAll(
  ".dropdown.centered .wrap-dropdown-selected"
);
dropdownFilter.forEach((filter) => {
  let filterScrollMove = 0;
  let gnbButtonH = 0;
  filter.addEventListener("click", function () {
    // alert(document.querySelectorAll(".btn-navi-wrap.mo-only").length);
    const heightBtn = document.querySelectorAll(".btn-navi-wrap.mo-only");
    if (heightBtn.length) {
      heightBtn.forEach((scrollH) => {
        gnbButtonH = scrollH.offsetHeight;
        document
          .querySelector(".dropdown.centered .dropdown-menu")
          .style.setProperty("----sticky", `${gnbButtonH}px`);
      });
      filterScrollMove = this.offsetTop - gnbButtonH - 48;
    }

    document.querySelector("body").scrollTo({
      top: filterScrollMove,
      behavior: "smooth",
    });
    const isExpanded = filter.getAttribute("aria-expanded") === "true";
    const dropdownMenu = filter.nextElementSibling; // 아코디언 트리거 버튼
    const dropdownFilterBtn = filter.parentElement; // 필터 드롭다운 트리거 버튼

    // 필터 오른쪽 화살표
    const btnRightArrFilter =
      filter.parentElement.querySelector(".icon-down-wh");
    btnRightArrFilter.classList.toggle("rotate", !isExpanded);

    // 아코디언 펼침
    filter.setAttribute("aria-expanded", String(!isExpanded));
    dropdownMenu.setAttribute("aria-hidden", String(isExpanded));
    dropdownMenu.classList.toggle("dropdown-on", !isExpanded);

    const detectCase2 = dropdownFilterBtn.classList.contains("centered"); // 필터 컴포넌트만
    const detectCase2_selectBtn = document.querySelector(
      ".dropdown.centered .wrap-dropdown-selected"
    ); // 필터 컴포넌트: 선택 버튼

    // if (detectCase2) {
    //   btnRightArrFilter.classList.toggle("rotate", !isExpanded);
    // }

    // 필터 모바일 대응
    const screenWidth = window.innerWidth;
    const backgroundEl = document.querySelector(
      ".dropdown.centered .wrap-dropdown-selected .icon-down-wh"
    );
    const filterBtn_icn1 = document.querySelector(
      ".dropdown.centered .wrap-dropdown-selected i.icon-control-bar"
    );
    const filterBtn_forDisplay = document.querySelector(
      ".dropdown.centered .wrap-dropdown-selected.dropdown-btn"
    );
    const filterBtn_forDisplayText = document.querySelector(
      ".dropdown.centered span.txt-type02"
    );

    if (detectCase2) {
      detectCase2_selectBtn.classList.toggle("dropdown-on");
      // 필터: 스크린 사이즈 대응
      // if (
      //   detectCase2_selectBtn.classList.contains("dropdown-on") &&
      //   screenWidth < 500
      // ) {
      //   // < 500
      //   filterBtn_forDisplayText.style.width = "100%";
      //   filterBtn_forDisplay.style.padding = "17px 40px";

      //   filterBtn_forDisplay.classList.toggle("bgwhite");
      //   filterBtn_icn1.style.display = "none";
      // }
      // if (
      //   detectCase2_selectBtn.classList.contains("dropdown-on") &&
      //   screenWidth > 500
      // ) {
      filterBtn_forDisplay.classList.toggle("bgred");
      // }

      if (!detectCase2_selectBtn.classList.contains("dropdown-on")) {
        filterBtn_forDisplay.classList.remove("bgred");
        filterBtn_forDisplay.classList.remove("bgwhite");
        filterBtn_forDisplayText.style.width = "auto";
        filterBtn_icn1.style.display = "flex";
      }
    }
  });
});

// 탭버튼 : 외부 접근 가능 하도록 실행함수로 변경
function tabBtnEvent(target, tabContainer) {
  // 빈 값일 경우, 예외처리
  if (target == "") {
    targets = $(".list-content.active .tabs li.on");
    for (var i = 0; i < targets.length; i++) {
      target = targets[i];
    }
  }

  if (tabContainer == "") {
    tabContainer = $(".list-content.active .tab-container");
  }

  const targetListItem = $(target.parentNode);
  const targetIdx = targetListItem.index();
  const tabLabel = target.getAttribute("aria-controls");
  const tabList = tabContainer.find(".tabs li");
  const tabConts = tabContainer.find(".tab-content");
  const contentItem = document.querySelector(
    ".content-item04.collectiontab-wrap"
  );

  if (tabLabel != null) {
    for (let i = 0; i < tabList.length; i++) {
      tabList[i].classList.remove("on");
    }

    for (let i = 0; i < tabConts.length; i++) {
      tabConts[i].classList.remove("on");
      tabList[i].querySelector("a").setAttribute("aria-selected", "false");
    }

    target.parentNode.classList.add("on");
    target.parentNode.querySelector("a").setAttribute("aria-selected", "true");
    targetListItem
      .closest(".tab-container")
      .find(".tab-content")
      [targetIdx].classList.add("on");
  }

  // BR050101 : Brand_N Merchandise tab 배경 때문에 추가
  if (contentItem) {
    contentItem.classList.remove(
      "tab01-bg",
      "tab02-bg",
      "tab03-bg",
      "tab04-bg",
      "tab05-bg"
    );
    if (tabLabel === "tab1-01") {
      contentItem.classList.add("tab01-bg");
    }
    if (tabLabel === "tab1-02") {
      contentItem.classList.add("tab02-bg");
    }
    if (tabLabel === "tab1-03") {
      contentItem.classList.add("tab03-bg");
    }
    if (tabLabel === "tab1-04") {
      contentItem.classList.add("tab04-bg");
    }
    if (tabLabel === "tab1-05") {
      contentItem.classList.add("tab05-bg");
    }
  }
}

// 드롭다운 아코디언
function dropdownAccordion() {
  const dropdownBtns = document.querySelectorAll(".dropdown .dropdown-trigger");
  if (!dropdownBtns) {
    return;
  }
  dropdownBtns.forEach((button) => {
    button.addEventListener("click", function () {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const dropdownMenu = button
        .closest(".dropdown")
        .querySelector(".dropdown-menu"); // 드롭다운 메뉴

      // (필터 제외한 모든) 아코디언 오른쪽 화살표
      const btnRightArr = button
        .closest(".dropdown")
        .querySelector(".dropdown-icon");

      // 아코디언 펼침
      button.setAttribute("aria-expanded", String(!isExpanded));
      dropdownMenu.classList.toggle("dropdown-on", !isExpanded);
      btnRightArr.classList.toggle("rotate", !isExpanded);
    });
  });
}
// 드롭다운(아코디언), 필터 컴포넌트: 리스트를 클릭할 시 상단 버튼에 클릭한 리스트의 텍스트를 반영
function selectOption(event, optionText) {
  event.preventDefault();
  const btnTxtWrap = document.querySelector(
    ".dropdown .wrap-dropdown-selected.dropdown-btn .dropdown-btn-title span.text"
  );
  btnTxtWrap.innerText = optionText;
}
// 드롭다운(아코디언), 필터 컴포넌트 끝

// 드롭다운(아코디언) 02 시작
// 기획서, 시안에 없어 임의로 다중 토글 적용
function DropdownFooter() {
  if (window.innerWidth < 1024) {
    // resize 때문에 off 한 번 해주고 click 이벤트
    $(".dropdown.inMobile .accor02-wrap .accor02-header")
      .off("click")
      .on("click", function () {
        const accor02List = $(this).siblings("ul");
        accor02List.toggleClass("dropdown-on");
        if (accor02List.hasClass("dropdown-on")) {
          $(".footer-list-area .icon-down-wh").css(
            "transform",
            "rotate(180deg)"
          );
          $(this).css("border-bottom", "none");
        } else {
          $(".footer-list-area .icon-down-wh").css("transform", "rotate(0deg)");
          $(this).css("border-bottom", "1px solid #333");
        }
        const expanded = accor02List.hasClass("dropdown-on") ? "true" : "false";
        $(this).attr("aria-expanded", expanded);
      });
  }
}
// 드롭다운(아코디언) 02 끝
// 드롭다운(아코디언), 필터 컴포넌트 끝

// 모델 팝업 내 동영상 제어 함수 시작
document.addEventListener("DOMContentLoaded", () => {
  const chkPopupOpened = document.querySelectorAll(
    ".popup.model-popup.forModel"
  );

  //  MD010101t02P01,MD010101t02P02,MD010101t02P03 내 다중 영상 제어 함수 시작
  function ControlMultiVideo() {
    const videoBtn_multi = document.querySelectorAll(
      ".popup .wrap-video-func .box-video button"
    );

    videoBtn_multi.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nearVideo = btn.previousElementSibling;
        const iconInBtn = btn.querySelector(
          ".popup .wrap-video-func .box-video button span.btn-icon24"
        );

        if (nearVideo.paused) {
          nearVideo.play();
          iconInBtn.classList.remove("icon-play-wh");
          iconInBtn.classList.add("icon-pause-wh");
          btn.setAttribute("title", "영상 재생 상태, 일시정지 하기");
        } else {
          nearVideo.pause();
          iconInBtn.classList.remove("icon-pause-wh");
          iconInBtn.classList.add("icon-play-wh");
          btn.setAttribute("title", "영상 일시정지 상태, 재생 하기");
        }

        // 모델 팝업이 닫혔을 때 스크롤, 영상 초기화 처리
        const video = document.querySelectorAll(".popup video");
        const popCloseBtn = document.querySelector(
          ".popup-wrapper .btn-wrap button.btn-only-icon-notbg.pop-close"
        );
        const popupBody = document.querySelector(
          ".popup.model-popup.forModel .popup-body"
        );

        popCloseBtn.addEventListener("click", () => {
          {
            video.paused ? null : resetVideo();
          }
        });

        function resetVideo() {
          nearVideo.play();
          nearVideo.currentTime = 0;

          if (iconInBtn.classList.contains("icon-play-wh")) {
            iconInBtn.classList.remove("icon-play-wh");
            iconInBtn.classList.add("icon-pause-wh");
          }

          setTimeout(() => {
            popupBody.scrollTop = 0;
          }, 250);
        }
      });
    });
  }
  //ControlMultiVideo() 끝

  if (chkPopupOpened) {
    ControlMultiVideo();
  }
});
// MD010101t02P01,MD010101t02P02,MD010101t02P03 내 다중 영상 제어 함수 끝
// 모델 팝업 내 동영상 제어 함수 끝

// 푸터 스크롤 탑
function footerScrollTop() {
  $(".footer-top-btn").click(() => {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
}
// not($(this)).removeClass("ellipsis");
// [Start] : hashTag 말줄임
function hasTagFun() {
  $(".card-hashtag button").each(function (e) {
    var $set = $(this);
    var $setUl = $(this).parent();
    var cardConRightEdge = $setUl.outerWidth();
    var liRightEdge =
      $set.offset().left - $setUl.offset().left + $set.outerWidth(true);
    // $set.removeClass("ellipsis");

    if (liRightEdge >= cardConRightEdge) {
      $(this).addClass("ellipsis");
    }

    if ($setUl.offset().left + cardConRightEdge - $(this).offset().left < 20) {
      $(".card-hashtag button.ellipsis").nextAll().hide();
      if ($(this).hasClass("ellipsis")) {
        $(this).hide();
      }
    } else {
      $(".card-hashtag button.ellipsis").nextAll().hide();
    }
    //
  });
}

function hasTagFunResize() {
  $("div.card-hashtag button").removeClass("ellipsis").show();
  // alert("d");
  hasTagFun();
}
// [End] : hashTag 말줄임

// [Start] : CM040101 > unread 버튼 클릭 시 배경색, read 문구 변경
$(".unread-box .mynotice-btm>button.sm-txt-btn01").click(function () {
  $(this)
    .closest(".mynotice-box.unread-box")
    .attr("class", "mynotice-box read-box");
  $(this).replaceWith(
    "<p class='mynotice-read'>" +
      "<i class='btn-icon16 icon-check' aria-hidden='true'>" +
      "</i>" +
      "Read" +
      "</p>"
  );
});
// [End] : CM040101 > unread 버튼 클릭 시 배경색, read 문구 변경

//[Start] : CM040701 > 아코디언 토글
function toggleAboutMe() {
  var aboutMeArea = $(".des-toggle");
  var aboutMeAreaBtn = $(".mypage-community-des").find(".btn");
  var aboutMeAreaH = aboutMeArea.prop("scrollHeight");
  if (aboutMeAreaH > 45) {
    aboutMeArea.removeClass("rotate");
    aboutMeAreaBtn.show();
    aboutMeAreaBtn.off("click").on("click", function () {
      $(".des-toggle").toggleClass("rotate");
      $(this).children(".icon-down").toggleClass("rotate");
    });
  } else {
    aboutMeAreaBtn.hide();
  }
}

//[End] : CM040701 > 아코디언 토글

// [Start] : 풀스크린
function toggleFullscreen() {
  const toggleFullscreenBtn = document.querySelector(".toggleFullscreenBtn");
  if (toggleFullscreenBtn == null) {
    return;
  }
  const container = document.querySelector(".fullscreenContainer");

  toggleFullscreenBtn.addEventListener("click", (e) => {
    toggleFullScreen(container);
    container.classList.toggle("full");
  });

  // const fullscreen = (element) => {
  //   if (element.requestFullscreen) return element.requestFullscreen();
  //   if (element.webkitRequestFullscreen)
  //     return element.webkitRequestFullscreen();
  //   if (element.mozRequestFullScreen) return element.mozRequestFullScreen();
  //   if (element.msRequestFullscreen) return element.msRequestFullscreen();
  // };

  // const exitFullScreen = () => {
  //   if (document.exitFullscreen) return document.exitFullscreen();
  //   if (document.webkitCancelFullscreen)
  //     return document.webkitCancelFullscreen();
  //   if (document.mozCancelFullScreen) return document.mozCancelFullScreen();
  //   if (document.msExitFullscreen) return document.msExitFullscreen();
  // };

  function toggleFullScreen(element) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    } else if (document.mozFullScreenElement) {
      document.mozCancelFullScreen();
    } else if (document.msFullscreenElement) {
      document.msExitFullscreen();
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  }
}
// [End] : 풀스크린

// [Start] : MD010301t01 > 기획서 v0.18 p.68 AS-IS과 동일한 슬라이드 기능 적용 (AS-IS 그대로 사용 / 클래스만 변경)

let _viewType = "";
// alert(user);

function deviceChk() {
  let user = navigator.userAgent;
  if (user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1) {
    _viewType = "mobile";
  } else {
    _viewType = "web";
  }
}
function perforSlideMoveFun() {
  var _$this = $(this),
    // _viewType = "web",
    _$btnBox = $(".img-move-btn"),
    _$moveBtn = _$btnBox.find(".handler"),
    _$maskBox = $(".mask"),
    _$maskImg = _$maskBox.find("img"),
    _maxWid = _$btnBox.width(),
    _$conArea = $(".perforMaskWrap"),
    _center = _maxWid / 2,
    _margin = 0,
    _delayTime = 500;

  _$moveBtn.css({ right: _center });
  _$maskBox.css({ width: _center });
  _$maskImg.css({ width: _center * 2 });
  _$this.mousedown = false;
  _$this.touchstart = false;

  evtMove();
  function evtMove() {
    _$moveBtn.on("mousedown keydown touchstart", function (e) {
      // alert("d");
      if (_viewType == "web") {
        if (e.type === "mousedown") {
          _$btnBox.css({ "z-index": 100 });
          _$this.mousedown = true;
        } else if (e.keyCode === 37) {
          e.preventDefault();
          _boxWid =
            parseInt(_$moveBtn.css("right"), 10) < _center
              ? _center + "px"
              : _maxWid - _margin + "px";
          tPosition(_boxWid, _delayTime);
        } else if (e.keyCode === 39) {
          e.preventDefault();
          _boxWid =
            parseInt(_$moveBtn.css("right"), 10) > _center
              ? _center + "px"
              : _margin + "px";

          tPosition(_boxWid, _delayTime);
        }
      } else {
        if (e.type === "touchstart") {
          _$btnBox.css({ "z-index": 100 });
          _$this.touchstart = true;
        }
      }
    });

    _$btnBox.on("mousemove touchmove", function (e) {
      e.preventDefault();
      var _offset = $(this).offset();

      if (_viewType == "web") {
        if (_$this.mousedown) {
          _boxWid = _maxWid - (e.clientX - _offset.left);
          _boxWid = _boxWid < _margin ? _margin : _boxWid;
          _boxWid = _boxWid > _maxWid - _margin ? _maxWid - _margin : _boxWid;

          tPosition(_boxWid + "px", 0);
        }
      } else if (_viewType == "mobile" || _viewType == "tablet") {
        if (_$this.touchstart) {
          // console.log(_offset);
          var event = e.originalEvent,
            _touch = event.touches[0].clientX;
          if (_touch >= 0 && _touch <= _maxWid) {
            _boxWid = _maxWid - _touch;
            tPosition(_boxWid + "px", 0);
          }
        }
      }
    });

    _$conArea.on("mouseup touchend", function (e) {
      e.preventDefault();
      if (_viewType == "web") {
        if (_$this.mousedown) {
          _$btnBox.css({ "z-index": 0 });
          _$this.mousedown = false;
        }
      } else {
        _$btnBox.css({ "z-index": 0 });
        _$this.touchstart = false;
      }
    });

    function tPosition(prev, delayTime) {
      var _$this = $(this);
      _$maskBox.stop(true, true).animate(
        {
          width: prev,
        },
        delayTime
      );
      _$moveBtn.stop(true, true).animate(
        {
          right: prev,
        },
        delayTime
      );
    }
  }
}
// [End] : MD010301t01 > 기획서 v0.18 p.68 AS-IS과 동일한 슬라이드 기능 적용 (AS-IS 그대로 사용 / 클래스만 변경)

// [Start] : Models > 영상 버튼 클릭 시 재생 혹은 멈춤 작업 & 한 번 재생 후 포스터 나와야함
function modelsVideoPlay() {
  $(".models-wrap .content-item02 .btn-only-icon-bg01-square.play").click(
    function () {
      // console.log("비디오 재생 ing");
      var videoPc = $(this)
        .closest(".btn-groups")
        .siblings("video.pc-only")
        .get(0);
      var videoMo = $(this)
        .closest(".btn-groups")
        .siblings("video.mo-only")
        .get(0);
      var icon = $(this).children(".btn-icon24");
      var pcPoster = $(this)
        .closest(".btn-groups")
        .siblings(".video_poster.pc-only");
      var moPoster = $(this)
        .closest(".btn-groups")
        .siblings(".video_poster.mo-only");

      if (videoPc.paused && videoMo.paused) {
        icon.attr("class", "btn-icon24 icon-pause-wh");
        if (window.innerWidth <= 1023) {
          videoMo.play();
          moPoster.hide();
          pcPoster.hide();
          $(".models-wrap .content-item02 video.mo-only").attr(
            "aria-hidden",
            false
          );
        } else {
          videoPc.play();
          moPoster.hide();
          pcPoster.hide();
          $(".models-wrap .content-item02 video.pc-only").attr(
            "aria-hidden",
            false
          );
        }
        $(this).attr("title", "영상 재생 상태, 일시정지 하기");
      } else {
        icon.attr("class", "btn-icon24 icon-play-wh");
        if (window.innerWidth <= 1023) {
          videoMo.pause();
          moPoster.hide();
          pcPoster.hide();
        } else {
          videoPc.pause();
          moPoster.hide();
          pcPoster.hide();
        }
        $(this).attr("title", "영상 일시정지 상태, 재생 하기");
      }
    }
  );

  $(".models-wrap .content-item02 .btn-only-icon-bg01-square.sound").click(
    function () {
      // console.log("비디오 재생 ing");
      var videoPc = $(this)
        .closest(".btn-groups")
        .siblings("video.pc-only")
        .get(0);
      var videoMo = $(this)
        .closest(".btn-groups")
        .siblings("video.mo-only")
        .get(0);
      var icon = $(this).children(".btn-icon24");

      if (videoPc.muted && videoMo.muted) {
        icon.attr("class", "btn-icon24 icon-soundon-wh");
        if (window.innerWidth <= 1023) {
          videoMo.muted = false; //음소거 해제
        } else {
          videoPc.muted = false;
        }
        $(this).attr("title", "현재 사운드 켜진 상태, 사운드 끄기");
      } else {
        icon.attr("class", "btn-icon24 icon-soundoff-wh");
        if (window.innerWidth <= 1023) {
          videoMo.muted = true; //음소거
        } else {
          videoPc.muted = true;
        }
        $(this).attr("title", "현재 사운드 꺼진 상태, 사운드 켜기");
      }
    }
  );

  // 비디오가 끝났을 때 썸네일 나오도록
  $(".models-wrap .content-item02 video").on("ended", function () {
    // console.log("비디오 끝 / 썸넬 시작");
    // $(this).get(0).currentTime = 0;
    var icon = $(this).siblings(".btn-groups").find(".icon-pause-wh");
    icon.attr("class", "btn-icon24 icon-play-wh");
  });
  $(window).resize(function () {
    $win_width = window.innerWidth;
    if (window.innerWidth <= 1023) {
      // mo 영상 살리기 & pc 영상 hidden
      $(".models-wrap .content-item02 video.mo-only").attr(
        "aria-hidden",
        false
      );
      $(".models-wrap .content-item02 video.pc-only").attr("aria-hidden", true);
      // mo 영상 끝났을 때
      // $(".models-wrap .content-item02 video.mo-only").on("ended", function () {
      //   $(this).siblings(".video_poster.mo-only").show();
      //   $(this).siblings(".video_poster.pc-only").hide();
      //   // mo 비디오 hidden
      //   $(this).attr("aria-hidden", true);
      // });
    } else if (window.innerWidth > 1023) {
      // pc 영상 살리기 & mo 영상 hidden
      $(".models-wrap .content-item02 video.pc-only").attr(
        "aria-hidden",
        false
      );
      $(".models-wrap .content-item02 video.mo-only").attr("aria-hidden", true);
      // pc 영상 끝났을 때
      // $(".models-wrap .content-item02 video.pc-only").on(
      //   "ended",
      //   function () {}
      // );
    }
  });
}
// [End] : Models > 영상 버튼 클릭 시 재생 혹은 멈춤 작업 & 한 번 재생 후 포스터 나와야함

function configuratorEvent() {
  const configuratorInput = document.querySelectorAll(
    ".configurator_select_area input"
  );
  configuratorInput.forEach((input) => {
    input.addEventListener("change", () => {
      // console.log(input.value);

      // transmission 값에 따라 alcantaraPackage 노출
      if (input.value.includes("transmission")) {
        const alcantaraInput = document.querySelectorAll(
          `.configurator_select_area input[name="transmission"]`
        );
        const alcantaraValue = [];
        alcantaraInput.forEach((el) => {
          alcantaraValue.push(el.value);
        });
        const alcantaraDropdown = document.querySelectorAll(
          `.configurator_select_area input[name*="alcantaraPackage"]`
        );
        alcantaraDropdown.forEach((el) => {
          el.checked = false;
          el.closest(".dropdown").classList.add("none");
        });
        const alcantaraIndex = alcantaraValue.indexOf(input.value);
        document
          .querySelector(
            `.configurator_select_area input[name="alcantaraPackage${
              alcantaraIndex + 1
            }"]`
          )
          .closest(".dropdown")
          .classList.remove("none");
      }

      // configObjEx 에 체크 된 value 추가
      // for (let i in Object.keys(configObjEx)) {
      //   exInput = document.querySelector(
      //     `.configurator_select_area input[name="${
      //       Object.keys(configObjEx)[i]
      //     }"]:checked`
      //   );
      //   configObjEx[Object.keys(configObjEx)[i]] = exInput === null ? "" : "_" + exInput.value;

      // }
      // configObjIn 에 체크 된 value 추가
      // for (let i in Object.keys(configObjIn)) {
      //   inInput = document.querySelector(
      //     `.configurator_select_area input[name="${
      //       Object.keys(configObjIn)[i]
      //     }"]:checked`
      //   );
      //   configObjIn[Object.keys(configObjIn)[i]] =
      //     inInput === null ? "" : "_" + inInput.value;
      // }

      // configuratorImg();

      // 슬라이드 이미지 애니메이션
      // $(".configurator_swiper .swiper-slide img").attr(
      //   "src",
      //   "../../inc/images/Configurator/NEN_EXT_XFB_LD_C003.jpg"
      // ); // 이미지 교체 확인용 임시 스크립트

      // 이미지 변경하면 화면 깜빡임
      // $(".configurator_swiper .swiper-slide img").animate({ opacity: 0.1 }, 200);
      // $(".configurator_swiper .swiper-slide img").animate({ opacity: 1 }, 200);
    });
  });
}

// [Start] : configurator fx
$(".btn_background").click(() => {
  $(".btn_background").toggleClass("on");
  // configObj.background = $(".btn_background").hasClass("on") ? "_track" : "_studio";
  // configuratorImg();
});
$(".btn_time").click(() => {
  $(".btn_time").toggleClass("on");
  // configObj.time = $(".btn_time").hasClass("on") ? "_night" : "_day";
  // configuratorImg();
});
$(".btn_zoom").click(() => {
  $(".btn_zoom").toggleClass("on");
  $(".configurator_swiper").toggleClass("zoom");
});
$(".btn_full").click(() => {
  $(".btn_full").toggleClass("on");
});
// [End] : configurator fx

// [Start] : configuratorScroll
function configuratorScroll() {
  var scrollWrap = $("#configurator");
  let scrollPrev = 0,
    scrollTop = 1;

  scrollWrap.scroll(function () {
    scrollTop = scrollWrap.scrollTop();

    if (scrollTop > 0) {
      if (scrollTop >= scrollPrev) {
        // 스크롤 위치 증가
        scrollWrap.find(".configurator_header_wrap").addClass("scroll-on");
        scrollWrap.find(".configurator_swiper_wrap").removeClass("scroll-on");
        scrollWrap.find(".configurator_price_wrap").removeClass("scroll-on");
      } else {
        // 스크롤 위치 감소
        scrollWrap.find(".configurator_header_wrap").removeClass("scroll-on");
        scrollWrap.find(".configurator_swiper_wrap").addClass("scroll-on");
        scrollWrap.find(".configurator_price_wrap").addClass("scroll-on");
      }
      setTimeout(function () {
        scrollPrev = scrollTop;
      }, 10);
    }
  });
}
// [End] : configuratorScroll

function scrollIndicator(obj) {
  var thisScrArea = $(obj),
    contentItem = document.querySelectorAll(".content-wrap .blue-title"),
    // scrItem = thisScrArea.find(".content-wrap [class*=content-item]"),
    nowScroll = thisScrArea.scrollTop(),
    sectionLength = contentItem.length,
    headerNavHeight = $(".header-wrap").height();
  sectionItem = [];

  contentItem.forEach((evt, idx) => {
    if (contentItem[idx].querySelector(".blue-title")) {
      contentItem[idx].classList.add("active");
    }
    contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성
    sectionItem[idx] =
      evt.getBoundingClientRect().top + nowScroll - headerNavHeight - 150;
    // console.log(contentItem[0].getBoundingClientRect().top);
  });

  // 08.09 'rending-btn' 버튼 클릭 시, 클릭한 위치 못 찾는 문제로 클릭 이벤트 발생시, 적용되도록 내용 수정하였음
  for (var i = 0; i < sectionLength; i++) {
    if (sectionItem[i] <= nowScroll + 40) {
      $(".navigation-item02 li")
        .eq(i)
        .find("button")
        .addClass("on")
        .parent()
        .siblings()
        .find("button")
        .removeClass("on");
    }
  }
}

// scroll 이벤트 추가
// masonryLayout 높이 추가로 잡기
let $firstScroll = 0;
let $win_width = window.innerWidth;
function scrollEvent() {
  var scrollWrap = $("body"),
    historyItemOffset = [],
    historyItemPosition = [],
    leftScrollData = [];

  let scrollPrev = 0,
    scrollTop = 1;

  scrollWrap.scroll(function () {
    if ($firstScroll < 100) {
      pubUi.masonryLayout();
      $firstScroll++;
    }
    // alert('d')
    let scrollY = (
      (scrollWrap.scrollTop() / ($(".wrap").height() - scrollWrap.height())) *
      100
    ).toFixed(3);
    scrollTop = scrollWrap.scrollTop();

    _this = $(this);
    if (scrollTop > 0) {
      $(".navigation_bar-wrap .gage").addClass("on");
      // $(".header-wrap").addClass("scroll-on");
      $("#topBtn").fadeIn("slow");
      $("#topBtn").css("display", "flex");
      if (scrollTop >= scrollPrev) {
        // 스크롤 위치 증가
        $(".header-wrap").addClass("scroll-on");
        // console.log(scrollTop, scrollPrev);
      } else {
        // 스크롤 위치 감소
        $(".header-wrap").removeClass("scroll-on");
      }
      setTimeout(function () {
        scrollPrev = scrollTop;
      }, 10);
    } else {
      $(".navigation_bar-wrap .gage").removeClass("on");
      // $(".header-wrap").removeClass("scroll-on");
      $("#topBtn").fadeOut("slow");
      $("#topBtn").css("display", "none");
    }

    $(".header-wrap").addClass("scroll-ing");
    $(".navigation_bar-wrap .gage.on").css("--bar", `${scrollY}%`);
    scrollIndicator(_this);
    if ($(".navigation-item02").length) {
      if ($(".navigation-item02").scrollLeft() > 0) {
        $(".navigation-item02")
          .stop()
          .animate({
            scrollLeft:
              $(".navigation-item02 li button.on").offset().left +
              $(".navigation-item02").scrollLeft() -
              $win_width / 2 +
              30,
          });
      } else {
        $(".navigation-item02")
          .stop()
          .animate({
            scrollLeft:
              $(".navigation-item02 li button.on").offset().left -
              $win_width / 2 +
              30,
          });
      }
    }
  });

  if ($(".history-list").length) {
    moveItem = $(".history-pointer");
    historyItemLength = $(".history-list > li").length;
    // $(".history-list > li").each(function (e) {
    //   _this = $(this);
    //   historyItemOffset[e] = _this.offset().top;
    //   historyItemPosition[e] = _this.position().top;
    // });
    if ($(window).width() >= 1024) {
      dateGap = 120;
      dateGapScroll = 80;
    } else {
      dateGapScroll = 18;
      dateGap = 18;
    }
    moveItemTop = moveItem.position().top;
    // alert(historyItemLength);
    scrollWrap.scroll(function () {
      $(".history-list > li").each(function (e) {
        _this = $(this);
        historyItemOffset[e] = _this.offset().top;
        historyItemPosition[e] = _this.position().top;
        // console.log(historyItemOffset[e]);
      });
      scrollTop = scrollWrap.scrollTop();
      for (var i = 0; i < historyItemLength; i++) {
        if (0 >= historyItemOffset[i]) {
          moveItemTop = historyItemPosition[i + 1];
        } else if (0 < historyItemOffset[0]) {
          moveItemTop = historyItemPosition[0];
        }
      }
      // console.log(moveItemTop);
      moveItem.css("top", moveItemTop + dateGap);
    });
  }
}

// 스크를 종료 감지
$.fn.scrollStopped = function (callback) {
  var that = this,
    $this = $(that);
  $this.scroll(function (ev) {
    clearTimeout($this.data("scrollTimeout"));
    $this.data("scrollTimeout", setTimeout(callback.bind(that), 100, ev));
  });
};
$("body").scrollStopped(function (ev) {
  // console.log(ev);
  // console.log("스크롤끝");
  $(".header-wrap").removeClass("scroll-ing");
});

// vh 모바일
function setVh() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.onload = function () {
  scrollEvent();
  // setTimeout(function () {
  //   scrollEvent();
  // }, 1000);
  configuratorScroll();
  setVh();
  dropdownAccordion();
  hasTagFun();
  $(window).resize(() => {
    setVh();
    toggleAboutMe();
  });
  toggleAboutMe();
  // pagingNumCheck();
  CheckNextRaces();

  // 07.30 추가 - 모바일에서 navigation-bar 존재 시, 컨텐츠영역 상단 짤림 현상 방지
  if (
    $(".navigation_bar-wrap .navigation-item02").length > 0 &&
    $(window).width() < 1024
  ) {
    $(".wrap .content-area").css("padding-top", "96px");
  } else if (
    $(".btn-navi-wrap.mo-only button").length == 2 &&
    $(window).width() < 1024
  ) {
    $(".wrap .content-area").css("padding-top", "88px");
  } else if ($(".navigation_bar-wrap").length > 0) {
    $(".wrap .content-area").css("padding-top", "48px");
  } else {
    $(".wrap .content-area").css("padding-top", "0");
  }

  // Jira - 359 대응 : 관련된 컨텐츠 갯수에 따라 css 적용 (레이아웃 깨짐 방지)
  if ($(".related-wrap .models-cardbox").length > 0) {
    var relatedItemSize = $(
      ".related-wrap .models-cardbox .models-card"
    ).length;
    $(".related-wrap .models-cardbox").css("--size", relatedItemSize);
  }

  // Jira - 426 대응 : SNS 갯수 크기별 css 적용
  if (
    $(".share-popup.popup-wrapper .popup-body.share-icn-wrap .box-row").length >
    0
  ) {
    var shareSnsIcon = $(".share-popup .share-icn-wrap .box-icn");

    if (shareSnsIcon.length >= 4) {
      $(".share-popup.popup-wrapper .popup-body.share-icn-wrap .box-row").css(
        "--count",
        "4"
      );
    } else {
      $(".share-popup.popup-wrapper .popup-body.share-icn-wrap .box-row").css(
        "--count",
        shareSnsIcon.length
      );
    }
  }

  if (
    navigator.userAgent.indexOf("iPhone") > -1 ||
    navigator.userAgent.indexOf("iPad") > -1
  ) {
    $(".toggleFullscreenBtn").hide();
  } else {
    $(".toggleFullscreenBtn").show();
  }
};

function startTimer(slide, video, maxVideoW, type, targetIdx) {
  let duration = 0;
  self.dataSecond = 0;

  var playBtn = slide.find(".btn-play").hasClass("on");
  if (type == "image") {
    if (playBtn) {
      duration = Math.floor(3);
    } else {
      duration = 0;
      return false;
    }
  } else {
    if (playBtn) {
      // video.currentTime = 0;
      video.play();
      duration = Math.floor(video.duration); // 동영상 전체 길이
    } else {
      duration = 0; // 동영상 전체 길이
      return false;
    }
  }

  self.timer = setInterval(function () {
    self.dataSecond++;
    self.curTime = dataSecond / 10;
    self.per = Math.floor((curTime / duration) * maxVideoW); // 영상길이 width 값 환산
    // self.perWrap = (1 / duration) * 100;
    // alert(self.dataSecond);
    document.querySelector(
      `.swiper-pagination-bullet:nth-child(${targetIdx + 1}) .seek-bar`
    ).style.width = per + "px";
    if (curTime >= duration) {
      slide[0].swiper.slideNext();
      stopTimer(video, type);
    }
  }, 100);
}

function stopTimer(video, type) {
  self.dataSecond = 0;
  self.per = 0;
  if (type !== "image") {
    if ((video.paused = false)) {
      video.pause();
      video.currentTime = 0;
    }
  }
  $(".swiper-pagination-bullet .seek-bar").css("width", 0);
  clearInterval(self.timer);
}

// contsItemGridSizeChk() - grid 형식의 컨텐츠 아이템 사이즈 1개일 경우, grid 속성 제거
function contsItemGridSizeChk() {
  var contArea = document.querySelector(".content-area");

  var contItem04Size = "";
  var contItem07Size = "";

  var contItem04Grid3 = "";
  var contItem07Grid3 = "";

  if (contArea.classList.contains("evtGuide")) {
    // event guide
    contItem04Size = document.querySelectorAll(
      ".evtGuide .list-content.active .content-item04 .grid_3 li"
    ).length;
    contItem07Size = document.querySelectorAll(
      ".evtGuide .list-content.active .content-item07 .grid_3 li"
    ).length;

    contItem04Grid3 = document.querySelector(
      ".evtGuide .list-content.active .content-item04 .grid_3"
    );
    contItem07Grid3 = document.querySelector(
      ".evtGuide .list-content.active .content-item07 .grid_3"
    );
  } else {
    // round detail
    contItem04Size = document.querySelectorAll(
      ".content-item04 .info_wrap .grid_3 li"
    ).length;
    contItem07Size = document.querySelectorAll(
      ".content-item07 .info_wrap .grid_3 li"
    ).length;

    contItem04Grid3 = document.querySelector(
      ".content-item04 .info_wrap .grid_3"
    );
    contItem07Grid3 = document.querySelector(
      ".content-item07 .info_wrap .grid_3"
    );
  }

  if (contItem04Size > 0) {
    if (contItem04Size == 1) {
      contItem04Grid3.style.gridTemplateColumns = "revert";
    } else {
      if (contItem04Size >= 3) {
        contItem04Grid3.style.setProperty("--size", 3);
      } else {
        contItem04Grid3.style.setProperty("--size", contItem04Size);
        if (pubUi.windowSize()) {
          //pc
          contItem04Grid3.classList.add("center");
        }
      }
    }
  }

  if (contItem07Size > 0) {
    if (contItem07Size == 1) {
      contItem07Grid3.style.gridTemplateColumns = "revert";
    } else {
      if (contItem07Size >= 3) {
        contItem07Grid3.style.setProperty("--size", 3);
      } else {
        contItem07Grid3.style.setProperty("--size", contItem07Size);
        if (pubUi.windowSize()) {
          //pc
          contItem07Grid3.classList.add("center");
        }
      }
    }
  }
}

// scroll 이동하고자하는 영역의 상단 header-menu에 대한 value 값과, configurator_select_area 영역의 data-type 값(type) 전달
// targetScrollConfig(value, type);  -> ex) targetScrollConfig('exterior', 'color');
// value : exterior 또는 interior 전달 / type : dropdown-btn의  data-type 값 전달
function targetScrollConfig(value, type) {
  // console.log(value, type);

  var configuratorArea = $("#configurator");
  var configSelectItem = configuratorArea.find(
    ".configurator_select_area > [class*=configurator_select_" + value + "]"
  );
  var configHeaderHeight = configuratorArea
    .find(".configurator_header_wrap")
    .height();
  var configSwiperHeight = configuratorArea
    .find(".configurator_swiper_wrap")
    .height();
  var configuratorAreaModel = configuratorArea.data("model");
  var dropdownItem;

  //$(".configurator_menu_" + value).trigger("click");

  var nowScrollTop = configSelectItem.scrollTop();
  console.log("nowScroll : " + nowScrollTop);

  for (var i = 0; i < configSelectItem.length; i++) {
    var configSelectItemModel = configSelectItem[i].dataset.model;

    if (configSelectItemModel == configuratorAreaModel) {
      dropdownItem = $(configSelectItem[i]).find(".dropdown");
    }
  }
  for (var i = 0; i < dropdownItem.length; i++) {
    var dropdownBtnDataType = $(dropdownItem[i])
      .find(".dropdown-btn")
      .data("type");
    if (dropdownBtnDataType == type) {
      $(dropdownItem[i]).addClass("on");

      if ($(dropdownItem[i]).hasClass("on")) {
        var dropDownOffsetTop = $(dropdownItem[i]).offset().top;
        var calOffsetTopPc =
          dropDownOffsetTop + nowScrollTop - configHeaderHeight;
        var calOffsetTopMo =
          dropDownOffsetTop +
          nowScrollTop -
          (configHeaderHeight + configSwiperHeight);

        if (pubUi.windowSize()) {
          // pc
          configSelectItem.animate({ scrollTop: calOffsetTopPc }, 1000);
        } else {
          // mobile
          configuratorArea.animate({ scrollTop: calOffsetTopMo }, 1000);
        }
      }
    } else {
      $(dropdownItem[i]).removeClass("on");
    }
  }
}

// function pagingNumCheck() {
//   var pageList = $(".page_list");
//   // var pageNum = $(".page_list > li").length;

//   for (var i = 0; i < pageList.length; i++) {
//     var pageNum = pageList[i].children.length;

//     if (pubUi.windowSize()) {
//       //pc
//     } else {
//       //mobile
//       if (pageNum >= 4) {
//         for (var j = 0; j < pageNum; j++) {
//           pageList[i].children[j].children[0].style.setProperty("--num", 4);
//         }
//       } else {
//         for (var j = 0; j < pageNum; j++) {
//           pageList[i].children[j].children[0].style.setProperty(
//             "--num",
//             pageNum
//           );
//         }
//       }
//     }
//   }
// }

function CheckNextRaces() {
  const cardSlide = document.querySelectorAll(".ty04Swiper .swiper-slide");
  const currentDate = new Date();

  // let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  $(cardSlide).removeClass("swiper-slide-active");

  for (var i = 0; i < cardSlide.length; i++) {
    var cardMonth = $(cardSlide[i]).find(".card_bottom .card_badge").text();
    var cardTit = $(cardSlide[i]).find(".card_bottom .card_tit").text();
    var cardDay = cardTit.split("~");
    var cardFirstDay = parseInt(cardDay[0]);

    cardMonth = cardMonth.toLowerCase();

    switch (cardMonth) {
      case "january":
        cardMonth = 1;
        break;
      case "february":
        cardMonth = 2;
        break;
      case "march":
        cardMonth = 3;
        break;
      case "april":
        cardMonth = 4;
        break;
      case "may":
        cardMonth = 5;
        break;
      case "june":
        cardMonth = 6;
        break;
      case "july":
        cardMonth = 7;
        break;
      case "august":
        cardMonth = 8;
        break;
      case "september":
        cardMonth = 9;
        break;
      case "october":
        cardMonth = 10;
        break;
      case "november":
        cardMonth = 11;
        break;
      case "december":
        cardMonth = 12;
        break;
    }

    // console.log(cardDay, cardFirstDay);

    if (cardMonth >= month) {
      if (cardMonth > month) {
        // cardMonth 가 현재 month 보다 큰 경우, 해당 swiper-slide에 active 추가
        $(cardSlide[i]).addClass("swiper-slide-active");
      } else {
        // cardMonth 가 현재 month 같은 경우, day 값 비교 후 active 추가
        if (cardFirstDay > day) {
          $(cardSlide[i]).addClass("swiper-slide-active");
        }
      }

      if ($(cardSlide[i]).hasClass("swiper-slide-active")) {
        var cardIndex = $(cardSlide[i]).index();
        $(".ty04Swiper")[0].swiper.slideTo(cardIndex, 1000, false);
      }
      return false;
    }
  }
}

// 웹접근성 초기 처리 실행 함수
function webAccessibilityChk() {
  var lang = $("html").attr("lang");
  var langBtn = $(".lang-btn");
  var swiperPlayBtn = $(".btn-play");
  var swiperSoundBtn = $(".btn-sound");
  var modelVisualPlayBtn = $(".btn.play");
  var modelVisualSoundBtn = $(".btn.sound");
  var popupPlayBtn = $(".box-video .btn");

  // 국/영문 사이트 체크
  if (lang == "ko") {
    langBtn.attr("aria-label", "현재 국문, 영문으로 변경하기");
  } else if (lang == "en") {
    langBtn.attr("aria-label", "현재 영문, 국문으로 변경하기");
  }

  swiperSoundBtn.attr("title", "현재 사운드 꺼진 상태, 사운드 켜기");
  swiperPlayBtn.attr("title", "영상 재생 상태, 일시정지 하기");
  modelVisualSoundBtn.attr("title", "현재 사운드 꺼진 상태, 사운드 켜기");
  modelVisualPlayBtn.attr("title", "영상 재생 상태, 일시정지 하기");
  popupPlayBtn.attr("title", "영상 재생 상태, 일시정지 하기");

  $(".option, .upload-btn")
    .off("keydown")
    .on("keydown", (e) => {
      if (e.key === "Enter") {
        $(e.currentTarget).click();
      }
    });
}

function webAccessAddTabindex() {
  var selectboxWrap = $(".selectbox-wrap");

  if (selectboxWrap.length > 0) {
    var selectOption = selectboxWrap.find(".selectbox-options li");

    for (var i = 0; i < selectOption.length; i++) {
      $(selectOption[i]).attr("tabindex", "0");
    }
    $(".moclose-btn").removeAttr("tabindex");
  }
}

function keydownTagEvent(parentSelector, el) {
  if (el.attr("type") == "checkbox") {
    if (el.prop("checked") == true) {
      el.prop("checked", false);
      el.closest("li").removeClass("on");
      el.closest("li").find("label").attr("data-check", "false");
    } else {
      el.prop("checked", true);
      el.closest("li").addClass("on");
      el.closest("li").find("label").attr("data-check", "true");
    }
  } else if (el.attr("type") == "radio") {
    var cateInner = parentSelector;

    cateInner.find(".tag-list li").removeClass("on");
    cateInner.find(".tag-list li input").prop("checked", false);
    cateInner.find(".tag-list li label").attr("data-check", "false");

    el.closest("li").addClass("on");
    el.prop("checked", true);
    el.closest("li").find("label").attr("data-check", "true");
  }
}

function swiperAriaHidden(swiperEl) {
  // swiper 웹접근성 처리용 aria-hidden 제어 함수 추가
  var swiperElList = swiperEl.find(".swiper-slide");
  if (swiperElList.length > 0) {
    // console.log(swiperElList);
    for (var i = 0; i < swiperElList.length; i++) {
      if (swiperElList[i].classList.contains("swiper-slide-active")) {
        swiperElList[i].setAttribute("aria-hidden", false);
      } else {
        swiperElList[i].setAttribute("aria-hidden", true);
      }
    }
  }
}

function swiperCtrlInert(swiperEl) {
  // swiper 웹접근성 처리용 inert 제어 함수 추가
  var swiperElList = swiperEl.find(".swiper-slide");
  if (swiperElList.length > 0) {
    // console.log(swiperElList);
    for (var i = 0; i < swiperElList.length; i++) {
      if (swiperElList[i].classList.contains("swiper-slide-active")) {
        swiperElList[i].removeAttribute("inert");
      } else {
        swiperElList[i].setAttribute("inert", "");
      }
    }
  }
}

function activeCardMoreBtn(target) {
  var btnMore = $(target);
  var slide = $(target).closest(".swiper-slide");
  var targetCardMoreBtn = slide.find(".card_more");
  //var swiper4CardMoreBtn = slide.siblings().find(".card_more");
  //var otherSlide = $(slide.siblings());

  // swiper4CardMoreBtn.attr("aria-hidden", "true");
  // swiper4CardMoreBtn.attr("aria-expanded", "false");
  // otherSlide.removeClass("on");

  if (btnMore.attr("aria-expanded") == "true") {
    slide.removeClass("on");
    btnMore.find(".dropdown-icon").removeClass("rotate");
    btnMore.attr("aria-expanded", "false");
    targetCardMoreBtn.attr("aria-expanded", "false");
    targetCardMoreBtn.attr("aria-hidden", "true");
  } else {
    slide.addClass("on");
    btnMore.find(".dropdown-icon").addClass("rotate");
    btnMore.attr("aria-expanded", "true");
    targetCardMoreBtn.attr("aria-expanded", "true");
    targetCardMoreBtn.attr("aria-hidden", "false");
  }
}

// label 안에 있는 텍스트 input에 title로 넣기 / inputLabelToTitle(적용할 범위, label 안에 있는 태그(없으면 ""))
function inputLabelToTitle(target, labelInnerTag) {
  $(target).each(function () {
    var addLabelTxtWrap = $(this);
    if ($(this).siblings(`label ${labelInnerTag}`).length == 0) {
      labelTxt = $(this)
        .siblings("label")
        .html()
        .replace(/(<([^>]+)>)/gi, "");
    } else if ($(this).siblings(`label ${labelInnerTag}`).length == 1) {
      labelTxt = $(this)
        .siblings(`label ${labelInnerTag}`)
        .html()
        .replace(/(<([^>]+)>)/gi, "");
    } else if ($(this).siblings(`label ${labelInnerTag}`).length == 2) {
      labelTxt =
        $(this)
          .siblings(`label ${labelInnerTag}:first-child`)
          .html()
          .replace(/(<([^>]+)>)/gi, "") +
        $(this)
          .find(`label ${labelInnerTag} + ${labelInnerTag}`)
          .html()
          .replace(/(<([^>]+)>)/gi, "");
    }
    // alert(addLabelTxtWrap.attr("id"))
    addLabelTxtWrap.attr("title", labelTxt);
    $(this).siblings("label").attr("aria-hidden", true);
  });
}
