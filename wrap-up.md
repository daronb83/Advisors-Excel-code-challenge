## Questions

### What issues, if any, did you find with the existing code?
 - There was a lot of redundant code that needs/needed refactoring
 - The AccountDashboard component is far too big and should be broken down into smaller components.
 - The client has too much access to the backend. 
 - The original code was updating the account name and type every time a transaction occurred.
 - etc

### What issues, if any, did you find with the request to add functionality?
 - The backend (db) does not currently support transaction records or accumulated transaction amounts

### Would you modify the structure of this project if you were to start it over? If so, how?
 - I would if we were going to expand on the project beyond a simple interview challenge. For the purposes of this excercise, it's probably fine.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
 - Validating the daily withdrawal limit is currently incomplete and insecure. 
   - I didn't add server support for transaction records, so we're limited to client side validation.
   - The basic client validation I implemented won't last beyond the current session.
 - I wanted to refactor the AccountDashboard into smaller components but ran out of time. There really, really
   ought to be a "transaction card" component (at the very least.)

### If you were to continue building this out, what would you like to add next?
 - Server support for transaction records (and the above mentioned validation.)
 - Viewable list of recent transactions.
 - We could address possible concurrency issues.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
 - Happy Holidays!