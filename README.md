# YoutubeAutmation
Youtube Automation System
Introduction: 
 During my internship, I had the opportunity to develop a pipelined automation system that revolutionized the livestream lecture scheduling process on YouTube. The system significantly improved productivity within the company by streamlining the request handling, decision-making, and notification processes.
Request Process: The automation system is designed to seamlessly handle incoming livestream lecture scheduling requests. When a requester submits a request, it is instantly forwarded to a dedicated Telegram channel, where the relevant team members can review it
Accept/Reject Mechanism: To simplify the decision-making process, the system incorporates a straightforward accept or reject mechanism. Those responsible for reviewing the requests can easily access the Telegram channel and make their decision with a simple click.
Email Notifications: Upon a decision being made, the automation system promptly sends email notifications to the requester. If a request is accepted, the system automatically generates an email containing the lecture details, such as the stream URL and stream key, and sends it to the requester. In case a request is rejected, an email is sent to the requester, providing them with a courteous explanation for the rejection.
Tracking and Logging: One of the system's notable features is its comprehensive tracking and logging capabilities. It meticulously records and logs all the details of each requested lecture, including the acceptor or rejector. This ensures transparency, accountability, and easy monitoring of the request process.
Error Recovery Mechanism: Recognizing the importance of a robust and fault-tolerant system, I incorporated an error recovery mechanism to mitigate potential issues. In the case of any errors or exceptional situations, the system is designed to handle them gracefully, minimizing disruptions and ensuring smooth operation.
Impact and Results: The implementation of this automation system resulted in a substantial increase in company productivity. By streamlining the entire livestream lecture scheduling process, we experienced significant time savings and improved efficiency. This allowed the team to focus on other critical tasks, fostering growth and success within the organization
TECHNOLOGY: 
The whole code is written in Google App Script 
Google form API and spreadsheet has been used to store the details about the each request along with their current state
Telegram API has been used to integrate it with telegram
Youtube API and Email API has been used to process the scheduling request and sending corresponding response to the user
It is hosted on the google app script interface itself
