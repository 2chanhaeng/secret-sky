import { appendFileSync } from "fs";

export const main = () => {
  if (process.env.CLOCK_ID === undefined) genCid();
};

const genCid = () => {
  const CLOCK_ID = Math.floor(Math.random() * 1024);
  appendFileSync(`./.env.local`, `CLOCK_ID=${CLOCK_ID}\n`);
};
