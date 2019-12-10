App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:7545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);

        proposalsRow.append(proposalTemplate.html());
        App.names.push(data[i].name);
      }
    });
    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('CryptoSelectionBallot.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.vote.setProvider(App.web3Provider);
    return App.bindEvents();
  });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '#win-count', App.handleWinner);
    $(document).on('click', '#submit_add', function(){ var ad = $('#enter_address').val(); console.log(ad); App.handleAddress(ad); });
    $(document).on('click', '#ageSubmission', function(){ var ad = $('#age').val(); console.log(ad); App.handleAge(ad); });
    $(document).on('click', '#membershipSubmission', function(){ var ad = $('#membership').val(); console.log(ad); App.handleMembership(ad); });
    $(document).on('click', '#voteDetailsSubmission', function(){ var ad = $('#voteDetails').val(); console.log(ad); App.handleVoteDetails(ad); });
    $(document).on('click', '#registration', function(){ var ad = $('#enter_address').val(); console.log(ad); App.handleRegisterDetails(ad);});
    $(document).on('click', '#b1', function(){ console.log("clicked"); App.handleVote("0");});
    $(document).on('click', '#b2', function(){ console.log("clicked"); App.handleVote("1");});
    $(document).on('click', '#b3', function(){ console.log("clicked"); App.handleVote("2");});
    $(document).on('click', '#b4', function(){ console.log("clicked"); App.handleVote("3");});
    $(document).on('click', '#win-count', function(){ console.log("clicked"); App.handleWinner();});
    $(document).on('click', '#changeState1', function(){ console.log("clicked"); App.handleStateChange(2);});
    $(document).on('click', '#changeState2', function(){ console.log("clicked"); App.handleStateChange(3);});
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){ 
        if(web3.eth.coinbase != accounts[i]){
          optionElementFirst='<option value="'+accounts[1]+'">'+accounts[1]+'</option';
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
      jQuery('#chair_address').append(optionElementFirst); 
      App.chairPerson=$('#chair_address').val();
      console.log(App.chairPerson)
    });
  },

  handleAddress: function(addr){
    console.log(addr)
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.enterAddress(addr);
    }).then(function(result, err){
        if(result){
            debugger
            console.log(result.receipt.status)
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " Address Checking Done Successfully. This is a Valid Address")
            else
            alert(addr + " Address Checking failed due to revert. This is not a valid Address")
        } else {
            alert(addr + " Address Checking failed")
        }   
    });
},

handleAge: function(addr){
  if(addr<=18)
  {
    alert("Entered age is below 18. You must be above 18 to register.")
  }
  var voteInstance;
  App.contracts.vote.deployed().then(function(instance) {
    voteInstance = instance;
    return voteInstance.enterAge(addr);
  }).then(function(result, err){
      if(result){
          if(parseInt(result.receipt.status) == 1)
          alert(addr + " You have entered your age successfully . Please Proceed with further details ")
          else
          alert(addr + " Age Checking failed due to revert")
      } else {
          alert(addr + " Age Checking failed")
      }   
  });
},

handleMembership: function(addr){
  if(addr==0)
  {
    alert("You must be a member of coindeal.com to register")
  }
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.enterMembershipDetails(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " You have entered your membership details successfully . Please Proceed with further details ")
            else
            alert(addr + " membership details failed due to revert")
        } else {
            alert(addr + " membership details failed")
        }   
    });
  },

  handleVoteDetails: function(addr){
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.enterVoteDetails(addr);
    }).then(function(result, err){
        if(result){
            if(parseInt(result.receipt.status) == 1)
            alert(addr + " You have entered your previous voting details successfully . Please Proceed with further details ")
            else
            alert(addr + " previous voting details failed due to revert")
        } else {
            alert(addr + " previous voting details failed")
        }   
    });
  },

  handleRegisterDetails: function(addr){
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.registerAddress(addr);
      debugger
    }).then(function(result, err){
        if(result){
          debugger
          if(parseInt(result.receipt.status) == 1)
            alert(addr + " You have registered successfully . Please Proceed with further details ")
            else
            alert(addr + " Registration failed due to revert")
        } else {
            alert(addr + " registration failed")
        }   
    });
  },
  handleVote: function(addr){
    console.log(addr)
    debugger
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.vote(addr);
    }).then(function(result, err){
        if(result){
         if(parseInt(result.receipt.status) == 1)
            alert(" You have Voted successfully ")
            else
            alert(" Voting failed due to revert")
        } else {
            alert(" Voting  failed")
        }   
    });
  },

  handleStateChange: function(state){
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.change(state);
    }).then(function(result, err){
        if(result){
         if(parseInt(result.receipt.status) == 1)
            alert(" You have Changed successfully . Please Proceed with further details ")
            else
            alert(" State Change failed due to revert")
        } else {
            alert(" State Change failed")
        }   
    });
  },
  handleWinner : function() {
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.reqWinner();
    }).then(function(res){
    console.log(res);
    console.log(App.names[res-1])
      alert(App.names[res] + "  is the new upcoming cryptocurrency");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
