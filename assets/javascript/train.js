$(document).ready(function(){
    //Initialize Firebase
    var config = {
    apiKey: "AIzaSyAywpU_AatnYbwkGFIDMKco4cd6sP15KLc",
    authDomain: "exampleproject-7a290.firebaseapp.com",
    databaseURL: "https://exampleproject-7a290.firebaseio.com",
    projectId: "exampleproject-7a290",
    storageBucket: "",
    messagingSenderId: "882140637107",
    appId: "1:882140637107:web:ec8edb86d9c1b63f"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    //Set the current time to this variable and show it
    var timeRN = new Date();
    $("#currentTime").text("Current Time: "+timeRN);

    //User's input variables or initial values
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";

    //when the submit button is clicked
    $("#submitInfo").on('click', function(event) {
        event.preventDefault();
        //assign these values on these specified places (and remove spaces)
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();

        //code for the push of the values that the user's 
        //entries assign to these variables
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });
    //clear user's input info
    $("#clearInfo").on('click', function(event){
        event.preventDefault();
        $("td").empty();
        database.ref().set("/", null)
    })

    // Firebase watcher + initial loader. Retrieve the data
    // from the database (both initially and every time
    // something changes), then store the data inside the variable "childSnapshot".
    // We could rename "snapshot" to anything.
    database.ref().on("child_added", function(childSnapshot){
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().trainName);
        // console.log(childSnapshot.val().destination);
        // console.log(childSnapshot.val().trainTime);
        // console.log(childSnapshot.val().frequency);

        //this is the time that the user inputs
        var userTime = moment(childSnapshot.val().trainTime, "hh:mm")
        //console.log(userTime);
        //calculating the time now (moment()) between the user's time in minutes
        var difference = moment().diff(moment(userTime), "minutes");
        //console.log(difference);
        //calculates how much time is left based on the time and how frequenctly it comes (minutes)
        var timeRemaning = difference%childSnapshot.val().frequency;
        //console.log(timeRemaning);
        var minsAway = childSnapshot.val().frequency - timeRemaning;
        //console.log(minsAway);
        var nextTrain = moment().add(minsAway, "minutes");
        // console.log(nextTrain);

        var addRow = $("<tr></tr>")
        //adding each individual cell(td) to each row(tr)
        addRow.append("<td>" + childSnapshot.val().trainName + "</td>")
        .append("<td>" + childSnapshot.val().destination + "</td>")
        .append("<td>" + childSnapshot.val().trainTime + "</td>")
        .append("<td>" + childSnapshot.val().frequency + "</td>")
        .append("<td>" + moment(nextTrain).format("hh:mm") + "</td>")
        .append("<td>" + minsAway + "</td>");
        $(".table").prepend(addRow);
    });
});