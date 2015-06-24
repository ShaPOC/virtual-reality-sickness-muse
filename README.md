# Virtual Reality Sickness Muse Webserver
> __Made with Node.js__

## Table of Contents

- [Virtual Reality Sickness Muse](#virtual-reality-sickness-muse)
	- [What is it?](#what-is-it)
	- [Prerequisites](#prerequisites)
	- [Setup](#setup)
	- [How to use](#how-to-use)
	- [Why specifically this data?](#why-specifically-this-data)
	- [How about a license of some sort?](#how-about-a-license-of-some-sort)

## What is it?

A web interface specifically designed for use with the [Virtual Reality Sickness Testrooms](https://github.com/ShaPOC/ue4-vrs-prototype). This project creates a server using [node.js](https://nodejs.org/) locally and uses [socket.io](http://socket.io/) and my [node-muse](https://www.npmjs.com/package/node-muse) module to send EEG data from the [Muse brainwave band](http://www.choosemuse.com/) directly to the web interface.

![Web interface](https://raw.githubusercontent.com/ShaPOC/virtual-reality-sickness-muse/master/extra/Interface.png)

The web interface offers a quick overview of the connection status, current battery life and the signal quality. The signal quality is determined by the way the Muse is located on the head of the user. When placed correctly all the bars in the left top corner will be filled. The screenshot above therefore tells you that the headband is not placed correctly on the user's head.

Once the user has placed the headband correctly the right interface will appear showing specific raw EEG data for use with the [Virtual Reality Sickness Testrooms](https://github.com/ShaPOC/ue4-vrs-prototype) test.

When the button on the top right is green, a.k.a. it's connected, you will be able to press it and it will show you a dropdown with some options. From here you can __start the next phase or go back to a previous one__. It will also offer you the option to __download the data as a JSON file__. The phases represent the current room the user resides in when using it during the [Virtual Reality Sickness Testrooms](https://github.com/ShaPOC/ue4-vrs-prototype) test.

## Prerequisites

The only prerequisite is that you have [node.js](https://nodejs.org/) installed.

## Setup

Clone this repository or download it to a location of your chosing. 
Afterwards open up a terminal, navigate to the folder and enter;

> npm install

Note: When on Linux or Mac, you might need to add the __sudo command__ infront.
That's it really...

## How to use?

Go to the terminal, navigate to the folder where the Virtual Reality Sickness Muse Webserver is installed and enter;

> node src/.

Or if you're on __Windows__ it's probably something like;

> node .\src\index.js

The webserver will then open the node-muse server which will be waiting for connection of the Muse and it will open a HTTP server on port 8080. Both will be shown in the terminal;

> Connecting to any available Muse using host; osc.udp://127.0.0.1:5002
> HTTP server started and available on port: 8080

Now just navigate your webbrowser to _localhost:8080_ connect your Muse via bluetooth and watch the magic happen through socket.io!

## Why specifically this data?

So basically this webserver was used for a study in virtual reality sickness using the [Virtual Reality Sickness Testrooms](https://github.com/ShaPOC/ue4-vrs-prototype). Before this study and the creation of this software many other studies were read by me. 

Study shows that the effects of virtual reality / motion sickness can be found in the frequencies 8-10 Hz and 18-20 Hz which correlates to the Theta, Alpha and Beta channels on the Muse.
Lin, C. T., Chuang, S. W., Chen, Y. C., Ko, L. W., Liang, S. F., & Jung, T. P. (2007, August). EEG effects of motion sickness induced in a dynamic virtual reality environment. In Engineering in Medicine and Biology Society, 2007. EMBS 2007. 29th Annual International Conference of the IEEE (pp. 3872-3875). IEEE.

Subtle changes in the face muscles are also measured and noted by the web interface, as they are often also an indication of inconvenience. 

## How about a license of some sort?

GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
As seen here: [GPLv3 License](./LICENSE)