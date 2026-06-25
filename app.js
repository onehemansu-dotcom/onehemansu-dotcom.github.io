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

  window.showShop = function showShop(e) {
    if (e) e.preventDefault();
    document.body.className = "show-shop";
    window.scrollTo(0, 0);
    revealIn("#shop-panel");
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
    if (window.__guideTravelMeasure) {
      setTimeout(window.__guideTravelMeasure, 50);
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
    var card = document.getElementById("guideTravel");
    var spacer = document.getElementById("barSpacer");
    var landing = document.getElementById("barLanding");
    var panel = document.getElementById("home-panel");
    if (!card || !spacer || !landing || !panel) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    var cardH = 0;
    var startTop = 0;
    var ready = false;

    function measure() {
      card.classList.remove("traveling", "landed");
      card.style.position = "";
      spacer.style.height = "0px";
      landing.style.height = "0px";

      var rect = card.getBoundingClientRect();
      cardH = rect.height;
      startTop = window.scrollY + rect.top;

      spacer.style.height = cardH + "px";
      landing.style.height = (cardH + 24) + "px";

      card.classList.add("traveling");
      ready = true;
      update();
    }

    var ticking = false;
    function update() {
      ticking = false;
      if (!ready) return;

      var y = window.scrollY;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var maxScroll = Math.max(1, document.body.scrollHeight - vh);
      var rawP = Math.max(0, Math.min(1, y / maxScroll));

      var lrect = landing.getBoundingClientRect();
      var landingTopAbs = y + lrect.top;
      var landingViewportAtEnd = landingTopAbs - maxScroll;
      var glide = rawP;
      var fixedTop = startTop + (landingViewportAtEnd - startTop) * glide;

      var atLanding = rawP >= 0.985;
      var p = glide;

      card.classList.add("traveling");
      if (atLanding) {
        card.classList.add("landed");
      } else {
        card.classList.remove("landed");
      }
      card.style.position = "fixed";

      var srect = spacer.getBoundingClientRect();
      card.style.width = srect.width + "px";
      card.style.left = srect.left + "px";

      var docked = rawP < 0.02;
      card.style.pointerEvents = (docked || atLanding) ? "auto" : "none";

      var mid = 1 - Math.abs(p - 0.5) * 2;
      var scale = (1 - mid * 0.10).toFixed(3);

      card.style.top = fixedTop + "px";
      card.style.transform = atLanding ? "scale(1)" : ("scale(" + scale + ")");

      var leave = Math.max(0, Math.min(1, (p - 0.05) / 0.10));
      var reveal = Math.max(0, Math.min(1, (p - 0.55) / 0.45));
      reveal = reveal * reveal * (3 - 2 * reveal);
      if (atLanding) reveal = 1;

      var hidden = leave * (1 - reveal);
      var op = (1 - hidden * 0.88).toFixed(3);
      var bl = (hidden * 10).toFixed(2);
      card.style.setProperty("--op", op);
      card.style.setProperty("--bl", bl + "px");

      var collapse = Math.max(0, Math.min(1, rawP / 0.16));
      spacer.style.height = (cardH * (1 - collapse)) + "px";
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      ready = false;
      measure();
    }, { passive: true });
    window.addEventListener("load", measure);
    setTimeout(measure, 400);
    window.__guideTravelMeasure = measure;
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

  onReady(function () {
    initRevealObserver();
    initAboutCardLight();
    initGuideTravel();
    initVideosReveal();
    initAccessForm();
    initClickTracker();
  });
})();
