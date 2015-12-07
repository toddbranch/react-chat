describe('store', function() {
  beforeEach(function() {
    this.store = Redux.createStore(reducer);
  });

  describe('CREATE_MESSAGE', function() {
    it('adds a new message to the specified room', function() {
      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var message = this.store.getState().messages[0];

      expect(message.room).toBe('Dunder Mifflin');
      expect(message.name).toBe('Dwight');
      expect(message.content).toMatch(/Jello/);
      expect(message.read).toBe(false);
    });

    it('marks message as read if created in currently active room', function() {
      this.store.dispatch({
        type: 'CHANGE_ROOM',
        room: 'Dunder Mifflin'
      });

      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var message = this.store.getState().messages[0];

      expect(message.read).toBe(true);
    });

    it('does not add a message without a name', function() {
      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var messages = this.store.getState().messages;
      expect(messages.length).toBe(0);
    });

    it('does not add a message without content', function() {
      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight'
      });

      var messages = this.store.getState().messages;
      expect(messages.length).toBe(0);
    });

    it('does not add a message without a room', function() {
      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      var messages = this.store.getState().messages;
      expect(messages.length).toBe(0);
    });
  });

  describe('SEND_MESSAGE', function() {
    beforeEach(function() {
      this.store.dispatch({
        type: 'CHANGE_ROOM',
        room: 'Dunder Mifflin'
      });
    });

    it('creates a read message in the currently active room', function() {
      this.store.dispatch({
        type: 'UPDATE_NAME',
        name: 'Creed'
      });

      this.store.dispatch({
        type: 'UPDATE_CONTENT',
        content: 'If I can\'t scuba, what\'s this all been about?'
      });

      this.store.dispatch({
        type: 'SEND_MESSAGE'
      });

      var message = this.store.getState().messages[0];

      expect(message.room).toBe('Dunder Mifflin');
      expect(message.content).toMatch(/scuba/);
      expect(message.name).toBe('Creed');
      expect(message.read).toBe(true);
    });

    it('does not create an empty message', function() {
      this.store.dispatch({
        type: 'UPDATE_NAME',
        name: 'Creed'
      });

      this.store.dispatch({
        type: 'SEND_MESSAGE'
      });

      expect(this.store.getState().messages.length).toBe(0);
    });

    it('does not create a message without a name', function() {
      this.store.dispatch({
        type: 'UPDATE_CONTENT',
        content: 'If I can\'t scuba, what\'s this all been about?'
      });

      this.store.dispatch({
        type: 'SEND_MESSAGE'
      });

      expect(this.store.getState().messages.length).toBe(0);
    });
  });

  describe('CHANGE_ROOM', function() {
    it('changes the active room', function() {
      this.store.dispatch({
        type: 'CHANGE_ROOM',
        room: 'Dunder Mifflin'
      });

      expect(this.store.getState().room).toBe('Dunder Mifflin');
    });

    it('marks all messages in the active room as read', function() {
      this.store.dispatch({
        type: 'CREATE_MESSAGE',
        room: 'Dunder Mifflin',
        name: 'Dwight',
        content: '@Jim, stop putting my stuff in Jello!'
      });

      this.store.dispatch({
        type: 'CHANGE_ROOM',
        room: 'Dunder Mifflin'
      });

      expect(this.store.getState().messages[0].read).toBe(true);
    });

    it('does not change rooms if name is undefined', function() {
      this.store.dispatch({
        type: 'CHANGE_ROOM',
        room: 'Dunder Mifflin'
      });

      this.store.dispatch({
        type: 'CHANGE_ROOM'
      });

      expect(this.store.getState().room).toBe('Dunder Mifflin');
    });
  });
});
