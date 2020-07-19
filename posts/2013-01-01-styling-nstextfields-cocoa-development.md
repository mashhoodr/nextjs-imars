---
title: "Styling NSTextFields (Cocoa Development)"
date: "2013-01-01"
---

While working on the a Cocoa app the other day, I had to implement a custom designed NSTextField and a NSSecureTextField. Since I have worked with iOS before, I thought this would be pretty straight but turns out NSTextField != UITextField.

I had four main changes to make to the field, firstly add a light blue background, secondly add a light grey border (the default one available was too dark), third increase width and height and finally add some padding to the text.

The correct way to implement all of the above is to subclass **NSTextFieldCell** (Yes, NOT NSTextField) and then implement two methods, drawWithFrame:inView: and selectWithFrame:inView:editor:delegate:start:length:. The first one is where you will implement the drawing for the background, the borders and the padding. In the second one you need to redefine the padding once the user selects the textfield. And ofcourse, don't forget to call the super functions.

To set the subclassed NSTexFieldCell you will need to unfold the TextField object in the Document Outline (the tray with the First Responder object on the left) and then select the cell below. Open the identity inspector from the right sidebar and set the name of your custom class there.

Another note of warning, if you have added a NSSecureTextField, subclassing it's NSSecureTextFieldCell wont work (the methods are somehow protected). The trick I used here (thanks to some answer on StackOverflow) is to set the textfield object as NSTextField, and set its cell as a NSSecureTextFieldCell.

Here is the implementation code for my cell class:

 

Here is how the final version looks:

[![Screen Shot 2013-01-01 at 8.31.23 PM](images/screen-shot-2013-01-01-at-8-31-23-pm11.png)](http://mashhoodr.wordpress.com/2013/01/01/styling-nstextfields-cocoa-development/screen-shot-2013-01-01-at-8-31-23-pm/)
