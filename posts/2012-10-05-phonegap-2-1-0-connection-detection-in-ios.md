---
title: "Phonegap 2.1.0 Connection Detection in iOS"
date: "2012-10-05"
---

\[I have been told that this is fixed in Cordova 2.2\]

I was working on a PhoneGap application being developed and optimized over Android and iOS. Last I used PhoneGap was about an year ago, a lot has changed in the platform since then. Together with jQuery Mobile, I ended up with a neat little app.

When working on the final touches for  the apps, I ran into a problem: when I detected the internet connection in Android using navigator.network.connection.type, it was working fine (Connection.NONE reported as intended), however, it was not the same for iOS. I double checked the permissions in the Cordova.plist, everything looked fine. It turns out, if there is no connection, the type is "unknown" or Connection.UNKNOWN. So now I am checking for Connection.NONE and Connection.UNKNOWN.

`js document.addEventListener("deviceready", onDeviceReady, false); function onDeviceReady() { var networkState = navigator.network.connection.type; console.log(networkState); if(networkState == Connection.NONE || networkState == Connection.UNKNOWN) { alert("You need an active internet connection if you want to save and email the reports."); } }`
