/**
 * @TODO get a reference to the Firebase Database object
 */

const database = firebase.database().ref();

/**
 * @TODO get const references to the following elements:
 *      - div with id #all-messages
 *      - input with id #username
 *      - input with id #message
 *      - button with id #send-btn and the updateDB
 *        function as an onclick event handler
 */

const allMessages = document.getElementById('all-messages');
const usernameElem = document.getElementById('username');
const messageElem = document.getElementById('message');

/* Add Reference to Profile Image Input */
const profileElem = document.getElementById('profile');

const sendBtn = document.getElementById('send-btn');
sendBtn.onclick = updateDB;

/**
 * @TODO create a function called updateDB which takes
 * one parameter, the event, that:
 *      - gets the values of the input elements and stores
 *        the data in a temporary object with the keys USERNAME
 *        and MESSAGE
 *      - console.logs the object above
 *      - writes this object to the database
 *      - resets the value of #message input element
 */

async function updateDB(event) {
  // Prevent default refresh
  event.preventDefault();

  if (usernameElem.value == '' || messageElem.value == '') {
    alert('Please enter something');
  } else {
    /* Time handling! */

    // Get the UNIX timestamp
    let now = new Date();

    console.log(now);

    let date = now.toLocaleDateString();

    let time = now.toLocaleTimeString();

    // To only include hours and minutes, add:
    //
    //  navigator.language, {
    //   hour: '2-digit',
    //   minute: '2-digit',
    // }
    //
    // to parameter of toLocaleTimeString();

    /* Profile Image Handling */

    // Declare a profile variable we can either use user input for, or a random Dog
    let profile;

    // If profileElem.value has value, store in variable for database

    if (profileElem.value) {
      profile = profileElem.value;
    } else {
      // Otherwise, select a random image from Dog API
      await fetch('https://dog.ceo/api/breeds/image/random')
        .then(function (response) {
          // .json() parses a JSON file so it's usable by JavaScript
          return response.json();
        })
        .then(function (myJSON) {
          // Assign profile to random dog url (inside "message")
          profile = myJSON.message;
        });
    }

    // Create data object
    const data = {
      USERNAME: usernameElem.value,
      MESSAGE: messageElem.value,
      DATE: date,
      TIME: time,
      PROFILE: profile,
    };

    // console.log the object
    console.log(data);

    // GET *PUSH* PUT DELETE
    // Write to our database
    database.push(data);

    // Reset message AND keep profile image the same
    messageElem.value = '';
    profileElem.value = profile;
  }
}

/**
 * @TODO add the addMessageToBoard function as an event
 * handler for the "child_added" event on the database
 * object
 */

database.on('child_added', addMessageToBoard);

/**
 * @TODO create a function called addMessageToBoard that
 * takes one parameter rowData which:
 *      - console.logs the data within rowData
 *      - creates a new HTML element for a single message
 *        containing the appropriate data
 *      - appends this HTML to the div with id
 *        #all-messages (we should have a reference already!)
 *
 */

function addMessageToBoard(rowData) {
  // Store the values of rowData inside object named 'data'
  const data = rowData.val();

  // console.log data
  console.log(data);

  // Create a variable named singleMessage
  // that stores function call for makeSingleMessageHTML()
  let singleMessage = makeSingleMessageHTML(
    data.USERNAME,
    data.MESSAGE,
    data.DATE,
    data.TIME,
    data.PROFILE
  );

  // Append the new message HTML element to allMessages
  allMessages.append(singleMessage);
}

/**
 * @TODO create a function called makeSingleMessageHTML which takes
 * two parameters, usernameTxt and messageTxt, that:
 *      - creates a parent div with the class .single-message
 *
 *      - creates a p tag with the class .single-message-username
 *      - update the innerHTML of this p to be the username
 *        provided in the parameter object
 *      - appends this p tag to the parent div
 *
 *      - creates a p tag
 *      - updates the innerHTML of this p to be the message
 *        text provided in the parameter object
 *      - appends this p tag to the parent div
 *
 *      - returns the parent div
 */

function makeSingleMessageHTML(
  usernameTxt,
  messageTxt,
  dateTxt,
  timeTxt,
  profileTxt
) {
  // Create Parent Div
  let parentDiv = document.createElement('div');
  // Add Class name .single-message
  parentDiv.className = 'single-message';

  /* NEW IMAGE ELEMENT */

  // Create Profile Img element
  let profileImg = document.createElement('img');
  // Add Class name single-message-img
  profileImg.className = 'single-message-img';
  // Add database URL to src
  profileImg.src = profileTxt;

  /* NEW HEAD DIV FOR USERNAME AND TIMESTAMP */

  // Create Head Div
  let headDiv = document.createElement('div');
  // Add Class name single-message-head
  headDiv.className = 'single-message-head';

  /* DATE AND TIME ELEMENTS */

  // Create Date P Tag
  let dateP = document.createElement('p');
  // Add the date data to P tag
  dateP.innerHTML = dateTxt;
  // Add Class name single-message-timestamp
  dateP.className = 'single-message-timestamp';

  // Create Time P Tag
  let timeP = document.createElement('p');
  // Add the time data to P tag
  timeP.innerHTML = timeTxt;
  // Add Class name single-message-timestamp
  timeP.className = 'single-message-timestamp';

  // Create Username P Tag
  let usernameP = document.createElement('p');
  usernameP.className = 'single-message-username';
  usernameP.innerHTML = usernameTxt + ':';

  headDiv.append(usernameP, dateP, timeP);

  // Create message P Tag
  let messageP = document.createElement('p');
  messageP.innerHTML = messageTxt;
  parentDiv.append(profileImg, headDiv, messageP);

  // Return Parent Div
  return parentDiv;
}

/**
 * @BONUS add an onkeyup event handler to the form HTML
 * element so the user can also submit the form with the
 * Enter key
 *
 * @BONUS use an arrow function
 *
 */

const handleEnterKey = (event) => {
  if (event.key === 'Enter') {
    updateDB(event);
  }
};

usernameElem.addEventListener('keydown', handleEnterKey);
messageElem.addEventListener('keydown', handleEnterKey);

/**
 * FOR INSTRUCTOR PURPOSES ONLY - CLEARING MESSAGES EVERY 30 MINUTES
 */
// Function to clear the chat messages (you don't need to teach this!)
function clearChat() {
  // Clear the Firebase database
  database
    .remove()
    .then(() => {
      // Clear the chat display
      allMessages.innerHTML = '';
      console.log('Chat messages cleared successfully.');
    })
    .catch((error) => {
      console.error('Error clearing chat messages:', error);
    });
}

// Set a timeout to clear chat messages after fifteen minutes (900000 milliseconds)
setTimeout(clearChat, 900000);

/* For Checking Images */

/**
 * You can actually check to see if an image that was uploaded is a valid image or not
 *
 * To do so, there's a nifty function someone wrote up as a solution
 * on Stackoverflow:
 *
 * You can add this function in your code:
 * 
 * function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
  }
 *  
 * And it'll check if your image loads or causes an error
 * If the 'good' and 'bad' parameters can be functions that you use to return something
 * So if the image loads (onload) you can call a function that returns TRUE
 * If the image doesn't load (onerror) you can all a function that returns FALSE
 * 
 * That way, you can check in a conditional to see if the image is valid like so:
 * 
 * if (checkImage(profileElem.value, function () {return true;}, function () {return false;}))
 * 
 * 
 * 
*/
