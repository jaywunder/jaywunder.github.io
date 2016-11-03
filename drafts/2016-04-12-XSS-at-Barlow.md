---
layout: post
title: XSS at Barlow
comments: false
headerLocation: blog

---

​My school has a firewall that prevents students from going to potentially distracting or inappropriate websites.  This is the story about how I found an XSS vulnerability in the front end of the firewall at my high school.  The adventure begins in middle school when I used to try to get onto gaming websites like [miniclip.com](http://miniclip.com). Miniclip was blocked by the school, so I went to the firewall instead of Miniclip. Here I noticed  some similarities between the URL bar and the page below.  For example, I saw that "blocked by the default web CEN filter" was also in the URL.  

​I tried replacing some of the text in the URL bar with a poop joke or something of that manner, and to my delight, the text appeared on the page!  I wasn’t a programmer yet, so I didn’t know the importance of my discovery, but I kept that information in the back of my head for later use.  Below is an example of replacing text in the URL bar and seeing it appear on the page.  I typed "Vulgar words" in the URL after the page loaded, and "Vulgar words" appears in the webpage as well.

![img](https://lh3.googleusercontent.com/6X3OE3SulRDNXFtbFkywdDVGsyM3tLSvXntKHnMJLO78h1NEEXK6w-7KbsSiUIn5LlraKByei8PYaQauqEIS6jeZo2korZ8GAvNFGwExKmv8HHhbN5yfkM08Gv3SgcXw-xVWiqY)

### Displaying HTML

​The first part of any XSS attack is seeing if you can execute some kind of code on the client's computer.  The simplest case for the web is some basic HTML.  Trying to inject basic HTML will show us if the firewall properly sanitizes the URL string before displaying it on the client's page.

​I tried putting a `strong` element in the url to test the most basic HTML.  Surprisingly, the `strong` element rendered on my page.  As you can see in the image below, "This is HTML" is text I added into the URL by hand.  That text is also bolded because I wrapped it in a `strong` element.

![img](https://lh6.googleusercontent.com/h_qa-t201ja8JNrf81wL-DS8GGNwu4rR75Q8T0FSbZABcQJh1aZfbqpmTDC7GTO8JpjvADtckc-AncPyaBVzeHWVK5JC8QHdDo7DJyu9rmjCnqiB5NqYbvmKLhgNzcSXa3rLa8c)

### Running javascript

​So far I had been manually editing the URL after I intentionally went to a blocked website.  However, if I want to send someone a malicious link, I will have to craft a link that someone will click on.  An example of a malicious link that might display bold text on the client's page is:

​`imgur.com/<strong>This%20text%20will%20be%20bold</strong>`

- `imgur.com` is a blocked link, so that will redirect to the firewall page

- `<strong></strong>` is HTML code

- `This%20text%20will%20be%20bold` is the text that will be bolded.

- `%20` is the URL escape sequence for a space character

​To kill two birds with one stone, I tried injecting a `script` element instead of a `strong` element.  The URL I tried looked like: `imgur.com/<script>alert('bad')</script>`.  Unfortunately that didn't work though, below is a look at the chrome dev tools when I go to that link.  This screenshot shows that when I try putting a `script` tag directly in the URL, the `anchor` element that contains the URL get's messed up and causes the page to not render properly.  So instead of `alert('bad')` being rendered, the below text is rendered.

![img](https://lh5.googleusercontent.com/2FwAohRT5B49IfWun0gG8dKNf7R3-2n-IKYVHV-YWgw1LZv4iZ_IFkjhvCZnHVoOOFa8aD8x7OzNd_b1L2_GQN4mPeWAWkfKSOnuO1at3rVbWlGxRxnnxUrCH2WDzDLdgLN1hbA)

I couldn't directly put an element in the page with the raw url, so I had to dissect the URL more closely to see what was happening.  This is an example of a URL that the firewall would redirect you to from a blocked link:

```
http://207.210.151.27:8080/ibreports/ibp/bp.html?fn=RSD9%20Joel%20Barlow%20HS&fp=22&ct=You%20are%20being%20blocked%20by%20the%20default%20CEN%20web%20filter.%20%20District%20admins%20please%20contact%20CEN%20tech%20support%20for%20assistance%20using%20our%20current%20escalation%20sheet.&ip=XX.10.105.142&ibip=207.210.151.27&ldu=1&re=0&bu=imgur.com%2F&bc=Website%20contains%20prohibited%20Adult%20Oriented%20content
```

In order to study it more closely I broke it apart into the different variables in the URL.

- `http://207.210.151.27:8080/ibreports/ibp/bp.html`
- `fn=RSD9%20Joel%20Barlow%20HS`
- `fp=22`
-  `ct=You%20are%20being%20blocked%20by%20the%20default%20CEN%20web%20filter.%20%20District%20admins%20please%20contact%20CEN%20tech%20support%20for%20assistance%20using%20our%20current%20escalation%20sheet.`
- `ip=XX.10.105.142` The actual IP address was there though, I crossed out the first two digits on the IP
- `ibip=207.210.151.27`
- `ldu=1`
- `re=0`
- `bu=imgur.com`
- `bc=Website%20contains%20prohibited%20Adult%20Oriented%20content`

What's interesting about this is that the `bu` variable – which is for the link – comes before the `bc` variable in the firewall URL.  The ordering of those two variables is important because it means I could craft a malicious URL to take advantage of it.  I tried going to `imgur.com/&bc=Some%20Random%20Text` and lo and behold "Some Random Text" was the description for why `imgur.com` was blocked, **not** "Website Contains prohibited Adult Oriented content".  

With that knowledge in mind, I could *in theory* inject any HTML into a client's webpage by putting the HTML after `&bc=` in the malicious URL.  I tried going to `imgur.com/&bc=<script>alert('bad')</script>` and found good news and bad news.  The good news was that I did see the `script` element in the HTML code of the webpage.  The bad news was that the `script` didn't actually run.  

​It turned out that the page was rendering the variables locally on the client's page, as we saw in the URL, the page is written in raw HTML, not rendered server-side with PHP.  The script tag wouldn't run because it was being rendered on the page after load time, and new script tags aren't run if they're added after the page loads.  After a bit of researching I found `img` tags *do* run javascript if they're put in a page after load time. So I just had to put an `img` tag with `src="not_real_image"` and `onerror="alert('this is bad')"` attributes.  



### Conclusion

​A maliciously crafted URL that will execute javascript code on a client's device looks like this:

```html
http://imgur.com/&bc=<img src="lolnope" onerror="alert('this is bad')">
```

​When I obfuscate the URL with escape codes it looks like this:

```html
http://imgur.com/&bc=%3Cimg%20src%3D%22lolnope%22%20onerror%3D%22alert%28%27this%20is%20bad%27%29%22%20/%3E
```

​This is the product of that URL:

![img](https://lh4.googleusercontent.com/fU2A-WsoWWL3VKcr3av-CnKUJOIrXdhuTCeBV_QImzn6_TBixYjM0kegX32GeI0xyvp5CAKItBGzCeQx83G34Eixd7d9YCfZ_tlx2dLLHTFQOgzijl91kisOeptP7nDVpcrJTCg)


​I've learned three things from this exploit:

 - #### **Always** sanitize user input

If the firewall had properly escaped the URL it got from the user, there wouldn't be a way to take advantage of the URL.  There would be no way to run code on a client's machine because any text a URL could contain would become actual text on the webpage.  An example of escaping user input is changing the "less than" character (`<`) into its HTML escape code "`&lt;` ".

 - #### Be wary of variable placement

I was able to take advantage of the firewall in part because the firewall URL had bad variable placement.  If the  user input was after anything else rendered on the page, it would have been significantly more difficult to take advantage of the page.

 -  #### Minify your javascript

It was extremely easy to read the code that drove this small webpage because the developers weren't serving minified javascript.  Minifying code doesn't make your webpage immune to hackers, but minified code is certainly more difficult to read than plain javascript.
