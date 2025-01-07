# Telegram Bot for the meal plan in the canteen of Saarland University

The bot fetches the meal plan from [Mensaar for the UdS](https://mensaar.de/#/menu/sb)
and provides inline queries and commands for listing and showing the available meals.

## Usage

If you host your own bot, you have to replace `mensa_sbot` with the name of your bot.

### Inline Queries

By typing `@mensa_sbot`, you will see the days in the meal plan. If you
select a day, the bot replies with the meals for this day.

### Commands

When the bot receives one of the commands `/days`, `/d`, `/m`,
`/mealplans`, `/meals` or `/menus`, it sends a list of inline buttons
for all days in the meal plan. It sends you the meals for the
respective day when you click on one of the buttons.

The bot sends the meals for tomorrow for the commands `/t` and `/tomorrow`.

### Messages

The bot replies with the meals for today if you send a message to it
directly.

## Hosting

Follow the [guide in grammY documentation](https://grammy.dev/hosting/deno-deploy)
for Deno Deploy. It is free.

You have to enable the inline mode for the bot. How to do this is described [in the grammY documentation](https://grammy.dev/plugins/inline-query#enabling-inline-mode).

If you need help, feel free to reach out, for example by opening an issue.

## Contributing

Feel free to open an issue if you have ideas for the bot. Before you make
a PR introducing new features, I would appreciate it if we could discuss
your ideas in an issue.

## Future work

Currently, I do not have new features for the bot in mind. If the
project grows more, it could make sense to

- add type checking and maybe migrate to TypeScript
- replace the linter from Deno with ESLint
  - my gut feeling is that the results from ESLint are better
  - maybe with
    - [typescript-eslint](https://typescript-eslint.io/)
    - [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
    - [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc)
    - [eslint-plugin-vitest](https://www.npmjs.com/package/eslint-plugin-vitest)
- replace the usages of the Deno runtime in `dev.js` and `main.js` with
  [dotenv](https://www.npmjs.com/package/dotenv) and for example [express](https://expressjs.com/)
- add more unit tests and maybe property based tests
- use a spell-checker like [typos](https://github.com/crate-ci/typos)

## Why JavaScript?

I wanted to try out plain JavaScript because I have only worked in
TypeScript projects so far.
