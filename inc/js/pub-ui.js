var pubUi = {
  init: function () {
    var self = this;
    self.settings();
    self.bindEvents();
    self.swiperSlideEvent();
    self.masonryLayout();
    btnNaviCheck();

    if ($(".evt-map-wrap").length > 0) {
      scrollToCenter(".event-box .evt-map-img");
    }

    if (
      $(".ty01Swiper:not(.banner-swiper)") != undefined &&
      $(".ty01Swiper:not(.banner-swiper)").length > 0
    ) {
      var typeChk = "";
      if (
        $(".ty01Swiper:not(.banner-swiper) .swiper-slide-active").find("img")
          .length
      ) {
        typeChk = "image";
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

    for (var i = 0; i < self.$tabList.length; i++) {
      self.$tabList[i].addEventListener("click", function (e) {
        var tabContainer = $(this).closest(".tab-container");
        e.preventDefault();
        pubUi.tabBtnEvent(e, tabContainer);
      });
    }

    // 스와이퍼 재생 버튼 클릭시, 동영상 재생, 정지
    $(".btn-play").on("click", function (e) {
      e.preventDefault();
      var targetSwiper = $(this).closest(".swiper");
      var videoChk = targetSwiper.find(".swiper-slide-active video");
      var swiperIndex = targetSwiper.find(".swiper-slide-active").index();

      if (targetSwiper.hasClass("ty01Swiper")) {
        if ($(this).hasClass("on")) {
          // console.log("정지버튼 클릭!");
          $(this).removeClass("on");
          $(this).attr("title", "재생");
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
          $(this).attr("title", "정지");
          if (videoChk.length > 0) {
            videoChk[0].play();
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              swiperIndex,
              "video"
            );
          } else {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.banner-swiper)",
              swiperIndex,
              "image"
            );
          }
        }
      } else {
        if ($(this).hasClass("on")) {
          // console.log("정지버튼 클릭!");
          $(this).removeClass("on");
          $(this).attr("title", "재생");
          targetSwiper[0].swiper.autoplay.stop();
        } else {
          // console.log("재생버튼 클릭!");
          $(this).addClass("on");
          $(this).attr("title", "정지");
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
        self.$btnSound.attr("title", "소리 켜기");
        targetSwiper.find("video").prop("muted", true);
      } else {
        // console.log("소리 켜기버튼 클릭!");
        self.$btnSound.addClass("on");
        self.$btnSound.attr("title", "소리 끄기");
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
      }
      // self.tagBtnEvent("", tagList, "reset"); 07.04 수정 : 태그 리셋 비활성화
    });

    // 검색 창 입력값 존재 시, 리셋 버튼 활성화
    if (self.$searchBox != null) {
      self.$searchBox.querySelector("input").oninput = function (e) {
        var searchBoxValue = e.target.value;
        if (searchBoxValue) {
          self.$searchBox.classList.add("on");
        } else {
          self.$searchBox.classList.remove("on");
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
      var options = [];
      var option1 = $(
        ".evtLayout-type div:not('.selectbox-group') .selectbox-options"
      ).find(".option-click.active");
      var option2 = $(
        ".evtLayout-type .selectbox-group > div.on .selectbox-options"
      ).find(".option-click.active");

      var selectedArea = document.querySelector(
        ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
      ).innerText;

      var selectedNType = document.querySelector(
        "#countrySelect li.active"
      ).innerText;

      if ($(".evt-map-wrap").hasClass("on")) {
        alert(
          "현재 이미지보다 큰 이미지를 볼 수 없습니다. \n이전 이미지로 돌아가려면 - 버튼을 눌러주세요. "
        );
      } else {
        $(".evt-map-wrap").addClass("on");
        evtImgMapChk(options, selectedArea, selectedNType, option1, option2);
      }
    });

    // 이벤트 레이아웃 - 버튼 클릭시,
    $(".event-box .btn-wrap.minus").click(function (e) {
      var options = [];
      var option1 = $(
        ".evtLayout-type div:not('.selectbox-group') .selectbox-options"
      ).find(".option-click.active");
      var option2 = $(
        ".evtLayout-type .selectbox-group > div.on .selectbox-options"
      ).find(".option-click.active");

      var selectedArea = document.querySelector(
        ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
      ).innerText;

      var selectedNType = document.querySelector(
        "#countrySelect li.active"
      ).innerText;

      $(".evt-map-wrap").removeClass("on");
      evtImgMapChk(options, selectedArea, selectedNType, option1, option2);
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
  },
  swiperSlideEvent: function () {
    var self = this;
    var slideInx = 1; // 현재 슬라이드 index 체크용 변수
    var loopVal = "";
    var touchFlag = "";
    var autoplayVal = "";
    var currentIndex = "";

    if (self.typeChk.length > 0) {
      //동영상 타입일 경우,
      touchFlag = 1;
      autoplayVal = false;
    } else {
      //이미지 타입일 경우,
      touchFlag = 1;
      autoplayVal = {
        delay: 3000,
        disableOnInteraction: false,
      };
    }

    var swiper1 = new Swiper(".ty01Swiper:not(.banner-swiper)", {
      slidesPerView: 1,
      watchOverflow: true, //pagination 1개 일 경우, 숨김
      initialSlide: 0,
      touchRatio: 1, // 드래그 X : 0 , 드래그 O : 1
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
        nextEl: ".ty01Swiper .swiper-button-next",
        prevEl: ".ty01Swiper .swiper-button-prev",
      },
      on: {
        init: function () {
          $(".swiper-pagination-custom .swiper-pagination-bullet").html(
            "<div class='seek-bar'></div>"
          );
        },
        slideChangeTransitionEnd: function () {
          var currentIndex = swiper1.activeIndex;
          self.typeIdx = this.realIndex;
          $(".ty01Swiper:not(.swiper-banner) video").each(function () {
            var videoIdEach = $(this).attr("id");
            var videoAll = document.querySelector(`#${videoIdEach}`);
            videoAll.currentTime = 0;
            // alert(videoAll.duration);
            //  = 0;
          });
          if (
            $(".ty01Swiper:not(.swiper-banner) .swiper-slide")[
              currentIndex
            ].querySelector("video")
          ) {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.swiper-banner)",
              this.realIndex,
              "video"
            );
          } else {
            pubUi.videoBulletChk(
              ".ty01Swiper:not(.swiper-banner)",
              this.realIndex,
              "image"
            );
          }
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
    });
    swiper2SlideEvt(); //swiper2 이벤트 실행

    swiper4SlideEvt(); //swiper4 이벤트 실행

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
      on: {},
    });
    var swiper3Card = new Swiper(".ty03Swiper.rankswiper", {
      slidesPerView: 3,
      spaceBetween: 24,
      watchOverflow: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination-custom",
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
          slidesPerView: 1.2,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
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
          slidesPerView: 1.8,
        },
      },
    });
    var swiper10 = new Swiper(".wrc_swiper", {
      slidesPerView: 1,
      centeredSlides: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".wrc_swiper .swiper-button-next",
        prevEl: ".wrc_swiper .swiper-button-prev",
      },
      pagination: {
        el: ".wrc_swiper .swiper-pagination-custom",
        clickable: true,
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
    });
    var swiper12 = new Swiper(".collection_swiper", {
      slidesPerView: 1.15,
      spaceBetween: 24,
      watchOverflow: true,
      slidesOffsetBefore: 24,
      slidesOffsetAfter: 24,
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
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
        400: {
          slidesPerView: 1.1,
          spaceBetween: 12,
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
        550: {
          slidesPerView: 1.07,
          spaceBetween: 12,
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
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
  tabBtnEvent: function (e, tabContainer) {
    const target = e.target;
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
      target.parentNode.classList.add("on");

      for (let i = 0; i < tabConts.length; i++) {
        tabConts[i].classList.remove("on");
      }

      document.querySelector("#" + tabLabel).classList.add("on");
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
  // masonryLayout: function () {
  //   const masonry_item = document.querySelectorAll(".masonry_item");
  //   if (masonry_item.length < 1) {
  //     return;
  //   }
  //   const row_gap = 24;
  //   masonry_item.forEach((el) => {
  //     el.style.gridRowEnd = `
  //         span ${Math.ceil(
  //           el.querySelector(".masonry_con").scrollHeight + row_gap
  //         )}
  //       `;
  //   });
  // },

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
      ".content-area > [class*=content-item]"
    );
    var headerHeight = document.querySelector(".header-cont").offsetHeight;
    var navBarHeight = document.querySelector(
      ".navigation_bar-wrap"
    ).offsetHeight;

    var navHeight = headerHeight + navBarHeight;

    // var leftScrollData = $(this).offset().left;
    contentItem.forEach((evt, idx) => {
      if (contentItem[idx].querySelector(".blue-title")) {
        contentItem[idx].classList.add("active");
      }
      //contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성
    });

    var contentActiveItem = document.querySelectorAll(
      ".content-area > [class*=content-item].active"
    );

    contentActiveItem.forEach((evt, idx) => {
      contentActiveItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성

      if (evt.dataset.scroll == dataScroll) {
        //nav data-scroll과 값비교 후 동일 대상 체크
        var offsetTopVal = evt.offsetTop - navBarHeight;
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

    // 사용 안함 - 개발에서 제어
    // var raceRank = targetSwiper.find(".card_top .card_rank").text();
    // var raceMonth = targetSwiper.find(".card_bottom .card_badge").text();
    // var raceDay = targetSwiper.find(".card_bottom .card_tit").text();
    // var raceLocation = targetSwiper.find(".card_bottom .card_subtit").text();

    // console.log(raceRank, raceMonth, raceDay, raceLocation);

    // swiperContents.removeClass("active");
    // //보고용
    // swiperContents.hide();
    // swiperContents.find(".evtLayout-type").removeClass(raceLocation);

    // for (var i = 0; i < swiperContents.length; i++) {
    //   contentDataCont = swiperContents[i].dataset.content;

    //   if (swiperDataCont == contentDataCont) {
    //     // 보고용
    //     // swiperContents[i].style.display = "block";
    //     swiperContents[i].classList.add("active");
    //   }
    // }

    // if (!swiperContents.hasClass("active")) {
    //   alert("Comming soon !");
    //   // 보고용
    //   // targetSwiper.removeClass("active");
    //   // 보고용
    //   $(".section_list .list-content.conts03").addClass("active");
    // }
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
  $(".selectbox-js").click(function () {
    $this = $(this);
    handleSelectboxClick(event);
  });
  $(".option-click").click(function () {
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
  $(window).resize(function () {
    if ($(window).innerWidth() < 1024) {
      if ($(".ty02Swiper").length > 0) {
        self.swiper2.destroy();
      }

      swiper2SlideEvt();

      //07.29 추가
      if ($(".evt-map-wrap").length > 0) {
        scrollToCenter(".event-box .evt-map-img");
      }
    }
    btnNaviCheck();
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

  // 07.22 수정
  if ($(".content-item04 .grid_3 li").length == 1) {
    $(".content-item04 .grid_3").css("grid-template-columns", "revert");
  }

  if ($(".content-item07 .grid_3 li").length == 1) {
    $(".content-item07 .grid_3").css("grid-template-columns", "revert");
  }
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

  // 08.07 수정 : jira 422 대응 : 3개보다 클 경우 loop:true 실행 -> 3개미만일 때 결함 체크하기 위함/ 3개 이하 컨텐츠일시 loop가 true상태로 적용되면 autoplay 안되는 문제 있어 3개보다 클 경우 loop 적용되도록 수정하였음
  if (slideLenth > 3) {
    loopVal = true;
  } else {
    loopVal = false;
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
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    // slideToClickedSlide: true,
    // loopFillGroupWithBlank: true,
    // loopedSlides: 1,
    // loopAdditionallidSes: 1,
    // grid: {
    //   row: 3,
    // },
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
      // clickable: true,
    },
    navigation: {
      nextEl: ".ty02Swiper .swiper-button-next",
      prevEl: ".ty02Swiper .swiper-button-prev",
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
  });
}

// [Start] : selectbox 컴포넌트
function handleSelectboxClick(event) {
  event.stopPropagation();
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

  $trigger.toggleClass("active").attr("aria-expanded", function () {
    return $(this).hasClass("active") ? "true" : "false";
  });

  if ($trigger[0].classList.contains("selectbox-left")) {
    $options.css({ left: "0" });
  } else {
    $options.css({ right: "0" });
  }

  $(window)
    .resize(function () {
      if (window.innerWidth <= 1023) {
        if ($options.is(":visible")) {
          $(".selectbox-options li.moclose-btn").show();
          $(".selectbox-overlay").show();
        } else {
          $(".selectbox-overlay").hide();
          $(".selectbox-options li.moclose-btn").hide();
        }
        $(".selectbox-options li.moclose-btn button").click(function (event) {
          event.stopPropagation();

          if ($this.parents(".dropdown-menu").length) {
            $(".dropdown-menu").removeClass("non-sticky");
          }
          $(this)
            .closest(".selectbox-wrap>div")
            .find(".selectbox-trigger")
            .removeClass("active"); // close 버튼 클릭 시 모든 trigger의 active가 제거
          $(this).closest(".selectbox-options").hide();
          $(".selectbox-overlay").hide();
        });
      } else {
        $(".selectbox-options li.moclose-btn").hide();
        $(".selectbox-overlay").hide();
      }
    })
    .resize();
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
    .attr("aria-expanded", "false");
  $(window)
    .resize(function () {
      if (window.innerWidth <= 1023) {
        $(".selectbox-overlay").hide();
        $(".selectbox-options li.moclose-btn").hide();
      }
    })
    .resize();

  if ($selectboxWrap.hasClass("evtLayout-type")) {
    var options = [];

    var option1 = $(
      ".selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options"
    ).find(".option-click.active");
    var option2 = $(".selectbox-group > div.on .selectbox-options").find(
      ".option-click.active"
    );
    // if($(event.target).closest(".selectbox-group").length <= 0) {
    //   //var option1 = $(event.target).closest(".selectbox-wrap > div:not('.selectbox-group') .selectbox-options").find(".option-click.active");
    // } else {
    //   var option1 = $(".selectbox-wrap.evtLayout-type > div:not('.selectbox-group') .selectbox-options").find(".option-click.active");
    //   var option2 = $(".selectbox-group > div.on .selectbox-options").find(".option-click.active");
    // }

    var selectedArea = document.querySelector(
      ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
    ).innerText;
    var selectedNType = document.querySelector(
      "#countrySelect li.active"
    ).innerText;

    if (option2 == "" || option2 == undefined) {
      options.push(option1);
    } else {
      options.push(option1, option2);
    }

    // console.log(options);

    if (option1 != undefined || option2 != undefined) {
      evtImgMapChk(options, selectedArea, selectedNType, option1, option2);
    }
  }
}
// [End] : selectbox 컴포넌트

function evtImgMapChk(options, area, ntype, option1, option2) {
  var evtMapWrap = $(".evt-map-wrap");
  var evtMapDefultBtn = $(".evt-map-default-box > button");
  var evtMapActiveBox = $(".evt-map-active-box > button");
  var selectboxEvtLayout = $(option1).closest(".selectbox-wrap.evtLayout-type");
  var selectboxGroupItem = selectboxEvtLayout.find(".selectbox-group > div");
  var option1Idx = option1.index();

  if (option2 != undefined) {
    var option2Idx = option2.index();
  }

  area = area.toLowerCase();
  ntype = ntype.toLowerCase();

  //console.log("selected option idx값 : " + option1Idx + ", " + option2Idx + ", " + area + ", " + ntype);

  if (selectboxEvtLayout.hasClass("select-type01")) {
    // selectbox 1개 일 경우,
    if (evtMapWrap.hasClass("on")) {
      // 상세이미지 활성화일 경우,
      if (option1Idx > 0) {
        evtMapDefultBtn.hide();
        for (var i = 0; i < evtMapActiveBox.length; i++) {
          if (option1Idx == i + 1) {
            evtMapActiveBox[i].style.display = "block";
          } else {
            evtMapActiveBox[i].style.display = "none";
          }
        }
      }
    } else {
      evtMapActiveBox.hide();
      evtMapDefultBtn.show();
      for (var i = 0; i < evtMapActiveBox.length; i++) {
        if (option1Idx == i + 1) {
          var ariaControl = evtMapActiveBox[i].getAttribute("aria-controls");
          evtMapDefultBtn.attr("aria-controls", ariaControl);
        }
      }
    }
  } else if (selectboxEvtLayout.hasClass("select-type02")) {
    // selectbox 2개 일 경우,

    // selectbox 1번째 값에 따라 , 2번째 selectbox 노출
    if (selectboxGroupItem.length > 0) {
      for (var i = 0; i < selectboxGroupItem.length; i++) {
        if (selectboxGroupItem[i].classList.contains("on")) {
          selectboxGroupItem[i].classList.remove("on");
        }

        if (option1Idx == 1) {
          selectboxGroupItem[option1Idx - 1].classList.add("on");
        } else if (option1Idx == 2) {
          selectboxGroupItem[option1Idx - 1].classList.add("on");

          // option2Idx 존재시 초기화 check용 - 보완필요
          if (option1Idx == 2 && option2Idx == 2) {
            option2Idx = 1;
          }
        }
      }
    } else {
      alert("selectbox 2번째 항목 없음");
    }

    if (option2Idx > 0) {
      if (evtMapWrap.hasClass("on")) {
        // + 버튼 활성화 이미지 노출 케이스일 경우,
        evtMapDefultBtn.hide();
        if (option1Idx == 1 && option2Idx == 1) {
          for (var i = 0; i < evtMapActiveBox.length; i++) {
            if (
              evtMapActiveBox[i].getAttribute("aria-controls") == "pop-nZone"
            ) {
              evtMapActiveBox[i].style.display = "block";
            } else {
              evtMapActiveBox[i].style.display = "none";
            }
          }
        } else if (option1Idx == 1 && option2Idx == 2) {
          for (var i = 0; i < evtMapActiveBox.length; i++) {
            if (
              evtMapActiveBox[i].getAttribute("aria-controls") ==
              "pop-nExperZone"
            ) {
              evtMapActiveBox[i].style.display = "block";
            } else {
              evtMapActiveBox[i].style.display = "none";
            }
          }
        } else if (option1Idx == 2 && option2Idx == 1) {
          for (var i = 0; i < evtMapActiveBox.length; i++) {
            if (
              evtMapActiveBox[i].getAttribute("aria-controls") == "pop-nFanZone"
            ) {
              evtMapActiveBox[i].style.display = "block";
            } else {
              evtMapActiveBox[i].style.display = "none";
            }
          }
        }
      } else {
        // - 버튼 클릭 or 기본 이미지 노출 케이스일 경우,
        evtMapActiveBox.hide();
        if (evtMapDefultBtn.length > 1) {
          // 기본 이미지 2개이상 노출될 경우
          if (option1Idx == 1 && option2Idx == 1) {
            for (var i = 0; i < evtMapDefultBtn.length; i++) {
              if (
                evtMapDefultBtn[i].getAttribute("aria-controls") == "pop-nZone"
              ) {
                evtMapDefultBtn[i].classList.add("active");
                evtMapDefultBtn[i].style.display = "block";
              } else {
                evtMapDefultBtn[i].classList.remove("active");
                evtMapDefultBtn[i].style.display = "none";
              }
            }
          } else if (option1Idx == 1 && option2Idx == 2) {
            for (var i = 0; i < evtMapDefultBtn.length; i++) {
              if (
                evtMapDefultBtn[i].getAttribute("aria-controls") ==
                "pop-nExperZone"
              ) {
                evtMapDefultBtn[i].classList.add("active");
                evtMapDefultBtn[i].style.display = "block";
              } else {
                evtMapDefultBtn[i].classList.remove("active");
                evtMapDefultBtn[i].style.display = "none";
              }
            }
          } else if (option1Idx == 2 && option2Idx == 1) {
            for (var i = 0; i < evtMapDefultBtn.length; i++) {
              if (
                evtMapDefultBtn[i].getAttribute("aria-controls") ==
                "pop-nFanZone"
              ) {
                evtMapDefultBtn[i].classList.add("active");
                evtMapDefultBtn[i].style.display = "block";
              } else {
                evtMapDefultBtn[i].classList.remove("active");
                evtMapDefultBtn[i].style.display = "none";
              }
            }
          }
        } else {
          // 기본 이미지 1개인 경우
          if (option1Idx == 1 && option2Idx == 1) {
            evtMapDefultBtn.attr("aria-controls", "pop-nZone");
          } else if (option1Idx == 1 && option2Idx == 2) {
            evtMapDefultBtn.attr("aria-controls", "pop-nExperZone");
          } else if (option1Idx == 2 && option2Idx == 1) {
            evtMapDefultBtn.attr("aria-controls", "pop-nFanZone");
          }
        }
      }
    }
  }

  scrollToCenter(".event-box .evt-map-img");
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
        } else {
          nearVideo.pause();
          iconInBtn.classList.remove("icon-pause-wh");
          iconInBtn.classList.add("icon-play-wh");
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

    // alert($(this).html());
    if ($(this).offset().left - cardConRightEdge > 30) {
      $(".card-hashtag button.ellipsis").nextAll().hide();
      $(".card-hashtag button.ellipsis").hide();
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
        $(this).attr("title", "pause");
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
        $(this).attr("title", "play");
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
        $(this).attr("title", "sound on");
      } else {
        icon.attr("class", "btn-icon24 icon-soundoff-wh");
        if (window.innerWidth <= 1023) {
          videoMo.muted = true; //음소거
        } else {
          videoPc.muted = true;
        }
        $(this).attr("title", "sound off");
      }
    }
  );

  // 비디오가 끝났을 때 썸네일 나오도록
  $(".models-wrap .content-item02 video").on("ended", function () {
    // console.log("비디오 끝 / 썸넬 시작");
    // $(this).get(0).currentTime = 0;
    var icon = $(this).siblings("button").children(".btn-icon24");
    icon.attr("class", "btn-icon24 icon-play-wh");
  });
  $(window).resize(function () {
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
      // $(".models-wrap .content-item02 video.pc-only").on("ended", function () {
      //   $(this).siblings(".video_poster.pc-only").show();
      //   $(this).siblings(".video_poster.mo-only").hide();
      //   // pc 비디오 hidden
      //   $(this).attr("aria-hidden", true);
      // });
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
      $(".configurator_swiper .swiper-slide img").hide();
      // $(".configurator_swiper .swiper-slide img").attr(
      //   "src",
      //   "../../inc/images/Configurator/NEN_EXT_XFB_LD_C003.jpg"
      // ); // 이미지 교체 확인용 임시 스크립트
      $(".configurator_swiper .swiper-slide img").fadeIn(300);
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
  var scrollWrap = $(".configurator_area");
  let scrollPrev = 0,
    scrollTop = 1;

  scrollWrap.scroll(function () {
    scrollTop = scrollWrap.scrollTop();

    if (scrollTop > 0) {
      if (scrollTop >= scrollPrev) {
        // 스크롤 위치 증가
        $(".configurator_header_wrap").addClass("scroll-on");
        $(".configurator_swiper_wrap").removeClass("scroll-on");
        $(".configurator_price_wrap").removeClass("scroll-on");
      } else {
        // 스크롤 위치 감소
        $(".configurator_header_wrap").removeClass("scroll-on");
        $(".configurator_swiper_wrap").addClass("scroll-on");
        $(".configurator_price_wrap").addClass("scroll-on");
      }
      setTimeout(function () {
        scrollPrev = scrollTop;
      }, 10);
    }
  });
}
// [End] : configuratorScroll

// scroll 이벤트 추가
// masonryLayout 높이 추가로 잡기
let $firstScroll = true;
function scrollEvent() {
  var scrollWrap = $("body"),
    sectionItem = [],
    historyItemOffset = [],
    historyItemPosition = [],
    leftScrollData = [];
  headerNavHeight = $(".navigation_bar-wrap").height();
  let scrollPrev = 0,
    scrollTop = 1;
  scrollWrap.find(".content-area > [class*=content-item]").each(function (e) {
    ($this = $(this)),
      (sectionItem[e] = $this.position().top - headerNavHeight);
  });

  scrollWrap.scroll(function () {
    if ($firstScroll) {
      pubUi.masonryLayout();
      $firstScroll = false;
    }
    // alert('d')
    var thisScrArea = $(this),
      scrItem = thisScrArea.find(".content-area > [class*=content-item]"),
      nowScroll = thisScrArea.scrollTop(),
      sectionLength = scrItem.length;

    let scrollY = (
      (scrollWrap.scrollTop() / ($(".wrap").height() - scrollWrap.height())) *
      100
    ).toFixed(3);
    scrollTop = scrollWrap.scrollTop();

    var contentItem = document.querySelectorAll(
      ".content-area > [class*=content-item]"
    );

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

    contentItem.forEach((evt, idx) => {
      if (contentItem[idx].querySelector(".blue-title")) {
        contentItem[idx].classList.add("active");
      }
      contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성
    });

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
    if ($(".navigation-item02").length) {
      if ($(".navigation-item02").scrollLeft() > 0) {
        $(".navigation-item02")
          .stop()
          .animate({
            scrollLeft:
              $(".navigation-item02 li button.on").offset().left +
              $(".navigation-item02").scrollLeft() -
              24,
          });
      } else {
        $(".navigation-item02")
          .stop()
          .animate({
            scrollLeft: $(".navigation-item02 li button.on").offset().left - 24,
          });
      }
    }
  });

  if ($(".history-list").length) {
    moveItem = $(".history-pointer");
    historyItemLength = $(".history-list > li").length;
    $(".history-list > li").each(function (e) {
      _this = $(this);
      historyItemOffset[e] = _this.offset().top;
      historyItemPosition[e] = _this.position().top;
    });
    $(".history-list")
      .find("img")
      .ready(function () {
        $(".history-list > li").each(function (e) {
          _this = $(this);
          historyItemOffset[e] = _this.offset().top;
          historyItemPosition[e] = _this.position().top;
        });
      });
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
      scrollTop = scrollWrap.scrollTop();
      for (var i = 0; i < historyItemLength; i++) {
        if (scrollTop + dateGapScroll > historyItemOffset[i]) {
          moveItemTop = historyItemPosition[i + 1];
        } else if (scrollTop <= historyItemOffset[0]) {
          moveItemTop = historyItemPosition[0];
        }
        // console.log(_this.attr("class"));
      }
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
  // 07.30 추가 - 모바일에서 navigation-bar 존재 시, 컨텐츠영역 상단 짤림 현상 방지
  if ($(".navigation_bar-wrap").length > 0) {
    $(".wrap .content-area").css("padding-top", "48px");
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
