const axios = require("axios");
const prettyMs = require("pretty-ms");
const { name } = require("../package.json");
class UpdateChecker {
  /**
     * 
     * @example
     * Github({
     *      GITHUB_USER: "Example",
            PROJECT_NAME: "Project-Example",
            AUTO_CHECK: true,
            RUN_UPDATE_CHECK: true,
            AUTO_CHECK_TIME: 3600, //in seconds
        });
     */
  constructor(options) {
    this.GITHUB_USER = options.GITHUB_USER;
    this.PROJECT_NAME = options.PROJECT_NAME;
    this.RUN_UPDATE_CHECK = options.RUN_UPDATE_CHECK || true;
    this.AUTO_CHECK = options.AUTO_CHECK || false;
    this.AUTO_CHECK_TIME = options.AUTO_CHECK_TIME || 3600;
  }
  async check() {
    if (this.GITHUB_USER === undefined && this.PROJECT_NAME === undefined) {
      console.log(
        "[Update Checker]: Please provide GITHUB_USER & GITHUB_PROJECT to continue using this feature."
      );
      return;
    }
    if (this.RUN_UPDATE_CHECK) {
      try {
        let github_url =
          "https://api.github.com/repos/{github_user}/{project}/releases/latest"
            .replace("{github_user}", this.GITHUB_USER)
            .replace("{project}", this.PROJECT_NAME);
        let github_resp = await axios.get(github_url, {
          headers: {
            accept: "application/vnd.github.v3+json",
            "user-agent": `${name}/1.0.0 by 2M4U`,
          },
        });

        let current_version = require(`${process.cwd()}/package.json`).version;
        let bot_version = current_version.replace(/\./g, "");
        let github_version = github_resp.data.tag_name;
        let tag_name = github_version.replace(/\./g, "");

        if (isNaN(bot_version) || isNaN(tag_name)) {
          console.log(
            "[Update Checker] Could not parse version numbers. Make sure the package.json file is untouched."
          );
        } else {
          if (Number(tag_name) > Number(bot_version)) {
            console.log(
              "[Update Checker] There is a new version. Download it from: https://github.com/{github_user}/{project}/releases/tag/{version}"
                .replace("{github_user}", this.GITHUB_USER)
                .replace("{project}", this.PROJECT_NAME)
                .replace("{version}", github_version)
            );
            console.log(`[Update Checker] Current Version: ${current_version}`);
            console.log(`[Update Checker] New Version: ${github_version}`);
          } else {
            console.log("[Update Checker] You are up to date!");
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.log(
            `[Update Checker] No releases could be found. ${
              this.AUTO_CHECK
                ? "Trying again in {time}".replace(
                    "{time}",
                    this.AUTO_CHECK_TIME
                  )
                : "Please try again later."
            }`
          );
        } else {
          console.log(
            "[Update Checker] There was an error checking for updates"
          );
        }
      }
      if (this.AUTO_CHECK) {
        console.log(
          `[Update Checker] Checking again in ${prettyMs(
            this.AUTO_CHECK_TIME * 1000,
            { verbose: true }
          )} for a new update.`
        );
        setInterval(async () => {
          await UpdateChecker({
            GITHUB_USER: this.GITHUB_USER,
            PROJECT_NAME: this.PROJECT_NAME,
            AUTO_CHECK: this.AUTO_CHECK,
            RUN_UPDATE_CHECK: this.RUN_UPDATE_CHECK,
            AUTO_CHECK_TIME: this.AUTO_CHECK_TIME,
          }).check();
        }, this.AUTO_CHECK_TIME * 1000);
      }
    }
  }
}
module.exports = UpdateChecker;
