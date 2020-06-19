# excavator

excavator is a `spadingScript` for KoLmafia (at least r20145) for collaboratively gathering data while playing the Kingdom of Loathing. It collects sends data via kmail to the player `Excavator` when possible (i.e. when you're not in an encounter), otherwise it is cached in the `spadingData` property. The cache can be processed by running the `spade` command in the CLI.

Only data pertinent to the [current projects](#current-projects) are reported (outcomes from combats, state of flags or counters on your player etc) and each packet of data can be reviewed and approved before it is sent. No personal information will ever be transmitted.

These data are pulled every 15 minutes to a [Google Sheet](https://tinyurl.com/excavator-data).

It is maintained by gausie (#1197090).

## Installation and Usage

Install the script using the KoLmafia CLI:

```
svn checkout https://github.com/gausie/excavator/trunk/RELEASE/
```

Set up KoLmafia to use `excavator.ash` as your spadingScript:

```
set spadingScript = excavator.ash
```

Data will be automatically submitted when possible, but if you want to manually clear the cache in the `spadingData` prop, you can do so using the `spade` command:

```
spade
```

A reminder to do so appears on login and in the Daily Deeds panel.

## Current projects

* **[Bird-a-Day](RELEASE/scripts/excavator/projects/x_bird_a_day.ash)** - Determine the relationship between Blessing of the Bird modifiers and the day seed
* **[Genie](RELEASE/scripts/excavator/projects/x_genie.ash)** - Determine which monsters and effects can be fought/acquired with the Genie
* **[Guzzlr](RELEASE/scripts/excavator/projects/x_guzzlr.ash)** - Determine the relationship between Guzzlr deliveries and enchantments on the Guzzlr tablet accessory
* **[Hookah](RELEASE/scripts/excavator/projects/x_hookah.ash)** - Submit data if an effect is obtained through a hookah-like mechanic that KoLmafia thinks shouldn't be possible
* **[Mumming Trunk](RELEASE/scripts/excavator/projects/x_mumming_trunk.ash)** - Record instances of a familiar indicating that it has a previous undetected attribute through mumming trunk bonuses
* **[Voting Booth](RELEASE/scripts/excavator/projects/x_voting_booth.ash)** - Determine the relationship between voting initiatives and the day seed

## Further information

To get involved in writing a project or if you have any other queries join us on the [Ascension Speed Society Discord server](https://discord.gg/T3rqfve).
