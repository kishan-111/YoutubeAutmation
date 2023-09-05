//Global variables
let token = "BOT_TOKEN";  //bot token
let chatId = "CHAT-ID"; //bot chat id
let sheet = SpreadsheetApp.openByUrl("SHEET-URL"); //sheet where you want to store data

let webAppUrl = "CURRENT-SCRIPT-URL"; //Google script url


let teacher = "D";
let video_title = "E";     
let reason_for_lecture_col = "F";        
let lecture_date_and_time = "G";
let lecture_type_col = "H";
let lecture_link = "J";
let lecture_stream = "K";
let status_col = "L";
let reactor_col = "M";
let email_col = "B" ; 
let stream_url_col = "N" ;
let reaction_time_col = "O" ; 
let comments = "P" ; 


welcome_note = "Hare Krishna Prabhu." ; 
approval_note = "\nYour one of the recent requests for scheduling youtube lecture has been APPROVED. Please find the lecture streaming details below : \n\n" ; 
rejection_note = "\nYour one of the recent requests for scheduling youtube lecture has been REJECTED, please find details below : \n\n" ; 

ending_note = "\n\nNOTE: This is an automated email, please do not reply without emergency, we do not see replies regularly." ;
ending_note += "\n\nIn your service, \nSankhya Team 😇" ; 



//this function used is mainly used to get chatID
function getMe() {
  let response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/getMe");
  console.log(response.getContentText());
}


//this function is used to set webhook which means that now all the actions on telegram will be forwarded to this script
function setWebhook() {
  let response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/setWebhook?url=" + webAppUrl);
  console.log(response.getContentText());
}

//deleteWebhook() function to used to delete the webhook
function deleteWebhook() {
  let response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/deleteWebhook?url=" + webAppUrl);
  console.log(response.getContentText());
}

//sendText() function is for sending the message to the user
function sendText(text) {
  text = encodeURIComponent(text);
  var url = "https://api.telegram.org/bot" + token + "/sendMessage?chat_id=" + chatId + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response);
}

//deleteText() function is for deleting sent message to the user
function deleteText(messageId) {
  var url = "https://api.telegram.org/bot" + token + "/deleteMessage?chat_id=1367186743&message_id=" + String(messageId);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response);
}

//function to schedule lecture according to given details
function scheduleYTBroadcast(title,scheduledTime,type){

  // Create the YouTube Live event
   var liveBroadcast = YouTube.LiveBroadcasts.insert({
    "snippet": {
      "title": title,
      "description": title,
      "scheduledStartTime": scheduledTime,
    },
    "status": {
      "privacyStatus": type,
      "selfDeclaredMadeForKids": false
    },
    "contentDetails": {
      "enableAutoStart": true,
      "enableAutoStop": true
    }
  }, "snippet,status,contentDetails");
  
  var liveStream = YouTube.LiveStreams.insert({
    "snippet": {
      "title": title
    },
    "cdn": {
      "frameRate": "variable",
      "ingestionType": "rtmp",
      "resolution": "variable"
    }
  }, "snippet,cdn");

  YouTube.LiveBroadcasts.bind(liveBroadcast.id, "id", {
    "streamId": liveStream.id,
    "kind": "youtube#liveBroadcast"
  });
  
  const response = {
    audienceUrl: "https://www.youtube.com/watch?v=" + liveBroadcast.id,
    streamKey: liveStream.cdn.ingestionInfo.streamName,
    streamURL : liveStream.cdn.ingestionInfo.ingestionAddress
  }

  return response;
}

//this function is just for manually running our defined function
function myfunction(){
  // var description = sheet.getRange(lecture_description + '2').getValue();
  // console.log(description);
  // sheet.getRange(comments + 5).setValue("Step 4");
  // scheduleYTBroadcast('Demo Title','Demo Description', "Demo Teacher",'2023-07-12T12:11:00.0+05:30');
  // console.log(deleteText(1094));
}

//this function is used for sending updating spreadsheet, scheduling lecture and sending mail to the lecturer
function doPost(e) {
  let contents = JSON.parse(e.postData.contents);
  Logger.log(contents);
  if (contents.callback_query) {
    var data = contents.callback_query.data;               // approve or reject       
    var messageId = contents.callback_query.message.message_id; // collecting message id to delete the message after processing
    
    var details = String(contents.callback_query.message.text);  // it contains the details of the lecture
    var response_id = details.split("\n")[1].split(":")[1];      // decoding unique_col_id from the message
    response_id = String(parseInt(response_id));
    var reactor = contents.callback_query.from.first_name + "_" + contents.callback_query.from.last_name + "_" + contents.callback_query.from.username; // this is to store who has accepted or rejected the response

    old_agreement = sheet.getRange(status_col + response_id).getValue();

    if ( old_agreement == "Accepted")
      {
        reactor = sheet.getRange(reactor_col + response_id).getValue(); 
        react_time = sheet.getRange(reaction_time_col + response_id).getValue();
        sendText("The Request for UniqueId : " + response_id + " was already ACCEPTED by " + reactor + " on " + react_time + " so doing nothing.");
      }
    
    else if ( old_agreement == "Rejected")
      {
        reactor = sheet.getRange(reactor_col + response_id).getValue(); 
        react_time = sheet.getRange(reaction_time_col + response_id).getValue();
        sendText("The Request for UniqueId : " + response_id + " was already REJECTED by " + reactor + " on " + react_time + " so doing nothing.");
      }

    else if (data == 'approve') {

      //if the response from the admin is 'Apporve' then following things happens: 
      // this request as come for first time, so process this. 
      deleteText(messageId);
      
      sheet.getRange(status_col + response_id).setValue("Accepted");           // status is updated to "Accepted"
      sheet.getRange(reactor_col + response_id).setValue(reactor);             // username of acceptor is stored
      var actionTime = String( new Date() );
      sheet.getRange(reaction_time_col + response_id).setValue( actionTime );             // time of acceptor is stored

      var email = sheet.getRange(email_col + response_id).getValue(); // email of requestor is stored
      var title = sheet.getRange(video_title + response_id).getValue();
      var reason_for_lecture = sheet.getRange(reason_for_lecture_col + response_id).getValue();
      var lecture_type = sheet.getRange(lecture_type_col + response_id).getValue();
      var date_and_time = sheet.getRange(lecture_date_and_time + response_id).getValue();
      var teacherName = sheet.getRange(teacher + response_id).getValue();
      title = date_and_time.getFullYear() + "-" + String(date_and_time.getMonth()+1) + "-" + date_and_time.getDate()  + " | "   + title + " | " + "Speaker" + teacherName;
      var formated_time = convertTime(date_and_time);                             // converting the time format to scheduleYTBroadcast compatible

      var lecture_details = scheduleYTBroadcast(title,formated_time,lecture_type); // function is called based on details

      sheet.getRange(lecture_link+response_id).setValue(lecture_details.audienceUrl); //url of scheduled lecture is stored
      sheet.getRange(lecture_stream+response_id).setValue(lecture_details.streamKey); // stream key is scheduled
      sheet.getRange(stream_url_col+response_id).setValue(lecture_details.streamURL);

      // Compose and send the email to the teacher
      subject = "Your class is scheduled on YouTube Live";

      body = welcome_note + "\n\nYour class title {" + title + "} given by {" + teacherName + "} is scheduled on YouTube Live at {" + date_and_time + "}.\n\nYoutube Audience Link : " + lecture_details.audienceUrl + "\nStream Key : " + lecture_details.streamKey + "\nStream URL: "+ lecture_details.streamURL +"\n is successfully sceduled." + ending_note;


      GmailApp.sendEmail(email, subject, body);

      details_array = details.split("\n");
      details = "0.) " + details_array[1] + "\n" + details_array[4] + "\n" + details_array[5] + "\n" + details_array[6] + "\n" + details_array[7] + "\n" + details_array[8] + "\n" + details_array[9] + "\n"; 

      details += "10.) Lecture Link : " + lecture_details.audienceUrl + "\n11.) Stream URL : " + lecture_details.streamURL + "\n12.) Stream KEY : " + lecture_details.streamKey + "\n13.) Approved By : " + reactor + "\n14.) Action Time : " + actionTime  ; 

      sendText("ACCEPTED\n" + details + "\n\nNo Action Needed.");

    } else if (data == 'reject') {
      deleteText(messageId);
      sheet.getRange(status_col+response_id).setValue("Rejected");
      sheet.getRange(reactor_col+response_id).setValue(reactor);
      var actionTime = String( new Date() );
      sheet.getRange(reaction_time_col + response_id).setValue( actionTime );  

      details_array = details.split("\n");
      details = "0.) " + details_array[1] + "\n" + details_array[4] + "\n" + details_array[5] + "\n" + details_array[6] + "\n" + details_array[7] + "\n" + details_array[8] + "\n" + details_array[9] + "\n"; 

      details += "10.) Lecture Link : NA\n11.) Stream URL : NA\n12.) Stream KEY : NA."+ "\n13.) Rejected By : " + reactor + "\n14.) Action Time : " + actionTime  ; 

      sendText("REJECTED\n" + details + "\n\nNo Action Needed.");
      // sheet.getRange(comments + response_id).setValue("Step Bot Rejected Sent");

      var recipient = sheet.getRange(email_col + response_id).getValue(); // email of requestor is stored
      
      GmailApp.sendEmail(recipient,
                          "Regards youtube lecture Scheduling",
                              welcome_note + rejection_note + details + ending_note);   //send inform to the requestor about rejection of lecture

      // Logger.log("rejected"+"\n" + details);
      
    }
    else {
      sendText("Debug : \nData : " + data +"\nOld_Agreement : " + old_agreement);
      // sheet.getRange(comments + response_id).setValue("Debug : \nData : " + data + +"\nOld_Agreement : " + old_agreement);
    } 
  }
}

//this function is used to convert the format of date and time to required format for sceduling youtube stream
function convertTime(date_and_time) {
  date_and_time = new Date(); 
  mnth = ("0" + (date_and_time.getMonth() + 1)).slice(-2),
  day = ("0" + date_and_time.getDate()).slice(-2);
  date = [date_and_time.getFullYear(), mnth, day].join("-");
  
  hours = date_and_time.getHours();
  minute = date_and_time.getMinutes();
  second = date_and_time.getSeconds();
  time = [hours, minute, second].join(":"); 

  youtubeDateTime = date + "T" + time + ".0+05:30";
  // console.log(youtubeDateTime); 

  return youtubeDateTime; 
}




// Hare Krishna, some extra space is good. 
