# Skill Data Engine v2 — schema audit

OpenDota's constants payload stores cooldown, mana and damage values as slash-separated strings or arrays. The engine preserves the source value and also exposes parsed per-level arrays. It retains behavior, target team/type, BKB piercing, dispellable state, innate flag, image, attributes, talents with level and facets.

Radius and cast range are read from explicit fields when present, or from matching attribute keys. The engine does not infer a missing value from prose. Coverage counts ability slots and talent slots separately, then reports missing metadata for both.

Source schema reference: https://github.com/odota/dotaconstants and OpenDota constants API. Values remain tied to the source payload and its patch context; this is not a complete simulation of each spell's mechanics.

The application exposes an on-demand button to load the complete constants dataset and show the actual hero/ability/talent coverage. Network extraction requires an active connection; the dataset remains in memory for the current page session.
