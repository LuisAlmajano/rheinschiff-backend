// Ref: https://medium.com/@upadhyayyuvi/how-to-use-express-rate-limiter-to-limit-user-rates-in-node-js-1a20b4e43355
// Ref: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP/user to 100 requests per windowsMs
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  statusCode: 429, // The HTTP status code to send back when a client is rate limited. (HTTP 429 Too Many Requests - RFC 6585).
  message: "Too many requests buddy, please try again later",
  keyGenerator: function (req) {
    return req.ip; // use user IP as the key
  },
  handler: function (req, res, next, options) {
    // HTTP 429 Too Many Requests
    res.status(options.statusCode).send(options.message);
  },
});

module.exports = limiter;

// Troubleshooting Proxy Issues

// If you are behind a proxy/load balancer (usually the case with most hosting services, e.g. Heroku, Bluemix, AWS ELB, Nginx, 
// Firebase Hosting, etc.), the IP address of the request might be the IP of the load balancer/reverse proxy (making the rate limiter effectively
// a global one and blocking all requests once the limit is reached) or undefined. To solve this issue, add the following line to your code 
// (right after you create the express application):

// app.set('trust proxy', numberOfProxies)
// Where numberOfProxies is the number of proxies between the user and the server. 
// To find the correct number, create a test endpoint that returns the client IP:

// app.set('trust proxy', 1)
// app.get('/ip', (request, response) => response.send(request.ip))

// Go to /ip and see the IP address returned in the response. If it matches your public IP address, then the number of proxies is correct and 
// the rate limiter should now work correctly. If not, then keep increasing the number until it does.

// Ref: https://www.npmjs.com/package/express-rate-limit