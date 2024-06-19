import { getRevision, gitInfo, myId, printHtml, visitUrl } from "kolmafia";

function getExcavatorVersion() {
  return (
    gitInfo("loathers-excavator-release").commit.substring(0, 7) ||
    gitInfo("gausie-excavator-release").commit.substring(0, 7) ||
    0
  );
}

function getVersionString() {
  return `${getRevision()}/${getExcavatorVersion()}`;
}

export function sendSpadingData(projectName: string, data: object) {
  const dataString = Object.entries({
    ...data,
    _PROJECT: projectName,
    _VERSION: getVersionString(),
    _PLAYER: myId(),
  })
    .map(([k, v]) => `${k}:${encodeURIComponent(v)}`)
    .join("&");

  const response = visitUrl(
    `https://excavator.loathers.net/webhook?${dataString}`,
    true,
  );
  const result = JSON.parse(response);

  if (!result.success) {
    if (result.message === "This project is invalid, please update excavator") {
      printHtml(
        `Excavator project <b>${projectName}</b> is invalid, please update excavator.`,
      );
    }
  }
}
