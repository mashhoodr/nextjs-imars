---
title: "Getting battery related information in Cocoa (OSX) development"
date: "2013-08-11"
---

I recently read a nice [Quora answer](http://www.quora.com/iPhone/Why-is-it-better-for-your-iPhone-to-keep-battery-cycles-at-a-minimum) on shallow charging and wanted to give it a try with my new Macbook Pro Retina. The core problem that I continuously faced was I would forget to plug the charger back in, or take it off and the charge would slide down below 35% or up to 100%. What I need was something that would remind me if the charge percentage would go above or below the limits. I did some research, but could not find anything in the Mac app store or in any of the open source projects. Since I was limited on time, I then setup a crude implementation using automator.

Its been three months since I implemented that crude implementation, and I finally got some time to develop an improved version.  At its core is a simple battery information API \[[BatteryInfo.h](https://github.com/mashhoodr/Shalby/blob/master/Shalby/MLBatteryInfo.h)\] which queries the system using **ioreg** tool via NSTask. I have even implemented a simple caching system which reduces the number of NSTask calls to the system.

The **ioreg** contains a lot of data, which is why I grep out only the things I need. The API can be easily extended by adding the additional keywords in the grep pattern.

The following information is available over the **ioreg**:

- "TimeRemaining" = 271
- "AvgTimeToEmpty" = 271
- "ExternalChargeCapable" = No
- "CellVoltage" = (3971,3976,3970,0)
- "PermanentFailureStatus" = 0
- "BatteryInvalidWakeSeconds" = 30
- "MaxCapacity" = 8112
- "Voltage" = 11917
- "DesignCycleCount70" = 65535
- "Manufacturer" = "SMP"
- "CurrentCapacity" = 6917
- "LegacyBatteryInfo" = {"Amperage"=18446744073709550084,"Flags"=4,"Capacity"=8112,"Current"=6917,"Voltage"=11917,"Cycle Count"=325}
- "BatteryInstalled" = Yes
- "CycleCount" = 325
- "DesignCapacity" = 8460
- "OperationStatus" = 58435
- "ManufactureDate" = 16687
- "AvgTimeToFull" = 65535
- "PostDischargeWaitSeconds" = 120
- "Temperature" = 3094
- "FullyCharged" = No
- "InstantAmperage" = 18446744073709550178
- "Amperage" = 18446744073709550084
- "IsCharging" = No
- "DesignCycleCount9C" = 1000
- "PostChargeWaitSeconds" = 120
- "ExternalConnected" = No

A word of caution though, calls like isCharging can take a few seconds to update, I still have not been able to figure out why. Thus, should be safe to poll a few times before confirming the change.

[![Shalby icon](images/icon_128x128.png)](http://imars.info/wp-content/uploads/2013/12/icon_128x12811.png)

References: [Quora Answer](http://www.quora.com/iPhone/Why-is-it-better-for-your-iPhone-to-keep-battery-cycles-at-a-minimum "Shallow Charging")

[Project Repo](https://github.com/mashhoodr/Shalby "Github repo")
