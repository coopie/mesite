---
{
    "title": "Some Rules I Try To Keep To When Researching",
    "date": "2017-09-03"
}
---

[discussion](https://www.reddit.com/r/MachineLearning/comments/6xtu0i/d_some_rules_i_try_to_keep_to_when_researching/)

In much of the lifespan of a research project, time is spent exploring rather than refining. One of the big issues with exploring is that old experiments can be lost due to codebase changes. Along with this, exploration can grind to a halt when too many one-off scripts are written, and poor programming paradigms are used.

These are some rules I have found to be beneficial to the exploratory research I have done. I don't always stick to them strictly, but I use them to push me off the path of least resistance.

* **Running an experiment should require a single command.** It is common in machine learning to run several scripts (such as data preprocessing) before running the training program. Not only does this add difficulty and documentation for others to run the scripts, it slows down the whole training process as the user has to check that all conditions are met before running the experiment.

* **Favor immediate results over performance.** Rather than preprocessing all of the training data before running the training loop, lazily processing training batches means that we can see any errors in the model implementation without having to wait for the preprocessing to finish. Build lazily evaluated pipelines where possible, and make use of caching.

* **Try the obvious baselines first.** Get some baseline metrics from very simple models. Use these to test your training harness as they will usually take very little time to train.

* **Experiments should be easily repeatable at any stage of development.** This means that sometimes it is beneficial to copy code over from one experiment to another to avoid accidentally changing the implementation of code used by other experiments in the codebase.

* **Favor composition over encapsulation.** Encapsulating code in a strictly object-oriented fashion is not useful for machine learning research. We want to be able to quickly change the core implementation of certain pieces of code without having to add functionality to a monolithic object. Build small, re-useable functions, test the important ones, compose experiments explicitly from these building blocks.

* **Analysis should be consistent over different experiments.** We should not have to write special scripts to analyze each model we train.

* **Experiments should have as few adjustable parameters as possible.** It is common in deep learning to parameterize models with many hyper-parameters such as learning rate, size of hidden layers, batch size etc. Each hyper-parameter adds another dimension to the hyper-parameter space which we would have to traverse when training models. When testing different model architectures in the time constraints we have, it is better to set many of these hyper-parameters, and use values known to be effective from other research.
