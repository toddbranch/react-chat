var messageId = 0;

function createMessage(name, content, room) {
  messageId += 1;

  return {
    id: messageId,
    name: name,
    content: content,
    room: room,
    read: false
  };
}

var reducer = function(state, action) {
  var defaultState = {
    messages: [],
    name: '',
    content: '',
    room: undefined
  };
  var message;

  state = state || defaultState;

  switch (action.type) {
    case 'CREATE_MESSAGE':
      if (action.name && action.content && action.room) {
        message = createMessage(action.name, action.content, action.room);
        if (message.room === state.room) {
          message.read = true;
        }
        state.messages.unshift(message);
      }
      break;
    case 'UPDATE_CONTENT':
      state.content = action.content;
      break;
    case 'UPDATE_NAME':
      state.name = action.name;
      break;
    case 'CHANGE_ROOM':
      if (action.room) {
        state.room = action.room;
      }

      state.messages = state.messages.map(function(message) {
        if (message.room === action.room) {
          message.read = true;
        }

        return message;
      });
      break;
  }

  return state;
};
