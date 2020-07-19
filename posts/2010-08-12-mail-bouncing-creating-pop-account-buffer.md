---
title: "Mailbox overflow - Creating POP buffer account"
date: "2010-08-12"
---

Whilst talking to a cousin of mine, he told me about an email related problem which I found to be quite common (at least in my family). While travelling, or on holiday, they are unable to download their emails regularly. As their company's POP email inbox have very limited space, these accounts soon get full and emails to these accounts start bouncing. My cousin wanted a solution for this, possibly an automated service that would download their emails and empty the POP account.

I started looking around and soon concluded that I needed an online email client that would act as a buffer between the company's POP account and their Outlook/Mail client, preferably an account with a large inbox so the bouncing problem would not be an issue. I didn't had to go far for Gmail provided me with the best solution. Gmail has an option for setting up other POP accounts in its settings tab which allows us to 'pull' the email into the Gmail account, emptying the company's POP account in the process. Now since Gmail offers about 7.5 GB of space, it becomes an excellent buffer. Now all we have to do is that configure this Gmail account into our email client and download emails like before.

So now your mail will travel through the following flow chart before getting to you.

Email sent to @rastgar account -> Email appears in @rastgar sitemail -> Email is pulled, now appears in Gmail account, deleted from sitemail -> (by either IMAP or POP) downloaded to client, copy of that mail stays on Gmail, also shows in Outlook/Mail

You will no longer configure your email client to download emails from your company's (@rastgar.com) POP account.

Most of my friends and family are already forwarding their company's POP email to a Gmail account (for an online backup), so the configuration below first removes this forwarding, then we re-configure the same Gmail account to pull the email.

While configuring our email client (ie Outlook/Mail) we will have two options, first one is the IMAP configuration, this will simply 'sync' your emails rather than downloading them. This way when we delete the junk mail, and reply to emails everything will be updated on the Gmail account too. This means that there is now only one copy of your email and that is on Gmail, the one in your email client is NOT a copy, just a view of that email.

The second option is to tick 'leave a copy of the message on the server' while configuring Gmail as a POP account. This will download the email so that there are two copies for every email, one on Gmail and one in your email client (ie Outlook or Apple Mail). However this way the Gmail account will not be updated when you delete the junk mail and reply to emails on your email client.

**Setting up your email:**

Before starting close your email client, (ie Outlook or Apple Mail). Please make sure there is no unread email in it, since after configuration you will not be able to view them (for POP - since Gmail downloads the mail that comes in after POP is activated, unless selected otherwise)

**Removing your current forwarding:**

• Login into your email account at sitemail.hostway.com • Click Settings • Click Mail Forward (left column) • Remove forwarding email, click Save

**Setting up Gmail account:**

• Login into the forwarding account • Click on Settings (top right) • Click on 'Account and Imports' tab • Here under 'Check mail using POP3' click 'Add POP3 email account' • On the form that opens, enter your @rastgar.com email, click 'Next Step' • Enter your full email address in the username field, and your password • Rastgar POP server: pop.rastgar.com • Incase you are configuring more than one account on the same Gmail account, tick the third checkbox, 'Label incoming messages' • click Add Account, if asked to setup to send mail Select No. • You will now return to the settings page, and your email will be downloaded into this Gmail account. • Test if this is working fine. • (if you are planning to use the POP settings, go into 'Forwarding and POP/IMAP' tab and select 'Enable POP for mail that arrives from now on')

**Configuring your email client: (IMAP - Apple Mail)**

• Click on Mail (top left in Menu bar) • Click on Preferences • Click on Accounts tab • Disable @rastgar account by clicking on it and navigating to Advanced tab and unchecking enable this account • Use the '+' button to create a new account • Enter your name and Gmail email address • Click Create • Click on the account, change Email address to @rastgar.com • Your account is now configured

**Configuring your email client: (POP - Apple Mail)**

• Click on Mail (top left in Menu bar) • Click on Preferences • Click on Accounts tab • Disable @rastgar account by clicking on it and navigating to Advanced tab and unchecking enable this account • Use the '+' button to create a new account • Enter your name, @rastgar email address and password • Click Create • Select Account type POP • Add Gmail Inbox to description • Incoming mail server: pop.gmail.com • Username: @Gmail user name without @gmail.com, password: Gmail account password • Click continue (new form will open) • Enter Rastgar SMTP in description • Outgoing Mail Server: pop.rastgar.com • Check on 'Use only this server' • Check on 'Use Authentication' • Enter your @rastgar account details • Click Continue • Click Connect if asked to verify rastgar server • Click Create • Under Advanced tab, uncheck 'Remove copy from server after retrieving a message' • Close the window • Click Save • Your account is now configured
