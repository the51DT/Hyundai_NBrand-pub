var pubUi = {
  init: function () {
    var self = this;
    self.settings();
    self.bindEvents();
    self.swiperSlideEvent();
    self.masonryLayout();
    // self.videoControlerChk("");
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

    // 스와이퍼 재생 버튼 클릭시,
    $(".btn-play").on("click", function (e) {
      e.preventDefault();
      var targetSwiper = $(this).closest(".swiper");

      self.videoControlerChk(targetSwiper);

      if ($(this).hasClass("on")) {
        console.log("정지버튼 클릭!");
        // targetSwiper.find(".btn-play").removeClass("on");
        // targetSwiper.find(".btn-play .visually-hidden").text("정지");
        targetSwiper[0].swiper.autoplay.stop();
        $(this).removeClass("on");
        $(this).find(".visually-hidden").text("정지");
      } else {
        console.log("재생버튼 클릭!");
        // targetSwiper.find(".btn-play").addClass("on");
        // targetSwiper.find(".btn-play .visually-hidden").text("재생");
        targetSwiper[0].swiper.autoplay.start();
        $(this).addClass("on");
        $(this).find(".visually-hidden").text("재생");
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

    // 리셋 버튼 클릭시,
    self.$btnReset.on("click", function (e) {
      e.preventDefault();
      self.$searchBox.querySelector("input").value = "";
    });

    // 태그 버튼 클릭시,
    $(".tag-list li a").click(function (e) {
      var tagList = $(this).closest(".tag-list-wrap").find(".tag-list");
      self.tagBtnEvent(e.target, tagList);
    });

    $(".ty05Swiper .card-list-wrap .swiper-slide").click(function (e) {
      e.preventDefault();
      $(".card-list-wrap .swiper-slide").removeClass("active");
      if (!$(this).hasClass("active")) {
        $(this).addClass("active");
      }
    });

    $(".btn-wrap.minus").click(function (e) {
      pubUi.evtZoomInOut("minus");
    });

    $(".btn-wrap.plus").click(function (e) {
      pubUi.evtZoomInOut("plus");
    });
  },
  swiperSlideEvent: function () {
    var self = this;
    var slideInx = 1; // 현재 슬라이드 index 체크용 변수
    var loopVal = "";
    //const progressBar = document.querySelector(".autoplay-progress .bar");
    const bulletActive = document.querySelector(
      ".swiper-pagination-custom .swiper-pagination-bullet-active"
    );

    var swiper1 = new Swiper(".ty01Swiper", {
      slidesPerView: 1,
      watchOverflow: true, //pagination 1개 일 경우, 숨김
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
      on: {
        // autoplayTimeLeft(s, time, progress) {
        //   // progressBar.style.setProperty("--progress", 1 - progress);
        // },
        init: function () {
          //초기 세팅값 이미지 로딩슬라이드,
        },
        slideChange: function () {
          //pubUi.videoControlerChk(".ty01Swiper");
          var swiperActiveVideo = $(".ty01Swiper").find(
            ".swiper-slide-active .kv-video-area video"
          );
          var targetBulletActive = $(
            ".ty01Swiper .swiper-pagination-custom .swiper-pagination-bullet-active"
          );
          if (swiperActiveVideo.length > 0) {
            var curTime = swiperActiveVideo[0].currentTime;
            var duration = swiperActiveVideo[0].duration;
            var range = (curTime / duration) * 84;

            targetBulletActive.css("--time", `${range}px`);
            // console.log(range);
          } else {
            targetBulletActive.css("--time", "84px");
          }
        },
      },
    });

    if ($(".ty02Swiper .swiper-slide").length > 3) {
      loopVal = true;
    } else {
      loopVal = false;
    }

    var swiper2 = new Swiper(".ty02Swiper", {
      slidesPerView:'auto',
      centeredSlides: true,
      loop: loopVal,
      initialSlide: slideInx,
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
        nextEl: ".ty02Swiper .swiper-button-next",
        prevEl: ".ty02Swiper .swiper-button-prev",
      },
      breakpoints: {
        360: {
          slidesPerView: 1.5,
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
          // console.log("타임 : " + time, "progress : " + progress);
          bulletActive.style.setProperty("--time", progress);
          // console.log(84 * (1 - progress));
        },
        activeIndexChange: function () {
          slideInx = this.realIndex; //현재 슬라이드 index 갱신
        },
      },
    });

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
      on: {
        autoplayTimeLeft(s, time, progress) {
          bulletActive.style.setProperty("--time", progress);
        },
      },
    });

    var swiper4 = new Swiper(".ty04Swiper", {
      slidesPerView: 4.5,
      spaceBetween: 24,
      observer: true,
      observerParents: true,
      freeMode: true,
      slidesOffsetAfter: 240,
      navigation: {
        nextEl: ".ty04Swiper .swiper-button-next",
        prevEl: ".ty04Swiper .swiper-button-prev",
      },
      breakpoints: {
        360: {
          slidesPerView: 1.5,
          spaceBetween: 12,
          slidesOffsetAfter: 24,
        },
        768: {
          slidesPerView: 3.5,
          spaceBetween: 12,
          slidesOffsetAfter: 24,
        },
      },
    });

    var swiper5 = new Swiper(".ty05Swiper", {
      slidesPerView: "auto",
      spaceBetween: 4,
      observer: true,
      observerParents: true,
      freeMode: true,
      slidesOffsetAfter: 200,
      navigation: {
        nextEl: ".ty05Swiper .swiper-button-next",
        prevEl: ".ty05Swiper .swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination-custom",
        clickable: true,
      },
      breakpoints: {
        344: {
          // fold
          slidesPerView: 2.2,
          slidesOffsetAfter: 24,
        },
        360: {
          slidesPerView: 2.2,
          spaceBetween: 4,
          slidesOffsetAfter: 24,
        },
        1124: {
          slidesPerView: 6.5,
          spaceBetween: 4,
          slidesOffsetAfter: 120,
        },
      },
      on: {
        init: function () {
          // $(window).resize(function(){
          //   swiper5.update();
          // })
        },
        activeIndexChange: function () {
          // const realIndex = swiper5.realIndex;
          // const totalIndex = swiper5.slidesLength;
          // if (realIndex === totalIndex - 1) {
          //   console.log(realIndex, totalIndex);
          //   $(".ty05Swiper .swiper-slide").css("margin-right", "200px");
          // }
        },
      },
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
      on: {
        autoplayTimeLeft(s, time, progress) {
          bulletActive.style.setProperty("--time", progress);
        },
      },
    });
    var swiper6 = new Swiper(".onlyOneSwiper", {
      slidesPerView: 1,
      spaceBetween: 80,
      centeredSlides: true,
      touchRatio: 0,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
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
  },
  videoBulletChk: function (targetSwiper) {
    var swiperActiveVideo = targetSwiper.find(
      ".swiper-slide-active .kv-video-area video"
    );
    var testWidth = swiperActiveVideo[0].currentTime;

    if (swiperActiveVideo[0].currentTime == 0) {
    } else {
      targetBulletActive.css("--time", testWidth);
    }
  },
  videoControlerChk: function (targetSwiper) {
    var swiperActiveVideo = targetSwiper.find(
      ".swiper-slide-active .kv-video-area video"
    );
    var targetBulletActive = targetSwiper.find(
      ".swiper-pagination-custom .swiper-pagination-bullet-active"
    );

    //targetBulletActive.css("--time", range);

    if (swiperActiveVideo.length > 0) {
      var curTime = swiperActiveVideo[0].currentTime;
      var duration = swiperActiveVideo[0].duration;
      var range = (curTime / duration) * 84;
      const playBtnOn = targetSwiper.find(".btn-play").hasClass("on");
      const soundBtnOn = targetSwiper.find(".btn-sound").hasClass("on");

      if (playBtnOn == true) {
        swiperActiveVideo[0].curTime = 0;
        swiperActiveVideo[0].pause();
      } else {
        swiperActiveVideo[0].play();
        console.log("영상 재생!!!!!!!", range);
        // targetBulletActive.css("--time", range);
        console.dir(swiperActiveVideo[0]);
      }
    }
  },
  tabBtnEvent: function (e, tabContainer) {
    const target = e.target;
    const tabLabel = target.getAttribute("aria-controls");
    const tabList = tabContainer.find(".tabs li");
    const tabConts = tabContainer.find(".tab-content");

    for (let i = 0; i < tabList.length; i++) {
      tabList[i].classList.remove("on");
    }
    target.parentNode.classList.add("on");

    for (let i = 0; i < tabConts.length; i++) {
      tabConts[i].classList.remove("on");
    }

    document.querySelector("#" + tabLabel).classList.add("on");
  },
  tagBtnEvent: function (e, list) {
    var targetAriaSelected = e.ariaSelected;
    var targetList = e.parentElement;
    var listItem = list.find("li");

    if (list.hasClass("multi")) {
      if (targetAriaSelected == "true") {
        e.setAttribute("aria-selected", "false");
        targetList.classList.remove("on");
      } else {
        e.setAttribute("aria-selected", "true");
        targetList.classList.add("on");
      }
    } else {
      for (var i = 0; i < listItem.length; i++) {
        listItem[i].classList.remove("on");
        listItem[i].childNodes[0].ariaSelected = "false";
      }

      if (targetAriaSelected == "false") {
        e.setAttribute("aria-selected", "true");
        targetList.classList.add("on");
      } else {
        e.setAttribute("aria-selected", "true");
        targetList.classList.add("on");
      }
    }
  },
  masonryLayout: function () {
    const masonry_item = document.querySelectorAll(".masonry_item");
    const row_gap = 24;
    masonry_item.forEach((el) => {
      el.style.gridRowEnd = `
          span ${Math.ceil(
            el.querySelector(".masonry_con").scrollHeight + row_gap
          )}
        `;
    });
  },
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
  // 수정 필요, 이벤트 레이아웃 구조 변경 예정
  evtZoomInOut: function (param) {
    const evtImg = $(".evt-map-wrap");
    let result = 1;

    switch (param) {
      case "plus":
        result = result + 0.2;
        console.log("plus", result);
        evtImg.css("transform", `scale(${result})`);
        break;
      case "minus":
        result = result - 0.2;
        console.log("minus", result);
        evtImg.css("transform", `scale(${result})`);
        break;
      default:
        console.log("data is not plus and minus");
        break;
    }
  },
};

$(document).ready(function () {
  pubUi.init();
  $(window).on("resize", pubUi.masonryLayout);
  $(".clear-text")
    .siblings('input[type="text"]')
    .on("propertychange change keyup paste input", pubUi.textReset);
});

// [Start] : selectbox 컴포넌트
$(".selectbox-trigger").click(function (event) {
  event.stopPropagation();
  var $options = $(this).siblings(".selectbox-options");
  $(".selectbox-options").not($options).hide().attr("aria-hidden", "true");
  $options.toggle().attr("aria-hidden", function (i, attr) {
    return attr === "true" ? "false" : "true";
  });
  $(".selectbox-wrap>div .selectbox-trigger")
    .not(this)
    .removeClass("active")
    .attr("aria-expanded", "false");
  $(this)
    .toggleClass("active")
    .attr("aria-expanded", function () {
      return $(this).hasClass("active") ? "true" : "false";
    });
  $options.css({ right: "0" });

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
          $(this)
            .closest(".selectbox-wrap>div")
            .find(".selectbox-trigger")
            .removeClass("active"); // close 버튼 클릭 시 모든 tigger의 active가 제거
          $(this).closest(".selectbox-options").hide();
          $(".selectbox-overlay").hide();
        });
      } else {
        $(".selectbox-options li.moclose-btn").hide();
        $(".selectbox-overlay").hide();
      }
    })
    .resize();
});

$(".option").click(function (event) {
  event.stopPropagation();
  var $selectboxWrap = $(this).closest(".selectbox-wrap");
  var selectedText = $(this).text();
  // select-type04 클래스(아이콘만 존재하는 경우의 타입)가 없는 경우에만 버튼 텍스트 변경
  if (!$selectboxWrap.hasClass("select-type04")) {
    $(this).closest(".selectbox-options").hide().attr("aria-hidden", "true").siblings(".selectbox-trigger").text(selectedText);
  } else {
    $(this).closest(".selectbox-options").hide().attr("aria-hidden", "true");
  }
  $(this).closest(".selectbox-options").find(".option").not(this).removeClass("active").attr("aria-selected", "false");
  $(this).addClass("active").attr("aria-selected", "true");
  $(this).closest(".selectbox-wrap>div").find(".selectbox-trigger").removeClass("active").attr("aria-expanded", "false");
  $(window)
    .resize(function () {
      if (window.innerWidth <= 1023) {
        $(".selectbox-overlay").hide();
        $(".selectbox-options li.moclose-btn").hide();
      }
    })
    .resize();
});
// [End] : selectbox 컴포넌트
// 드롭다운(아코디언), 필터 컴포넌트 시작
const dropdownBtns = document.querySelectorAll(".wrap-dropdown-selected");
dropdownBtns.forEach((button) => {
  button.addEventListener("click", function () {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const dropdownMenu = button.nextElementSibling;
    const dropdownFilterBtn = button.parentElement;
    const dropdownMenuFilter =
      button.parentElement.parentElement.querySelector("dropdown-menu");
    // const btnRightArr = button
    //   .closest(".dropdown")
    //   .querySelector(".arrow-down");
    const btnRightArr = button
      .closest(".dropdown")
      .querySelector(".icon-down-wh");
    const btnRightArrFilter =
      button.parentElement.querySelector(".icon-down-wh");

    button.setAttribute("aria-expanded", String(!isExpanded));
    dropdownMenu.classList.toggle("dropdown-on", !isExpanded);
    btnRightArr.classList.toggle("rotate", !isExpanded);

    const dropdownCentered = button.closest(".dropdown");
    const detectCase1 = dropdownMenu.classList.contains("dropdown-on"); // 필터, 드롭다운 공통
    const detectCase2 = dropdownFilterBtn.classList.contains("centered"); // 필터 컴포넌트만
    const detectCase2_selectBtn = document.querySelector(
      ".dropdown.centered .wrap-dropdown-selected"
    ); // 필터 컴포넌트: 선택 버튼

    if (!isExpanded) {
      dropdownMenu.setAttribute("aria-hidden", "true");
    }

    if (detectCase1 && !detectCase2) {
      dropdownMenu.addEventListener("click", function () {
        dropdownMenu.classList.remove("dropdown-on");
        dropdownMenu.setAttribute("aria-hidden", "true");
        button.setAttribute("aria-expanded", "false");
        btnRightArr.classList.remove("rotate", detectCase1);
      });
    }

    if (detectCase2) {
      btnRightArrFilter.classList.toggle("rotate", !isExpanded);
    }

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
      if (
        detectCase2_selectBtn.classList.contains("dropdown-on") &&
        screenWidth < 500
      ) {
        // < 500
        filterBtn_forDisplayText.style.width = "100%";
        filterBtn_forDisplay.style.padding = "17px 40px";

        filterBtn_forDisplay.classList.toggle("bgwhite");
        filterBtn_icn1.style.display = "none";
      }
      if (
        detectCase2_selectBtn.classList.contains("dropdown-on") &&
        screenWidth > 500
      ) {
        filterBtn_forDisplay.classList.toggle("bgred");
      }

      if (!detectCase2_selectBtn.classList.contains("dropdown-on")) {
        filterBtn_forDisplay.classList.remove("bgred");
        filterBtn_forDisplay.classList.remove("bgwhite");
        filterBtn_forDisplayText.style.width = "auto";
        filterBtn_icn1.style.display = "flex";
      }
    }
  });
});

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
  const dropdowns = document.querySelectorAll(
    ".dropdown.inMobile .accor02-wrap"
  );

  dropdowns.forEach(function (dropdown) {
    const footerBtn = dropdown.querySelector(".accor02-header");
    const accor02List = dropdown.querySelector(
      ".dropdown.inMobile .accor02-wrap ul"
    );
    const isMobile = window.matchMedia("(max-width: 1024px)");
    const screenWidth = window.innerWidth;
    if (screenWidth < 1024) {
      footerBtn.addEventListener("click", function () {
        accor02List.classList.toggle("dropdown-on");
      });
    }
  });
}

DropdownFooter();

// 드롭다운(아코디언) 02 끝
// 드롭다운(아코디언), 필터 컴포넌트 끝

// [Start] : hashTag 말줄임
$(".card_type04 .card_con").each(function () {
  var $set = $(this).children("div.card-hashtag").children("button");
  var $setUl = $(this).children("div.card-hashtag");

  $set.each(function () {
    var cardConRightEdge = $setUl.offset().left + $setUl.outerWidth();
    var liRightEdge = $(this).offset().left + $(this).outerWidth(true);
    if (liRightEdge >= cardConRightEdge) {
      $(this).addClass("ellipsis");
      // $("ul.card-hashtag li.ellipsis").first().css({ minWidth: 50 });
    }
  });

  $set.siblings(".ellipsis").first().show();
  $set.siblings(".ellipsis").nextAll().hide(); // EP040501 - Pony Magazine 제목 참고 (안하면 button.ellipsis 뒤에 li들 다 살아있음 - 그래서 button.ellipsis 너비 줄어듦)
});
// [End] : hashTag 말줄임

// [Start] : 하트 버튼 토글 (EP040101, EP040201, EP040301, EP040501)
$(".card_function.btn-wrap-type5 .btn-only-icon-notbg").click(function (event) {
  $(this).find(".btn-icon20").toggleClass("icon-heart icon-heart-red");
});
// [End] : 하트 버튼 토글 (EP040101, EP040201, EP040301, EP040501)

// [Start] : CM040101 > unread 버튼 클릭 시 배경색, read 문구 변경
$(".unread-box .mynotice-btm>button.sm-txt-btn01").click(function () {
  $(this).closest(".mynotice-box.unread-box").attr("class", "mynotice-box read-box");
  $(this).replaceWith("<p class='mynotice-read'>" + "<i class='btn-icon16 icon-check' aria-hidden='true'>" + "</i>" + "Read" + "</p>");
});
// [End] : CM040101 > unread 버튼 클릭 시 배경색, read 문구 변경
