---
title: "Of Animation, Popups and Timers.."
date: "2009-09-07"
---

Unfortunately my laptop is now unable to run the Visual Basic 2008 Express Edition.. so I am back at my web development.  I was fixing some bugs on my mums site (http:ammisrecipes.com) when I saw I needed some popups to give certain notifications.  Thus I started working on the popups, adding a fade out effect and a timer to close it automatically after two seconds. Fadeout timer and the visual settings can be changed from the respective css and js files.

CSS file: style.css

```css
html { background:blue; }

body { color: black; margin: 15px; align:center; }

#styled\_popup {

background:yellow; width: 350px; height: 100px; display:none; position: absolute; top: 100px; left: 300px; zoom: 1; -webkit-border-radius: 5px;

margin:10px; color:black; } \[/sourcecode\]
```

JS File: ani_popup.js

```js
var mins,secs,TimerRunning,TimerID; TimerRunning=false;

function StopTimer() { if(TimerRunning) clearTimeout(TimerID); TimerRunning=false; }

function StartTimer() { TimerRunning=true; TimerID=self.setTimeout("StartTimer()",1000); Check();

if(mins==0 && secs==0) StopTimer();

if(secs==0) { mins--; secs=60; } secs--;

}

function Check() { if(mins==0 && secs==0) { return fadeOutMyPopup(); } }

// Browser safe opacity handling function function setOpacity( value ) { document.getElementById("styled\_popup").style.opacity = value / 10; document.getElementById("styled\_popup").style.filter = 'alpha(opacity=' + value \* 10 + ')'; }

function fadeInMyPopup() { for( var i = 0 ; i <= 100 ; i++ ) setTimeout( 'setOpacity(' + (i / 10) + ')' , 8 \* i ); }

function fadeOutMyPopup() { for( var i = 0 ; i <= 100 ; i++ ) { setTimeout( 'setOpacity(' + (10 - i / 10) + ')' , 8 \* i ); }

setTimeout('closeMyPopup()', 800 ); }

function closeMyPopup() { document.getElementById("styled\_popup").style.display = "none" }

function fireMyPopup() { setOpacity( 0 ); document.getElementById("styled\_popup").style.display = "block"; fadeInMyPopup(); mins=0; secs=2; StopTimer(); StartTimer(); }
```

HTML File: Popup.html

```html
Animated Popups

<script type="text/javascript" src="ani_popup.js"></script>

Your entry has been updated.
```
