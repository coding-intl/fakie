const { fakie, FakieClient, FakieServer } = require('../src/index');

const getAllUsers = fakie({
  users: fakie.array(
    {
      name: 'userName',
      bday: 'past',
      loves: 'abbreviation'
    },
    3,
    5,
  ),
  id: 'uuid'
});

const getUser = fakie({
  username: (request) => request.params.username,
  avatar: 'avatar',
  friends: fakie.array('userName')
});

const client = new FakieClient({
  host: 'http://localhost',
  routes: [
    {
      path: '/users',
      handler: getAllUsers,
    }
  ]
});

// TODO: determine if FakieClient.fetch should work on node. Response and Blob would need Fallbacks.
//
// client.fetch('http://localhost/users', { method: 'GET' })
//   .then(
//     response =>
//       console.log(response.json())
//   );

const server = new FakieServer({
  // locale: localizes some of the values e.g. the names
  locale: 'de',
  // seed: number other than 0 - enforces to receive always the same results  !!! doesn't work with dates !!!
  seed: 11092323,
  routes: [
    {
      methods: ['GET'],
      path: '/users',
      handler: getAllUsers,
    },
    {
      methods: ['GET'],
      path: '/user/:username',
      handler: getUser,
    }
  ]
});

server.listen(/*PORT*/);