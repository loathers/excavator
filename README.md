# excavator ♠️

excavator is a `spadingScript` for KoLmafia (at least r20145) for collaboratively gathering data while playing the Kingdom of Loathing.

Only data pertinent to the [current projects](https://excavator.loathers.net/projects) are reported (outcomes from combats, state of flags or counters on your player etc) and each packet of data can be reviewed and approved before it is sent. No personal information beyond your player id will ever be transmitted.

These data are pulled every 15 minutes to a database and displayed on https://excavator.loathers.net. Before this site they were imported to [Google Sheets](https://tinyurl.com/excavator-data), where some data remains for posterity.

It is maintained by gausie (#1197090).

## Installation and Usage

Install the script using the KoLmafia CLI:

```
git checkout loathers/excavator release
```

Set up KoLmafia to use `excavator.js` as your spadingScript:

```
set spadingScript = excavator.js
```

Data will be automatically submitted when possible, but if you want to manually clear the cache in the `spadingData` prop, you can do so using the `spade autoconfirm` command:

```
spade
```

A reminder to do so appears on login and in the Daily Deeds panel.

## Further information

To get involved in writing a project or if you have any other queries join us on the [Ascension Speed Society Discord server](https://discord.gg/T3rqfve).
