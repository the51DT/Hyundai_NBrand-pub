var pubUi = {
  init: function () {
    var self = this;
    self.settings();
    self.bindEvents();
    self.swiperSlideEvent();
    self.masonryLayout();
    btnNaviCheck();
    // self.videoControlerChk("");

    if ($(".ty01Swiper") != undefined && $(".ty01Swiper").length > 0) {
      self.videoBulletChk(".ty01Swiper");
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
    self.swiper4;
    self.typeChk = $(".ty01Swiper").find(".swiper-slide video");
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
      var videoChk = targetSwiper.find(".swiper-slide video");

      if (targetSwiper.hasClass("ty02Swiper")) {
        if ($(this).hasClass("on")) {
          // console.log("정지버튼 클릭!");
          $(this).removeClass("on");
          $(this).find(".visually-hidden").text("정지");
          targetSwiper[0].swiper.autoplay.stop();
        } else {
          // console.log("재생버튼 클릭!");
          $(this).addClass("on");
          $(this).find(".visually-hidden").text("재생");
          targetSwiper[0].swiper.autoplay.start();
        }
      } else if (targetSwiper.hasClass("ty01Swiper")) {
        // ty01Swiper - video 케이스 아닐 경우,
        if (videoChk.length > 0) {
          if ($(this).hasClass("on")) {
            // console.log("정지버튼 클릭!");
            $(this).removeClass("on");
            $(this).find(".visually-hidden").text("정지");
          } else {
            // console.log("재생버튼 클릭!");
            $(this).addClass("on");
            $(this).find(".visually-hidden").text("재생");
          }

          self.videoControlerChk(targetSwiper);
        } else {
          if ($(this).hasClass("on")) {
            // console.log("정지버튼 클릭!");
            $(this).removeClass("on");
            $(this).find(".visually-hidden").text("정지");
            targetSwiper[0].swiper.autoplay.stop();
          } else {
            // console.log("재생버튼 클릭!");
            $(this).addClass("on");
            $(this).find(".visually-hidden").text("재생");
            targetSwiper[0].swiper.autoplay.start();
          }
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
        self.$btnSound.find(".visually-hidden").text("소리 끄기");
        targetSwiper.find("video").prop("muted", true);
      } else {
        // console.log("소리 켜기버튼 클릭!");
        self.$btnSound.addClass("on");
        self.$btnSound.find(".visually-hidden").text("소리 켜기");
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

    // 이벤트 레이아웃 마이너스 버튼 클릭시, 추 후 요건 확정 후 재작업 예정
    $(".event-box .btn-wrap.plus").click(function (e) {
      var options = [];
      var option1 = $(".list-content.active .evtLayout-type div")
        .filter(":first-child")
        .find(".option-click.active")
        .text();
      var option2 = $(".list-content.active .evtLayout-type div")
        .filter(":last-child")
        .find(".option-click.active")
        .text();

      var selectedArea = document.querySelector(
        ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
      ).innerText;
      console.log(selectedArea);

      if ($(".evt-map-wrap").hasClass("on")) {
        alert(
          "현재 이미지보다 큰 이미지를 볼 수 없습니다. \n이전 이미지로 돌아가려면 - 버튼을 눌러주세요. "
        );
      } else {
        if (option2 == "" || option2 == undefined) {
          options.push(option1);
        } else {
          options.push(option1, option2);
        }

        console.log(options);

        if (options) {
          $(".evt-map-wrap").addClass("on");
          evtImgMapChk(options, selectedArea);
        }
      }
    });

    $(".event-box .btn-wrap.minus").click(function (e) {
      var options = [];

      var option1 = $(".list-content.active .evtLayout-type div")
        .filter(":first-child")
        .find(".option-click.active")
        .text();
      var option2 = $(".list-content.active .evtLayout-type div")
        .filter(":last-child")
        .find(".option-click.active")
        .text();

      var selectedArea = document.querySelector(
        ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
      ).innerText;
      console.log(selectedArea);

      if (option2 == "" || option2 == undefined) {
        options.push(option1);
      } else {
        options.push(option1, option2);
      }

      console.log(options);

      if (options) {
        $(".evt-map-wrap").removeClass("on");
        evtImgMapChk(options, selectedArea);
      }
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

    $(".ty01Swiper .swiper-button-next, .ty01Swiper .swiper-button-prev").on(
      "click",
      function () {
        var targetSwiper = $(this).closest(".swiper");
        var videoChk = targetSwiper.find(".swiper-slide video");

        if (videoChk.length > 0) {
          targetSwiper.find(".swiper-slide-active video")[0].pause();
        }
      }
    );

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
    var videoOption;

    if (self.typeChk.length > 0) {
      //동영상 타입일 경우,
      touchFlag = 0;
      autoplayVal = false;
    } else {
      //이미지 타입일 경우,
      touchFlag = 1;
      autoplayVal = {
        delay: 3000,
        disableOnInteraction: false,
      };
    }

    // console.log("스와이퍼 이벤트 진입");

    var swiper1 = new Swiper(".ty01Swiper", {
      slidesPerView: 1,
      watchOverflow: true, //pagination 1개 일 경우, 숨김
      initialSlide: 0,
      touchRatio: touchFlag, // 드래그 X : 0 , 드래그 O : 1
      loop: true,
      autoplay: autoplayVal,
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
      on: {
        init: function () {
          $(".swiper-pagination-custom .swiper-pagination-bullet").html(
            "<div class='seek-bar'></div>"
          );
        },
        slideChangeTransitionStart: function () {
          if (self.typeChk.length > 0) {
            // 동영상 케이스,
            $(".ty01Swiper .swiper-slide-active video")[0].currentTime = 0;
            $(
              ".ty01Swiper .swiper-pagination-custom .swiper-pagination-bullet .seek-bar"
            ).css("--time", "0");

            pubUi.videoBulletChk(".ty01Swiper", this.realIndex);
          } else {
            // 동영상 x 케이스,
            if (
              !$(
                ".swiper-pagination-custom .swiper-pagination-bullet"
              ).hasClass(".swiper-pagination-bullet-active")
            ) {
              $(
                ".swiper-pagination-custom .swiper-pagination-bullet:not(.swiper-pagination-bullet-active)"
              ).css("background-color", "#fff");
            }

            $(".swiper-pagination-custom .swiper-pagination-bullet-active").css(
              "background-color",
              "#de3111"
            );
          }
        },
      },
    });

    swiper2SlideEvt(); //swiper2 이벤트 실행

    var swiper3 = new Swiper(".ty03Swiper", {
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
          slidesPerView: 1.5,
          spaceBetween: 12,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });

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
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
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
    // var swiper9 = new Swiper(".configurator_swiper", {
    //   slidesPerView: 1,
    //   centeredSlides: true,
    //   navigation: {
    //     nextEl: ".configurator_swiper .swiper-button-next",
    //     prevEl: ".configurator_swiper .swiper-button-prev",
    //   },
    //   pagination: {
    //     el: ".configurator_swiper .swiper-pagination-custom",
    //     clickable: true,
    //   },
    // });
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
      slidesPerView: 3,
      spaceBetween: 24,
      watchOverflow: true,
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
          slidesPerView: 1.07,
          spaceBetween: 12,
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
        768: {
          slidesPerView: 1.07,
          spaceBetween: 12,
          slidesOffsetBefore: 24,
          slidesOffsetAfter: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  },
  videoBulletChk: function (targetSwiper, targetIdx) {
    var self = this;

    if (!targetSwiper.length > 0) {
      return;
    }

    if (self.typeChk.length > 0) {
      // console.log("비디오 타입");
      var slide = $(targetSwiper);
      var slideActive = slide.find(".swiper-slide-active");
      var playBtn = slide.find(".btn-play").hasClass("on");
      var videoId = slideActive.find(".video").attr("id");

      if (targetIdx == undefined) {
        targetIdx = 0;
      }

      // console.log("타겟인덱스: " + targetIdx + " 비디오 Id값: " + videoId);
      //var slides = document.querySelectorAll(".ty01Swiper .swiper-slide");
      var video = document.querySelector(`#${videoId}`);

      if (slideActive) {
        if (playBtn) {
          video.play();
        } else {
          // console.log("비디오 일시정지 상태 입니다.");
          // $(".swiper-pagination-bullet-active .seek-bar").css("--time", "8px");
        }
      }

      video.addEventListener(
        "timeupdate",
        function (e) {
          var curTime = Math.floor(video.currentTime); // 현재 동영상 길이
          var duration = Math.floor(video.duration); // 동영상 전체 길이
          var per = Math.floor((curTime / duration) * 100); // 퍼센트 계산 값

          if (per <= 100) {
            document
              .querySelector(".swiper-pagination-bullet-active .seek-bar")
              .style.setProperty("--time", `${per}px`);

            // $("#paging").css("color", "#fff");
            // $("#paging").html("퍼센트: " + per);
          }

          if (curTime == duration) {
            slide[0].swiper.slideNext();
            curTime = 0;
          }
        },
        false
      );
    } else {
      // console.log("비디오 타입 X");
      $(".seek-bar").remove();
      $(targetSwiper).find(".btn-sound").hide();
      $(".swiper-pagination-custom .swiper-pagination-bullet-active").css(
        "background-color",
        "#de3111"
      );
      return;
    }
  },
  videoControlerChk: function (targetSwiper) {
    var swiperActiveVideo = targetSwiper.find(".swiper-slide-active video");
    var targetBulletActive = targetSwiper.find(
      ".swiper-pagination-custom .swiper-pagination-bullet-active .seek-bar"
    );
    // var targetBulletWidth = "";

    if (swiperActiveVideo.length > 0) {
      var curTime = swiperActiveVideo[0].currentTime;
      var duration = swiperActiveVideo[0].duration;
      var per = (curTime / duration) * 100;
      const playBtnOn = targetSwiper.find(".btn-play").hasClass("on");
      const soundBtnOn = targetSwiper.find(".btn-sound").hasClass("on");

      if (swiperActiveVideo[0].paused) {
        swiperActiveVideo[0].play();
        //console.log("영상 재생!!!!!!!");
      } else {
        swiperActiveVideo[0].pause();
        //console.log("영상 정지!!!!!!!");
      }
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

    contentItem.forEach((evt, idx) => {
      contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성

      if (evt.dataset.scroll == dataScroll) {
        //nav data-scroll과 값비교 후 동일 대상 체크
        var offsetTopVal = evt.offsetTop - navBarHeight;
      }

      $("body").animate({ scrollTop: offsetTopVal }, 300);
    });
  },
  listContsActive: function (target) {
    var targetSwiper = $(target).parents(".swiper-slide");
    var swiperDataCont = targetSwiper.data("content");
    var swiperContents = $(".section_list .list-content");
    var contentDataCont;

    // ty05Swiper, 슬라이드 클릭 시, active 처리
    targetSwiper.siblings().removeClass("active");
    targetSwiper.addClass("active");

    setTimeout(function () {
      document.querySelector(".ty05Swiper").swiper.update();
    }, 500);

    // 사용 안함 - 개발에서 제어
    var raceRank = targetSwiper.find(".card_top .card_rank").text();
    var raceMonth = targetSwiper.find(".card_bottom .card_badge").text();
    var raceDay = targetSwiper.find(".card_bottom .card_tit").text();
    var raceLocation = targetSwiper.find(".card_bottom .card_subtit").text();

    // console.log(raceRank, raceMonth, raceDay, raceLocation);

    swiperContents.removeClass("active");
    swiperContents.hide();
    swiperContents.find(".evtLayout-type").removeClass(raceLocation);

    for (var i = 0; i < swiperContents.length; i++) {
      contentDataCont = swiperContents[i].dataset.content;

      if (swiperDataCont == contentDataCont) {
        swiperContents[i].style.display = "block";
        swiperContents[i].classList.add("active");
      }
    }

    if (!swiperContents.hasClass("active")) {
      alert("Comming soon !");
      targetSwiper.removeClass("active");
    }
  },
  overScroll: function (cl) {
    const slider = document.querySelectorAll(cl);
    if (!slider) return;
    slider.forEach((el)=>{
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
    })
  },
};
let resizeTimer = null;
$(window).resize(function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(hasTagFunResize(), perforSlideMoveFun(), 10);
});
$(document).ready(function () {
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
  hasTagFun();
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

  $(".ty01Swiper .swiper-pagination-bullet").on("click", function () {
    var targetSwiper = $(this).closest(".swiper");
    var videoChk = targetSwiper.find(".swiper-slide video");

    if (videoChk.length > 0) {
      targetSwiper.find(".swiper-slide-active video")[0].pause();
    }
  });
  toggleFullscreen();

  $(window).resize(function () {
    if ($(window).innerWidth() < 1024) {
      if (self.swiper2.length > 0) {
        for (var i = 0; i < self.swiper2.length; i++) {
          self.swiper2[i].destroy();
          // console.log("swiper2 destroy!!!");
        }
      } else {
        if (self.swiper2.slides.length > 0 && self.swiper2 != undefined) {
          self.swiper2.destroy();
          // console.log("swiper2 destroy")
        }
      }

      swiper2SlideEvt();
    }

    if (self.swiper4.length > 0) {
      for (var i = 0; i < self.swiper4.length; i++) {
        self.swiper4[i].destroy();
        // console.log("swiper4 destroy!!!");
      }
    } else {
      if (self.swiper4.slides.length > 0 && self.swiper4 != undefined) {
        self.swiper4.destroy();
        // console.log("swiper4 destroy");
      }
    }
    swiper4SlideEvt();

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

  if ($(".ty02Swiper .swiper-slide").length >= 3) {
    loopVal = true;
  } else {
    loopVal = false;
  }

  self.swiper2 = new Swiper(".ty02Swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: loopVal,
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
        spaceBetween: 60,
      },
    },
    on: {
      activeIndexChange: function () {
        slideInx = this.realIndex; //현재 슬라이드 index 갱신
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
      1023: {
        slidesPerView: "auto",
        spaceBetween: 12,
        slidesOffsetBefore: leftSpaceVal,
        slidesOffsetAfter: 80,
      },
      1280: {
        slidesPerView: "auto",
        spaceBetween: 12,
        slidesOffsetBefore: leftSpaceVal,
        slidesOffsetAfter: 80,
      },
      2100: {
        slidesPerView: "auto",
        spaceBetween: 12,
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
    var option1 = $(".list-content.active .evtLayout-type div")
      .filter(":first-child")
      .find(".option-click.active")
      .text();
    var option2 = $(".list-content.active .evtLayout-type div")
      .filter(":last-child")
      .find(".option-click.active")
      .text();

    var selectedArea = document.querySelector(
      ".ty05Swiper .swiper-slide.active .card_info .card_subtit"
    ).innerText;

    if (option2 == "" || option2 == undefined) {
      options.push(option1);
    } else {
      options.push(option1, option2);
    }

    // console.log(options);

    if (option1 != undefined && option2 != undefined) {
      evtImgMapChk(options, selectedArea);
    }
  }
}
// [End] : selectbox 컴포넌트

// 추 후 이미지 교체 필요
function evtImgMapChk(options, area) {
  var evtMapImage = $(".evt-map-wrap .evt-map-img img");
  var swiperContentsActive = $(".section_list .list-content.active");
  var evtSelect = swiperContentsActive.find(".evtLayout-type > div");

  var evtMapPopBtn = $(".evt-map-wrap .evt-map-img .btn-evtmap-pop");
  var evtMapPopLayerId = $(".side-popup").attr("id");

  console.log(evtMapImage);
  var option1 = options[0];
  var option2 = options[1];

  var selectedArea = area.toLowerCase();
  console.log(selectedArea);

  if ($(".evt-map-wrap").hasClass("on")) {
    if (evtSelect.length > 1) {
      console.log("셀렉트 박스 2개");
      if (
        selectedArea == "yongin" ||
        selectedArea == "youngin everland speedium"
      ) {
        if (option1 == "A Paddock" && option2 == "N Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_A_NZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nZone");
        } else if (option1 == "A Paddock" && option2 == "N Experience zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_A_ExperZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nExperZone");
        } else if (option1 == "B Paddock" && option2 == "N Fan Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_B_FanZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nFanZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      }
    } else {
      console.log("셀렉트 박스 1개");
      if (selectedArea == "inje" || selectedArea == "inje speedium") {
        if (option1 == "N Lounge") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_nLounge.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nLounge");
        } else if (option1 == "Motorsport Experience") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_motorExperience.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-motorExperience");
        } else if (option1 == "Viewing zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_viewingZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-viewingZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      } else if (
        selectedArea == "yeongam" ||
        selectedArea == "korea international circuit"
      ) {
        if (option1 == "Experience Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_yeongam_ExperZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamExperZone");
        } else if (option1 == "Motorsport Experience") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_yeongam_MotorExper.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamMotorExper");
        } else if (option1 == "Viewing zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_max_yeongam_ViewingZone.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamViewingZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      }
    }
  } else {
    if (evtSelect.length > 1) {
      console.log("셀렉트 박스 2개");
      if (
        selectedArea == "yongin" ||
        selectedArea == "youngin everland speedium"
      ) {
        if (option1 == "A Paddock" && option2 == "N Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg02.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nZone");
        } else if (option1 == "A Paddock" && option2 == "N Experience zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg02.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nExperZone");
        } else if (option1 == "B Paddock" && option2 == "N Fan Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg03.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nFanZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      }
    } else {
      console.log("셀렉트 박스 1개");
      if (selectedArea == "inje" || selectedArea == "inje speedium") {
        if (option1 == "N Lounge") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg01.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-nLounge");
        } else if (option1 == "Motorsport Experience") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg01.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-motorExperience");
        } else if (option1 == "Viewing zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg01.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-viewingZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      } else if (
        selectedArea == "yeongam" ||
        selectedArea == "korea international circuit"
      ) {
        if (option1 == "Experience Zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg04.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamExperZone");
        } else if (option1 == "Motorsport Experience") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg04.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamMotorExper");
        } else if (option1 == "Viewing zone") {
          evtMapImage.attr(
            "src",
            "../../inc/images/eventLayout/evtLayout_min_shortImg04.png"
          );
          evtMapPopBtn.attr("aria-controls", "pop-yeongamViewingZone");
        } else {
          alert(
            "조건에 맞지 않습니다. 지역에 맞는 이벤트 옵션을 선택해주세요."
          );
        }
      }
    }
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

  // 영상 필터링 파싱 시작
  // function ControlVideo() {
  //   const videoWrap = document.querySelectorAll(".video-wrapper");
  //   const video = document.querySelectorAll(".popup video");
  //   video.muted = true;

  //   const videoUrlList = [
  //     [
  //       {
  //         //MD010101t01P01 모두 미수급 상태
  //         id: "MD010101t01P01_IONIQ5N",
  //         url: "../../inc/videos/i20n.mp4",
  //         type: "video/mp4",
  //       },
  //       {
  //         id: "MD010101t01P01_IONIQ5N",
  //         url: "../../inc/videos/24hnbr24.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         //MD010101t01P01 모두 미수급 상태
  //         id: "MD010101t01P01_i20N",
  //         url: "../../inc/videos/i20n.mp4",
  //         type: "video/mp4",
  //       },
  //       {
  //         id: "MD010101t01P01_i20N",
  //         url: "../../inc/videos/24hnbr24.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         id: "MD010201t01P01",
  //         url: "../../inc/videos/elantraN-video01.mp4",
  //         type: "video/mp4",
  //       },
  //       {
  //         id: "MD010201t01P01",
  //         url: "../../inc/videos/elantraN-video02.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         // MD010401t01P01 영상 미수급 상태
  //         id: "MD010401t01P01",
  //         url: "../../inc/videos/elantraN-video01.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         id: "MD020201P01",
  //         url: "../../inc/videos/IONIQ5N-eN1-Cup-video01.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         id: "MD020301P01",
  //         url: "../../inc/videos/IONIQ5N-TA-video01.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         id: "MD040201P01",
  //         url: "../../inc/videos/IONIQ5N-NPX1-video01.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       {
  //         id: "MD050901P01",
  //         url: "../../inc/videos/VELOSTERN-video01.mp4",
  //         type: "video/mp4",
  //       },
  //       {
  //         id: "MD050901P01",
  //         url: "../../inc/videos/VELOSTERN-video02.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //     [
  //       // 더미 페이지입니다. 추후 삭제 예정입니다.
  //       {
  //         id: "modelPop_test",
  //         url: "../../inc/videos/elantra-n-kv.mp4",
  //         type: "video/mp4",
  //       },
  //       {
  //         id: "modelPop_test",
  //         url: "../../inc/videos/i20n.mp4",
  //         type: "video/mp4",
  //       },
  //     ],
  //   ];

  //   videoWrap.forEach((el) => {
  //     const videoId = el.id;
  //     const filteredVideo = [];

  //     videoUrlList.forEach((list) => {
  //       list.forEach((item) => {
  //         if (item.id === videoId) {
  //           filteredVideo.push(item);
  //         }
  //       });
  //     });

  //     video.forEach((videoEl, index) => {
  //       if (index < filteredVideo.length) {
  //         const videoData = filteredVideo[index];
  //         const sourceEl = document.createElement("source");
  //         sourceEl.src = videoData.url;
  //         sourceEl.type = videoData.type;
  //         videoEl.muted = true;
  //         videoEl.appendChild(sourceEl);
  //       }
  //     });
  //   });
  //   // 영상 필터링 파싱 끝

  //   // 영상 플레이어 제어 시작
  //   const videoBtn = document.querySelectorAll(
  //     ".popup .wrap-model-video .btn-model-play"
  //   );

  //   videoBtn.forEach((btn, indexx) => {
  //     const eachVideos = video[indexx];
  //     const eachPlayBtns = videoBtn[indexx];

  //     btn.addEventListener("click", () => {
  //       eachVideos.paused
  //         ? playVideo(eachVideos, eachPlayBtns)
  //         : pauseVideo(eachVideos, eachPlayBtns);
  //     });

  //     eachVideos.addEventListener("pause", () => {
  //       setTimeout(() => {
  //         eachPlayBtns.style.opacity = "1";
  //       }, 300);
  //     });

  //     eachVideos.addEventListener("play", () => {
  //       eachVideos.muted = true;
  //       eachPlayBtns.style.opacity = "0";
  //     });

  //     // 모델 팝업이 닫혔을 때 스크롤, 영상 초기화 처리
  //     const popCloseBtn = document.querySelector(
  //       ".popup-wrapper .btn-wrap button.btn-only-icon-notbg.pop-close"
  //     );
  //     const popupBody = document.querySelector(
  //       ".popup.model-popup.forModel .popup-body"
  //     );

  //     popCloseBtn.addEventListener("click", () => {
  //       {
  //         eachVideos.paused ? null : resetVideo(eachVideos);
  //       }

  //       setTimeout(() => {
  //         popupBody.scrollTop = 0;
  //       }, 250);
  //     });
  //   });

  //   function playVideo(video, button) {
  //     video.play();
  //     button.style.opacity = "0";
  //   }

  //   function pauseVideo(video, button) {
  //     video.pause();

  //     button.style.opacity = "1";
  //   }

  //   function resetVideo(video) {
  //     video.play();
  //     video.currentTime = 0;
  //   }
  // }

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

// [Start] : hashTag 말줄임
function hasTagFun() {
  $(".card-hashtag button").each(function (e) {
    var $set = $(this);
    var $setUl = $(this).parent();
    var cardConRightEdge = $setUl.outerWidth();
    var liRightEdge =
      $set.offset().left - $setUl.offset().left + $set.outerWidth(true);
    if (liRightEdge >= cardConRightEdge) {
      $(this).addClass("ellipsis");
    } else {
      $(this).removeClass("ellipsis");
    }

    $set.siblings(".ellipsis").first().show();
    $set.siblings(".ellipsis").nextAll().hide(); // EP040501 - Pony Magazine 제목 참고 (안하면 button.ellipsis 뒤에 li들 다 살아있음 - 그래서 button.ellipsis 너비 줄어듦)
  });
}

function hasTagFunResize() {
  $("div.card-hashtag button").show().removeClass("ellipsis");
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
$("#ToggleDesBtn").click(function () {
  $(".des-toggle").toggleClass("rotate");
  $("#ToggleDesBtn").children(".icon-down").toggleClass("rotate");
});
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
function perforSlideMoveFun() {
  var _$this = $(this),
    _viewType = "web",
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

  if (document.documentElement.clientWidth == 1024) {
    _viewType = "tablet";
  }

  evtMove();
  function evtMove() {
    _$moveBtn.on("mousedown keydown touchstart", function (e) {
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
          console.log(_offset);
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
  $(".models-wrap .content-item02 .btn-only-icon-bg01-square").click(
    function () {
      console.log("비디오 재생 ing");
      var videoPc = $(this).siblings("video.pc-only").get(0);
      var videoMo = $(this).siblings("video.mo-only").get(0);
      var icon = $(this).children(".btn-icon24");
      var pcPoster = $(this).siblings(".video_poster.pc-only");
      var moPoster = $(this).siblings(".video_poster.mo-only");

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
      }
    }
  );

  // 비디오가 끝났을 때 썸네일 나오도록
  $(".models-wrap .content-item02 video").on("ended", function () {
    console.log("비디오 끝 / 썸넬 시작");
    var icon = $(this).siblings("button").children(".btn-icon24");
    icon.attr("class", "btn-icon24 icon-play-wh");
  });
  $(window)
    .resize(function () {
      if (window.innerWidth <= 1023) {
        // mo 영상 살리기 & pc 영상 hidden
        $(".models-wrap .content-item02 video.mo-only").attr(
          "aria-hidden",
          false
        );
        $(".models-wrap .content-item02 video.pc-only").attr(
          "aria-hidden",
          true
        );
        // mo 영상 끝났을 때
        $(".models-wrap .content-item02 video.mo-only").on(
          "ended",
          function () {
            $(this).siblings(".video_poster.mo-only").show();
            $(this).siblings(".video_poster.pc-only").hide();
            // mo 비디오 hidden
            $(this).attr("aria-hidden", true);
          }
        );
      } else if (window.innerWidth > 1023) {
        // pc 영상 살리기 & mo 영상 hidden
        $(".models-wrap .content-item02 video.pc-only").attr(
          "aria-hidden",
          false
        );
        $(".models-wrap .content-item02 video.mo-only").attr(
          "aria-hidden",
          true
        );
        // pc 영상 끝났을 때
        $(".models-wrap .content-item02 video.pc-only").on(
          "ended",
          function () {
            $(this).siblings(".video_poster.pc-only").show();
            $(this).siblings(".video_poster.mo-only").hide();
            // pc 비디오 hidden
            $(this).attr("aria-hidden", true);
          }
        );
      }
    })
    .resize();
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
    headerNavHeight = $(".navigation_bar-wrap").height();
  let scrollPrev = 0,
    scrollTop = 1;
  scrollWrap.find(".content-area > [class*=content-item]").each(function (e) {
    ($this = $(this)),
      (sectionItem[e] = $this.position().top - headerNavHeight);

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

      // console.log(
      //   "스크롤 좌표값 체크 - scrollTop : ",
      //   scrollTop + " scrollY % 값 : ",
      //   scrollY + "%"
      // );

      // console.log(scrollTop, scrollPrev);

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
        contentItem[idx].setAttribute("data-scroll", idx + 1); // 각 콘텐츠에 data-scroll 생성
      });

      for (var i = 0; i < sectionLength; i++) {
        if (sectionItem[i] <= nowScroll + 40) {
          $(".navigation-item02.pc-only li")
            .eq(i)
            .find("button")
            .addClass("on")
            .parent()
            .siblings()
            .find("button")
            .removeClass("on");
        }
      }
    });
  });
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
  $(window).resize(() => {
    setVh();
  });
};
