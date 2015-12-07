var lastMessageId = 0;

function createMessage(name, content) {
  lastMessageId += 1;
  return {
    id: lastMessageId,
    name: name,
    content: content,
    read: false
  };
}

function createRoom(name) {
  return {
    name: name,
    messages: [],
    active: false
  };
}

function findRoom(name, rooms) {
  return _.find(rooms, function(room) {
    return room.name === name;
  });
}

function findMessage(room, id) {
  return _.find(room.messages, function(message) {
    return message.id === id;
  });
}

function findActiveRoom(rooms) {
  return _.find(rooms, function(room) {
    return room.active === true;
  });
}

var reducer = function(state, action) {
  var defaultState = {
    rooms: [],
    name: undefined,
    error: '',
    message: '',
    connected: false
  };
  var room;
  var message;

  state = state || defaultState;

  switch (action.type) {
    case 'CREATE_MESSAGE':
      room = findRoom(action.room, state.rooms);
      if (room && action.name && action.content) {
        room.messages.push(createMessage(action.name, action.content));
      }
      break;
    case 'SEND_MESSAGE':
      var activeRoom = findActiveRoom(state.rooms);
      message = createMessage(state.name, state.message);
      message.read = true;
      activeRoom.messages.unshift(message);
      break;
    case 'CREATE_ROOM':
      if (action.name && !findRoom(action.name, state.rooms)) {
        room = createRoom(action.name);
        state.rooms.push(room);
      }
      break;
    case 'UPDATE_MESSAGE':
      state.message = action.message;
      break;
    case 'UPDATE_NAME':
      state.name = action.name;
      break;
    case 'CHANGE_ROOM':
      state.rooms = state.rooms.map(function(room) {
        room.active = false;
        return room;
      });
      room = findRoom(action.room, state.rooms);
      room.active = true;
      break;
    case 'READ_MESSAGES':
      room = findRoom(action.room, state.rooms);
      room.messages = room.messages.map(function(message) {
        message.read = true;
        return message;
      });
      break;
  }

  return state;
};

var store = Redux.createStore(reducer);
