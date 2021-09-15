# Change Log

## 0.3.4

Released 15-09-2021

Bug Fixes

* Fix localhost UI correct related prefix links,
* Fix several links in Data Freshness tooltip (most for localhost UI).
* Fix IPv6 /32 inferred prefixes.

New 

* Show UI version in footer.
* Removed `rtr total connections` from connections tab.
* Use 1000s separators

## 0.3.3

Released 13-09-2021

included in Routinator 0.10.1-rc2

Bug Fixes

* Fixes initial loading of UI with query parameters not showing the validation

Other Changes

* Do not rebuild crate on changes in ../dist (would always rebuild if ../dist does not exist).

## 0.3.2

included in Routinator 0.10.1-rc1

New

* Better Routinator failure reporting
* Roto-API failure reporting


## 0.3.1

Release 13-09-2021

Other Changes

* Use bgp-api.net as host for roto-api

## 0.3.0

Released 13-09-2021

New

* Adds support for roto-api: search for BGP origin ASNS and allocations, show more-less specific prefixes.
