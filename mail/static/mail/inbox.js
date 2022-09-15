document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');

  // Submit email

  document.querySelector('#compose-form').onsubmit = function() {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
      })
    })
    .then(response => response.json())
    .then(result => {
      //print result
      console.log(result);
    })
    .then(response => load_mailbox('sent'))
    .catch(error => {
      console.log('Error', error);
    });

    return false;
  }

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Clear out reply form changes
  document.querySelector('#form-title').innerHTML = "New Email";
  document.getElementById("compose-recipients").disabled = false;
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load mailbox
  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);

    // Display emails
    emails.forEach(email => {
      const element = document.createElement('div');
      // Checking if email was read or not and assigning appropriate color
      element.style = email['read'] ? "background-color: #c3c3c3ea;" : "background-color: white;";
      element.innerHTML = `<span id="sender"><b>${email['sender']}</b></span> <span id="subject">${email['subject']}</span> <span id="timestamp">${email['timestamp']}</span>`;
      element.addEventListener('click', function() {
          console.log('This element has been clicked!');
          view_email(email['id']);
      });
      document.querySelector('#emails-view').append(element);
    });

  });
}

function view_email(id) {

  // Show the email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Load the email with provided id

  fetch('/emails/' + id)
  .then(response => response.json())
  .then(email => {

    // Print email
    console.log(email);
    
    document.querySelector('#email-view').innerHTML = `
      <ul class="list-group">
        <li class="list-group-item"><b>From: </b>${email['sender']}</li>
        <li class="list-group-item"><b>To: </b>${email['recipients']}</li>
        <li class="list-group-item"><b>Subject: </b>${email['subject']}</li>
        <li class="list-group-item"><b>Timestamp: </b>${email['timestamp']}</li>
      </ul>
      <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
      <button class="btn btn-sm btn-outline-primary" id="add_to_archive"></button>
      <button class="btn btn-sm btn-outline-primary" id="read_toggle">Mark as Unread</button>
      <hr>
      <p>${email['body']}</p>
      `;
    
    // Reply button onclick function
    document.querySelector('#reply').addEventListener('click', function() {
      console.log('This element has been clicked!');
      compose_email();
      console.log(email['subject'])
      // Populate form with reply information
      document.querySelector('#form-title').innerHTML = `Reply to ${email['sender']}`;
      document.querySelector('#compose-recipients').value = email['sender'];
      document.getElementById("compose-recipients").disabled = true;

      // Check if subject is "RE:"
      if (email['subject'].slice(0,3) != "Re:"){
        document.querySelector('#compose-subject').value = `Re: ${email['subject']}`;
      } else {
        document.querySelector('#compose-subject').value = email['subject']
      };

      // Populate body with former message and make space for the new one:
      document.querySelector('#compose-body').value = `\r\n \r\n | On ${email['timestamp']} ${email['sender']} wrote: ${email['body']}`;

    });

    // Archive button onclick function
    document.querySelector('#add_to_archive').addEventListener('click', function() {
      console.log('This element has been clicked!');

      // Change archive status after click
      if (email['archived']) {
        email['archived'] = false;
      } else {
        email['archived'] = true;
      }
      console.log(email['archived']);

      // Put email in the archive box and load inbox mailbox
      fetch('/emails/' + email['id'], {
        method: 'PUT',
        body: JSON.stringify({
            archived: email['archived']
        })
      })
      .then(response => load_mailbox('inbox'))
    });

    // Toggle add_to_archive button name

    if (!email['archived']) {
      document.querySelector('#add_to_archive').innerHTML = `Archive`;
      } else {
      document.querySelector('#add_to_archive').innerHTML = `Unarchive`;
      }
    
    // Hide archive button in Sent mailbox, unless its a mail sent to oneself

    const user_email = document.getElementById('email-user').value;
    if (user_email == email['sender'] && user_email != email['recipients']) {
      document.getElementById('add_to_archive').style.display = "none";
    }

    // Mark email as read after opening it

    fetch('/emails/' + email['id'], {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })

    // Unread toggle button function
    document.querySelector('#read_toggle').addEventListener('click', function() {
      
      fetch('/emails/' + email['id'], {
        method: 'PUT',
        body: JSON.stringify({
            read: false
        })

      })
      .then(response => load_mailbox('inbox'))
    });

  });

}
