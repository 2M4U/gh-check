const Github = require("./lib/updateChecker");
const Update = new Github({
  GITHUB_USER: "2M4U",
  PROJECT_NAME: "IPBlocker",
  AUTO_CHECK: true,
  RUN_UPDATE_CHECK: true,
  AUTO_CHECK_TIME: 3600,
});
async function test() {
  await Update.check();
}
test();
