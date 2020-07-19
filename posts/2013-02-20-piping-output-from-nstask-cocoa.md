---
title: "Piping output from NSTask (Cocoa)"
date: "2013-02-20"
---

I was working on one of my Cocoa apps when I realized I need to store the output some NSTasks in a file. I also needed the output inside the application to do some validation. Instead of taking the output and writing it to a file manually, I piped my output to a file directly - and since I was piping it I got the output back in the app as well!

<script src="https://gist.github.com/mashhoodr/4996940.js"></script>

In the code above, two things need to be noticed. First I have added a trivial command (echo Hello), which will only output Hello in the file and return that as well. This is mainly useful if you want constant feedback on the command you have just initiated instead of waiting for the NSTask to return. There could be a more direct way, I have not figured it out yet, so this is what I am using for now. I can then tail the text file to see the status of the task currently running.

Secondly, the command I used to write to a file was "tee", you can use another equivalent as well. The -a parameter is for appending to the file, if you want it to overwrite (every time you run this task) then remove this parameter.

One major mistake I was making while implementing this was not putting the second argument as a single argument. If there are variables, use NSString's stringWithFormat to inject the variables and send it as a single argument. Otherwise the pipe will not work.

Also, piping is not to be confused with NSPipe. I am talking about the [Unix Pipeline](<http://en.wikipedia.org/wiki/Pipeline_(Unix)>) \[http://en.wikipedia.org/wiki/Pipeline\_(Unix)\]
