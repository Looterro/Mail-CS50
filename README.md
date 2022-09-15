# Mail-CS50

Harvard's CS50 Project 3 - Mailbox Clone. Its a single page app written using Django framework, built-in API and JS language.

Full specification, API description and setup: https://cs50.harvard.edu/web/2020/projects/3/mail/

## Setup

Clone this repository and change directory to mail:

```bash
git clone https://github.com/Looterro/Mail-CS50.git
cd mail
```

Install Django:
```bash
python3 -m pip install Django
```

Run the development server using command:
```bash
python manage.py runserver
```

## Specification:

**Send Mail**: 
- When a user submits the email composition form, the app uses JavaScript code to actually send the email through a POST request to /emails, passing in values for recipients, subject, and body.
- Once the email has been sent, app loads the user’s sent mailbox.

**Mailbox**: 
- When a user visits their Inbox, Sent mailbox, or Archive, app loads the appropriate mailbox through a GET request to /emails/<mailbox>.
- When a mailbox is visited, the application should first query the API for the latest emails in that mailbox.
- When a mailbox is visited, the name of the mailbox should appear at the top of the page.
- Each email should be rendered in its own box that displays who the email is from, what the subject line is, and the timestamp of the email.
- If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.

**View Email**: 
- When a user clicks on an email, the user should be taken to a view where they see the content of that email through a GET request to /emails/<email_id>.
- The view displays the email’s sender, recipients, subject, timestamp, and body.
- Once the email has been clicked on, the app should mark the email as read through a PUT request to /emails/<email_id>.

**Archive and Unarchive**: 
- Users can archive and unarchive emails that they have received.
- When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
- A PUT request is sent to /emails/<email_id> to mark an email as archived or unarchived.
  
**Reply**: 
- Users can reply to an email.
- When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
- When the user clicks the “Reply” button, they should be taken to the email composition form.
- The composition form is pre-filled with the recipient field set to whoever sent the original email.
- The subject line is also pre-filled. If the original email had a subject line of "baz", the new subject line should be "Re: baz". (If the subject line already begins with "Re: ", it doesnt add up)
-The body of the email is pre-filled with a line like "On Jan 1 2020, 12:00 AM(timestamp) foo@example.com(email user) wrote:" followed by the original text of the email.
