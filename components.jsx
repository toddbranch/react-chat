var store = Redux.createStore(reducer);

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
    var messages = _.filter(this.props.messages, function(message) {
      return message.room === room;
    });

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
              value={this.props.content}
              onChange={this.props.updateContent}
            />
            <button onClick={this.props.sendMessage}>Send</button>
          </div>
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
        <Message
          className="recent"
          message={messages[0]}
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

// this will be replaced with a call to the endpoint
function getMessages() {
  return [
    {name: 'Jim', content: '@Dwight, what kind of bear is best?', room: 'Sales'},
    {name: 'Dwight', content: '@Jim stupid question.', room: 'Sales'},
    {name: 'Jim', content: '@Dwight false.  The answer is Black Bear.  Fact: bears eat beats.  Bears.  Beets.  Battlestar Gallactica.', room: 'Sales'},
    {name: 'Dwight', content: '@Michael!', room: 'Sales'},
    {name: 'Michael', content: 'Happy Birthday Jesus. Sorry your party sucked.', room: 'Party Planning'},
    {name: 'Angela', content: 'Stop it @Michael!', room: 'Party Planning'},
    {name: 'Phyllis', content: 'We\'re doing the best we can, @Michael.', room: 'Party Planning'},
  ];
}

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
  store.dispatch({
    type: 'SEND_MESSAGE'
  });
}

function changeRoom(room) {
  store.dispatch({
    type: 'CHANGE_ROOM',
    room: room
  });
}

(function intializeStore() {
  var messages = getMessages();

  messages.forEach(function(message) {
    store.dispatch({
      type: 'CREATE_MESSAGE',
      name: message.name,
      content: message.content,
      room: message.room
    });
  });

  changeRoom(messages[0].room);
}());

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
