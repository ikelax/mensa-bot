import process from "node:process";

// The global setup is run before the test suite. So, it can set the
// timezone. See also
// https://github.com/vitest-dev/vitest/issues/1575#issuecomment-1439286286.
export const setup = () => {
  process.env.TZ = "UTC";
};
