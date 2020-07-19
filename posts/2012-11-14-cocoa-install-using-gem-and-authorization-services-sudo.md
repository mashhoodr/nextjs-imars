---
title: "Cocoa: Install using 'gem' and Authorization Services (sudo)"
date: "2012-11-14"
---

I have been working on an app which required me to install another application using the 'gem' tool. The bigger problem however, was to run the tool with sudo since that would require the app to prompt the user for the password. My first incline was to implement NSTasks, however, even when using the deprecated Authorization Services technique, it still kept failing. Then I started reading about the new way  (using the Bless helper tool) to getting higher privileges and still could not see a clean way to implement the setup.

After constantly doing research on this for over one week, I stumbled across the solution: use AppleScript to run the 'sudo gem install' script. If you add "with authorization privileges" to the script, the OS handles the whole task for getting authorization and running the script. And thats it, three lines of code and the problem was solved! And another good thing is that the call is synchronous, which was good for me since I wanted to wait for the install to finish before moving on.

Here is the code which I used:

<script src="https://gist.github.com/mashhoodr/7729661.js"></script>

> ProTip: You can wrap the above code in dispatch_async to free up the main thread, so you can show some loading animation on it until its being done.
