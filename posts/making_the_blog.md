---
{
    "title": "Making This Blogging Website: My First Proper Go at Web Dev",
    "date": "2015-09-25"
}
---

This being my first official post, I see it only fitting to talk about why and how I made this website. check out the [github repo](https://github.com/coopie/mesite) for it if you want to see the source.

I have wanted to have a blog ever since I read the [still drinking post](http://www.stilldrinking.org/programming-sucks) about how horrible developing can actually be. If you haven't already read it, I seriously recommend it. It also gives me a chance to try and coherently organise my thoughts in text, something I have not really done since I was in school writing history essays.

## Making the Website ##
Before making this website, I had a look around at some currently existing blogging frameworks to try and fins something that sounded appealing to me.

**This framework must:**
* **Allow me to write things in markdown**. I much prefer it to alternatives and I have had enough experience using it from work.
* **Be simple enough for me to alter it, without using some fancy gui**. I would rather not use some fancy colorwheel for the background-color of my site
* **Look nice and minimal**. I don't want to have some bootstrappy website like [this]().

After looking around, I found the [jekyll blogging framework](http://jekyllrb.com/), exactly what I wanted. It looked really nice, had markdown posts, and even looked simple enough that I could make a website like that myself...

>*"I have a week or so before uni starts and I have just finished the Witcher 3, so I might as well give it a go"*

So off I went to make it.

### Choosing the technology stack ###

Luckily, this was an easy question to answer. I had just finished working for Bloomberg for the summer, and I was using Node.js (well, a proprietary Node.js-like tecnology) for the backend of my service. This meant that I still had all of the muscle memory from work and it was fairly easy to build a working prototype that just served the rendered pages of my markdown posts.

### Building the Post List ###

I couldn't find any way of elegantly assigning metaData to my markdown files, so I decided to do it myself. On the top of every file is a JSON which is sliced off from the file and parsed. This object contains data like the title, the date it was written, and anything else that is needed in the future (a url to a picture perhaps). This means that generating the ordered list of posts goes as follows:
* Get all of the files' metaData
* Sort by date
* Render in a list

Everything else in the website is more or less writing css to make it look a bit prettier.
