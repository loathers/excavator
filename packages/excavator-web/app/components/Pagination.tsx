import { Stack, Box } from "@chakra-ui/react";

import {
  PaginationItems,
  PaginationPageText,
  PaginationPrevTrigger,
  PaginationNextTrigger,
  PaginationRoot,
} from "./ui/pagination";

type Props = {
  count: number;
  pageSize: number;
  page: number;
};

export function Pagination({ count, pageSize, page }: Props) {
  return (
    <PaginationRoot
      count={count}
      pageSize={pageSize}
      page={page + 1}
      getHref={(page) => `?page=${page}`}
    >
      <Stack direction="row" alignItems="center">
        <PaginationPrevTrigger />
        <Box display={["none", null, "block"]}>
          <PaginationItems />
        </Box>
        <Box display={["block", null, "none"]}>
          <PaginationPageText />
        </Box>
        <PaginationNextTrigger />
      </Stack>
    </PaginationRoot>
  );
}
