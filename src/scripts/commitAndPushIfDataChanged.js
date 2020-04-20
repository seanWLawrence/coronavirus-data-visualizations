let { spawnSync } = require("child_process");

// add all changes to git
spawnSync("git", ["add", "."]);

// run git status to get changes stored into a variable
let { stdout: gitStatus } = spawnSync("git", ["status"]);

let dataHasChanged = String(gitStatus)
  .toLowerCase()
  .includes("changes to be committed:");

if (dataHasChanged) {
  console.log("Contains changes. Commiting them...");

  // commit changes with today's date
  spawnSync(
    "git",
    ["commit", "-m", `"Updating data on ${new Date().toISOString()}"`],
    { stdio: "inherit" }
  );

  process.exit(0);
} else {
  console.log("No changes. Exiting gracefully...");

  process.exit(0);
}
