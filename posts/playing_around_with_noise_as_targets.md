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

Recording the learned mapping from a 256-dimensional $N(0, I)$ to a 2D distribution
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

For the last year or so, I have been experimenting with the Noise as Target (NAT) framework. It's a mechanism which can train a model to map from one probability distribution to another. Recently I have been seeing if NAT could be used as a form of image compression, where a model learns to map Gaussian Noise to a 2D distribution of a monochrome image. It's a long way off from being competitive in memory reduction, but I think the results are interesting in their own right - and at least nice to look at.

[All the code is open sourced for those who which to make their own NAT image.](https://github.com/coopie/vae-nat)


## Noise As Targets (NAT)

NAT was first introduced in [Unsupervised Learning by Predicting Noise (Bojanowski, Joulin)](https://arxiv.org/abs/1704.05310) in April 2017. The training method aims learn a mapping $f_\theta$ from an input distribution $X$ to a target distribution $Y$. What makes this different to typical classification or regression problems is that there are no explicit labels from $X$ to $Y$ - they also have to be learned.

NAT works by taking large (equally sized) samples from $X$ and $Y$, and learns a one-to-one assignment from each input $x$ to an output $y$ *during* training. In short, the training consists of two objectives:

1. Effectively map $x$s to their corresponding $y$s, i.e. minimize $\sum_{i=1}^{|X|} \|\| f\theta(x_i) - y_i \|\|$.
2. Find a one-to-one assignment from each $x$ to a $y$ i.e. find a permutation of the original Y which

If a model is able to effectively learn the objective, it follows that the model is a stateless map from $X$ to $Y$, i.e:

$$f_\theta(X) \sim Y$$


For my experiments (and those in the original paper), the mapping $f_\theta$ is a deep neural network,
BATCH TRAINING LIKE MOST DEEP LEARNING


### Initialization

Along with initializing the parameters of a model, randomly assign each $x$ in the training data to a $y$. These are the initial assignments in the model.


### Train step

To help better explain, I'll use an example of mapping from an arbitrary distribution $X$ to a 2-dimensional distribution $Y$. This example uses a batch size of 5.

First, we select a random batch of $x$s along with their corresponding $y$s and compute the forward pass of the mapping. I'll call the output of the mapping for a $x_i$ $z_i$.
Additionally, we "forget" the assignments from each $x$ to $y$ in the batch and find the best possible assignment.
 The $z$s and $y$s for the example are located as follows ($y$s are the red dots):

![](https://i.imgur.com/rUSyrzI.jpg)

We consider the best possible assignment in the batch to be when the *total distance* from each $z$ to their newly assigned $y$ is smallest.
To do this, we use the [hungarian method](https://en.wikipedia.org/wiki/Hungarian_algorithm). The algorithm is an $O(n^3)$ complexity and finds which one-to-one assignments minimize the total cost of the system. In this case, the cost is the euclidean distance between an $z$ and a $y$. Below shows the optimal assignments in the example batch:

![](https://i.imgur.com/VpFljMQ.jpg)

As you can see, the nearest target to a $z$ is not necessarily assigned to it. consider the $z$ on the bottom right for example.

After the new assignments are found in the batch, we treat the training as in classic regression, where the loss for a specific training example is the distance from the mapping of the input example $z$ to its new corresponding target $\hat{y}$:

$$
\mathcal{L}(\theta ; X_\text{batch}, Y_\text{batch}) = \sum_{x_i \in X_\text{batch}} \|\| f_\theta(x_i) - \hat{y}_i \|\|
$$

We can then use this loss to train the mapping network via backpropagation. Although the process of re-assigning targets is not differentiable, *the loss still is*.


If you want to learn more about NAT, I recommend reading the paper. [Ferenc Huszár's blog post on the paper](https://www.inference.vc/unsupervised-learning-by-predicting-noise-an-information-maximization-view-2/) and [a video myself and a good friend made](https://www.youtube.com/watch?v=CkSVb1ZMlnU) might also be useful.

## Using Noise As Targets For Learning Distributions Of Monochrome Images

Explain how a monochrome image can be seen as a 2d distribution, where the areas with larger probability mass are more white

### Experiment 1 - Learning A Complex Image From Gaussian Noise
``
<div class="videoContainer">
<video poster="//i.imgur.com/Cgx9q4Th.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
    <source src="//i.imgur.com/Cgx9q4T.mp4" type="video/mp4">
</video>
</div>


explain the idea of image compression being that you can feed Gaussian noise into a model to produce the image
therefore the model is the compression of the image

### Experiment 2 - Mapping MNIST Onto Donald Duck

[link with sprites](https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/coopie/cc1112863687995287f83f22593202b9/raw/1a8d05b0d5c369c792c5de1caa689d7a1135e779/config.json)

 [link with no sprites](https://projector.tensorflow.org/?config=https://gist.githubusercontent.com/coopie/cc1112863687995287f83f22593202b9/raw/ec47b8a3fd514162b748eb395d34029c25b975a7/config_no_sprite.json)


show that this can also work complex distributions, such as images

<div class="videoContainer">
<video poster="//i.imgur.com/1uXoCggh.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
    <source src="//i.imgur.com/1uXoCgg.mp4" type="video/mp4">
</video>
</div>

## Problems/Improvements with the work

### The Hungarian Algorithm is A Performance Bottleneck

PARTLYY BECAUSE THE MODELS ARE SUPER SMALL -

### Scaling to Larger Datasets

128K IS ABOUT THE SWEET SPOT

### The NAT Models Partly Overfit The Training Data


## Come Join me

If anyone is interested in working on these problems with myself, feel free to email me with the work you would be interested in.

The end goal of this work is to find a real-world use case where NAT is an effective tool

Hopefully, this work will be good enough to make it into the likes of NIPs or ICLR if published.


Additionally, if you have any feedback on this article - if you found a part of it confusing or poorly exaplained -  I would really like to hear from you.

Send emails to:
```
sam DOT j DOT coope  AT  gmail DOT com
```
