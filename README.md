# weight_loss_tracker_back

### Made with Node.js and Express

The basis for many backend's made with Javascript. 

### Getting Started

Nothing with that much configuring needed in terms of dependencies with this, should all be installed easily by running

    npm install
    
in the root directory. 

MongoDB was used for the database, which will need a bit more work. A database is actually very easy to set up and they have a generous free-tier, so once you have one set up you need to paste the link into an .env file at the root directory but you also need to create an environment variable for the JWT package, mainly a secret password that will be used to hash user passwords (this isn't for MongoDB specifically just for the authentication part of this backend). 

### Description

This was an enjoyable project to build and it was a challenge for me but one I'm very grateful to have undertaken. After finding that MongoDB was a bit rigid in terms of storing all schema instance's in an array, I had to write some code to run on the server that would adjust the data into a more digestible format for the frontend (I converted the data from MongoDB into a hashmap-like object structure on the server-side, even if I tried to set the data using the Map JS object it would have been converted into a typical JS object once it was converted to JSON anyway). While the solution seemed simple it did require a lot of thinking and planning, as I had several things to consider, namely the calendar UI component, the chart.js component and the limitations of Mongoose and MongoDB, it was unclear how I was going to get everything working together and I feel that the solution is satisfactory. It's a shame this couldn't have been done directly with MongoDB, as this would have been the quickest solution (in terms of speed) but I think some server-side work in terms of data organisation is acceptable.

What I also enjoyed about making this was the fact that I felt I understood backend a lot more, especially the typical folder structure of a backend (at least of something of this size). I also got to use regular expressions a bit for the validation of the data, which I didn't foresee but enjoyed the chance to use it in a real-life scenario. 
