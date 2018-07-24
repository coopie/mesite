---
{
    "title": "Playing Around With Noise As Targets",
    "date": "2019-06-20",
    "style": {
        "color1": "rgb(241, 100, 80)",
        "color2": "rgb(91, 96, 160)"
    },
    "footer": ""
}
---

<script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=TeX-MML-AM_CHTML' async></script>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<video poster="//i.imgur.com/TNxvwByh.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" style="width: var(--postwidth); height: calc(height);padding-bottom:5px;max-width: var(--postwidth);">
<source src="//i.imgur.com/TNxvwBy.mp4" type="video/mp4">
</video>

<div align="center">

(Yann Lecun) *Learning The LeDistribution*

Recording the learned mapping from a 256-dimensional $N(0, I)$ to a 2D "image" distribution
</div>

---

<!-- ```latex
@article{NATForImages,
  author = {Sam Coope},
  title = {Playing Around With Noise As Targets},
  journal = {Sam Coope's Personal Blog},
  year = {2018},
  note = {https://www.samcoope.com/posts/playing_around_with_noise_as_targets},
  doi = {GET FIRST VERSION AS A PDF TO DOWNLOAD}
}
``` -->

For the last year or so, I have been experimenting with the Noise as Target (NAT) framework. It's a mechanism which can train a model to map from one probability distribution to another. Recently I have been exploring if NAT could be used as a form of image compression, where a model learns to map Gaussian Noise to a 2D distribution of a monochrome image. It's a long way off from being competitive in memory reduction, but I think the results are interesting in their own right - and at least nice to look at.

[All the code is open sourced for those who which to make their own NAT image.](https://github.com/coopie/vae-nat)


## Noise As Targets (NAT)

NAT was first introduced in [Unsupervised Learning by Predicting Noise (Bojanowski, Joulin)](https://arxiv.org/abs/1704.05310) in April 2017. The training method aims learn a mapping $f_\theta$ from an input distribution $X$ to a target distribution $Y$. What makes this different to typical classification or regression problems is that there are no explicit labels from $X$ to $Y$ - they also have to be learned.

NAT works by taking large (equally sized) samples from $X$ and $Y$ (noted as $\overline{X}$ and $\overline{Y}$), and learns a one-to-one assignment from each input $x$ to an output $y$ *during* training. In short, the training consists of two objectives:

1. Effectively map $x$s to their corresponding $y$s, i.e. minimize $\sum_{i=1}^{|\overline{X}|} \|\| f\theta(x_i) - y_i \|\|$.
2. Starting with random assignments between $\overline{X}$ and $\overline{Y}$ Find a one-to-one assignment from each $x$ to a $y$ which helps with (1.).

If a model is able to effectively do this, it follows that the model closely approximates a stateless map from $X$ to $Y$, i.e:

$$f_\theta(X) \sim Y$$


For my experiments (and those in the original paper), the mapping $f_\theta$ is a deep neural network,
but any machine learning framework that can be trained in a supervised manner using batches could also work.


### Training a NAT Model: Initialization

Along with initializing the parameters of a model, randomly assign each $x$ in the training data to a $y$. These are the initial assignments in the model.


### Training a NAT Model: Train step

To help better explain, I'll use an example of mapping from an arbitrary distribution $X$ to a 2-dimensional distribution $Y$. This example uses a batch size of 5.

First, we select a random batch of $x$s along with their corresponding $y$s and compute the forward pass of the mapping. I'll call the output of the mapping for a $x_i$ $z_i$.
Additionally, we "forget" the assignments from each $x$ to $y$ in the batch.
The $z$s and $y$s for the example are located in 2D space as follows ($y$s are the red dots):

![](https://i.imgur.com/rUSyrzI.jpg)

We now want to find an assignment from each $z$ to a $y$ where the *total distance* from each $z$ to their newly assigned $y$ is smallest. In other words, the targets are assigned to each example in the batch in a way that is "easiest" for the model to learn.

To do this, we use the [hungarian method](https://en.wikipedia.org/wiki/Hungarian_algorithm). The algorithm is an $O(n^3)$ complexity and finds which one-to-one assignments minimize the total cost of the system. In this case, the cost is the euclidean distance between a $z$ and a $y$. Below shows the optimal assignments in the example batch:

![](https://i.imgur.com/VpFljMQ.jpg)

As you can see, the nearest target to a $z$ is not necessarily assigned to it. consider the $z$ on the bottom right for example.

After the new assignments are found in the batch, we treat the training as in classic regression, where the loss for a specific training example is the distance from the mapping of the input example $z$ to its new corresponding target $\hat{y}$:

$$
\mathcal{L}(\theta ; X_\text{batch}, Y_\text{batch}) = \sum_{x_i \in X_\text{batch}} \|\| f_\theta(x_i) - \hat{y}_i \|\|
$$

We can then use this loss to train the mapping network via backpropagation. Although the process of re-assigning targets is not differentiable, *the loss still is*.

Just like other deep learning methods, this training step is repeated until convergence. Each time, a random batch of $x$s and their corresponding $y$s are chosen, with $y$s being re-assigned each time to find "smoother" assignments.


If you want to learn more about NAT, I recommend reading the paper. [Ferenc Huszár's blog post on the paper](https://www.inference.vc/unsupervised-learning-by-predicting-noise-an-information-maximization-view-2/) and [a video myself and a good friend made](https://www.youtube.com/watch?v=CkSVb1ZMlnU) might also be useful.

## Using Noise As Targets For Learning Distributions Of Monochrome Images

A monochrome image can be seen as a 2D probability distribution, where the areas of higher density correspond to whiter areas in an image. In my experiments, I have taken the range to be $[0, 1]$ for both dimensions. As we are using NAT in this approach, we are concerned with large collections of 2D points which are very large samples of a probability distribution.

The image of the sample is a 2D histogram, where the buckets of the histogram are all equal length (the length of a bucket is $\frac{1}{\text{pixel width}}$)

The original idea for doing this was for image compression: Given a model which can map Gaussian noise well to an image "distribution", the compression of the image *is* the model. To reconstruct the image, simply feed Gaussian noise to the model and record how the model distributes it's output.

As an example, here is what a 2 Dimensional normal distribution with mean $(0.5, 0.5)$ and standard-deviation 0.5 looks like (using 1 million samples):

![](https://i.imgur.com/P7vHjxr.png)

## Some Demos

For most of my experiments, I have been using high-dimensional Gaussian Noise as the input, and sampled noise from a monochrome "distribution" as the targets. Details can be found in the codebase.

The below videos are recorded as each model is being trained. After a few training steps, I record the total output of the network from the training inputs, and create an image from the $z$s computed (each image being a frame in the video).

### Early Progress: Learning A Complex Image From Gaussian Noise
``
<div class="videoContainer">
<video poster="//i.imgur.com/Cgx9q4Th.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
    <source src="//i.imgur.com/Cgx9q4T.mp4" type="video/mp4">
</video>
</div>

This was the first non trivial image that I got working. Previous to this image, only simple shapes (circles, dots etc.) were effective. This target image is a picture of myself sampled with 64,000 points, using 128-dimensional Gaussian Noise and a 2-layer MLP with hidden sizes of 128.


### Mapping MNIST Onto Donald Duck

<div class="videoContainer">
<video poster="//i.imgur.com/1uXoCggh.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
    <source src="//i.imgur.com/1uXoCgg.mp4" type="video/mp4">
</video>
</div>

In [the video myself and a good friend made about NAT](https://www.youtube.com/watch?v=CkSVb1ZMlnU), we briefly discuss the use of NAT as a way of learning the latent prior distribution in VAEs. I quite clumsily said "you can have a distribution of points that look like Donald Duck (if you wanted)". To prove this point, I thought it only fitting to show how it's possible to map MNIST to the "Donald Duck" distribution. The model used was an MLP which took the flattened pixel values of an MNIST digit, and

You can see how it's mapped on the [tensorflow embedding projector](https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/coopie/cc1112863687995287f83f22593202b9/raw/1a8d05b0d5c369c792c5de1caa689d7a1135e779/config.json) ([here is one without sprites to make it clearer](https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/coopie/cc1112863687995287f83f22593202b9/raw/ec47b8a3fd514162b748eb395d34029c25b975a7/config_no_sprite.json))

### Higher Definition: Yann Lecun

<video poster="//i.imgur.com/TNxvwByh.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" style="width: var(--postwidth); height: calc(height);padding-bottom:5px;max-width: var(--postwidth);">
<source src="//i.imgur.com/TNxvwBy.mp4" type="video/mp4">
</video>

Early on, the NAT models could not scale to large number of points. It seems that the problem was that the models found minima before "good" assignments were learned causing blurry images. Although it took much longer to train (this model took 3 days), this is a promising sign that NAT could work at a very large scale. This image used 256-dimensional Gaussian Noise, and 512,000 sampled points from the image.


In a later post, I'll talk in more depth around the issues that NAT has, namely performance bottlenecks and training tradeoffs.


## Join In

If anyone is interested in working on these problems with myself, feel free to email me with the work you would be interested in. This is one of many NAT projects that I have worked on, for example my team at Digital Genius experimented with it's use in [agglomerative clustering](https://openreview.net/pdf?id=BJvVbCJCb)

The end goal of this work is to find a real-world use case where NAT is an effective tool, and to investigate it's efficacy compared to other methods similar to it such as [adversarial autoencoders](https://arxiv.org/abs/1511.05644).

Additionally, if you have any feedback on this article - if you found a part of it confusing or poorly explained -  I would also like to hear from you.

Send emails to:
```
sam DOT j DOT coope  AT  gmail DOT com
```
