function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// Translator

const LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: "assets/i18n",
  // filesLocation: "https://raw.githubusercontent.com/huylesitdn/ob9-world-cup/main/assets/i18n",
});

const PREFERED_REGION = "preferred_region";
const _get_translator_config =
  translator.config.persistKey || "preferred_language";
const _get_language =
  localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || 'Malaysia';

translator.fetch([LANGUAGES.EN, LANGUAGES.ZH]).then(() => {
  // -> Translations are ready...
  translator.translatePageTo(_get_language);
  changeLanguageColor();
  renderAfterHaveTranslator();
});

/**
 * MENU SLIDE
 *
 */

$("#navMenu").on("click", function (e) {
  $("#mySidenav").addClass("active");
});

$("#mySidenav .backdrop, #mySidenav a.left-nav__top__nav__item__link").on(
  "click",
  function (e) {
    $("#mySidenav").removeClass("active");
  }
);

const selectLanguageModalElm = $("#selectLanguage");
if (selectLanguageModalElm.length > 0) {
  var selectLanguageModal = new bootstrap.Modal(selectLanguageModalElm, {});
}
$(".choose-language").on("click", function (e) {
  const select_language = $(this).data("language");
  const select_region = $(this).data("region");
  const accept_languages = ["Malaysia", "Singapore"];

  if (!accept_languages.includes(select_region)) {
    window.location.href = "/access-denied.html";
    return false;
  }

  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    selectLanguageModal.hide();
    $("#mySidenav").removeClass("active");
    localStorage.setItem(PREFERED_REGION, select_region);
    changeLanguageColor();
    window.location.reload();
  } else {
    console.log("No language setup");
  }
});

$(".universal__content__language").on("click", function (e) {
  const select_language = $(this).data("language");
  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    window.location.href = "/";
  } else {
    console.log("No language setup");
  }
});

$(".universal .play-now a").on("click", function (e) {
  e.preventDefault();
  const slick_current_select = $(
    "#selectLanguage .slick-list .slick-track .slick-current .title"
  );
  if (slick_current_select.length > 0) {
    const slick_current_select_title = slick_current_select.data("i18n");
    const accept_languages = [
      "universal_page.Malaysia",
      "universal_page.Singapore",
    ];
    if (accept_languages.includes(slick_current_select_title)) {
      window.location.href = "/login.html";
    } else {
      window.location.href = "/access-denied.html";
    }
  }
});

function changeLanguageColor() {
  $(".choose-language").each(function () {
    const get_attr_lang = $(this).data("language").toLowerCase();
    const get_attr_region = $(this).data("region");
    const _get_region = localStorage.getItem(PREFERED_REGION);
    if (_get_language == get_attr_lang && _get_region == get_attr_region) {
      $(this).addClass("text-primary");
    }
  });
}

/**
 * MENU SLIDE
 *
 */

/**
 * SCROLL TEXT
 *
 */

//this is the useful function to scroll a text inside an element...
function startScrolling(scroller_obj, velocity, start_from) {
  //bind animation  inside the scroller element
  scroller_obj
    .bind("marquee", function (event, c) {
      //text to scroll
      var ob = $(this);
      //scroller width
      var sw = parseInt(ob.closest(".text-animated").width());
      //text width
      var tw = parseInt(ob.width());
      //text left position relative to the offset parent
      var tl = parseInt(ob.position().left);
      //velocity converted to calculate duration
      var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
      //same velocity for different text's length in relation with duration
      var dr = (v * tw) / sw + v;
      //is it scrolling from right or left?
      switch (start_from) {
        case "right":
          //   console.log('here')
          //is it the first time?
          if (typeof c == "undefined") {
            //if yes, start from the absolute right
            ob.css({
              left: sw,
            });
            sw = -tw;
          } else {
            //else calculate destination position
            sw = tl - (tw + sw);
          }
          break;
        default:
          if (typeof c == "undefined") {
            //start from the absolute left
            ob.css({
              left: -tw,
            });
          } else {
            //else calculate destination position
            sw += tl + tw;
          }
      }
      //attach animation to scroller element and start it by a trigger
      ob.animate(
        {
          left: sw,
        },
        {
          duration: dr,
          easing: "linear",
          complete: function () {
            ob.trigger("marquee");
          },
          step: function () {
            //check if scroller limits are reached
            if (start_from == "right") {
              if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                //we need to stop and restart animation
                ob.stop();
                ob.trigger("marquee");
              }
            } else {
              if (
                parseInt(ob.position().left) > parseInt(ob.parent().width())
              ) {
                ob.stop();
                ob.trigger("marquee");
              }
            }
          },
        }
      );
    })
    .trigger("marquee");
  //pause scrolling animation on mouse over
  scroller_obj.mouseover(function () {
    $(this).stop();
  });
  //resume scrolling animation on mouse out
  scroller_obj.mouseout(function () {
    $(this).trigger("marquee", ["resume"]);
  });
}

$(function () {
  $(".text-animated").each(function (i, obj) {
    if ($(this).find(".text-overflow").width() > $(this).width()) {
      //settings to pass to function
      var scroller = $(this).find(".text-overflow"); // element(s) to scroll
      var scrolling_velocity = 95; // 1-99
      var scrolling_from = "right"; // 'right' or 'left'
      //call the function and start to scroll..
      startScrolling(scroller, scrolling_velocity, scrolling_from);
    }
  });
});

/**
 * END SCROLL TEXT
 *
 */


$('.back_to_top').on("click", function (e) {
  e.preventDefault();
  // $(window).scrollTop(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
})


const incorrectEmailModalElm = $("#incorrectEmailModal");
if (incorrectEmailModalElm.length > 0) {
  var incorrectEmailModal = new bootstrap.Modal(incorrectEmailModalElm, {});
}
$('.forget-password-page .btn-next').on('click', function (e) {
  const forget_password_input = $('.forget-password-page #forget_password_input')
  if (!forget_password_input.val()) {
    incorrectEmailModal.show();
  } else {
    window.location.href = '/forget-password-success.html';
  }
});


/** REGISTER PAGE */
const COMPLETED_STEP_CLASS = 'step-completed'
$('#my-step button[data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
  const current_step = $(event.target).data('step');
  $('#my-step button[data-bs-toggle="tab"]').each(function (index, item) {
    const item_step = $(item).data('step');
    if(current_step >= item_step) {
      $(item).addClass(COMPLETED_STEP_CLASS);
    } else {
      if($(item).hasClass(COMPLETED_STEP_CLASS)) {
        $(item).removeClass(COMPLETED_STEP_CLASS);
      }
    }
  })
});

$('#my-step-content .goToStep').on('click', function (event) {
  const gotostep = $(event.target).data('gotostep');
  if(!!gotostep) {
    const step_elm = $(`#my-step button[data-step="${gotostep}"]`);
    if (step_elm && step_elm.length > 0) {
      const step = new bootstrap.Tab(step_elm);
      step.show();
      if (translator) {
        var step_title = `${translator.translateForKey('register_page.step', _get_language)} ${gotostep} ${translator.translateForKey('register_page.of', _get_language)} 3`
        $('.step-title').html(step_title)
      }
    }
  }
})

/** REGISTER PAGE */


function renderAfterHaveTranslator () {
  //
  changeFlagAndCountryName();

  if (translator) {
    var step_title = `${translator.translateForKey('register_page.step', _get_language)} 1 ${translator.translateForKey('register_page.of', _get_language)} 3`
    $('.step-title').html(step_title)
  }

}

function changeFlagAndCountryName() {
  if(translator) {
    console.log(_get_region)

    var flagName = '1'
    switch (_get_region) {
      case 'Malaysia':
        flagName = '1'
        break;
      case 'Singapore':
        flagName = '2'
        break;
      case 'Thailand':
        flagName = '3'
        break;
      case 'Vietnam':
        flagName = '4'
        break;
      case 'Indonesia':
        flagName = '5'
        break;
      default:
        break;
    }
    $('#flagLanguage').attr("src","assets/images/language/"+flagName+".png");

    const countryNameLanguage = translator.translateForKey('universal_page.' + _get_region, _get_language)
    $('#countryNameLanguage').html(countryNameLanguage)
  }
}

let toggleBalance = false;
$('.toggleBalance').on("click", function (e) {
  e.preventDefault();

  if (!!toggleBalance) {
    $('#balanceCurrency').html('MYR 5888.20')
  } else {
    $('#balanceCurrency').html('MYR ********')
  }
  toggleBalance = !toggleBalance;
});

let timer_refresh_balance;
$('.refresh-balance').on("click", function (e) {
  e.preventDefault();
  const self = this;
  if (translator) {
    window.clearTimeout(timer_refresh_balance);
    $(self).addClass('spin');
    timer_refresh_balance = window.setTimeout(function(){
      $(self).removeClass('spin');
      addAlert(translator.translateForKey('SUCCESSFUL', _get_language), 'secondary');
    }, 3000); 
  }

});



var alertPlaceholder = document.getElementById('liveAlertPlaceholder')

function addAlert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  alertPlaceholder.append(wrapper);
  closeAlert(); // close after 5s
}

let timer_close_alert;
function closeAlert() {
  window.clearTimeout(timer_close_alert);
  timer_refresh_balance = window.setTimeout(function(){
    const _alertElm = $('.alert');
    if(_alertElm.length > 0) {
      var alert = bootstrap.Alert.getOrCreateInstance(_alertElm[0]);
      alert.close();
    }
  }, 5000); 
}

// end inbox follow