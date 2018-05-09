---
{
    "title": "Some Thoughts About a Length-Scaled Softmax",
    "date": "2017-05-13"
}
---

**tl:dr:** *Some back-of-the-envelope ideas about a dynamically scaled softmax.*


***Has there been any work into creating a length-scaled softmax?*** I couldn't find any with a quick google.

Here is a good motivating (and quite contrived) example:

Suppose you have a seq2seq model which uses an attention mechanism for the decoder. The mechanism looks at the previous states of the decoder (similar to [1]), and computes a weight for each previous hidden state. Let's say the attention module produces weights between [-1, 1] representing the importance of that hidden state to the current one.

This attention mechanism is then used on sequences of varying length: Early on in the decoding step, the sequence of previous hidden states is quite small, whereas the later steps will have significantly longer sequences of weights.


Typically these weights are then softmaxed to produce the normalized weights used to form the 'attended' embedding.
An important thing to note here is that *attention mechanisms are typically meant to pick out only a few parts of a sequence*. We hope for trained models to produce normalized attention weights where many values are close to 0, and only a few values which are not close to zero.


Now lets consider this mechanism when it only has three previous hidden states. The trained model has learned to single out only the hidden states that pertain to the current hidden state.

For example, the unnormalized weights could be:

```
[-1, 1, -1].
```


Here the attention mechanism is "telling" us that only the second value is worth considering. The softmaxed version of these becomes:

```
[0.107, 0.787, 0.107]
```

Not bad, but we would still get some noise from the first and last hidden state. multiplying the unnormalized weights by a constant could help. If we multiply the unnormalized weights by 2 for example we get:

```
[0.018, 0.965, 0.018]
```

Which is much closer to our desired values.


Now lets consider a point when the decoder has already produced 200 hidden states. At this point, the decoder identifies ten values in the sequence that pertain to the 201st hidden state, so the attention weights before softmax are:

```
[-1, -1, -1, .... 1, -1, ...1, -1.... ]
```

with 10 1s and 190 -1s. Ideally we would like the softmax of the 1s to be close to 1/10, and the -1s close to 0. In fact, the softmaxed value for the 1s is 0.0280, where the -1s are 0.0038. In this case, the -1 values occupy 72% of the mass of the weights!

If we used the previous constant of 2, the 1s then become 0.074 and the -1s become 0.001. The mass of the -1s is 25%, which is a lot of noise to add to the attention vector.

The problem with using a larger constant, say 3 or 4, is that although this might solve the longer case, it makes the short sequence case very volatile, with values slightly larger than zero being much larger after softmax than values just below zero.  


If we take the case of an attention module for a sequence of length l, for which we expect m values in the sequence to be high (close to 1) and (l-m) values in the sequence to be low (close to -1), we can compute a constant k which aims to scale the unnormalized weights. We need to add another term, epsilon, which represents the mass that exists outside the high values after softmax.

Here is the maths for those interested:


![MATHS!](http://i.imgur.com/juzgNIM.jpg)


so the final value is:
```
k = 0.5 ln(
        (1-epsilon)(l-m)/
        epsilon*m
    )
```


There are several issues to be discussed with this:

* What is the value of m? Could this just be a function of the length (e.g. m = sqrt(l)).
* Does this contrived example bear any resemblance to real attention models?
* How much could this improve performance? Due to the logarithmic scaling of k wrt. length, it might turn out that using a trained constant for scaling might work just as well. In fact, some papers use a trained constant to scale the softmax of weights.




References:
* [1] [A Deep Reinforced Model for Abstractive Summarization](https://arxiv.org/pdf/1705.04304.pdf)
