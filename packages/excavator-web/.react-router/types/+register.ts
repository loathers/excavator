import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/projects": {};
  "/projects/:project.csv": {
    "project": string;
  };
  "/projects/:project": {
    "project": string;
  };
};