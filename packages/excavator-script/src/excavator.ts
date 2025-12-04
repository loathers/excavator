import type { ExcavatorProject } from "excavator-projects";
import { projects } from "excavator-projects";
import { getRevision, myPath, Path } from "kolmafia";

import { sendSpadingData } from "./utils";

function tupleNotNull<A, B>(
  value: readonly [A, B | null],
): value is readonly [A, B] {
  return value[1] !== null;
}

type Event = keyof ExcavatorProject["hooks"];

function main(event: Event, meta: string, page: string) {
  projects
    .filter(
      ({ hooks, since = 0, completed, allowInTcrs }) =>
        !completed &&
        event in hooks &&
        since <= getRevision() &&
        (myPath() !== Path.get("Two Crazy Random Summer") || allowInTcrs),
    )
    .map(
      ({ name, hooks }) => [name, hooks[event]?.(meta, page) ?? null] as const,
    )
    .filter(tupleNotNull)
    .forEach(([name, data]) => {
      // Projects are permitted to send a single or multiple data points at a time
      (Array.isArray(data) ? data : [data]).forEach((d) => {
        sendSpadingData(name, d);
      });
    });
}

module.exports.main = main;
