// ====== EDIT HERE ======
const NAME = "My Love"; // her name
const MESSAGE = "I love you more every day. Thank you for being you. ❤";

// Folder names (must match your real folders, same spelling)
const MUSIC_DIR = "music";
const PHOTO_DIR = "image"; // your folder is called "image", not "photos"

// File names inside the music folder (must match exactly, including .mp3)
const songs = [
  {
    title: "Noly Records",
    artist: "Noly Records",
    src: MUSIC_DIR + "/noly.mp3",
  },
  {
    title: "Deep Romance",
    artist: "Tena ft. Dit Way",
    src: MUSIC_DIR + "/tena.mp3",
  },
  { title: "Blue", artist: "Yung Kai", src: MUSIC_DIR + "/yung.mp3" },
];

// File names inside the image folder (must match exactly)
const photoNames = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
];
const photos = photoNames.map((n) => PHOTO_DIR + "/" + n);
// =======================

const $ = (id) => document.getElementById(id);
const audio = $("audio");
let cur = 0;

$("title").textContent = "For " + NAME;
$("love").textContent = MESSAGE;

function toast(t) {
  const e = $("toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 2600);
}

/* themes */
function setTheme(t) {
  document.body.dataset.theme = t;
  document.documentElement.dataset.theme = t;
  document
    .querySelectorAll("#themes button")
    .forEach((b) => b.classList.toggle("alt", b.dataset.t !== t));
  try {
    localStorage.setItem("theme", t);
  } catch (e) {}
}
$("themes").onclick = (e) => {
  if (e.target.dataset.t) setTheme(e.target.dataset.t);
};
try {
  const t = localStorage.getItem("theme");
  if (t) setTheme(t);
} catch (e) {}

/* photos (auto-scroll) */
const emojis = ["🌹", "💖", "🥰", "✨", "💌", "🌸", "💕", "🦋"];
function emojiSlides() {
  const html = emojis.map((e) => '<div class="slide">' + e + "</div>").join("");
  $("track").innerHTML = html + html;
}
function renderPhotos() {
  if (!photos.length) {
    emojiSlides();
    return;
  }
  // a photo that fails to load is removed, so there are no broken-image icons
  const html = photos
    .map(
      (p) =>
        '<div class="slide"><img src="' +
        p +
        '" alt="" onerror="this.parentElement.remove()"></div>',
    )
    .join("");
  $("track").innerHTML = html + html; // doubled for seamless loop
  // if every photo failed (wrong folder / names), show emojis instead
  setTimeout(() => {
    if (!$("track").querySelector(".slide")) {
      emojiSlides();
      console.warn(
        'No photos found. Check the folder name "' +
          PHOTO_DIR +
          '" and the file names.',
      );
    }
  }, 1500);
}
$("photoIn").onchange = (e) => {
  [...e.target.files].forEach((f) => photos.push(URL.createObjectURL(f)));
  renderPhotos();
  toast("Photos added 📷");
};
renderPhotos();

/* music */
function renderList() {
  $("list").innerHTML = songs
    .map(
      (s, i) =>
        '<li class="' +
        (i === cur ? "on" : "") +
        '" data-i="' +
        i +
        '"><span>' +
        s.title +
        "</span><small>" +
        s.artist +
        "</small></li>",
    )
    .join("");
}
function load(i) {
  cur = (i + songs.length) % songs.length;
  const s = songs[cur];
  audio.src = s.src;
  $("sTitle").textContent = s.title;
  $("sArtist").textContent = s.artist;
  renderList();
}
function play() {
  audio
    .play()
    .then(() => {})
    .catch(() => toast("Add your songs with “Add songs” 🎵"));
}
audio.onplay = () => {
  $("play").textContent = "⏸";
  $("playerCard").classList.add("playing");
};
audio.onpause = () => {
  $("play").textContent = "▶";
  $("playerCard").classList.remove("playing");
};
audio.onended = () => {
  load(cur + 1);
  play();
};
audio.onerror = () => {
  if (audio.getAttribute("src"))
    toast("Can’t find “" + songs[cur].src + "” 🎵");
};
audio.ontimeupdate = () => {
  if (audio.duration)
    $("seek").value = (audio.currentTime / audio.duration) * 100;
};
$("seek").oninput = (e) => {
  if (audio.duration)
    audio.currentTime = (e.target.value / 100) * audio.duration;
};
$("play").onclick = () => (audio.paused ? play() : audio.pause());
$("next").onclick = () => {
  load(cur + 1);
  play();
};
$("prev").onclick = () => {
  load(cur - 1);
  play();
};
$("list").onclick = (e) => {
  const li = e.target.closest("li");
  if (li) {
    load(+li.dataset.i);
    play();
  }
};
$("songIn").onchange = (e) => {
  const files = [...e.target.files];
  if (!files.length) return;
  const first = songs.length;
  files.forEach((f) =>
    songs.push({
      title: f.name.replace(/\.[^.]+$/, ""),
      artist: "My music",
      src: URL.createObjectURL(f),
    }),
  );
  load(first);
  play();
  toast("Songs added 🎵");
};
load(0);

/* open: browsers need a tap before sound, so music starts here */
$("openBtn").onclick = () => {
  $("intro").classList.add("hide");
  play();
};

/* falling hearts */
setInterval(() => {
  const h = document.createElement("div");
  h.className = "fall";
  h.textContent = ["❤", "💖", "💕", "🌸"][(Math.random() * 4) | 0];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  h.style.animationDuration = 5 + Math.random() * 5 + "s";
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 10500);
}, 600);
