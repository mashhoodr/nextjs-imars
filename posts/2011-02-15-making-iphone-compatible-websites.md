---
title: "Making iPhone Compatible Websites"
date: "2011-02-15"
---

Its been a while since I have done anything good enough to be posted here. However, yesterday I finally released the iPhone version for my personal website ([http://imars.info](http://imars.info "Personal website")). I acquired this skill after spending some time designing an iPhone version of [pimedia.org.uk](http://pimedia.org.uk "Pimedia Publication"), the website of UCL's student publications. Turns out it is very easy to setup your current website into an iPhone compatible one. All you have to do is a different CSS file for iPhone or Android browsers. For this we will use a simple Javascript script, which will check the browser being used by the incoming user and link the correct CSS accordingly. There is one additional line of code which will let you further control the user interface (like wether the user can zoom into the page or not). And using this simple script and some CSS modifications, you can have an iPhone/Android specific version for your website.

The script itself goes as follows:

```js
if (
  navigator.userAgent.match(/iPhone/i) ||
  navigator.userAgent.match(/iPod/i) ||
  navigator.userAgent.match(/Android/i)
) {
  document.write("<link rel='stylesheet' href='css/mobile.css' />");

  document.write(
    "<meta name='viewport' content='width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=no'>"
  );
} else {
  document.write("<link rel='stylesheet' href='css/style.css' />");
}
```

It should be noted that the Safari browser and Android's native browser both support webkit libraries and much of CSS3.
