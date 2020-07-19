---
title: "Xcode tricks: Building and Archiving programmatically (from Terminal)"
date: "2012-12-31"
---

Recently, I was working on a project where I needed to fully automate the client's Xcode build and archive process. Since my client had a number of apps, and they kept changing, they wanted a dynamic solution (this was being used for testing). So I set about the task and found a few nice command line tools which help with the process.

Beginning from the first of the two staged process, building the application. This is fairly straight forward, just need to pass in the correct parameters, since I wanted a generic script, I went for the simplest technique:

> /usr/bin/xcodebuild -target $TARGET -sdk iphoneos -configuration Release

The code above only required me to be present in the project directory, and then extract the target from that project. Extracting the target seems tricky at first, but turned out to be equally trivial:

> /usr/bin/xcodebuild -list

The command above lists the targets, schemes and the configurations for the available project. Some neat pattern matching and I had the information I wanted.

Next up was archiving, is slightly tricky, but not very. The command to call here is xcrun, which converts your .app file into a code-signed IPA. The command I used was:

> /usr/bin/xcrun -sdk iphoneos PackageApplication -v "${TARGET}.app" -o "${OUTDIR}/${TARGET}.ipa" --sign "${IDENTITY}" --embed "${PROVISONING\_PROFILE}"

In my case, this worked fine - however if you want you can drop the --sign and --embed params and it will use the settings already provided in Xcode (or give an error if there are none). You can get the **$IDENTITY** variable from the Keychain Chain app. Get info for your Developer certificate and the Common Name value is the value for Identity. Make sure you copy paste it properly else you shall run into errors. The **$PROVISIONING\_PROFILE** variable is the path to apps provisioning profile (I was using the \* one for all the apps).

And thats it! You can also build using schemes for xcodebuild and there are other ways mentioned in the [documentation](https://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html). Xcode build also has two other nifty functions which I did not use:

> xcodebuild -showsdks

  

> xcodebuild -showBuildSettings

Documentation: xcodebuild: [https://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html](https://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html)

xcrun: [http://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/xcrun.1.html](http://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/xcrun.1.html)

Helpful resource: [http://stackoverflow.com/questions/5640776/xcode4-alternative-way-to-build-ipas](http://stackoverflow.com/questions/5640776/xcode4-alternative-way-to-build-ipas)
