# gh-check
Perfect little package for any github-repo based projects that wish to have their end-users kept up-to-date with new releases.


## Example Usage
The script below will check [**__THIS__**](https://github.com/2M4U/gh-check/) exact repository for it's release version,
I will be improving this at a later date when I can find the time.
```js
const Github = require("gh-check");
const Update = new Github({
  GITHUB_USER: "2M4U",
  PROJECT_NAME: "gh-check",
  AUTO_CHECK: true,
  RUN_UPDATE_CHECK: true,
  AUTO_CHECK_TIME: 3600,
});
```

**Full Changelog**: https://github.com/2M4U/gh-check/commits/0.1.0
