import process from "node:process";

export const setup = () => {
  process.env.TZ = "UTC";
};
