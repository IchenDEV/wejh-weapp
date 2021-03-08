const app = getApp();

function bind(th) {
  app.$store.connect(th, "home");
  th.observe("session", "time");
  th.observe("session", "unclearedBadges");
  th.observe("static", "devMenuEnabled");
}

export { bind };
