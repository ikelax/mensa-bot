# Manual tests

Because the unit tests do not the Telegram based functionality, the
following manual tests should be done if (large) changes to the codebase
are made.

| Action                                                             | Expected result                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Make an inline query `@mensa_sbot` and click on one of the results | Replies with the meals for the chosen day.                           |
| View the available days in an inline query.                        | They are the same as on [Mensaar](https://mensaar.de/#/menu/sb).     |
| Send `/start`                                                      | Replies with the welcome message.                                    |
| Send `/days`, `/d`, `/m`, `/mealplans`, `/meals` or `/menus`.      | Replies with a list of inline buttons with the days in the meal plan |
| Click on an inline button.                                         | Replies with the meals for the chosen day.                           |
| View the available days in list of inline buttons.                 | They are the same as on [Mensaar](https://mensaar.de/#/menu/sb).     |
