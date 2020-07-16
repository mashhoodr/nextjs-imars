---
title: "Installing Ruby Gems without ‘sudo’"
date: "2013-01-11"
---

It was yet another fine day here in Karachi, Pakistan, when I found that the AppleScript I was using to install some gems (with administrator privileges) was no longer working on Mavericks. The script would get stuck, and would never return. I tried a few other combinations, but after some time I gave up and started looking for alternatives. One of the things I have briefly come across before was to install gems without any authentication at all. Although initially it looked very trivial to implement, it took me a few hours to tweak it and get it working right.

The basic idea of installing gems without authentication is very simple, you simply define an install directory which the user has access to (eg. ~/.somegems). However I ran into two issues with that, firstly I had to set the GEMPATH and PATH variables so the gem executable could find the installed gems, and somehow I had to load them in when running NSTask (since NSTask does not load the .bashprofile).

The implementation turned out to be fairly simple. We will use the following command to install the gems:

```sh
gem install GEM_NAME –install-dir DIR_PATH —verbose
```

We will add the following lines in the `.bash_profile`:

```sh
export GEM_PATH=$GEM_PATH:DIRPATH
export PATH=$PATH:DIRPATH/bin
```

And we are all set! If you are accessing this via NSTask in Cocoa, you can use the following command to make sure these variables are loaded from .bash_profile (or you can add them in the command it self.

```objective-c
NSTask launchedTaskWithLaunchPath:@”/bin/bash” arguments:@[@”-lc”,@”command”]
```
