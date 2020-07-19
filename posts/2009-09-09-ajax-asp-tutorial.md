---
title: "AJAX ASP Tutorial..."
date: "2009-09-09"
---

about two years ago, a good friend of mine (snuke -[http://alizahid.net/](http://alizahid.net/)) sent me a ZIP file containing the AJAX tutorial... i have finally mastered the script (it didnt actually take me two years!.. i was busy with my GCSEs).. and its time for me to pass the information on. The code below links to the slightly updated file of wht snuke sent me.. run the code thru IIS and it shud work smoothly...

The HTML File: index.html

\[sourcecode language='html'\] Welcome to the ajax tutorial

<script type="text/javascript" src="java.js"></script>

Welcome to the ajax tutorial... The following link are linked to AJAX Functions. Click to test:

[Test1](<javascript:page('test1','div1');>)

[Test2](<javascript:page('test2','div2');>)

[Test3](<javascript:page('test3','div3');>)

Div1

Div2

Div3

© 2009 / [imars.info](http://imars.info) / ajax'd

CSS File: style.css

```css
html {
  background: #000000;
}

body {
  color: #ffffff;
  background: #000000;
  cursor: default;
  font-family: Calibri;
  font-size: 16px;
  letter-spacing: 0.2em;
  margin: 0px;
}

a {
  text-decoration: none;
  color: #f0f0f0;
}

a:hover {
  color: #ffffff;
}

#wrapper {
  width: 820px;
  margin: auto;
}

#page {
  width: 75%;
  margin-left: 5px;
  float: left;
  background: #222222;
  padding: 10px;
  -webkit-border-bottom-left-radius: 3px;
  -webkit-border-bottom-right-radius: 3px;
}

.myBox {
  background: #585858;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border: #aaaaaa solid 2px;
  padding: 10px;
  margin: auto;
  color: "#FFFFFF";
  font-family: tahoma;
}

#footer {
  clear: both;
  float: left;
  margin-top: 10px;
  padding: 5px;
  font-size: 9px;
  text-align: right;
  background: #222222;
  -webkit-border-bottom-right-radius: 3px;
  -webkit-border-top-right-radius: 3px;
}

.spinner {
  padding: 5px;
}

.tbox {
  background: #000000;
  color: #666666;
  border: 1px solid #666666;
  height: 25px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}

.style1 {
  text-align: center;
}
```

Javascript File: java.js

```js
var spinner = "Loading...";

function page(page, target) {
  document.getElementById(target).innerHTML = spinner;
  xmlHTTP = GetxmlHTTPObject();

  if (xmlHTTP == null) {
    alert("Your browser does not support AJAX!");
    return;
  }

  var url = "core.asp?";
  url = url + page;

  xmlHTTP.onreadystatechange = function () {
    if (xmlHTTP.readyState == 4) {
      document.getElementById(target).innerHTML = xmlHTTP.responseText;
    }
  };

  xmlHTTP.open("GET", url, true);
  xmlHTTP.send(null);
}

function GetxmlHTTPObject() {
  var xmlHTTP = null;

  try {
    xmlHTTP = new XMLHttpRequest();
  } catch (e) {
    try {
      xmlHTTP = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  return xmlHTTP;
}
```

and finally the ASP file: core.asp

```vb

<% If Request.ServerVariables("QUERY\_STRING") = "test1" Then %> This links to Test1 <% End If %>

<% If Request.ServerVariables("QUERY\_STRING") = "test2" Then %> This links to Test2 <% End If %>

<% If Request.ServerVariables("QUERY\_STRING") = "test3" Then %> This links to Test3 <% End If %>

```
