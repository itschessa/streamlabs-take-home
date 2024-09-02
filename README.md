# Instructions on how to run your application
- Clone the repo locally. Make sure you have a recent version of node + npm installed.
- Run `npm i` from command line to install the necessary packages.
- Run `npm run dev` to start up the app. You should be able to access the app from `http://localhost:5173` in your browser.

Thanks for taking the time to check this out! :sparkles:

# Your brief answers to the following questions:

## How long did it take you to complete this assignment?
- Maybe 4 or 5 hours. I haven't used the canvas API before so a good chunk of my time was spent researching and reading
documentation around that.

## What about this assignment did you find most challenging?
- Probably honestly just learning how the canvas API worked since I was unfamiliar with it. And trying to get both the
canvas and images scaled correctly without making everything look all wonky.

## What about this assignment did you find unclear?
- I don't think there was anything that was unclear in my opinion.

## Do you feel like this assignment has an appropriate level of difficulty?
- I think probably yes! It was definitely a bit more difficult from the start for me just because I was 
unfamiliar with using the canvas API and that sort of thing beforehand, but I think if it is truly 
representative of the kind of work that you guys typically do in your codebase, then it's probably a good 
level of difficulty!

## Briefly explain the technical decisions you made in this project, i.e. architecture, code-splitting, libraries, or other decisions and tradeoffs.
- I think the architecture and such in my app is pretty simple so hopefully there's not too much to explain.
I went with a React + Vite app just because it's what I'm familiar with using and was easy for me to spin up.
The logic around rendering the canvas, drawing the images, and handling the drag/drop functionality started
to get pretty complex, so I decided to pull it out into a custom hook (+ a helpers file) to maintain a 
bit of separation of concerns between the actual React component rendering and the guts of the logic.
That's pretty much all there is to it though!
