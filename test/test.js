const { fakiefy, FakieClient } = require('../src/index');

const getUsers = fakiefy({
  users: [
    {
      name: 'userName',
      bday: 'past',
      catchPhrase: 'catchPhrase'
    }
  ],
  id: 'recent'
}, 'de');

const client = new FakieClient({
  host: 'http://localhost',
  routes: [
    {
      path: '/users',
      handler: getUsers,
    }
  ]
});

console.log(client.fetch('http://localhost/users'));
