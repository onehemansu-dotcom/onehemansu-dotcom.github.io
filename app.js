/* ===== Intro word-cycling loader (Apple boot-style) ===== */
(function(){
  var GREETINGS = ['Hello','नमस्ते','ನಮಸ್ಕಾರ','வணக்கம்','నమస్కారం','নমস্কার','नमस्कार','السلام علیکم'];
  var DWELL = [900, 130, 130, 130, 130, 130, 130, 700];

  var loaderEl = document.getElementById('loader');
  var wordEl   = document.getElementById('loaderWord');
  if (!loaderEl || !wordEl) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0;

  function finish(){
    loaderEl.classList.add('hide');
    setTimeout(function(){ if (loaderEl && loaderEl.parentNode) loaderEl.remove(); }, 380);
  }

  function step(){
    setTimeout(function(){
      i++;
      if (i >= GREETINGS.length){ finish(); return; }
      if (reduceMotion){
        wordEl.textContent = GREETINGS[i];
        step();
      } else {
        wordEl.classList.add('fade');
        setTimeout(function(){
          wordEl.textContent = GREETINGS[i];
          wordEl.classList.remove('fade');
          step();
        }, 15);
      }
    }, DWELL[i]);
  }

  step();
})();

(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- GA4 click tracking ---------- */
  function track(label, url, category, eventName) {
    if (typeof gtag === "function") {
      gtag("event", eventName || "link_click", {
        click_label: label || "unknown",
        link_url: url || "",
        click_category: category || "General"
      });
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-label]");
    if (!a) return;
    track(a.getAttribute("data-label"), a.getAttribute("href") || "", a.getAttribute("data-category") || "General");
  });

  /* ---------- Panel switching ---------- */
  var home = null, access = null, about = null, shop = null, question = null, work = null, announcement = null;
  function panels() {
    home = home || document.getElementById("home-panel");
    access = access || document.getElementById("access-panel");
    about = about || document.getElementById("about-panel");
    shop = shop || document.getElementById("shop-panel");
    question = question || document.getElementById("question-panel");
    work = work || document.getElementById("work-panel");
    announcement = announcement || document.getElementById("announcement-panel");
  }
  function hideAll() {
    panels();
    if (access) access.classList.remove("active");
    if (about) about.classList.remove("active");
    if (shop) shop.classList.remove("active");
    if (question) question.classList.remove("active");
    if (work) work.classList.remove("active");
    if (announcement) announcement.classList.remove("active");
    if (home) home.style.display = "none";
  }

  function revealIn(panel) {
    if (!panel) return;
    panel.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  window.showAccess = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (access) { access.classList.add("active"); revealIn(access); }
    window.scrollTo(0, 0);
  };
  window.showHome = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (home) home.style.display = "";
    window.scrollTo(0, 0);
  };
  window.showAbout = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (about) { about.classList.add("active"); revealIn(about); }
    window.scrollTo(0, 0);
  };
  window.showShop = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (shop) { shop.classList.add("active"); revealIn(shop); startShopAutoScroll(); }
    window.scrollTo(0, 0);
  };

  /* ---------- Shop product search ---------- */
  window.toggleShopSearch = function (e) {
    if (e) e.preventDefault();
    var row = document.getElementById("shopSearchRow");
    var btn = document.getElementById("shopSearchBtn");
    var input = document.getElementById("shopSearchInput");
    var hot = document.getElementById("shopHot");
    if (!row) return;
    var open = row.classList.toggle("open");
    if (btn) btn.classList.toggle("active", open);
    if (hot) hot.classList.toggle("open", open);
    if (open && input) { input.focus(); }
    else { clearShopSearch(); }
  };

  window.filterShopProducts = function () {
    var input = document.getElementById("shopSearchInput");
    if (!input) return;
    var q = input.value.trim().toLowerCase();
    var terms = q.split(/\s+/).filter(Boolean);
    var shopPanel = document.getElementById("shop-panel");
    if (!shopPanel) return;
    var tiles = shopPanel.querySelectorAll(".shop-sheet .tile");
    var visible = 0;
    tiles.forEach(function (t) {
      var ttl = t.querySelector(".ttl");
      var sub = t.querySelector(".sub");
      var name = (ttl ? ttl.textContent : "").toLowerCase();
      var subt = (sub ? sub.textContent : "").toLowerCase();
      var keys = (t.getAttribute("data-keywords") || "").toLowerCase();
      var haystack = name + " " + subt + " " + keys;
      // every search term must appear somewhere (AND match) so multi-word stays precise
      var match = terms.length === 0 || terms.every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
      t.style.display = match ? "" : "none";
      if (match) visible++;
    });
    // Hide category headings + rows that have no visible tiles
    var heads = shopPanel.querySelectorAll(".shop-section-head");
    heads.forEach(function (h) {
      var bento = h.nextElementSibling;
      while (bento && !bento.classList.contains("bento")) bento = bento.nextElementSibling;
      if (!bento) return;
      var anyVisible = Array.prototype.some.call(bento.querySelectorAll(".tile"), function (t) {
        return t.style.display !== "none";
      });
      h.classList.toggle("hide-sec", !anyVisible);
      bento.classList.toggle("hide-sec", !anyVisible);
    });
    var nr = document.getElementById("shopNoResults");
    if (nr) nr.classList.toggle("show", visible === 0 && q !== "");
    // Pause the auto-scroll while searching and snap rows to the left so matches are visible
    window.__shopSearching = q !== "";
    var sheet = shopPanel.querySelector(".shop-sheet");
    if (sheet) sheet.classList.toggle("searching", q !== "");
    var rows = shopPanel.querySelectorAll(".shop-sheet .bento");
    if (q !== "") {
      var snap = function () {
        rows.forEach(function (row) { row.scrollLeft = 0; });
      };
      snap();
      requestAnimationFrame(snap);
      requestAnimationFrame(function () { requestAnimationFrame(snap); });
    }
  };

  window.clearShopSearch = function () {
    var input = document.getElementById("shopSearchInput");
    if (input) input.value = "";
    filterShopProducts();
  };

  window.hotSearch = function (term) {
    var row = document.getElementById("shopSearchRow");
    var btn = document.getElementById("shopSearchBtn");
    var input = document.getElementById("shopSearchInput");
    var hot = document.getElementById("shopHot");
    if (row && !row.classList.contains("open")) { row.classList.add("open"); if (btn) btn.classList.add("active"); }
    if (hot) hot.classList.add("open");
    if (input) { input.value = term; input.focus(); }
    filterShopProducts();
  };

  window.showQuestion = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (question) { question.classList.add("active"); revealIn(question); }
    window.scrollTo(0, 0);
  };

  window.showWork = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (work) { work.classList.add("active"); revealIn(work); }
    window.scrollTo(0, 0);
  };

  window.showAnnouncement = function (e) {
    if (e) e.preventDefault();
    hideAll();
    if (announcement) { announcement.classList.add("active"); revealIn(announcement); }
    window.scrollTo(0, 0);
  };

  /* ---------- Shop auto-scroll (one row per category) ---------- */
  var shopScrollStarted = false;
  function startShopAutoScroll() {
    if (shopScrollStarted) return;
    shopScrollStarted = true;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    var rows = document.querySelectorAll("#shop-panel .shop-sheet .bento");
    rows.forEach(function (row) {
      var SPEED = 0.35;       // px per frame — gentle drift
      var paused = false;
      var resumeTimer = null;
      var pos = 0;            // float accumulator (scrollLeft rounds to int)

      function pause() {
        paused = true;
        if (resumeTimer) clearTimeout(resumeTimer);
      }
      function scheduleResume() {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { paused = false; }, 1600);
      }

      // pause on hover / touch / manual scroll, resume shortly after
      row.addEventListener("mouseenter", pause);
      row.addEventListener("mouseleave", scheduleResume);
      row.addEventListener("touchstart", pause, { passive: true });
      row.addEventListener("touchend", scheduleResume, { passive: true });
      row.addEventListener("wheel", function () { pause(); scheduleResume(); }, { passive: true });
      // keep accumulator in sync when the user scrolls by hand
      row.addEventListener("scroll", function () {
        if (paused) pos = row.scrollLeft;
      }, { passive: true });

      function step() {
        var max = row.scrollWidth - row.clientWidth;
        if (window.__shopSearching) {
          if (row.scrollLeft !== 0) { row.scrollLeft = 0; }
          pos = 0;
        } else if (max > 4 && !paused) {
          pos += SPEED;
          if (pos >= max) pos = 0;        // loop back to start
          row.scrollLeft = pos;
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Guide form ---------- */
  var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvF9Lx6miwV5zAsrTmnCc4iYcVccFUsxEMVjUksIGckqbJQsxL01Gl23QqBCY_QUE/exec";

  function fieldWrap(id) { var el = document.getElementById(id); return el ? el.closest(".field") : null; }
  function validName() { var v = (document.getElementById("f-name")||{}).value || ""; return v.trim().length > 0; }
  function validEmail() { var v = (document.getElementById("f-email")||{}).value || ""; return /^[^\s@]+@gmail\.com$/i.test(v.trim()); }
  function validBike() { var v = (document.getElementById("f-bike")||{}).value || ""; return v.trim().length > 0; }

  function refreshSubmit() {
    var btn = document.getElementById("f-submit");
    if (btn) btn.disabled = !(validName() && validEmail() && validBike());
  }

  window.submitAccess = function () {
    var okN = validName(), okE = validEmail(), okB = validBike();
    var fN = fieldWrap("f-name"), fE = fieldWrap("f-email"), fB = fieldWrap("f-bike");
    if (fN) fN.classList.toggle("invalid", !okN);
    if (fE) fE.classList.toggle("invalid", !okE);
    if (fB) fB.classList.toggle("invalid", !okB);
    if (!(okN && okE && okB)) return;

    var name = document.getElementById("f-name").value.trim();
    var email = document.getElementById("f-email").value.trim();
    var bike = document.getElementById("f-bike").value.trim();

    var btn = document.getElementById("f-submit");
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

    track("Guide: Form Submitted", email, "Guide", "form_submit");

    var fd = new FormData();
    fd.append("name", name); fd.append("email", email); fd.append("bike", bike);

    fetch(APPS_SCRIPT_URL, { method: "POST", body: fd, mode: "no-cors" })
      .catch(function(){})
      .finally(function () {
        var form = document.getElementById("access-form");
        var succ = document.getElementById("access-success");
        var em = document.getElementById("success-email");
        if (em) em.textContent = email;
        if (form) form.classList.add("hide");
        if (succ) succ.classList.add("show");
      });
  };

  /* ---------- Question form ---------- */
  // PASTE your deployed Apps Script Web App URL here (ends in /exec):
  var QUESTIONS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGUkqKKwlbGIvoOKzlWQqO7twRH_WLyTOC4-0hIK3VJplPzNwFwiWcBKOr5JhMLJ7gOw/exec";

  function qWrap(id) { var el = document.getElementById(id); return el ? el.closest(".field") : null; }
  function validQName() { var v = (document.getElementById("q-name") || {}).value || ""; return v.trim().length > 0; }
  function validQText() { var v = (document.getElementById("q-question") || {}).value || ""; return v.trim().length > 0; }

  function refreshQSubmit() {
    var btn = document.getElementById("q-submit");
    if (btn) btn.disabled = !(validQName() && validQText());
  }

  window.submitQuestion = function () {
    var okN = validQName(), okQ = validQText();
    var fN = qWrap("q-name"), fQ = qWrap("q-question");
    if (fN) fN.classList.toggle("invalid", !okN);
    if (fQ) fQ.classList.toggle("invalid", !okQ);
    if (!(okN && okQ)) return;

    var name = document.getElementById("q-name").value.trim();
    var text = document.getElementById("q-question").value.trim();
    var contact = (document.getElementById("q-contact") || {}).value || "";
    contact = contact.trim();

    var btn = document.getElementById("q-submit");
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

    track("Question: Form Submitted", contact || name, "Question", "form_submit");

    var fd = new FormData();
    fd.append("name", name);
    fd.append("question", text);
    fd.append("contact", contact);

    fetch(QUESTIONS_SCRIPT_URL, { method: "POST", body: fd, mode: "no-cors" })
      .catch(function () {})
      .finally(function () {
        var form = document.getElementById("question-form");
        var succ = document.getElementById("question-success");
        if (form) form.classList.add("hide");
        if (succ) succ.classList.add("show");
      });
  };

  /* ---------- Stat count-up animation ---------- */
  function animateCounts() {
    var els = document.querySelectorAll(".count");
    if (!els.length) { return; }
    var DURATION = 1000;
    var done = 0;
    els.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var div = parseFloat(el.getAttribute("data-div")) || 1;
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var start = null;
      function fmt(v) {
        var n = v / div;
        return (decimals ? n.toFixed(decimals) : Math.round(n)) + suffix;
      }
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / DURATION, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else {
          el.textContent = fmt(target);
          done++;
        }
      }
      requestAnimationFrame(step);
    });
  }

  // scroll-reveal: cards swift up as they enter the viewport
  function initReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 6) * 40) + "ms";
      io.observe(el);
    });

    // Anything already on screen at load must reveal immediately - on tall
    // displays there may be no scroll to trigger the observer.
    function revealInView() {
      items.forEach(function (el) {
        if (el.classList.contains("in")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    }
    revealInView();
    window.addEventListener("load", revealInView);
    window.addEventListener("resize", revealInView);
    setTimeout(revealInView, 500);
  }

  // live follower counter: rapid climb 0 -> base, then +step every interval
  function startLiveCount() {
    var el = document.querySelector(".live-count");
    if (!el) return;
    var base = parseInt(el.getAttribute("data-start"), 10) || 0;
    var step = parseInt(el.getAttribute("data-step"), 10) || 1;
    var interval = parseInt(el.getAttribute("data-interval"), 10) || 5000;

    // Phase 1: rapid count-up 0 -> base (~1.1s ease-out)
    var CLIMB = 1100;
    var climbStart = null;
    function climb(ts) {
      if (climbStart === null) climbStart = ts;
      var p = Math.min((ts - climbStart) / CLIMB, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(base * eased).toLocaleString("en-US");
      if (p < 1) {
        requestAnimationFrame(climb);
      } else {
        el.textContent = base.toLocaleString("en-US");
        // Phase 2: slow tick from the moment climb finishes
        var tickStart = Date.now();
        setInterval(function () {
          var ticks = Math.floor((Date.now() - tickStart) / interval);
          el.textContent = (base + ticks * step).toLocaleString("en-US");
        }, interval);
      }
    }
    requestAnimationFrame(climb);
  }

  /* ---------- Time-based theme (light 6am-6pm, dark otherwise) ---------- */
  function initTimeTheme() {
    // Uses the visitor's local time. Re-checks every minute so the page
    // flips automatically if it stays open across the transition.
    function applyTheme() {
      var hour = new Date().getHours();
      var isDay = hour >= 6 && hour < 18;
      document.body.setAttribute("data-theme", isDay ? "light" : "dark");
    }
    applyTheme();
    setInterval(applyTheme, 60 * 1000);
  }

  onReady(function () {
    initTimeTheme();
    ["f-name", "f-email", "f-bike"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", refreshSubmit);
    });
    refreshSubmit();

    ["q-name", "q-question"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", refreshQSubmit);
    });
    refreshQSubmit();

    // reveal cards on scroll into view
    initReveal();

    // Count-up + follower climb + confetti.
    // Fires on first scroll, OR immediately if the stats are already on screen
    // (tall displays / tablets have no scroll to trigger, so the old
    //  scroll-only trigger left the counters stuck at 0).
    var counted = false;
    function triggerCounts() {
      if (counted) return;
      counted = true;
      animateCounts();
      startLiveCount();
    }
    window.addEventListener("scroll", function () { triggerCounts(); }, { passive: true });

    function statsInView() {
      var el = document.querySelector(".id-stats");
      if (!el) return false;
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    }
    function checkStats() { if (statsInView()) triggerCounts(); }

    checkStats();                                  // already visible on load?
    window.addEventListener("load", checkStats);   // and once images settle
    window.addEventListener("resize", checkStats); // and on rotate / resize
    setTimeout(checkStats, 600);                   // and as a final backstop
    setTimeout(triggerCounts, 2500);               // absolute fallback: never leave 0
  });

  /* iOS safety net: if the IntersectionObserver never fires (some iOS Safari
     cases), force any still-hidden .reveal card to fade in after a moment.
     The animation still plays normally when the observer works. */
  onReady(function () {
    setTimeout(function () {
      document.querySelectorAll(".reveal").forEach(function (el) {
        if (!el.classList.contains("in")) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 400) el.classList.add("in");
        }
      });
    }, 1200);
    window.addEventListener("load", function () {
      setTimeout(function () {
        document.querySelectorAll(".reveal").forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 400) el.classList.add("in");
        });
      }, 300);
    });
  });

})();
