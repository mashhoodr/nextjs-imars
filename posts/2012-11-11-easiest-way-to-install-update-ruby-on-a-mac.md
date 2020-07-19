---
title: "Easiest way to install / update Ruby on a Mac"
date: "2012-11-11"
---

The setup below was tested on a fresh install of OSX Lion, Ruby was updated from v1.8.7 to v1.9.3 and the standalone Command Line Developer Tools were used.

Yesterday, I started working on a project where I had to programmatically install / update Ruby on the local machine since the app I was making required it. Instead of just providing the link, I setup a basic helper, which downloaded and installed it for the user. Even before I began setting up the helper, I started looking at different implementations available for installing Ruby on a Mac and found several options. The biggest issue was the several dependancies each setup required (like Git), which meant installing several things before actually installing Ruby. The following is one with the least dependencies, i.e. 2 of them.

### Step 1: Install RVM

First you need to install RVM by running the following code in Terminal. The Terminal application can be found under /Applications/Utilities/Terminal.app.

\[sourcecode language="objc"\] curl -L get.rvm.io | bash -s stable \[/sourcecode\]

### Step 2: Install Xcode Command Line tools

There are two ways to install this, firstly you can do it by downloading and installing Xcode, and then installing the Command Line Tools via Preferences -> Downloads -> Click Install next to Command Line Tools. Or you can download the standalone package from developer.apple.com by searching for Command Line Tools in the Downloads Section. However, I think you need to have a developer account for that.

### Step 3: Install Ruby

Once the Command Line tools and RVM is installed simple copy paste the following in Terminal:

\[sourcecode language="objc"\] rvm install 1.9.3 \[/sourcecode\]

### Step 4: Check Ruby Version

You can check your installed Ruby version by running the following command in Terminal:

\[sourcecode language="objc"\] ruby -v \[/sourcecode\]
