$(function () {
  // ハンバーガーメニュー
  $(".toggle-button").on("click", function () {
    console.log("cdsacascdsa");
    $(this).toggleClass("open");
    $(".header-menu").toggleClass("open");
    $(".black-bg").toggleClass("open");
    $("body").toggleClass("open"); //bodyをスクロールさせない　(https://web-note.org/programming/css/drawer-bg-scroll/)
  });
  //取り除く処理
  $(".black-bg").on("click", function () {
    console.log("黒背景だよ");
    $(this).removeClass("open");
    $(".header-menu").removeClass("open");
    $(".black-bg").removeClass("open");
    $(".toggle-button").removeClass("open");
    $(".header-menu-link").removeClass("open");
    $("body").removeClass("open");
  });

  //スクロール関係
  let sections = $(".js-sec");
  let currentIndex = 0;
  let isAnimating = false;
  let canScroll = true;
  let headerWrapper = $(".header-wrapper");
  let fixedMenuLinks = $(".fixed-menu a"); // 追加

  function updateHeaderBackground(index) {
    let targetSec = sections.eq(index);
    if (targetSec.hasClass("fv")) {
      headerWrapper.css("background", "#9C2D2E");
    } else {
      headerWrapper.css("background", "none");
    }
  }

  function updateFixedMenu(index) {
    let activeId = sections.eq(index).attr("id");
    fixedMenuLinks.css("color", "#FFF"); // すべて白色にリセット
    fixedMenuLinks.filter(`[href="/#${activeId}"]`).css("color", "#9C2D2E"); // 該当セクションの色変更
  }

  function switchSection(nextIndex) {
    if (
      isAnimating ||
      !canScroll ||
      nextIndex === currentIndex ||
      nextIndex < 0 ||
      nextIndex >= sections.length
    )
      return;

    isAnimating = true;
    canScroll = false;

    updateHeaderBackground(nextIndex);
    updateFixedMenu(nextIndex); // 追加

    let currentSec = sections.eq(currentIndex);
    let nextSec = sections.eq(nextIndex);

    if (nextIndex > currentIndex) {
      currentSec.removeClass("current_sec").addClass("out_to_top");
      nextSec
        .addClass("current_sec")
        .removeClass("hidden_sec")
        .addClass("in_from_top");
    } else {
      currentSec.removeClass("current_sec").addClass("out_to_bottom");
      nextSec
        .addClass("current_sec")
        .removeClass("hidden_sec")
        .addClass("in_from_bottom");
    }

    setTimeout(() => {
      currentSec.removeClass("out_to_top out_to_bottom").addClass("hidden_sec");
      nextSec.removeClass("in_from_bottom in_from_top");
      isAnimating = false;
      canScroll = true;
    }, 1000);

    currentIndex = nextIndex;
  }

  function handleScrollEvent(event) {
    if (!canScroll) return;
    let nextIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);
    switchSection(nextIndex);
  }

  window.addEventListener(
    "wheel",
    function (event) {
      event.preventDefault();
      handleScrollEvent(event);
    },
    { passive: false }
  );

  let touchStartY = 0;
  $(window).on("touchstart", function (event) {
    touchStartY = event.originalEvent.touches[0].clientY;
  });

  $(window).on("touchmove", function (event) {
    let touchEndY = event.originalEvent.touches[0].clientY;
    if (!canScroll) return;
    let nextIndex =
      currentIndex +
      (touchStartY - touchEndY > 50
        ? 1
        : touchEndY - touchStartY > 50
        ? -1
        : 0);
    switchSection(nextIndex);
  });

  updateHeaderBackground(currentIndex);
  updateFixedMenu(currentIndex); // 追加

  // ========================
  // ✅ すべての「hrefが/#○○」のリンクを対象にする
  // ========================
  $("a[href^='/#']").on("click", function (event) {
    event.preventDefault(); // デフォルトのスクロールを防ぐ

    let targetId = $(this).attr("href").replace("/#", ""); // IDを取得
    let targetIndex = sections.index($("#" + targetId)); // 該当セクションのindexを取得

    if (targetIndex !== -1) {
      switchSection(targetIndex);
    }
  });

  function updateFixedMenu(index) {
    let activeId = sections.eq(index).attr("id");

    $(".fixed-menu li").removeClass("active"); // すべてのリストから.activeを削除
    fixedMenuLinks.css("color", "#FFF"); // すべてのaタグを白に戻す

    let activeItem = fixedMenuLinks.filter(`[href="/#${activeId}"]`).parent();
    activeItem.addClass("active"); // 対象のliに.activeを追加
    fixedMenuLinks.filter(`[href="/#${activeId}"]`).css("color", "#9C2D2E"); // アクティブなリンクの色を変更
  }
});

// 画像のポップアップ
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".learning__card");
  const popup = document.querySelector(".learning-popup");
  const popupBg = document.querySelector(".learning-popup__bg");
  const closeButtons = document.querySelectorAll(
    ".learning-popup__card-banner img"
  );

  if (cards.length > 0 && popup && popupBg) {
    cards.forEach((card) => {
      card.addEventListener("click", function () {
        const targetId = card.getAttribute("data-id");
        const targetPopupCard = document.querySelector(
          `.learning-popup__card[data-id='${targetId}']`
        );

        if (targetPopupCard) {
          document
            .querySelectorAll(".learning-popup__card")
            .forEach((popupCard) => {
              popupCard.style.display = "none";
            });
          targetPopupCard.style.display = "block";
          popup.style.display = "block";
        }
      });
    });

    function closePopup() {
      popup.style.display = "none";
      document
        .querySelectorAll(".learning-popup__card")
        .forEach((popupCard) => {
          popupCard.style.display = "none";
        });
    }

    popupBg.addEventListener("click", closePopup);
    closeButtons.forEach((button) => {
      button.addEventListener("click", closePopup);
    });
  }

  // カードを375px以下でスライダーにする
  $(".slider").slick({
    autoplay: false, //自動再生
    dots: false, //ドット
    infinite: false, //ループ
    pauseOnHover: false, //ホバーで止めない
    slidesToShow: 1, // 一度に1枚表示
    slidesToScroll: 1, // 1枚ずつスクロール
    centerMode: true, //両サイドを表示
  });
  // スライドが動いたら .scroll-btn を非表示
  $(".slider").on("beforeChange", function () {
    $("#scrollButton").animate({ opacity: 0 }, 200);
    // 透明になった後、少し遅らせて非表示に
    setTimeout(function () {
      $("#scrollButton").css("display", "none");
    }, 400); // 1秒後に非表示
  });
});
