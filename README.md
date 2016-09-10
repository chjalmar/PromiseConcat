#Synopsis

An example script showing how to concatenate http requests dinamically creating promises, in cases when you don't know how many requests you will be making until you reach the end.

I found some examples using async, or other libraries, but they usually assumed you were starting up with an already limited list of URLs to request. 
In my case, I didn't know exactly what page number was the last one, so I needed to dinamically increment the endpoints to request;

And since I knew there would be hundreds of requests, I didn't want to fire them all at once.

For this example I ended up using 'request' library, but it can be done with regular http.request() method.

Some logic for using async methods syncwyse.

#Requires

- Node;
- 'fs' and 'request' (Or only 'fs' if you decide to do it with plain 'http').
