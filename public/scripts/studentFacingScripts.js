/*
This is a file for student facing scripts.
*/

// A function to make sure student input is correct.
function validateForm () {
  var phone = document.forms["studentFF"]["phone"];
  var phoneLength = phone.value.replace(/\D/g, '').length;

  var email = document.forms['studentFF']["email"];

  /**
  A condition to check that the phone number ranges from at least 10 digits to at max 15 (the length of a complete international number).
  */
  if(phoneLength < 10 || phoneLength > 15){
    alert("Please enter a valid Phone Number.");
    phone.focus();
    return false;
  }

  /**
  Check to make sure the inputed email is correct.
  */
  if(!email.value.includes("@pugetsound.edu")){
    if(email.value.includes("@")){
      alert("Please enter a valid email.")
      email.focus();
      return false;
    }
  }
};

/**
A function that gets the users coordinates.
*/
function getLoc () {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLatLng);
  } else {
    console.log('geolocation not supported'); // add dummy vaues here
  }
};

function getLatLng (position) {
  document.getElementById('lat').value = position.coords.latitude;
  document.getElementById('lng').value = position.coords.longitude;
};
