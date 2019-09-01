# lib_locale.ai_xrides
An API to fetch and stream orders from XRides.
<b>NOTE</b>: Database dump is also available at ./dbdump.tar.

### Links
[Application URL](https://limitless-falls-57736.herokuapp.com)

[Write Up URL](https://docs.google.com/document/d/1-pRUawHXdfPuvGPpET43Z2x0tig3PLYY5LZ9LEDiko4/edit?usp=sharing)

### Endpoints
- <b>POST</b> /orders
- <b>GET</b> /orders
- <b>GET</b> /orders/<b>\<id\></b>
	
Post Body Example:
```code
{
  "id":1,
  "user_id": "testuserid",
  "vehicle_model_id": "qwerty",
  "package_id": 2,
  "travel_type_id": 1,
  "from_area_id": "w8snSyu1",
  "to_area_id": "98u9jasdg",
  "from_city_id": "9kjnasdkuo13r",
  "to_city_id": "7098jashubnd",
  "from_date": 15876132,
  "to_date": 158712311,
  "online_booking": true,
  "mobile_site_booking": true,
  "booking_created": 15879123,
  "from_lat": 15.887123,
  "from_long": 77.897123,
  "to_lat": 15.123123,
  "to_long": 77.897123,
  "car_cancellation": false
}
```

### Instructions
```
npm run [dev/testing/prod]
```
### Screenshots
![Test 1](https://i.ibb.co/SXg2mW4/Screenshot-from-2019-09-01-13-05-07.png)

![Test 2](https://i.ibb.co/BL312Z8/Screenshot-from-2019-09-01-13-05-15.png)

![DB Schema](https://i.ibb.co/cXMvLBk/Screenshot-from-2019-09-01-20-21-03.png)

### Ideal System Design

1. Use a process manager like PM2 to run instances of the Node.js app server on multiple processes(ideally 4). PM2 comes with a built in load balancer that can be configured to designate the incoming request to the instance with least load. (Using PM2 is generally considered safer than forking clusters manually). We could run the server on an AWS EC2 instance. Furthermore, we could even setup an auto-scaling group on AWS to scale vertically.

2. All of the above happens within a single VM. We can have multiple VMs and we can use a reverse proxy like Nginx to strategically forward the requests to the VMs based on distance from origin and load on VM. We could also use Nginx to cache static assets. This will therefore enable us to scale horizontally once we’ve already scaled up vertically.

3. (Optional) In case we have a lot of static files to serve, we can even leverage a CDN like CloudFlare to serve static assets and cache common content to be sent to clients.

4. We could shard our database with a Master-Master methodology so that even if one of them goes down, we have other Database instances to rely on. We could use AWS RDS for this but from what I’ve learnt, AWS DynamoDB performs better when it comes to handling large sets of unstructured data. We could use an AWS S3 bucket if we were to store a lot of static content ourselves.

5. We could also use Docker to make images of our application instances and then use Kubernetes as the container to host a set of these docker images thereby allowing us to scale horizontally.

6. Setup a CI/CD platform. GitHub just introduced their new CI/CD platform which enables developers to monitor commit events. This can be used to push new code to production. This will probably be the better move since we are probably all going to be using GitHub to host our codebase. We could use it to create issues, pull requests and what not.

### Features

1. I’ve figured out from experience and by reading blogs of smarter people that Node.js is more efficient when compared to Python for building servers. I have deployed both Node.js and Python servers in production and Node.js didn’t run into any kind of errors. The Python(flask) application ran into all kinds of Garbage Collection errors at a certain point. Hence, I chose Node.Js for this task.

2. I’ve used express as it provides an easy and customizable way to write and configure middleware. It’s also the industry standard fashion to build Node.Js applications. I have written 3 middleware functions that can be found in /util/index.js.

3. I’ve used a package called Morgan which is another standard Node middleware that is used to log application traffic. In my application, I’ve configured morgan to log requests to both the console and a separate log file. (access.log)

4. I am limiting the number of requests that can be sent to our server. This is a common practise called rate limiting and it can help us potentially mitigate the huge numbers of requests being processed. (We can forward these requests to other servers with lesser load). Also limiting the payload size of each request to 1KB to further prevent DoS attacks as even the maximum size of a legitimate payload cannot exceed 1KB in the context of this task. 
I’ve used a package called helmet which adds additional headers in the HTTP responses being sent back from the server that enable stricter security. Examples of headers being added: Strict-Transport-Security, X-XSS-Protection and so on

5. I’ve used another package called xss-clean which sanitizes the input before passing on the query to Postgres to prevent SQL Injection attacks.


6. There are 3 different execution environments: Development, Testing and Production. This is defined in the /config/index.js file. This configuration file in turn obtains the values from the environment variables. I’ve defined these environment variables in the env file. In production, we would have to declare these variables on our remote VM. This will prevent illegal access to our API even if our codebase is compromised. (For the sake of the task, I’ve used the same config for all 3 environments).

7. I'm only returning 25 rows from the table by default, thereby preventing an overload. But it can be increased by sending query parameters limit and offset.

### Possible Enhancements

1. We could set up a job queue using Bull which in turn uses Redis for caching. Essentially what could be achieved is significantly lesser downtime since the requests would be queued on the cache and then processed one after the other as the load on the system reduces.

2. Leverage an ORM module, it’s going to help us long term with migrations and so on if we decide to switch Databases at a later point of time.

3. We could build an authentication and authorization system where in each company that we tie up will have a registered email and password. We could use bcrypt to hash these passwords. The reason I would want this is to implement JWT tokens. In the current scenario, anyone with the application link can view the data but by using an auth system, we can send a JWT token only upon successful login. This token could then be sent from the client to the server in the headers for every subsequent request, therefore enabling us to
  - Give access to data only to the legitimate user(company).
  - Prevent people with the server URL from accessing the data.
  - Keep track of incoming and outgoing traffic from a certain user(company) by mapping the received JWT to a user(company) account on the database. Who knows? We could use the location data from the incoming network traffic to figure out where to physically host our new servers.

### DSL queries for Analytics

1. Let’s say we want to find the number of users from a certain area who rent the vehicle on an hourly basis. Assume the area ID of Bangalore is ‘cityid69’. Travel type is hourly rental and therefore travel_type_id=3 (Given). The query would be:
```code
	SELECT COUNT(*) FROM orders WHERE travel_type_id=3 AND from_area_id=’cityid69’;	
```

2. We could use Business Intelligence tools such as Tableau or Power BI where in we will be streaming our data to their system just like how XRides will be streaming data to our system.
