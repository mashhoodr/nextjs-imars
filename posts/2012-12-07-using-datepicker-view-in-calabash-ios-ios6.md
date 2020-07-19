---
title: "Using DatePicker view in Calabash iOS [iOS6]"
date: "2012-12-07"
---

Functional testing is getting big, especially since our mobile applications are getting more and more complex. Manually checking the views by hand can be cumbersome and annoying. Calabash is one of the tools available which helps you automate your functional testing. It is based on Cucumber, so writing tests is not very difficult and its flexible functions make it easier to maintain your scripts.

One of the problems I came across recently was to test some dates using UIDatePicker view. There are currently no built in functions available for you to select your date easily, so I ventured out to the web to see if I could find some nice way to do this. I soon came across a full implementation for the date picker, all I had to do was to include the file and make the checks. The gist is linked below:

[Gist for controlling the DatePicker](https://gist.github.com/jmoody/4103369)

However it turned out that the code did not support the DatePicker in iOS6. This meant I had to see what was wrong and try to fix it. I was still researching when I came across another relavent post, where I found the script which did the work for me. The link to the group and the code I used are pasted below:

[Calash Google Group Post](https://groups.google.com/forum/?fromgroups=#!searchin/calabash-ios/scroll_to_row$20date$20picker/calabash-ios/BVZepgX02hk/ADpDOVm7h0oJ)

[Gist](https://gist.github.com/mashhoodr/7729627.js)
