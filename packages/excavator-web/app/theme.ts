import { defineStyleConfig, extendTheme } from "@chakra-ui/react";

const Link = defineStyleConfig({
  baseStyle: {
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
});

export const theme = extendTheme({
  components: {
    Link,
  },
});
