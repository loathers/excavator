import { Heading } from "@chakra-ui/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";

import { db } from "../db.server.js";

export async function loader() {
  const data = await db.spadingData.findMany({});
  return json({ data });
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <>
      <Heading>Excavator ♠️</Heading>
      {JSON.stringify(data)}
    </>
  );
}
