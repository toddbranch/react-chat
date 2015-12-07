describe('store', function() {
  beforeEach(function() {
    store = Redux.createStore(reducer);
  });

  describe('CREATE_ROOM', function() {
    it('creates a new room', function() {
      store.dispatch({
        type: 'CREATE_ROOM',
        name: 'Dunder Mifflin'
      });

      expect(store.getState().rooms[0].name).toBe('Dunder Mifflin');
    });

    it('does not create a room with a duplicate name', function() {
      store.dispatch({
        type: 'CREATE_ROOM',
        name: 'Dunder Mifflin'
      });

      store.dispatch({
        type: 'CREATE_ROOM',
        name: 'Dunder Mifflin'
      });

      expect(store.getState().rooms.length).toBe(1);
    });

    it('does not create a room without a name', function() {
      store.dispatch({
        type: 'CREATE_ROOM',
      });

      expect(store.getState().rooms.length).toBe(0);
    });
  });

  describe('CREATE_MESSAGE', function() {
    beforeEach(function() {
      store.dispatch({
        type: 'CREATE_ROOM',
        name: 'Dunder Mifflin'
      });
    });

    it('adds a new message to the specified room', function() {
      store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var room = store.getState().rooms[0];
      var message = store.getState().rooms[0].messages[0];

      expect(room.name).toBe('Dunder Mifflin');
      expect(message.name).toBe('Dwight');
      expect(message.content).toMatch(/Jello/);
    });

    it('does not break if room doesn\'t exist', function() {
      store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Schrute Farms',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var messages = store.getState().rooms[0].messages;
      expect(messages.length).toBe(0);
    });

    it('does not add a message without a name', function() {
      store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var messages = store.getState().rooms[0].messages;
      expect(messages.length).toBe(0);
    });

    it('does not add a message without content', function() {
      store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight'
      });

      var messages = store.getState().rooms[0].messages;
      expect(messages.length).toBe(0);
    });
  });

  describe('SEND_MESSAGE', function() {
    it('creates a read message in the currently active room', function() {

    });

    it('does not create an empty message', function() {

    });

    it('does not create a message without a name', function() {

    });
  });
});
