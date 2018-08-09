# fakie

**MOCK API MADE EASY**
Simple server or fetch mock up API powered by [faker.js](https://github.com/Marak/faker.js) and [express](https://github.com/expressjs/express).

```
npm i -S fakie
```

- Need a mock API with random content? [templates](#templates)
- Wanna use it as a standalone server? [FakieServer](#FakieServer)
- Wanna use it as a router in express? [createRouter](#createRouter)
- Wanna use it as a fetch mock up directly in the client? [FakieClient](#FakieClient)


## Templates

``` javascript
const { fakie } = require('fakie');

const getAllUsers = fakie({
  users: fakie.array(
    {
      name: 'userName',
      bday: 'past',
      loves: 'abbreviation'
    },
    3, // min entries, defaults to 5
    5, // max entries, defaults to 10
  ),
  id: 'uuid'
});

const getUser = fakie({
  // functions are called with the request object
  username: (request) => request.params.username,
  avatar: 'avatar',
  friends: fakie.array('userName')
});
```

## FakieServer

``` javascript
const { FakieServer } = require('fakie');

const server = new FakieServer({
  // locale: localizes some of the values e.g. the names
  locale: 'de',
  // seed: number other than 0 - enforces to receive always the same results  !!! doesn't work with dates !!!
  seed: 11092323,
  routes: [
    {
      methods: ['GET'],
      path: '/users',
      // handler: template object or function
      handler: getAllUsers,
    },
    {
      methods: ['GET'],
      path: '/user/:username',
      // handler: template object or function
      handler: getUser,
    }
  ]
});

server.listen(/*port*/);
```

### as router

``` javascript
const { FakieServer, FakieClient } = require('fakie');

// via createRouter
const routerA = FakieServer.createRouter(new FakieClient(/*config*/));
// via FakieServer instance
const routerB = new FakieServer(/*config*/).router;
```


## FakieClient

``` javascript
const { FakieClient } = require('fakie');

const client = new FakieClient({
  host: 'http://localhost',
  routes: [
    {
      path: '/users',
      handler: getAllUsers,
    }
  ]
});

console.log(
  client.fetch('http://localhost/users', {method: 'GET'})
);
```