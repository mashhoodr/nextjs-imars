---
title: "iOS: Distributing your Simulator Build file"
date: "2013-03-04"
---

A few weeks ago, I wrote a post on how to create an iOS IPA file using the terminal command **xcodebuild**. You can use use the same command to create an APP file for the simulator, but you can also distribute the APP file which was created when you ran the app in the simulator. All the apps installed in a specific simulator can be found under

> ~/Library/Application Support/iPhone Simulator/IPHONE\_SIMULATOR\_VERSION/Applications

Each application is in a directory will a random ID, and inside each folder contains the application data including the APP file. All you need to do is to zip this folder (only the APP file will work too, but then you will need to create the folder structure again when deploying it) and transfer it to the other computer. Then you will simply unzip the folder in the same version of the simulator and it will appear when it starts.

If there is already a folder there with the same name, you can rename this folder by changing the last character. Since the ID is a HEX String anything character between 0-9A-F should work. Running the same APP file on different versions can cause issues, generally when if we run a higher built for version (ie build for iOS 6) on a lower SDK version, it will run fine (not always!), there will be more issues if you try doing the opposite.
