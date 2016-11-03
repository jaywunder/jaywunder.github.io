---
layout: post
title: XSS at Barlow
comments: true
headerLocation: blog
---

​	My school has a firewall that prevents students from going to potentially distracting or inappropriate websites.  This is the story about how I found an XSS vulnerability in the frontend of the firewall at my highschool.  The adventure begins in middle school when I used to try to get onto gaming websites like [miniclip.com](http://miniclip.com). Miniclip was blocked by the school, so I went to the firewall instead of Miniclip. Here I noticed  some similarities betwee the URL bar and the page below.  For example, I saw that "blocked by the default web CEN filter" was also in the URL.  

​	I tried replacing some of the text in the URL bar with a poop joke or something of that manner, and to my delight, the text appeared on the page!  I wasn’t a programmer yet, so I didn’t know the importance of my discovery, but I kept that information in the back of my head for later use.  Below is an example of replacing text in the URL bar and seeing it appear on the page.  I typed "Vulgar words" in the URL after the page loaded, and "Vulgar words" appears in the webpage as well.

![img](https://lh3.googleusercontent.com/6X3OE3SulRDNXFtbFkywdDVGsyM3tLSvXntKHnMJLO78h1NEEXK6w-7KbsSiUIn5LlraKByei8PYaQauqEIS6jeZo2korZ8GAvNFGwExKmv8HHhbN5yfkM08Gv3SgcXw-xVWiqY)

### Displaying HTML

​	The first part of any xss attack is seeing if you can execute some kind of code on the client's computer.  The simplest case for the web is some basic HTML.  Trying to inject basic HTML will show us if the firewall properly sanitizes the URL string before displaying it on the client's page. 

​	I tried putting a `` element in the url to test the most basic HTML.  Surprisingly, the `` element rendered on my page.  As you can see in the image below, "This is HTML" is text I added into the URL by hand.  That text is also bolded because I wrapped it in a `` element. 

![img](https://lh6.googleusercontent.com/h_qa-t201ja8JNrf81wL-DS8GGNwu4rR75Q8T0FSbZABcQJh1aZfbqpmTDC7GTO8JpjvADtckc-AncPyaBVzeHWVK5JC8QHdDo7DJyu9rmjCnqiB5NqYbvmKLhgNzcSXa3rLa8c)

### Running javascript

​	So far I had been manually editing the URL after I intentionally went to a blocked website.  However, if I want to send someone a malicious link, I will have to craft a link that someone will click on.  An example of a malicious link that might display bold text on the client's page is: 

​	`imgur.com/This%20text%20will%20be%20bold` 

- `imgur.com` is a blocked link, so that will redirect to the firewall page
- `` is HTML code
- `This%20text%20will%20be%20bold` is the text that will be bolded. 
- `%20` is the URL escape sequence for a space character​

​	To kill two birds with one stone, I tried injecting a `script` element instead of a `strong` element.  The URL I tried looked like: `imgur.com/alert('bad')`.  Unfortunately that didn't work though, below is a look at the chrome dev tools when I go to that link.  This screenshot shows that when I try putting a `script` tag directly in the URL, the `anchor` element that contains the URL get's messed up and causes the page to not render properly.  So instead of `alert('bad')` being rendered, the below text is rendered. 

![img](https://lh5.googleusercontent.com/2FwAohRT5B49IfWun0gG8dKNf7R3-2n-IKYVHV-YWgw1LZv4iZ_IFkjhvCZnHVoOOFa8aD8x7OzNd_b1L2_GQN4mPeWAWkfKSOnuO1at3rVbWlGxRxnnxUrCH2WDzDLdgLN1hbA)

​	The next thing I tried to use to inject javascript was an `img` tag.  `img` tags have two attributes that l learned 

​	This means I'm going to have to be more creative with how I inject a script tag So that way of running javascript isn’t going to work, after a little more research on XSS attacks, I found a common way to run javascript after the page loads is to use an image tag with a bad source that runs bad javascript in the `onerror` attribute. 

*Example:*   

```
<img src="lolnope" onerror="alert('bad')">
```

​	So when we put this into the URL manually… It works!  Now the last part of the puzzle is to wrap everything up into a link that’ll get the page to run our malicious code.  The key to an XSS attack is to get control over a web page in any way.  So what do we have control over in this situation?  There aren’t any places to submit comments or make changes that other people will see.  But we do have control over the URL that get’s blocked.  Let’s try pasting our image tag witchery onto a blocked URL.

![img](https://lh6.googleusercontent.com/WcI0MgfPx6__iWYP0ibZyltGdoNzPx6SRe9jbUUSbM_Tyac1HB99ADHWv5fYmlfIjwc-ocYnNqVsZPVBTujFcVDUBhQOmTlmaelq5EBsuFjxQ_OyC58BQjopI-IaUoUr43u_aKk)

​	Unfortunately, this doesn’t work.  I messed around with this for a bit, until I realized I could actually just look at the code!  I had assumed the firewall people would minify their code, but lo and behold, I stroll on over to the `sources` tab in the chrome tools and there we have a fully readable javascript file.I poked around in the file for a little bit. It’s fairly simple, it just parses the URL by regex and displays the text from the URL variables in different div’s in the DOM.  The script is written in vanillaJS, which I take as both potentially good and bad.  Either good because the programmers wanted to make a lightweight page, or bad because the programmers didn’t know how to make a safe page.  Regardless of the engineering reasoning, I discovered that the URL had weird things going on with quotes where I’d have to very carefully balance quotes.This is around the same time that I found that the “Description” for the reason the page was blocked goes *after* the URL.  Awesome! The page doesn’t properly escape any link information, so if I put `&bc=SOME TEXT` in my malicious URL then…. BAM there’s "SOME TEXT" as the description.This is because of how they parse by regex, they completely trust the URL to not have conflicting URL variables despite using a relatively simple variable name, `bc`.

### Connections and conclusions

Now if we put everything together as: 

```
http://imgur.com/&bc=<img src="lolnope" onerror="alert('bad')">
```

Then we can run any bad code. Hooray!  This is a great example of why it's always good to sanitize user input.  Also it’s a good idea to minify code in production so nosey coders can’t see how little you care about security. 

![img](https://lh4.googleusercontent.com/fU2A-WsoWWL3VKcr3av-CnKUJOIrXdhuTCeBV_QImzn6_TBixYjM0kegX32GeI0xyvp5CAKItBGzCeQx83G34Eixd7d9YCfZ_tlx2dLLHTFQOgzijl91kisOeptP7nDVpcrJTCg)What’s

# IDK WHERE THIS IS SUPPOSED TO GO

Despite being able to inject javascript tags, the script tags are put into the DOM after the page is loaded, which is after raw script tags execute in the DOM loading sequence.  I would have to be more clever to get javascript to run.