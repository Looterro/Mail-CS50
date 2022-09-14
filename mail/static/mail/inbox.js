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
      <button class="btn btn-sm btn-outline-primary" id="add_to_archive">Archive</button>
      <button class="btn btn-sm btn-outline-primary" id="unread">Mark as Unread</button>
      <hr>
      <p>${email['body']}</p>
      `;
    
      // Reply button onclick function
      document.querySelector('#reply').addEventListener('click', function() {
          console.log('This element has been clicked!');
      });

    });

}
