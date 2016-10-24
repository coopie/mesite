---
{
    "title": "Hearing Heartbeat in Audio and Video: A Deep Learning Project",
    "date": "2016-02-02",
    "footer": "Geoff Hinton once built a neural network that beat Chuck Norris on MNIST."
}
---
Last term, I ended up taking three machine learning courses, along with a couple of others. Out of all of the stuff I did last term, the biggest and best thing I did was work with a few friends on a group project. This project was:

> Automatic Estimation of Heart rate from Audio and Video

Now this might sound like nonsense to most people, *"how can you hear my heartrate? My heart doesn't beat that loudly! And you you can detect my heart rate from video? witchcraft!?"*. In fact you would be almost right.

Several studies like [this one](https://mediatum.ub.tum.de/doc/1189701/948196.pdf) have shown that it is completely possible. In short: Your heartbeat affects the nerve that operates your voicebox, and the change in coloration of a person's face does indeed match a heartbeat (your face becomes more red when your heart pumps blood to it).

So we weren't trying to analyse facial expression or physical exertion to estimate heart rate, but rather the physical waveform produced in your speech and facial coloration which correspond to a persons heartbeat.

## Why Heartrate? ##

### 1. Not Much Work Done in the Area ###

Currently, all of the heavyweight research into this area of machine learning comes from companies who want to read their customers better, rather than help them. This means that detecting emotional state has already had extensive research and is already being used in software. [Microsoft is already selling a service which detects the emotion of people in video or images](https://www.projectoxford.ai/emotion).

### 2. Potential Benefit ###

There are a lot more theoretical uses for analysing speech and video of a persons's face. Some people theorise that [depression](http://ieeexplore.ieee.org/xpls/abs_all.jsp?arnumber=6365169&tag=1) can be detected in people (or at least help doctors with a [diagnosis](http://www3.cs.stonybrook.edu/~minhhoai/papers/acii-paper_final.pdf)), heart arrhythmia and potentially a lot more.

Imagine combining these abilities into one product. In the future a doctor could use something like this to help detect subtle symptoms in the way a person presents themselves. A whole new quantification of emotional wellbeing would completely change how so many areas of medicine work.

Being able to detect heart rate (and other stuff) from speech or video of a person's face has a whole bunch of benefits:

1. **Remote**: No one needs to be next to the patient to take measurements.
*  **Unintrusive**: No device needs to be placed on the patient's body.
*  **Retroactive**: It would be possible to look at past audio and video recordings (that we have, like, a ton of) to help in diagnosis. Videos of a patient as a child might reveal signs of a symptom, or could provide new evidence in a court case.

## What We Did ##

The final product was a website where you could upload a video with a person talking in it and have it streamed back to you in real time with the heart beat of the person in the video. We used both the audio and video methods of estimating heart rate to get as good an estimate as possible. Unfortunately we have not hosted it at the moment, as it would require some powerful hardware to run the server.

Here is a screenshot of our video streaming service. In retrospect I think superimposing a big red square over the person's face looks a bit tacky.

![](/resource/images/clinton-palpitate.png)

We were given a dataset of people talking about embarrasing/happy/sad/funny moments of their life with their pulse measured. Naturally this meant that the heart rate of the subject would change during the session, as they would get more tense or relaxed depending on what they were saying. Our job was to use this dataset to train our models.

Most of my work on the project was video analysis, data preparation and a little bit of help with the neural network training, so I'll show you the stuff I know about in the project.

### Face Tracker ###

For video analysis, the aim was to monitor the bloodflow in someone's face. We did this by looking at the green intensity of the subjects' face (based on [this paper](http://www.cv-foundation.org/openaccess/content_cvpr_2014/papers/Li_Remote_Heart_Rate_2014_CVPR_paper.pdf)).

In order to do this, you need to track the position of a person's face so you know which pixels are showing someone's face. This is a bit more tricky than it sounds: most face trackers out there fail really, really soft. What that means is that if the face tracker is having a hard time finding the subject in the video, they usually then start tracking some blip of dust on the wall, which would completely contaminate the data we have.

Also, many of these face trackers are quite processor heavy, which makes the dream of using this in a real time streaming service very difficult. Some of these trackers could run at around 10fps on a desktop machine, which is just way too slow.

So instead we used the fast and crappy face tracker in OpenCV. The problem with this face tracker is that it is completely memoryless. This means that it doesn't take into account the previous frames to find the face, which makes it a very wobbly tracker. Also, even when it looked like the face tracker was tracking the subject perfectly, it would drop an odd frame, which would flag up the subject as difficult to track, and move on to the next one.

To solve the wobbliness, we added a layer on top of the tracker which uses moving averages for the size and position of the face to smooth out the tracking. The frame loss was solved by giving the adding a ten frame drop limit, so if the tracker loses the face in the next frame, it uses the position of the previous frame for collecting the green intensity for up to ten consecutive frames.

Here you can see an example of the face tracker working on a subject in our training data. Note the green square is where the face tracker thinks the face is, and the cyan rectangle is the region of pixels relative to the face-tracker which the green intensity is extracted from the face.

![It can track pixelated faces!](/resource/images/face-tracker.jpg)

### Neural Nets ###

We used [keras](http://github.com/fchollet/keras) for making and running our deep neural nets. If you are curious to try some deep learning, this is all of the benefit of high performance CUDA in a nicely made python framework.

These were the four different approaches to audio we attempted. For video, we only used the CNN-RNN architecture (the one on the right).

<style>
img.customPicture {
    width: 22%;
    align: "middle"
}
</style>

<img class="customPicture" src="/resource/images/NN-2layer-feedforward.png">
<img class="customPicture" src="/resource/images/NN-standard-convolutional.png">
<img class="customPicture" src="/resource/images/NN-RNN.png">
<img class="customPicture" src="/resource/images/NN-CNN-RNN.png">

#### First Idea

We initially tried to apply a similar strategy to [Dieleman and Schrauwen](http://ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=6854950&url=http%3A%2F%2Fieeexplore.ieee.org%2Fxpls%2Fabs_all.jsp%3Farnumber%3D6854950), who used [spectrograms](https://en.wikipedia.org/wiki/Spectrogram) of subjects speaking to detect heart rate. For video, we used the time series data of the green intensity of someone's face to create the spectrograms, here are what the spectrograms looked like for audio and video.

The idea is that convolutional neural nets are very good at image classification, and applying these practices to look at a spectrogram might be a good way at detecting heart rate.

This was not very successful for us. Our best result was 0.68 product moment correlation coefficient.

#### Recurrent Nets

We then tried recurrent neural networks, which proved to be much better at detecting heart rate, but still not great. For audio we sliced the spectrograms into small chunks, and for video, we just used the time series of green intensity of the face. These turned out to be much more promising, but still not as good as we hoped.

## Thoughts ##

Can you detect heart rate from a video of a person?

Sometimes in research based projects the answer can be as simple as a yes or no, but in our case, we can't really tell. There are so many factors which could have contaminated the data a little bit, such as some of the subjects wearing make-up, which would block coloration of the face coming through. I do believe that this is an avenue of research that could really do with more people interested in it, it has the potential to have a lot of commercial and medical impact.

### Appendix

[The slides for our final presentation](/resource/misc/Palpitate-Presentation.pdf)

the source for the project is [here](https://github.com/group-24/Palpitate)

we also made a goofy [video of an early prototype](https://www.youtube.com/watch?v=YXdfFHYNVIk)
