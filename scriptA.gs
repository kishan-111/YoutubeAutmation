//Global variables
let botToken = "YOUR-TELEGRAM-BOT-TOKEN"; //bot token
let chatId = "CHAT-ID"; //bot chat id

let form = FormApp.openById('FORM-ID'); // Form ID
let sheet = SpreadsheetApp.openByUrl('DOC-ID'); //Spreadsheet of Form

let unique_col_ID="I";           //Unique ID for each request
let no_of_fields= 8;             //Total field in Google form including timestamp
let email_col = "B";              //Column Number of Email Address [1 index]
let status_col = "L";

//function called after submit

function onFormSubmit(event) {
  record_array = []
  var last_response_row = sheet.getLastRow();                                 // Fetching the total number of rows in spreadsheet
  last_response_row = last_response_row.toString();                                       // Coverting format of lastRow to string
  // console.log(last_response_row);
  var range = sheet.getRange(last_response_row+":"+last_response_row);                  // Fetching the details of last resopnse
  var fields = sheet.getRange("1:1").getValues();                     // Fetching all the field of spreadsheet
  var values = range.getValues();                                   // Getting all the values of each field
  var details_for_bot = "";                             // details_for_bot is the message which will be sent to bot
  var details_for_mail= "";                                         //details_for_mail is for sending the submitted details to requestor

  // Combining all the details of the request
  for(let x=1;x<no_of_fields;x++){
    details_for_mail += "\n"+x+".) "+fields[0][x]+" : "+values[0][x];
  }

  details_for_bot = "Hare Krishna, New Youtube Request as Follows : \nUNIQUE ID of LECTURE : "+ last_response_row + "\nDetails from Form : \n";
  details_for_bot = details_for_bot + details_for_mail;
  details_for_bot += "\n\nPlease Approve or Reject this request ASAP."

  // Logger.log(details_for_bot);
  details_for_bot = encodeURIComponent(details_for_bot);

  // for adding buttons to the message
  var keyboard = [
    [{text: 'Approve', callback_data: 'approve'}, {text: 'Reject', callback_data: 'reject'}]
  ];

  var replyMarkup = JSON.stringify({inline_keyboard: keyboard});
  replyMarkup = encodeURIComponent(replyMarkup);                                  //encoding the message to be sent

  //url to send message to the bot
  var url = "https://api.telegram.org/bot" + botToken + "/sendMessage?chat_id=" + chatId + "&text=" + details_for_bot + "&reply_markup=" + replyMarkup;
  var response = UrlFetchApp.fetch(url);

  sheet.getRange(unique_col_ID + last_response_row).setValue(last_response_row);  //updating the sheet that form is submitted
  sheet.getRange(status_col + last_response_row).setValue("Requested");

  welcome_note = "Hare Krishna Prabhu, we have recently obtained your request for scheduling lecture on youtube via our automated platform, your request is being verified, just for your reference the details are as follows : \n\n" ; 

  ending_note = "\n\nNOTE 1 : This is an automated email, please do not reply without emergency, we do not see replies regularly." ; 
  ending_note += "\nNOTE 2 : Usually it may take up to 12-24 hours for approval of your request, if it is emergency please contact Mohit Kumar 67XXXXXXXXXX " ; 
  ending_note += "\n\nIn your service, \nSankhya Team 😇" ; 

  //Sending mail to the End User
  var recipient_mail = sheet.getRange(email_col + last_response_row).getValue();
  MailApp.sendEmail(recipient_mail, "Updates on Lecture Schedule Request", welcome_note + details_for_mail + ending_note);

  //Printing the final response
  // Logger.log(response.getContentText());
 }
