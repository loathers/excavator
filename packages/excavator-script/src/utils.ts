import {
  choiceFollowsFight,
  currentRound,
  fightFollowsChoice,
  getRevision,
  gitInfo,
  handlingChoice,
  inMultiFight,
  print,
  printHtml,
  sessionStorage,
  todayToString,
  visitUrl,
} from "kolmafia";
import { get, Kmail, set } from "libram";

const DATA_PROPERTY = "spadingData";
const RECIPIENT_PROPERTY = "excavatorRecipient";

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

function canKmail() {
  if (
    // In a fight
    currentRound() > 0 ||
    // In a choice
    handlingChoice() ||
    // Was in a choice, gonna be in a fight
    fightFollowsChoice() ||
    // Was in a fight, gonna be in a choice
    choiceFollowsFight() ||
    // Was in a fight, gonna be in another fight
    inMultiFight()
  ) {
    return false;
  }

  return true;
}

function addSpadingData(data: string, recipient: string, reason: string) {
  const newData = `${data}|${recipient}|${reason}`;
  let currentData = get(DATA_PROPERTY, "");

  if (currentData.includes(newData)) return;

  if (currentData && !currentData.endsWith("|")) {
    currentData += "|";
  }

  set(DATA_PROPERTY, currentData + newData);
}

function flushSpadingData() {
  // This will flush *all* spading data, not just that collected for Excavator.
  // I think that's fine? Noone uses this prop. But if they do, it would just be a
  // case of replacing this with a regex for `.*?|{get_recipient()}.*?` and then
  // selectively removing them with replace_all or something
  const spadingData = get(DATA_PROPERTY).split("|");

  let i = 0;
  while (i < spadingData.length - 2) {
    const contents = spadingData[i];
    const recipient = spadingData[++i];
    ++i; // Explanation
    const success = Kmail.send(recipient, contents);
    if (!success) {
      print(
        "Sending a kmail failed while Excavator was flushing the spading cache. Flush aborted.",
        "red",
      );
      return;
    }
    i++;
  }

  set(DATA_PROPERTY, "");
}

export function sendSpadingData(projectName: string, data: object) {
  // KoL adds spaces using v1.1 of htmlwrap (https://greywyvern.com/code/php/htmlwrap)
  // Rather than try to backwards engineer this, I'll just replace all spaces with +
  // and then treat spaces as hostile on the processing server. This obviously means
  // that data cannot contain a + sign. We'll have to solve that when we come to it.

  const dataString = encodeURIComponent(
    JSON.stringify({
      ...data,
      _PROJECT: projectName,
      _VERSION: getVersionString(),
    }),
  );

  const recipient = get(RECIPIENT_PROPERTY, "Excavator");

  if (canKmail()) {
    const flushMessage = get(DATA_PROPERTY, "")
      ? ", as well as some other data we couldn't send before, "
      : "";
    printHtml(
      `<font color="green">Sending spading data for <b>${projectName}</b>${flushMessage} to ${recipient}. Thanks!</font>`,
    );
    const success = Kmail.send(recipient, dataString);

    if (success) {
      flushSpadingData();
      deleteSpadingKmail(recipient);
      return;
    }

    print(
      "Excavator thought it could send data via kmail but it can't. Saving to cache instead.",
      "orange",
    );
  }

  addSpadingData(
    dataString,
    recipient,
    `Excavator's project to spade ${projectName}`,
  );
}

function deleteSpadingKmail(sentTo: string): void {
  // Only delete from the first page
  const buffer = visitUrl(
    `messages.php?box=Outbox&begin=1&per_page=10`,
  ).toLowerCase();
  const messageIds: string[] = buffer
    .split("td valign=top")
    .filter((s) =>
      s.match(
        `<a href="showplayer.php\\?who=(\\d+)">${sentTo.toLowerCase()}</a>`,
      ),
    )
    .map((s) => {
      const match = s.match('checkbox name="sel(\\d+)"');
      return match ? match[1] : "";
    })
    .filter((s) => s.length > 0);

  if (messageIds.length > 0) {
    const del = `messages.php?the_action=delete&box=Outbox&pwd${messageIds.map((id) => `&sel${id}=on`).join("")}`;
    visitUrl(del);
  }
}
