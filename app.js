(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function revealIn(sel) {
    document.querySelectorAll(sel + " .reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  function triggerBulbEntrance() {
    // Skip in light mode — natural sunlight feel
    if (document.body.getAttribute("data-theme") === "light") return;
    var shop = document.getElementById("shop-panel");
    if (!shop) return;

    // Reset state — enter dark mood
    shop.classList.remove("lit");
    shop.classList.add("awaiting-light");

    // Set cascade delay for each tile based on its document order.
    // The :nth-child trick won't span multiple .bento containers, so
    // we walk all tiles in order and assign --reveal-delay inline.
    var tiles = shop.querySelectorAll(".tile");
    tiles.forEach(function (tile, i) {
      tile.style.setProperty("--reveal-delay", (0.05 + i * 0.06) + "s");
    });

    // After a beat, trigger the reveal: warm bloom + cascade
    setTimeout(function () {
      shop.classList.remove("awaiting-light");
      shop.classList.add("lit");
    }, 120);
  }

  function hintScroll(shop) {
    if (!shop) shop = document.getElementById("shop-panel");
    if (!shop) return;
    var firstRow = shop.querySelector(".bento");
    if (!firstRow) return;
    // Only hint if there's actually overflow to scroll
    if (firstRow.scrollWidth <= firstRow.clientWidth + 4) return;

    // Smooth, slow scroll-hint with real ease-out → pause → ease-in return.
    // We disable scroll-snap during the hint so it doesn't fight us — snap
    // would otherwise yank scrollLeft back to 0 every frame.
    var TARGET = 130;          // how far to slide right (px)
    var OUT_MS = 1100;         // slide out duration
    var HOLD_MS = 300;         // pause at far end
    var IN_MS = 1100;          // slide back duration

    var originalSnap = firstRow.style.scrollSnapType;
    firstRow.style.scrollSnapType = "none";

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInCubic(t)  { return t * t * t; }

    function animate(from, to, duration, easeFn, done) {
      var start = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - start) / duration);
        firstRow.scrollLeft = from + (to - from) * easeFn(t);
        if (t < 1) requestAnimationFrame(frame);
        else if (done) done();
      }
      requestAnimationFrame(frame);
    }

    // Slide out → hold → slide back → restore snap
    animate(0, TARGET, OUT_MS, easeOutCubic, function () {
      setTimeout(function () {
        animate(TARGET, 0, IN_MS, easeInCubic, function () {
          firstRow.style.scrollSnapType = originalSnap;
        });
      }, HOLD_MS);
    });
  }

  window.showShop = function showShop(e) {
    if (e) e.preventDefault();
    document.body.className = "show-shop";
    window.scrollTo(0, 0);
    revealIn("#shop-panel");
    triggerBulbEntrance();
    // Scroll hint: fires in BOTH themes. After cascade in dark (~1.6s),
    // sooner in light (~600ms — no cascade animation to wait for).
    var isLight = document.body.getAttribute("data-theme") === "light";
    setTimeout(function () {
      hintScroll(document.getElementById("shop-panel"));
    }, isLight ? 600 : 1600);
  };

  window.showAccess = function showAccess(e) {
    if (e) e.preventDefault();
    document.body.className = "show-access";
    window.scrollTo(0, 0);
    revealIn("#access-panel");
    document.getElementById("access-form").classList.remove("hidden");
    document.getElementById("access-success").classList.remove("show");
  };

  window.showHome = function showHome(e) {
    if (e) e.preventDefault();
    document.body.className = "";
    window.scrollTo(0, 0);
    // Fully reset the guide travel card to its natural state
    var card = document.getElementById("guideTravel");
    var spacer = document.getElementById("barSpacer");
    var landing = document.getElementById("barLanding");
    if (card) {
      card.classList.remove("traveling", "landed");
      card.style.position = "";
      card.style.top = "";
      card.style.left = "";
      card.style.width = "";
      card.style.transform = "";
      card.style.pointerEvents = "";
    }
    if (spacer) spacer.style.height = "0px";
    if (landing) landing.style.height = "0px";
    // Remeasure cleanly after layout settles
    if (window.__guideTravelMeasure) {
      setTimeout(window.__guideTravelMeasure, 150);
    }
  };

  function initRevealObserver() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in");
      });
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
  }

  function initAboutCardLight() {
    var card = document.querySelector(".about");
    if (!card) return;

    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--gx", (e.clientX - r.left) + "px");
      card.style.setProperty("--gy", (e.clientY - r.top) + "px");
      card.classList.add("lit");
    });

    card.addEventListener("pointerleave", function () {
      card.classList.remove("lit");
    });
  }

  function initGuideTravel() {
    // Travel animation removed — card reveals normally with .reveal class
    var spacer = document.getElementById("barSpacer");
    var landing = document.getElementById("barLanding");
    if (spacer) spacer.style.height = "0px";
    if (landing) landing.style.height = "0px";
  }

  function initVideosReveal() {
    var wrap = document.querySelector("#vidsScroll");
    if (!wrap) return;

    wrap.classList.add("vreveal");
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      wrap.classList.add("shown");
      return;
    }

    var ticking = false;
    function check() {
      ticking = false;
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.82) {
        wrap.classList.add("shown");
      } else {
        wrap.classList.remove("shown");
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
  }

  function initAccessForm() {
    var name = document.getElementById("f-name");
    var email = document.getElementById("f-email");
    var bike = document.getElementById("f-bike");
    var btn = document.getElementById("f-submit");
    if (!name) return;

    function isGmail(v) {
      return /^[^\s@]+@gmail\.com$/i.test(v.trim());
    }
    function nameOk() {
      return name.value.trim().length > 0;
    }
    function emailOk() {
      return isGmail(email.value);
    }
    function bikeOk() {
      return bike.value.trim().length > 0;
    }
    function refresh() {
      btn.disabled = !(nameOk() && emailOk() && bikeOk());
    }

    [name, email, bike].forEach(function (inp) {
      inp.addEventListener("input", function () {
        inp.closest(".field").classList.remove("show-err");
        refresh();
      });
    });

    var SUBMIT_URL = "https://script.google.com/macros/s/AKfycbzvF9Lx6miwV5zAsrTmnCc4iYcVccFUsxEMVjUksIGckqbJQsxL01Gl23QqBCY_QUE/exec";
    window.submitAccess = function submitAccess() {
      var ok = true;
      if (!nameOk()) {
        name.closest(".field").classList.add("show-err");
        ok = false;
      }
      if (!emailOk()) {
        email.closest(".field").classList.add("show-err");
        ok = false;
      }
      if (!bikeOk()) {
        bike.closest(".field").classList.add("show-err");
        ok = false;
      }
      if (!ok) return;

      if (SUBMIT_URL) {
        try {
          var fd = new FormData();
          fd.append("name", name.value.trim());
          fd.append("email", email.value.trim());
          fd.append("bike", bike.value.trim());
          fetch(SUBMIT_URL, { method: "POST", mode: "no-cors", body: fd });
        } catch (err) {}
      }

      document.getElementById("success-email").textContent = email.value.trim();
      document.getElementById("access-form").classList.add("hidden");
      document.getElementById("access-success").classList.add("show");
      window.scrollTo(0, 0);
    };
  }

  function initClickTracker() {
    var linkNames = {
      // Social
      "instagram.com":        "Social: Instagram",
      "youtube.com":          "Social: YouTube",
      "youtu.be":             "Social: YouTube",
      "wa.me":                "Social: WhatsApp",
      // Nav
      "showHome":             "Nav: Home",
      "showShop":             "Nav: Shop",
      "showAccess":           "Nav: Free Guide",
      // Products — amzn.to
      "amzn.to/4uI1OPM":     "Product: Motul Chain Kit",
      "amzn.to/4txp7uK":     "Product: Tank Cover",
      "amzn.to/3Q7p23c":     "Product: Aerol Silicone Spray",
      "amzn.to/3Pjt08w":     "Product: RE Riding Jacket",
      "amzn.to/4eBTNag":     "Product: 3M Bike Care Kit",
      // Products — shorturl
      "shorturl.at/6VX7N":   "Product: Matte Care Kit",
      // Products — link.amazon
      "B01JRESSp":           "Product: SMK Helmet",
      "B0dEwTdGo":           "Product: Tyre Inflator",
      "B0cfZ5Rf7":           "Product: Puncture Kit",
      "B0cZU0jyj":           "Product: Tool Kit",
      "B0e4g5lO8":           "Product: Riding Shoes",
      "B016OZnJB":           "Product: Fuel Additive",
      "B01gHJSXr":           "Product: WD-40"
    };

    function getLinkName(el) {
      var onclick = el.getAttribute("onclick") || "";
      for (var key in linkNames) {
        if (onclick.indexOf(key) > -1) return linkNames[key];
      }

      var href = el.href || "";
      for (var linkKey in linkNames) {
        if (href.indexOf(linkKey) > -1) return linkNames[linkKey];
      }

      var label = el.getAttribute("aria-label") || el.textContent.trim();
      return label.substring(0, 60) || href.substring(0, 80) || "unknown";
    }

    document.addEventListener("click", function (e) {
      var el = e.target.closest("a, [onclick]");
      if (!el) return;

      var name = getLinkName(el);
      var url = el.href || window.location.href;
      var section = (el.closest("#shop-panel") ? "Shop" :
        el.closest("#access-panel") ? "Guide" :
        el.closest(".topbar") ? "Social Bar" :
        el.closest(".vids") ? "Videos" :
        el.closest(".bento") ? "Bento Grid" :
        el.closest(".bar") ? "CTA Bar" : "General");

      if (typeof gtag === "function") {
        gtag("event", "link_click", {
          event_category: section,
          event_label: name,
          link_url: url,
          non_interaction: false
        });
      }

      if (typeof clarity === "function") {
        clarity("set", "link_clicked", name);
      }
    });
  }

  function initTimeTheme() {
    // Light theme 6am–6pm (06:00–17:59), dark theme rest of day.
    // Uses visitor's local time. Re-checks every minute in case the
    // page stays open across the transition.
    function applyTheme() {
      var hour = new Date().getHours();
      var isDay = hour >= 6 && hour < 18;
      document.body.setAttribute("data-theme", isDay ? "light" : "dark");
    }
    applyTheme();
    setInterval(applyTheme, 60 * 1000);
  }

  function initGreeting() {
    var h1 = document.querySelector(".header h1");
    var role = document.querySelector(".header .role");
    if (!h1 || !role) return;

    var h = new Date().getHours();

    var pools = {
      morning:   { lines: ["Morning, bhai.|"] },
      afternoon: { lines: ["Afternoon, bhai.|"] },
      evening:   { lines: ["Evening, bhai.|"] },
      night:     { lines: ["Hello night owl.|"] }
    };

    var slot = (h >= 5 && h < 12) ? "morning" : (h >= 12 && h < 17) ? "afternoon" : (h >= 17 && h < 21) ? "evening" : "night";
    var pool = pools[slot];
    var line = pool.lines[Math.floor(Math.random() * pool.lines.length)];

    var parts = line.split("|");
    h1.textContent = parts[0].trim();
    role.textContent = "Gear, guides & honest picks — one place for every rider. Glad you're here.";
  }

  onReady(function () {
    initTimeTheme();
    initGreeting();
    initRevealObserver();
    initAboutCardLight();
    initGuideTravel();
    initVideosReveal();
    initAccessForm();
    initClickTracker();
  });
})();
