---
title: "A Tutorial on NSTask (Cocoa Development)"
date: "2012-11-01"
---

I recently started developing for Mac OSX (a recent transition from iOS). My task included me to run some script to do background checks and this is where I needed NSTask. Now the code available is fairly straight forward, a simple copy paste will work - however a bit of explanation is always helpful. Lets start with the full code snippet below:

\[sourcecode language="objc"\] NSTask \*task; task = \[\[NSTask alloc\] init\]; \[task setLaunchPath: launchPath\]; \[task setArguments: arguments\]; \[task setCurrentDirectoryPath:dir\];

NSPipe \*pipe; pipe = \[NSPipe pipe\]; \[task setStandardOutput: pipe\];

NSFileHandle \*file; file = \[pipe fileHandleForReading\];

\[task launch\];

NSData \*data; data = \[file readDataToEndOfFile\]; NSString \*response =  \[\[NSString alloc\] initWithData: data encoding: NSUTF8StringEncoding\]; \[/sourcecode\]

The first bit is the NSTask instantiation, pretty obvious. However the next three properties need some explaining. The launch path is the path of the executable you want to run. Most of the executables can be found under /usr/bin, and most of the "system" commands like mv, cat and chmod can be found under /bin. The second parameter is the list of arguments (takes an NSArray). The list is literally the parameters you would type next to the command, eg. mv /usr/bin/ruby /bin/ruby will have the launch path as @"/bin/mv" and arguments as @\[@"/usr/bin/ruby",@"/bin/ruby"\]. The third property sets the current working directory, which can be useful for certain applications which require to work in current directories. So if we were to set the current directory path to @"/user/bin" then we could just type in @"ruby" as the first parmeter (in the arguments).

Next block of code is the pipe instantiation. This allows the task to communicate back to the application. We simply instantiate a NSPipe and link it to the task.

We launch the task.

Finally, when the launch returns, the data is read from the file pointer and converted to an NSString.

Final point: Incase you are using sudo, pass the parameter -s for a terminal window asking for the password. However, the right way to do is to implement Authorization Services. That will probably be my next article.
