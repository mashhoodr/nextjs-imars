---
title: "Setting up WebSockets between iOS and a Java application"
date: "2012-10-17"
---

I recently had a project where I was supposed to implement a WebSocket in an iOS application and make it communicate with a Java application. I looked around for some good libraries and settled on [SocketRocket](https://github.com/square/SocketRocket "SocketRocket Git Repo") for iOS. SocketRocket comes with a WebSocket example which was fairly easily to follow, together with a WebSocket server in Python. Setting it up was not too much of a hassel, however once I had setup and run the sample, I moved on to looking for a Java based WebSocket server.

Now the first mistake I made was that I assumed Sockets == WebSockets, and spent countless hours implementing different versions of Java Socket implementations. I kept getting stuck or got this bad header error message. After several attempts it finally hit me that what I really wanted was a specific WebSocket library for Java as well.

Enter [TooTallNate's WebSocket](https://github.com/TooTallNate/Java-WebSocket "Java WebSocket") library, which was one amongst many different web-socket libraries which actually worked for me. Again the built-in examples came in handy, and within 5 minutes I had a simple socket server running with which I could communicate with all my clients with. This seemingly simple task took a whole day for me to complete - I hope this can now help others do it much quicker.

TooTallNate's Java WebSockets: https://github.com/TooTallNate/Java-WebSocket

SocketRocket for iOS: https://github.com/square/SocketRocket
