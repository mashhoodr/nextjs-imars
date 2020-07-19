---
title: "Showing an alert message in iOS"
date: "2012-01-02"
---

Its been a while since my last post, a lot has happened and there are several unfinished entries waiting to be published. However, this particular one is very small. I recently started developing for iOS and was looking for a way to show alert messages and I could not find a simple one line solution to my problem. I have finally figured out a way to do it, its not exactly one line, but is a single string of code, just need to replace the title and message string and you are good to go!

This may not  be the best way to show an alert, but I felt this is the easiest one.

```objc

\[\[\[\[UIAlertView alloc\] initWithTitle:@"Title" message:@"Message" delegate:self cancelButtonTitle:@"Ok" otherButtonTitles: nil\] autorelease\] show\];
```
