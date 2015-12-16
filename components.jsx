var store = Redux.createStore(reducer);

var Message = React.createClass({
  render: function() {
    return (
      <li className="list-group-item message">
        <div className="message-name">
          {this.props.message.name}
        </div>
        <div className="message-content">
          {this.props.message.content}
        </div>
      </li>
    );
  }
});

var Messages = React.createClass({
  render: function() {
    return (
      <ul className="list-group messages">
        {this.props.messages.map(function(message) {
          return (
            <Message message={message} key={message.id} />
          );
        })}
      </ul>
    );
  }
});

var Chat = React.createClass({
  render: function() {
    var room = this.props.room;
    if (!room) {
      return (
        <div>
          Select a room.
        </div>
      );
    }

    var messages = _.filter(this.props.messages, function(message) {
      return message.room === room;
    });

    return (
      <div className="chat">
        <div className="message-fields">
          <div className="form-group name-box">
            <div>Name:</div>
            <input
              className="form-control"
              type="text"
              value={this.props.name}
              onChange={this.props.updateName}
            />
          </div>
          <div className="form-group message-box">
            <div>Message:</div>
            <input
              className="form-control"
              type="text"
              value={this.props.content}
              onChange={this.props.updateContent}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={this.props.sendMessage}
          >Send</button>
        </div>
        <Messages
          messages={messages}
        />
      </div>
    );
  }
});

var Room = React.createClass({
  render: function() {
    var messages = this.props.messages;
    var unread = _.filter(messages, function(message) {
      return message.read === false;
    });
    var room = messages[0].room;
    var roomClasses  = this.props.active === room ? 'room active' : 'room'

    var changeRoom = this.props.changeRoom;
    function makeRoomActive() {
      changeRoom(room);
    }

    return (
      <li className={roomClasses} onClick={makeRoomActive}>
        <div className="room-name">
          {room}
        </div>
        <Messages
          className="recent"
          messages={[messages[0]]}
        />
        <div className="unread">
          {unread.length} unread
        </div>
      </li>
    );
  }
});

var Rooms = React.createClass({
  render: function() {
    var changeRoom = this.props.changeRoom;
    var active = this.props.room;
    var roomMessages = _.values(
      _.groupBy(this.props.messages, function(message) {
        return message.room;
      })
    );

    return (
      <ul className="rooms">
        {roomMessages.map(function(messages) {
          return (
            <Room
              active={active}
              messages={messages}
              key={messages[0].room}
              changeRoom={changeRoom}
            />
          );
        })}
      </ul>
    );
  }
});

var Application = React.createClass({
  render: function() {
    return (
      <div className="application">
        <Rooms
          messages={this.props.messages}
          room={this.props.room}
          changeRoom={this.props.changeRoom}
        />
        <Chat
          messages={this.props.messages}
          room={this.props.room}
          name={this.props.name}
          updateName={this.props.updateName}
          content={this.props.content}
          updateContent={this.props.updateContent}
          sendMessage={this.props.sendMessage}
        />
      </div>
    );
  }
});

function updateName(e) {
  store.dispatch({
    type: 'UPDATE_NAME',
    name: e.target.value
  });
}

function updateContent(e) {
  store.dispatch({
    type: 'UPDATE_CONTENT',
    content: e.target.value
  });
}

function sendMessage() {
  var state = store.getState();

  socket.emit('message', {
    name: state.name,
    content: state.content,
    room: state.room
  });
}

function changeRoom(room) {
  store.dispatch({
    type: 'CHANGE_ROOM',
    room: room
  });
}

function createMesssages(messages) {
  messages.forEach(function(message) {
    store.dispatch({
      type: 'CREATE_MESSAGE',
      name: message.name,
      content: message.content,
      room: message.room
    });
  });
}

var socket = io();
socket.on('messages', createMesssages);

function render() {
  var state = store.getState();

  ReactDOM.render(
    <Application
      messages={state.messages}
      room={state.room}
      changeRoom={changeRoom}
      name={state.name}
      updateName={updateName}
      content={state.content}
      updateContent={updateContent}
      sendMessage={sendMessage}
    />,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
