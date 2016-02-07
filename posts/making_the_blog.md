---
{
    "title": "Making This Blogging Website: My First Attempt at Web Development",
    "date": "2015-09-28"
}
---
This being my first official post, I see it only fitting to talk about why and how I made this website. Check out the [github repo](https://github.com/coopie/mesite) if you want to see the source.

I have wanted to have a blog ever since I read the [still drinking post](http://www.stilldrinking.org/programming-sucks) about how horrible developing can actually be. If you haven't already read it, I seriously recommend it.

Blogging also gives me a chance to try and coherently organise my thoughts in text, something I have not really done since I was in school writing history essays.

## Making the Website ##

Before making this website, I had a look around at some currently existing blogging frameworks to try and find something that sounded appealing to me.

**This framework must:**
* **Allow me to write things in markdown**. I much prefer it to alternatives and I have had enough experience using it from work.
* **Be simple enough for me to alter it, without using some fancy gui**. I would rather not use some interactive colorwheel for the background-color of my site, or only be able to pick from themes other people have made.
* **Look nice and minimal**. I don't want to have some flashy website like [this](http://www.lingscars.com/).

After looking around, I found the [jekyll blogging framework](http://jekyllrb.com/), exactly what I wanted. It looked really nice, had markdown posts, and even looked simple enough that I could make a website like that myself...

>*"I have a week or so before uni starts and I have just finished the Witcher 3, so I might as well give it a go"*

So off I went to make it.

### Choosing the Technology stack ###

Luckily, this was an easy question to answer. I had just finished working for Bloomberg for the summer, and I was using Node.js (well, a proprietary Node.js-like technology) for the backend of my service. This meant that I still had all of the muscle memory from work and it was fairly easy to build a working prototype that just served the rendered pages of my markdown posts. The main packages I am using are:

* **[marked](https://github.com/chjj/marked)** : A Node library for generating html from markdown files.
* **[express](http://expressjs.com/)** : The framework *everyone* uses for web servers with Node.
* **[handlebars](http://handlebarsjs.com/)** : A html templating framework for generating pages.
* **[bluebird](https://github.com/petkaantonov/bluebird)** : For promises.

### Building the Post List ###

The only real challenge to making the core of the website was getting all of my posts, sorting them by age and presenting them on the main page of the site.

I couldn't find any way of elegantly assigning metaData to my markdown files, so I decided to do it myself. On the top of every file is a JSON which is sliced off from the file and parsed. This object contains data like the title, the date it was written, and anything else that is needed in the future (a url to a picture perhaps). The top of the markdown file of this post looks like this:

```javascript
---
{
    "title": "Making This Blogging Website: My First Attempt at Web Development",
    "date": "2015-09-28"
}
---
This being my first official post...
```

This means that generating the ordered list of posts goes as follows:

1. Get all of the files' metadata
* Sort by date
* Build the post entries using the metadata and handlebars.

### Page Design ###
I wanted the design to be clean, but also colorful. I have seen way too many blogs which are just black and white, and that just looks kind of soulless in my opinion.

I couldn't think of what to put in the footer of my site; most people have their github and twitter linked there, but instead I chose my favorite motto: 'this too shall pass'. This motto is so old and so widely used that almost every language has its own version, so I also have it there in latin, hebrew and arabic for good measure. The motto is meant to stress that nothing lasts forever, be it good or bad, and that we should live our lives understanding that nothing is permanent, including ourselves.

![Nothing lasts forever](/resource/images/rick-and-morty-watch-tv.jpg)

## Hosting the Website ##

This was not fun. Not fun at all.

### First Attempt ###

I originally tried to host my site with [asmallorange](http://www.asmallorange.com). This was the first mistake. The service was so bad that my virtual machine was down more than half the time I wanted to access it to edit things. After reading around I quickly saw that it was not just me, but almost everyone using their service that complained about awful downtimes.

It also felt like I was still buying more than I needed: I just needed some machine to run my Node instance, and this service was offering database help, SEO, help installing wordpress, nothing that was useful to me at all. Luckily, they offer a money back guarantee if you want to leave their service before 6 months, so I left.

### Gears and Cartridges ###

I then came across [openshift](http://openshift.redhat.com), a service made by redhat similar to AWS, but much more lightweight. You are given 3 gears (what they call these small app instances) to do whatever you want with without costing anything! You build a gear by selecting cartridges, these could be runtime environments (like Node.js), or databases, which then can have other things (like large libraires) added to the gear.

After cooking up your gear's requirements, you then are given a git repo for your app's code, so all you have to do make changes to you web app is to `git push` your app to openshift.

So i made a gear with Node.js cartridge and moved my code over to the gear.

***AND THEN EVERYTHING BREAKS***

I then spent a day moving things over piece by piece to my gear to see which part of the code breaks the app. I tirelessly look at the error message:

 `ENOENT: pageEntry.html`

This is meant to indicate that a file (which exists in my repo), does not exist in my repo. What could be wrong?

The actual name of the file was `postentry.html` ... not `postEntry.html`

It turns out the more recent version of Node that I am using on my laptop does not care about the case of letters in the path of a file, but the LTS version on the gear *does*. A whole day wasted on a spelling mistake.

So I have my gear up and running, it's a breeze to update my website with new posts and features, but it isn't over yet.

### Pointing My Domain to My Gear ###

I bought my domain from [namecheap](http://www.namecheap.com), which allowed me to use a CNAME record to point to my gear. It took until the next day to set up properly, but this was actually the most painless part of the whole process.

So now I have this nice website where I can write random stuff on, which is cool.
