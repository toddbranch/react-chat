var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <div className="message-name">
          {this.props.message.name}
        </div>
        <div className="message-content">
          {this.props.message.content}
        </div>
      </div>
    );
  }
});

var Messages = React.createClass({
  render: function() {
    return (
      <ul className="messages">
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
      return (<div></div>);
    }

    return (
      <div className="chat">
        <div className="message-fields">
          <div className="name-box">
            <div>Name:</div>
            <input
              type="text"
              value={this.props.name}
              onChange={this.props.updateName}
            />
          </div>
          <div className="message-box">
            <div>Message:</div>
            <input
              type="text"
              value={this.props.message}
              onChange={this.props.updateMessage}
            />
            <button onClick={this.props.sendMessage}>Send</button>
          </div>
        </div>
        <Messages
          messages={room.messages}
        />
      </div>
    );
  }
});

var Room = React.createClass({
  render: function() {
    var room = this.props.room;
    var unread = _.filter(room.messages, function(message) {
      return message.read === false;
    });
    var message = room.messages[0];
    var roomClasses  = room.active ? 'room active' : 'room'

    var that = this;
    function changeRoom() {
      that.props.changeRoom(room.name);
    }

    return (
      <li className={roomClasses} onClick={changeRoom}>
        <div className="room-name">
          {room.name}
        </div>
        <Message
          className="recent"
          message={message}
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

    return (
      <ul className="rooms">
        {this.props.rooms.map(function(room) {
          return (
            <Room
              room={room}
              key={room.name}
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
    var rooms = this.props.rooms;
    var activeRoom = _.find(rooms, function(room) {
      return room.active === true;
    });

    return (
      <div className="application">
        <Rooms
          rooms={rooms}
          changeRoom={this.props.changeRoom}
        />
        <Chat
          room={activeRoom}
          name={this.props.name}
          updateName={this.props.updateName}
          message={this.props.message}
          updateMessage={this.props.updateMessage}
          sendMessage={this.props.sendMessage}
        />
      </div>
    );
  }
});

// this will be replaced with a call to the endpoint
function getRooms() {
  return [
    {
      name: 'Sales',
      messages: [
        {name: 'Jim', content: '@Dwight false.  The answer is Black Bear.  Fact: bears eat beats.  Bears.  Beets.  Battlestar Gallactica.'},
        {name: 'Dwight', content: '@Jim stupid question.'},
        {name: 'Jim', content: '@Dwight, what kind of bear is best?'}
      ]
    },
    {
      name: 'Party Planning',
      messages: [
        {name: 'Phyllis', content: 'We\'re doing the best we can, @Michael.'},
        {name: 'Angela', content: 'Stop it @Michael!'},
        {name: 'Michael', content: 'Happy Birthday Jesus. Sorry your party sucked.'}
      ]
    }
  ];
}

function changeRoom(name) {
  store.dispatch({
    type: 'CHANGE_ROOM',
    room: name
  });

  store.dispatch({
    type: 'READ_MESSAGES',
    room: name
  });
}

function updateName(e) {
  store.dispatch({
    type: 'UPDATE_NAME',
    name: e.target.value
  });
}

function updateMessage(e) {
  store.dispatch({
    type: 'UPDATE_MESSAGE',
    message: e.target.value
  });
}

function sendMessage() {
  store.dispatch({
    type: 'SEND_MESSAGE'
  });
}

(function intializeStore() {
  var rooms = getRooms();
  rooms.forEach(function(room) {
    store.dispatch({
      type: 'CREATE_ROOM',
      name: room.name
    });

    room.messages.forEach(function(message) {
      store.dispatch({
        type: 'CREATE_MESSAGE',
        room: room.name,
        name: message.name,
        content: message.content
      });
    });
  });

  changeRoom(rooms[0].name);
}());

function render() {
  ReactDOM.render(
    <Application
      rooms={store.getState().rooms}
      changeRoom={changeRoom}
      name={store.getState().name}
      updateName={updateName}
      message={store.getState().message}
      updateMessage={updateMessage}
      sendMessage={sendMessage}
    />,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
