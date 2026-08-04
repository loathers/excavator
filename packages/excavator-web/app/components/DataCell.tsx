import { Link } from "@chakra-ui/react";

import {
  getEntity,
  parseEntityId,
  resolveKey,
  wikiUrl,
} from "../utils/entityLinks.js";

type DataCellProps = {
  columnName: string;
  value: unknown;
  names: Record<string, string>;
};

export function DataCell({ columnName, value, names }: DataCellProps) {
  const entity = getEntity(columnName);
  const id = entity ? parseEntityId(value) : null;
  const name =
    entity && id !== null ? names[resolveKey(entity, id)] : undefined;

  if (entity && id !== null && name) {
    return (
      <Link href={wikiUrl(entity, id)} target="_blank" rel="noreferrer">
        {name}
      </Link>
    );
  }

  return <>{String(value)}</>;
}
