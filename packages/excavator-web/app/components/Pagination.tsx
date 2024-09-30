import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Select,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";

type Props = {
  pages: number;
  value: number;
  onChange: (page: number) => any;
};

export function Pagination({ pages, value, onChange }: Props) {
  const options = useMemo(
    () =>
      [...Array(pages).keys()].map((i) => (
        <option key={i} value={i}>
          {i + 1}
        </option>
      )),
    [pages],
  );

  return (
    <Flex justifyContent="space-between">
      <ButtonGroup isAttached>
        <Button
          isDisabled={value === 0}
          onClick={() => onChange(0)}
          title="First Page"
        >
          {"<<"}
        </Button>
        <Button
          isDisabled={value === 0}
          onClick={() => onChange(value - 1)}
          title="Previous Page"
        >
          {"<"}
        </Button>
      </ButtonGroup>
      <HStack>
        <Text>Page</Text>
        <Select
          title="Current page"
          textAlign="center"
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
          width="auto"
        >
          {options}
        </Select>{" "}
        <Text>of {pages}</Text>
      </HStack>
      <ButtonGroup isAttached>
        <Button
          isDisabled={value >= pages - 1}
          onClick={() => onChange(value + 1)}
          title="Next Page"
        >
          {">"}
        </Button>
        <Button
          isDisabled={value >= pages - 1}
          onClick={() => onChange(pages - 1)}
          title="Last Page"
        >
          {">>"}
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
