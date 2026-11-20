// ✏️ Edit these to make it yours
var HER_NAME = "lay Sovannarathtepy";
var START = new Date("2026-10-18T00:00:00"); // the day you got together
var REASONS = [
  [
    "The way you laugh",
    "It’s the best sound, and I’d do almost anything to hear it.",
  ],
  ["How kind you are", "You’re gentle with everyone, even when you’re tired."],
  ["Your stubborn side", "It drives me crazy, and I wouldn’t change it."],
  ["Being around you", "Even quiet nights feel like my favourite plans."],
  ["Your little habits", "I notice every one of them, and I love them all."],
  ["Who I am with you", "A calmer, happier version of me."],
];
var ANSWERS = [
  "More than yesterday.",
  "Forever and a day.",
  "To the moon and back.",
  "Always. Even when you’re grumpy.",
];

var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var $ = function (id) {
  return document.getElementById(id);
};

// Name: one animated span per letter
var nameEl = $("name");
nameEl.textContent = "";
nameEl.setAttribute("aria-label", HER_NAME);
HER_NAME.split("").forEach(function (ch, i) {
  var s = document.createElement("span");
  s.textContent = ch;
  s.style.setProperty("--i", i);
  s.setAttribute("aria-hidden", "true");
  nameEl.appendChild(s);
});
document.title = "For " + HER_NAME;
$("since").textContent =
  "of being with you, since " +
  START.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) +
  ".";

// Live counter
function tick() {
  var s = Math.floor(Math.max(0, Date.now() - START.getTime()) / 1000);
  $("d").textContent = Math.floor(s / 86400);
  $("h").textContent = Math.floor((s % 86400) / 3600);
  $("m").textContent = Math.floor((s % 3600) / 60);
  $("s").textContent = s % 60;
}
tick();
setInterval(tick, 1000);

// Reasons
REASONS.forEach(function (r) {
  var li = document.createElement("li"),
    b = document.createElement("button");
  b.type = "button";
  b.setAttribute("aria-expanded", "false");
  b.innerHTML =
    '<span class="heart" aria-hidden="true">♥</span><span><strong class="tease"></strong><span class="text"></span></span>';
  b.querySelector(".tease").textContent = r[0];
  b.querySelector(".text").textContent = r[0] + ". " + r[1];
  b.addEventListener("click", function () {
    b.setAttribute(
      "aria-expanded",
      b.getAttribute("aria-expanded") === "true" ? "false" : "true",
    );
  });
  li.appendChild(b);
  $("reasons").appendChild(li);
});

// Section reveal
var secs = document.querySelectorAll("section");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  secs.forEach(function (s) {
    io.observe(s);
  });
} else {
  secs.forEach(function (s) {
    s.classList.add("in");
  });
}

// Scroll progress bar
function progress() {
  var h = document.documentElement.scrollHeight - innerHeight;
  $("progress").style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
}
addEventListener("scroll", progress, { passive: true });
progress();

// Theme toggle
$("theme").addEventListener("click", function () {
  var root = document.documentElement,
    t = root.getAttribute("data-theme");
  var dark = t
    ? t === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", dark ? "light" : "dark");
});

// Heart burst
function burst() {
  for (var i = 0; i < 18; i++) {
    var e = document.createElement("span");
    e.className = "fly";
    e.textContent = "♥";
    e.style.left = Math.random() * 96 + "vw";
    e.style.animationDelay = Math.random() * 0.5 + "s";
    e.style.fontSize = 14 + Math.random() * 24 + "px";
    document.body.appendChild(e);
    setTimeout(
      (function (el) {
        return function () {
          el.remove();
        };
      })(e),
      3000,
    );
  }
}
var n = 0;
$("btn").addEventListener("click", function () {
  $("answer").textContent = ANSWERS[n++ % ANSWERS.length];
  burst();
});

// Photo viewer: the photo grows from where you tapped it
var lb = $("lightbox"),
  card = $("lbCard"),
  art = $("lbArt"),
  active = null;
function place(t) {
  var r = t.getBoundingClientRect(),
    c = card.getBoundingClientRect();
  var dx = r.left + r.width / 2 - (c.left + c.width / 2);
  var dy = r.top + r.height / 2 - (c.top + c.height / 2);
  card.style.transform =
    "translate(" +
    dx +
    "px," +
    dy +
    "px) scale(" +
    r.width / c.width +
    ") rotate(-4deg)";
}
function openPhoto(t) {
  active = t;
  art.textContent = "";
  var img = t.querySelector("img");
  if (img) {
    art.appendChild(img.cloneNode());
  } else {
    var s = document.createElement("span"),
      b = document.createElement("b");
    b.textContent = "♥";
    s.appendChild(b);
    s.appendChild(
      document.createTextNode(t.textContent.replace("♥", "").trim()),
    );
    art.appendChild(s);
  }
  $("lbCaption").textContent = t.getAttribute("data-caption") || "";
  lb.hidden = false;
  lb.classList.remove("open");
  card.style.transition = "none";
  place(t);
  void card.offsetWidth;
  card.style.transition = "";
  lb.classList.add("open");
  card.style.transform = "none";
  $("lbClose").focus();
  burst();
}
function closePhoto() {
  if (!active) return;
  var t = active;
  active = null;
  place(t);
  lb.classList.remove("open");
  setTimeout(
    function () {
      lb.hidden = true;
      t.focus();
    },
    calm ? 0 : 450,
  );
}
document.querySelectorAll(".tile").forEach(function (t) {
  t.addEventListener("click", function () {
    openPhoto(t);
  });
});
lb.addEventListener("click", function (e) {
  if (e.target === lb) closePhoto();
});
$("lbClose").addEventListener("click", closePhoto);
addEventListener("keydown", function (e) {
  if (e.key === "Escape") closePhoto();
});

if (!calm) {
  // Drifting background hearts
  var bg = document.createElement("div");
  bg.className = "bg";
  bg.setAttribute("aria-hidden", "true");
  for (var i = 0; i < 14; i++) {
    var h = document.createElement("span");
    h.textContent = "♥";
    h.style.left = Math.random() * 96 + "vw";
    h.style.fontSize = 12 + Math.random() * 26 + "px";
    h.style.animationDuration = 14 + Math.random() * 14 + "s";
    h.style.animationDelay = -Math.random() * 20 + "s";
    bg.appendChild(h);
  }
  document.body.insertBefore(bg, document.body.firstChild);

  // Sparkle trail that follows the cursor or finger
  var last = 0;
  addEventListener("pointermove", function (e) {
    var now = Date.now();
    if (now - last < 60) return;
    last = now;
    var s = document.createElement("span");
    s.className = "spark";
    s.textContent = "✦";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.setProperty("--dx", Math.random() * 40 - 20 + "px");
    s.style.setProperty("--dy", Math.random() * 40 + 10 + "px");
    document.body.appendChild(s);
    setTimeout(function () {
      s.remove();
    }, 800);
  });

  // 3D tilt on photo tiles
  document.querySelectorAll(".tile").forEach(function (t) {
    t.addEventListener("pointermove", function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty(
        "--ry",
        ((e.clientX - r.left) / r.width - 0.5) * 24 + "deg",
      );
      t.style.setProperty(
        "--rx",
        -((e.clientY - r.top) / r.height - 0.5) * 24 + "deg",
      );
    });
    t.addEventListener("pointerleave", function () {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
    });
  });
  const loveBtn = document.getElementById("loveBtn");
  const loveLoader = document.getElementById("loveLoader");
  const loveSound = document.getElementById("loveSound");

  loveBtn.addEventListener("click", () => {
    loveSound.currentTime = 0;
    loveSound.play().catch(() => {});
    loveBtn.disabled = true;
    loveLoader.hidden = false;
    requestAnimationFrame(() => loveLoader.classList.add("show"));

    setTimeout(() => {
      window.location.href = loveBtn.dataset.url; // no quotes around this
    }, 3000); // 3000ms = 4s
  });
}
