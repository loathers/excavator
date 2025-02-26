import {
  Stack,
  Box,
  PaginationNextTrigger,
} from "@chakra-ui/react";
import { PaginationItems, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from "./ui/pagination";

type Props = {
  count: number;
  pageSize: number,
  page: number;
  onPageChange: (page: number) => any;
};

export function Pagination({ count, pageSize, page, onPageChange }: Props) {
  return (
    <PaginationRoot
      count={count}
      pageSize={pageSize}
      page={page + 1}
      onPageChange={({ page }) => onPageChange(page)}
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
