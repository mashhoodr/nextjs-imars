---
title: "Creating a self contained gem installation"
date: "2013-11-06"
---

My most recent challenge was to create a self contained RubyGem installation for my client. We had been using `gem install testmunk` over NSTask to install the gems to date, however, as we let more and more people try it out we found that a lot of the people got an error while downloading and installing the gems. After a lot of research, we had several options which we could take on forward:

1. Vagrant
2. Omnibus Installer – https://github.com/opscode/omnibus-ruby
3. Tokaido – https://github.com/tokaido

All three of them offered more or less the same thing, a statically compiled version of ruby. The advantage of a statically compiled build is that the build becomes independent of the configuration on the users machine. With Vagrant we were not actually creating a virtual machine, we were just stripping the ruby packaged within its installer.

For my project, I chose Tokaido, mainly because I was dealing with a Cocoa app and they had a fully implemented example already available [https://github.com/tokaido/tokaidoapp]. From this point on, it was fairly easy – I had to build the gems using this statically compiled gem executable and then modify their native extensions to use the environment ruby instead of the path to the version of the ruby used. For this, I opened the native extension (in \$GEM_HOME/bin) in a code editor and changed the first line from what ever is there to “#!/usr/bin/env ruby” [without quotes]. This will use the ruby version in the current environment.

Finally, some configurations in my Cocoa app, and my contained gem installation we ready to be deployed! The only disadvantage that I have come across for using the self contained gem install is that I need to source the bash script (SetupTokaido.sh) every time I need to use this contained setup in my terminal. Other than that it has managed to fix all the issues we were having from gem install!
