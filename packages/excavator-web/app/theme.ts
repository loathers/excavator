import {
  type SystemStyleObject,
  createSystem,
  defaultConfig,
  defineRecipe,
} from "@chakra-ui/react";

const linkRecipe = defineRecipe<{
  variant: { underline: SystemStyleObject; plain: SystemStyleObject };
}>({
  defaultVariants: {
    variant: "underline",
  },
});

export const theme = createSystem(defaultConfig, {
  theme: {
    recipes: {
      link: linkRecipe,
    },
  },
});
