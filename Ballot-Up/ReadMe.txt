Work-Flow Instructions:
• Compile the Contracts:
o Cd to ballot contract Folder
o Compile the contracts using truffle migrate –reset command
• Open Ganache and Set Up Metamask
• Compiling Front-End
o Cd to ballot-up
o Use the command NPM Install
o Use the command NPM Run
• Go to http://localhost:3000/ to open the web page
• Now How to Use the Contract
a. First enter the address of the voter to verify the correct address
b. Enter the age (Should be above 18 otherwise contract will throw an error)
c. Enter Membership Details (Should be member of coindeal.com otherwise contract will throw an error) (Input should be 0 or 1)
d. Enter if you have Voted Before (A member can Vote Maximum 4 times)
e. Register Yourself as a voter
f. Change the State to Voting State
g. Vote for a Particular Cryptocurrency
h. Remember one voter can vote maximum 4 times
i. Once you are done change the state to declaration
j. Click the “Show the winner button” to see the result.