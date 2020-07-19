---
title: "of Groovy Swing Lists.."
date: "2009-11-05"
---

my first course work with Groovy was a small inventory management program, which was suppose to be all command line based. However, I thought it would be fun to implement some GUI as well.. and thus I ventured into the Javax Swing world where a thing as simple as displaying a list (or a JList) can be ones worst nightmare. The code below took me 90 mins to compile!.. n I was just trying to display a list! :@

```
String\[\] data = \["one", "two", "three", "four", "five", "six", "seven", "eight"\];

listbox = new JList(data); listbox.setSelectionMode(ListSelectionModel.SINGLE\_SELECTION); listbox.setVisibleRowCount(2); listbox.ensureIndexIsVisible(2);

scrollPane (layout : new ScrollPaneLayout())    { dBox = list(listbox, visibleRowCount : 2, autoscrolls : true) }

```
