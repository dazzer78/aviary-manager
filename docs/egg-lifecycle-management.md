# Egg lifecycle management

Egg status is now system-managed and should not be changed with a manual status dropdown.

## Status source

The current egg/chick status is derived from `egg_events`.

Event priority:

1. `ringed` -> Ringed
2. `dead_before_ringing` -> Dead Before Ringing
3. `hatched` -> Hatched
4. `dead_in_shell` -> Dead In Shell
5. `abandoned` -> Abandoned
6. `broken` -> Broken
7. `not_fertilised` -> Not Fertilised
8. `egg_created` or no events -> Incubating

## Edit egg screen

Replace manual status selection with read-only display:

```text
Status
Incubating
System managed
```

## Allowed actions

### Incubating

- Hatch Egg
- Mark Clear / Not Fertilised
- Mark Broken
- Mark Abandoned
- Mark Dead In Shell

### Hatched

- Ring Chick
- Record Death Before Ringing

### Ringed or closed statuses

No egg status actions should be shown.

## Grouped cage / nest views

Use the summary helper to show egg counts by derived status, for example:

```text
Cage 14
Gouldian Finch
4 eggs
2 Hatched
2 Incubating
```
