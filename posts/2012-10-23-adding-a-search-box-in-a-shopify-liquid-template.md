---
title: "Adding a search box in a Shopify Liquid Template"
date: "2012-10-23"
---

One of my recent projects included making a .liquid template for a website based on Shopify. The task was very simple, create a basic blog template with a listing of articles and a search box on the sidebar. Shopify documentation is very good, so setting that up was all easy, however, it took me some time to find on how to implement a search box.

I was actually looking for a search widget, which I believe is not available in Shopify. Instead, all you have to do is to setup a form in the HTML with two fields and submit it to /search. The form includes a text field named "q", which will take the query and a hidden field named "type". Type can have the value of article, product or page. Since I wanted to search only the blog, I entered article. You can search for multiple types by separating them with a comma e.g. article,product.

More information can be found on their website [here](http://wiki.shopify.com/Admin_search#Searching_only_for_certain_types "Shopify") \[http://wiki.shopify.com/Admin\_search#Searching\_only\_for\_certain\_types.\]

The final code looked like this:

\[sourcecode language="html"\] <form action="\_WEBSITE\_/search" method="GET"> <input type="text" name="q" value="" placeholder="Query" /> <input type="hidden" name="type" value="article" /> <input type="submit" value="Search" /> </form> \[/sourcecode\]
