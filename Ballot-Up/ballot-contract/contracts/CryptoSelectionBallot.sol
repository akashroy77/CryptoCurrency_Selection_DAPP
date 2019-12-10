pragma solidity ^0.5.2;
contract CryptoSelectionBallot {
   struct Voter {                     
        uint weight;
        uint8 age;
        uint8 isMember;
        uint8 voted;
        uint8 vote;
        bool isRegistered;
        uint max_vote;
    }
    
    struct Proposal {                  
        uint voteCount;
    }
    
    address chairperson;
    address voter_address;
    Proposal[] proposals;
    mapping(address => Voter) voters; 
    uint8 state=0; 
    
    //modifiers
   modifier validPhase(uint8 reqPhase) 
    { 
        require(state == reqPhase); 
        _; 
    } 
    
    modifier checkAge()
    {
        require(voters[voter_address].age >=19); 
        _;
    }
    modifier onlyChair() 
     {
         require(msg.sender == chairperson);
         _;
     }

    modifier onlyMemberOfCoinDeal()
    {
        require(voters[voter_address].isMember==1);
        _;    
    }
    
    modifier checkIsVoted()
    {
        require(voters[voter_address].voted==0);
        _;
    }
    
    modifier checkMaxVote()
    {
        require(voters[voter_address].max_vote<=4);
        _;
    }
   
   modifier checkRegister()
   {
       require(voters[voter_address].isRegistered==true);
        _;
   }
   constructor (uint8 numProposals) public  {
        chairperson = msg.sender;
        proposals.length = numProposals;
        voters[chairperson].weight = 4;
        state = 1;
    }
    
    function enterAddress(address voter) public{
        voter_address=voter;
    }
    function enterAge(uint8 _age) public {
        voters[voter_address].age=_age;
    }
    
    function enterMembershipDetails(uint8 _ismember) public{
        
        voters[voter_address].isMember=_ismember;
      
    }
    
    function enterVoteDetails(uint8 _isVotedAlready) public{
        voters[voter_address].voted=_isVotedAlready;
    }
    
    function registerAddress(address voter) checkAge onlyMemberOfCoinDeal checkAge public{
        voters[voter].isRegistered=true;
        voters[voter].max_vote=0;
    }

    function increaseNumberVote() private{
        voters[voter_address].max_vote=voters[voter_address].max_vote+1;
    }
    
    function change(uint8 x)  public {
           
        state = x;
    }
    
    function vote(uint8 toProposal)  public checkRegister validPhase(2) checkMaxVote{
      
        Voter memory sender = voters[voter_address];
        
        require (toProposal < proposals.length); 
        enterVoteDetails(1);
        increaseNumberVote();
        voters[voter_address].vote = toProposal;   
        proposals[toProposal].voteCount += 1;
    }
    
    function reqWinner() public validPhase(3) view returns (uint8 winningProposal) {
       
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < proposals.length; prop++) 
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                winningProposal = prop;
            }
       assert(winningVoteCount>=1);
    }
  
}