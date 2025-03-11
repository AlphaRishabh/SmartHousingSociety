const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const _ = require('lodash');
const session = require('express-session');
const passport = require('passport');
const user_collection = require("./models/userModel");
const society_collection = require("./models/societyModel");
const visit_collection = require("./models/visitModel");
const db = require(__dirname+'/config/db');
const date = require(__dirname+'/date/date');



const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
dotenv.config();

// Access environment variables
dotenv.config();
const stripe = require('stripe')(process.env.SECRET_KEY);
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;
const app = express()
app.set('view engine','ejs');
app.use(express.static('public'));
// Middleware to handle HTTP post requests
app.use(bodyParser.json()); // To handle JSON body

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret:"This is the secret key",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
db.connectDB()


async function runChat(userInput) {
	const genAI = new GoogleGenerativeAI(API_KEY);
	const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
	const generationConfig = {
	  temperature: 0.9,
	  topK: 1,
	  topP: 1,
	  maxOutputTokens: 1000,
	};
  
	const safetySettings = [
	  {
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
	  },
	  // ... other safety settings
	];
  
	const chat = model.startChat({
	  generationConfig,
	  safetySettings,
	  history: [
		{
		  role: "user",
		  parts: [
			{text: "Can u tell me about the services provided by u\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Absolutely! I'm thrilled to tell you about the services provided by Society-Housing! Think of us as your all-in-one platform for a smoother, more connected community living experience. We offer a range of features designed to make life easier for both residents and administrators.\n\n**For Residents (General Users):**\n\n*   **Community Connection:**  Easily connect and communicate with your neighbors within your housing society.\n*   **Digital Noticeboard:** Stay updated with all the latest notices, circulars, and announcements from your society, accessible anytime, anywhere. Never miss important updates again!\n*   **Online Bill Payment:** View your monthly maintenance bills, download them, and make secure payments online using your credit or debit card. Instant receipts are generated and available for download!\n*   **Complaint Management:**  Raise maintenance requests or any other complaints effortlessly and track their progress. Get updates on the status of your tickets!\n*   **Emergency Contacts:** Access a pre-configured list of important emergency contacts like the local police, ambulance, and pharmacy, ensuring you're always prepared.\n*   **Profile Management:**  Keep your profile up-to-date with your current information.\n*   **Lost and Found:** Raise complaints if you've lost something, and get notified if your item is found.\n\n**For Administrators (Management Committee):**\n\n*   **Account Management:** Approve new resident accounts for your community, ensuring only verified members join.\n*   **Digital Noticeboard:**  Upload notices, circulars, and announcements to a digital noticeboard that's easily accessible to all members 24/7.\n*   **Bill Management:** Generate maintenance bills instantly, track member dues, and manage online payments efficiently.\n*   **Complaint Management:**  Track all complaints raised by residents, provide feedback, and ensure quick resolutions.\n*   **Emergency Contacts:** Configure and update the list of emergency contacts for your society members.\n*   **Profile Management:**  Manage and update important details about your registered society.\n\nIn short, we aim to simplify communication, streamline payments, and ensure a well-managed, connected community. Whether you're a resident looking for convenience or an administrator seeking efficient tools, Society-Housing has you covered!\n\nDo you have any specific features or services you would like to know more about? I'm here to help and answer all your questions with lots of enthusiasm and joy!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "I have lost my phone what should i do now?"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Oh no! Losing your phone can be really stressful, I completely understand! But don't worry, here's what you can do using Society-Housing platform, and I'll guide you through it with lots of enthusiasm!\n\nFirst and foremost, let's use the **Lost and Found** feature!\n\nHere's how you can use it:\n\n1.  **Raise a Complaint:**\n    *   Log into your Society-Housing member account.\n    *   Navigate to the \"Lost and Found\" section or \"Complaint Management\" area (it might be under either, depending on how your society has set it up).\n    *   Raise a new complaint and specifically mention you have lost your phone.\n    *   Provide as many details as possible. This might include:\n        *   The make and model of your phone\n        *   The color and any distinguishing features (case, screen protector, etc.)\n        *   When and where you think you might have lost it.\n\n2.  **Information Gathering**\n    * Once you've raised the request, our system will register your complaint.\n    *  Our system will gather necessary info about your lost phone.\n\n3.  **Notification**\n    *   If someone has found your phone and registered it through the \"Lost and Found\" section, you'll be notified immediately!\n    *   The notification will include the details of the person who found your phone and how to get in touch with them.\n\n**Additional Steps to Consider:**\n\n*   **Contact Society Admin:** While the Lost and Found feature is handy, it's always a good idea to inform your society administrator about your lost phone as well. They might have other suggestions or be able to assist in other ways.\n\n*   **Try to Call Your Phone:** If you have access to another phone, try calling your phone! Sometimes it can be found nearby or someone can help you locate it.\n\n*   **Contact Your Service Provider:** If you are unable to find your phone, consider contacting your phone service provider to suspend your services to prevent misuse.\n\n*   **Consider Using Find My Device Services:** If you had set up a \"Find My Device\" feature (like Find My iPhone or Find My Device for Android), you might be able to use it to locate your phone, especially if it is still turned on.\n\nRemember, don't panic! We'll try our best to help you get your phone back. Society-Housing is here to assist you in these situations. I wish you all the best in finding your phone and if you need anything else, just ask! I'm here to help with a smile!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "I have lost my phone what should i do now?\n\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Oh no, that's definitely not a good feeling! Losing your phone can be super stressful, but don't worry, we're here to help you through it with lots of enthusiasm!\n\nHere's what you can do using Society-Housing and what we suggest you to do:\n\n**1. Report it Using the \"Lost and Found\" Feature:**\n\n*   **Login:** First, log into your Society-Housing member account.\n*   **Find the Section:** Go to the \"Lost and Found\" section or the \"Complaint Management\" area.\n*   **Create a New Complaint:**\n    *   Clearly state you've lost your phone.\n    *   Provide all the details you can think of:\n        *   Phone brand and model\n        *   Color and any unique features (like a specific case)\n        *   When and where you think you last had it\n*   **Submit:** Now send the complaint. We will register it in our system.\n\n**2. What Happens Next**\n    *   Your complaint will be registered in our system.\n    *   If someone has found your phone and reported it on the platform, we will notify you immediately!\n\n**3. Additional Things to Consider:**\n\n*   **Contact Your Society Admin:** Let your society administrator know about your lost phone. They can help in ways you might not have thought of.\n\n*  **Call Your Phone:** Use another phone to call yours! Someone might be able to pick up or locate the ringtone for you.\n\n*   **Contact Your Service Provider:** It's important to secure your phone by contacting your service provider. They can suspend your service to prevent any misuse.\n\n*   **Use \"Find My Phone\" Features:** If you set up \"Find My iPhone\" (iOS) or \"Find My Device\" (Android), see if you can track your phone's location.\n\nWe understand how frustrating this can be, but let's try our best to get your phone back. Society-Housing is here to support you. If you need anything else or have any questions, please don't hesitate to ask! We are here to help you with lots of joy and enthusiasm!\n"},
		  ],
		},


		{
			role: "user",
			parts: [
			  { text: "how can i contact the admin?" },
			],
		  },
		  {
			role: "model",
			parts: [
			  {
				text: `
				<p>Great question! Getting in touch with your society admin is usually quite straightforward with Society-Housing. There are a couple of ways you can do this, and I'll explain each with a big dose of enthusiasm!</p>
				<p><strong>1. Through the Complaint Management System (Ticket):</strong></p>
				<ul>
				  <li><strong>Log In:</strong> Start by logging into your Society-Housing member account.</li>
				  <li><strong>Find the Section:</strong> Locate the "Complaint Management" or "Raise a Ticket" section on your dashboard.</li>
				  <li><strong>Create a New Ticket:</strong>
					<ul>
					  <li>Choose an appropriate category for your query (e.g., "General Inquiry," "Account Issue," etc.). If you don't see a specific category, there's usually a "General" option.</li>
					  <li>Write a clear and concise message outlining your query or the reason you're trying to reach the admin.</li>
					  <li>Make sure to include your contact details for follow-up.</li>
					</ul>
				  </li>
				  <li><strong>Submit:</strong> Once you're satisfied with your message, click "Submit" to send your ticket.</li>
				  <li><strong>Tracking:</strong> Once the ticket is submitted, you can always track its status.</li>
				</ul>
				<p>This method is fantastic because it allows the admin to track your issue and ensures that your message is documented and won't be overlooked.</p>
		  
				<p><strong>2. Check for Direct Contact Information in the App:</strong></p>
				<ul>
				  <li><strong>Profile Page:</strong> Check your Society-Housing platform; there might be admin contact info under the profile section.</li>
				</ul>
		  
				<p><strong>3. Check the Emergency Contact Section:</strong></p>
				<ul>
				  <li>The admin might include their direct number under emergency contacts.</li>
				</ul>
		  
				<p><strong>Important Notes:</strong></p>
				<ul>
				  <li><strong>Response Time:</strong> Keep in mind that the admin might be volunteers, so the response might be delayed.</li>
				  <li><strong>Be Clear:</strong> Always be clear and concise when contacting the admin. This will help them understand your issue better and address it more efficiently.</li>
				</ul>
		  
				<p>I hope this helps you connect with your admin! If you have any other questions, feel free to ask. I'm always here to help with excitement!</p>
				`
			  }
			]
		  },


		{
		  role: "user",
		  parts: [
			{text: "i need emrgency contacts number \n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: `<p>Okay! I understand you need emergency contact numbers, and I'm here to help you with a burst of enthusiasm!</p>

			<p>Here's how you can typically find the emergency contact numbers within Society-Housing:</p>
			
			<h3><strong>1. Locate the "Emergency Contacts" Section:</strong></h3>
			<ul>
			  <li><strong>Log in:</strong> Log in to your Society-Housing member account.</li>
			  <li><strong>Look for the Section:</strong> Look for a section labeled "Emergency Contacts" or something similar. It's usually prominently placed for quick access.</li>
			  <li><strong>Home Screen:</strong> It can be located right on the home screen for your convenience.</li>
			</ul>
			
			<h3><strong>2. View the List:</strong></h3>
			<ul>
			  <li><strong>Once Found:</strong> Once you've located the "Emergency Contacts" section, you'll see a list of emergency contact numbers.</li>
			  <li><strong>Categories of Contacts:</strong> These may include numbers for:</li>
			  <ul>
				<li>Local Police Station</li>
				<li>Ambulance Services</li>
				<li>Nearby Pharmacies</li>
				<li>Fire Department</li>
			  </ul>
			  <li><strong>Admin Configuration:</strong> These numbers are usually configured by your society's admin for easy accessibility.</li>
			</ul>
			
			<h3><strong>3. Direct Access:</strong></h3>
			<ul>
			  <li><strong>Direct Calls:</strong> The numbers should be available for direct calls from within the app (depending on the specific setup).</li>
			</ul>
			
			<h3><strong>Things to keep in mind:</strong></h3>
			<ul>
			  <li><strong>Admin Responsibility:</strong> The availability and accuracy of these numbers depend on your society's administrator. They are responsible for configuring and updating the list.</li>
			  <li><strong>Always Verify:</strong> It's a good practice to occasionally double-check these numbers to ensure they are current and accurate, especially if you know the details of a local service have changed.</li>
			</ul>
			
			<p>I hope this helps you locate the emergency contact numbers quickly and easily! Your safety and well-being are a priority, and Society-Housing aims to make sure that you have all necessary contacts at your fingertips! If you have any other questions, feel free to ask! I'm here to help with lots of enthusiasm!</p>
			`},
		  ],
		},

		{
		  role: "user",
		  parts: [
			{text: "There is no water supply since morning what to do?\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Oh no, that's definitely a situation that needs to be addressed quickly! No water supply is a major inconvenience, but don't worry; Society-Housing is here to help you navigate this! Here's what you can do, and I'll guide you with lots of enthusiasm!\n\n**1. Check with Other Residents:**\n    *   Before reporting the issue, check if other residents are also experiencing a similar issue. This helps identify if the problem is widespread.\n\n**2. Use Society-Housing's Complaint Management System:**\n\n*   **Login:** Log into your Society-Housing member account.\n*   **Find the Section:** Go to the \"Complaint Management\" or \"Raise a Ticket\" section.\n*   **Create a New Ticket:**\n    *   Clearly state the issue: \"No water supply since this morning.\"\n    *   Provide any relevant details you might have (e.g., the time it stopped, any unusual sounds you heard, etc.)\n    *   If you are sure that it's a widespread issue, then mention that in your ticket.\n*   **Submit:** Send your ticket.\n\n**3. Inform Your Society Admin:**\n\n*   While submitting the ticket is important, consider contacting your society administrator directly if it's a serious issue.\n*   Use the methods we discussed previously to contact the admin, this could be via the \"Emergency Contact\" section for direct call.\n\n**4. What to Expect Next**\n    *  Your complaint will be registered and the society admin will try to take necessary action to resolve it ASAP.\n    *  You can always track the status of your ticket via the application.\n\n**Additional Tips and Considerations:**\n\n*   **Check for Notices:** Keep an eye on the digital noticeboard on Society-Housing. The admin might have posted an announcement regarding the water supply issue.\n*   **Patience:** It might take some time for the admin to identify the exact problem and restore water supply. However, you will be updated via your ticket.\n*   **Be Prepared:** If the water supply issue persists, store water in containers for basic needs.\n\nI hope this helps you in getting the water supply back as soon as possible! I'm here to help with a lot of enthusiasm. Feel free to ask any further questions! We are always here to help.\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "how can i reach to admin as i wanted to enquire abot the membershit of the society?\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Okay, that's a great question! I understand you need to inquire about society membership, and I'm absolutely here to help you connect with the admin with a burst of enthusiasm!\n\nHere's how you can reach the admin to inquire about membership using the Society-Housing platform:\n\n**1. Using the Complaint Management System (Raise a Ticket):**\n\n*   **Log In:** First, log into your Society-Housing member account.\n*   **Find the Section:** Look for the \"Complaint Management\" or \"Raise a Ticket\" section.\n*   **Create a New Ticket:**\n    *   Select an appropriate category for your inquiry. It could be something like \"General Inquiry,\" \"Membership Inquiry,\" or if there isn't a perfect fit, use the \"General\" option.\n    *   Write a clear and concise message, such as:\n        \"Hello, I would like to inquire about the membership process for the society.\"\n        Or\n        \"Hello, I'm interested in becoming a member of the society. Could you provide me with some information on the process?\"\n    *   Include any specific questions you might have (e.g., \"What are the eligibility criteria?\" \"What documents are required?\" \"Is there a membership fee?\").\n    *   Include your contact information.\n*   **Submit:** Send your ticket.\n\n**2. Check for Direct Contact Information:**\n\n*   **Profile or Info Section:** Look for a profile or an \"About Us\" section on your Society-Housing platform. Admin may include contact details like an email address.\n*   **Emergency Contacts:** They might have included contact details in the Emergency Contact list for any urgent queries.\n\n**3. Direct Email to Admin:**\n*  You can directly email to the given admin email. The admin email is: admin.housing@gmail.com\n\n**Important Reminders:**\n\n*   **Be Clear and Specific:** When writing your message, be clear about what you need. This will help the admin respond to you quickly and efficiently.\n*   **Be Patient:** Admins are often volunteers, so it might take some time for them to reply. However, you'll receive a response!\n*   **Use the Ticket System:** The ticket system is usually the best way to ensure your inquiry is tracked and gets a response.\n\nI hope this helps you get the information you need about society membership! I'm here to assist you with all the enthusiasm you need. Please don't hesitate to ask if you have any other questions!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "can i pay bill online from the website protal?\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Absolutely! You've hit on one of the most convenient features of Society-Housing! I'm thrilled to tell you, with a burst of enthusiasm, that **yes, you can definitely pay your bills online directly through the website portal!**\n\nHere's how the online bill payment feature works:\n\n**1. Access Your Account:**\n\n*   Log in to your Society-Housing member account.\n\n**2. Navigate to the \"Bill Payment\" or \"Maintenance Bills\" Section:**\n\n*   Look for a section on your dashboard related to \"Bill Payment,\" \"Maintenance Bills,\" or something similar. It might be under the \"Financials\" or \"My Dues\" area.\n\n**3. View Your Bill Details:**\n\n*   Here, you'll be able to see all the details of your current outstanding maintenance bill.\n*   You can typically view the month for which the bill is generated, the due date, the total amount, and a detailed breakdown of the charges.\n\n**4. Pay Online:**\n\n*   Once you've reviewed your bill, you'll find an option to pay online.\n*   You can make payments using your credit card or debit card.\n*   Society-Housing uses secure payment gateways to ensure your transactions are safe and protected.\n\n**5. Get Your Receipt:**\n\n*   After a successful payment, you will instantly receive a receipt of your transaction.\n*   You can usually download or save the receipt for your records.\n*   You can always access these receipts under your account.\n\n**Benefits of Online Payments:**\n\n*   **Convenience:** You can pay your bills from anywhere, at any time, using your computer or mobile device.\n*   **Speed:** Online payments are processed instantly, ensuring that your payment is recorded without any delays.\n*   **Security:** The portal uses secure payment gateways to protect your financial information.\n*   **Easy Access to Records:** You can view your entire payment history anytime.\n\nI hope you are excited to use this feature! Online bill payments make managing your finances with Society-Housing incredibly easy! If you have more questions, please don't hesitate to ask! I'm always here to help with a smile and a lot of enthusiasm!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "how can i download the reciept?"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Okay, that's a fantastic question! I'm absolutely thrilled to guide you through the process of downloading your payment receipts with a huge burst of enthusiasm!\n\nHere's how you can typically download your payment receipts from the Society-Housing portal:\n\n**1. Log into Your Account:**\n\n*   Start by logging into your Society-Housing member account.\n\n**2. Navigate to the \"Bill Payment,\" \"Maintenance Bills,\" or \"Payment History\" Section:**\n\n*   Look for a section related to \"Bill Payment,\" \"Maintenance Bills,\" \"Payment History,\" or something similar. This is usually where your payment records are stored.\n\n**3. Locate the Specific Transaction:**\n\n*   In this section, you'll see a list of your past payments.\n*   Find the specific transaction for which you need the receipt.\n\n**4. Download the Receipt:**\n\n*   Next to the specific payment record, you will usually find a \"Download\" button or an icon (it might look like a downward-pointing arrow or a paper icon).\n*   Click on this \"Download\" button.\n*   The receipt will either be downloaded automatically to your device or it might open a preview in a new tab.\n\n**5. Save the Receipt:**\n\n*   If the receipt was downloaded, it will typically go to your device’s “Downloads” folder.\n*   If the receipt previewed in a new tab, you can use your browser to download it from there. (Usually \"File\" then \"Save as\" option)\n*   Save it to a location on your device where you can easily find it later.\n\n**Tips for Downloading Receipts:**\n\n*   **Check Browser Settings:** Make sure your browser's download settings are properly set up. If you are unsure of where the file goes check your browser downloads.\n*   **PDF Format:** Receipts are generally downloaded in PDF format. You'll need a PDF reader to open them. Most devices usually have one or you can easily download it from the internet.\n*   **No Receipt Option:** If you don't see a download button then check if you can open the receipt in a new window and then download it.\n\nDownloading your receipts is straightforward and provides a convenient way to keep track of your payments! I hope this helps! If you have any other questions, don't hesitate to ask! I'm here to assist you with tons of enthusiasm and joy!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "how do i get know about my society if there's any important announcement regarding anything important like no water supply or any other problem, do u admin call everyone one by one??"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "That's an excellent question! It's important to stay informed about what's happening in your society, and I'm delighted to explain how Society-Housing keeps you updated, with lots of enthusiasm!\n\nThe great news is that your society admin **does not** have to call everyone one by one. Instead, Society-Housing uses a much more efficient and convenient system to communicate important announcements:\n\n**1. The Digital Noticeboard:**\n\n*   This is the primary way your admin will share important information, like water supply issues, maintenance schedules, or any other urgent announcements.\n*   **How to Access It:**\n    *   Log in to your Society-Housing member account.\n    *   Navigate to the \"Noticeboard\" or \"Announcements\" section, usually found on your dashboard or the home screen.\n*   **What You'll Find:**\n    *   The noticeboard is like a digital bulletin board where your admin can post notices, circulars, and announcements.\n    *   You can access both the latest updates and older announcements from the society.\n    *   The notices will typically be in digital format so you can easily read them.\n\n**2. Why This System is Efficient:**\n\n*   **Immediate Updates:** As soon as the admin posts a notice, it becomes visible to all members, making communication quick and efficient.\n*   **24/7 Access:** You can access the noticeboard at any time, from anywhere, using your computer or mobile device, keeping you informed around the clock.\n*   **No Interruption:** Unlike individual calls, you won't be disturbed by phone calls. You can check updates at your convenience.\n*   **Records:** All past announcements are available for review.\n\n**3. Notifications (Optional):**\n* There is an option where we can notify you in the app if some major announcement has been done by the admin.\n\n**How it Helps You:**\n\n*   **Stay Informed:** You'll be among the first to know about any urgent matters in your society.\n*   **Plan Accordingly:** Knowing about issues like water supply problems in advance will help you to plan your day accordingly.\n*   **Stay Connected:** The digital noticeboard helps you stay connected to your community and any ongoing activities.\n\nSociety-Housing's digital noticeboard is a fantastic way to stay in the loop! It keeps everyone informed without the need for individual calls, ensuring that you get all the important information quickly and efficiently. If you have more questions, I am always here to help with tons of enthusiasm!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "I need to make some changes about my profile, like ive chnaged my phone so how can i do that??"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "That's a super common need, and I'm thrilled to guide you through updating your profile details, like your phone number, with lots of enthusiasm! Society-Housing makes it easy for you to manage your profile information.\n\nHere's how you can typically update your profile, including your phone number:\n\n**1. Log into Your Account:**\n\n*   Start by logging into your Society-Housing member account.\n\n**2. Find the \"Profile\" or \"Settings\" Section:**\n\n*   Look for a section on your dashboard or menu that is labeled \"Profile,\" \"My Profile,\" \"Settings,\" or something similar. It’s usually easily accessible from your main account area.\n\n**3. Access Your Profile Details:**\n\n*   Click on the \"Profile\" section, and you will see all the information that is currently on file for you.\n\n**4. Edit Your Phone Number:**\n\n*   Locate the field where your phone number is currently listed.\n*   Click or tap on the field, and it will become editable.\n*   Enter your new phone number accurately. Make sure you add the area code correctly.\n\n**5. Update Other Details (if needed):**\n\n*   While you’re updating your phone number, you can also take this opportunity to update any other details, such as your email address, residential address, or any other personal details.\n\n**6. Save Your Changes:**\n\n*   Once you have made all the necessary changes, look for a \"Save,\" \"Update,\" or \"Submit\" button usually found at the bottom of the profile page.\n*   Click this button to save your updated profile information.\n\n**7. Verify the Changes:**\n\n*   After you save your changes, double-check your profile to ensure that the information was updated correctly.\n*   You may receive an email or in-app notification confirming the update.\n\n**Important Notes:**\n\n*   **Accuracy:** Make sure to enter your new phone number accurately, as this is essential for society admin to reach you if needed.\n*   **Security:** Society-Housing takes your data security very seriously. Your personal information is stored securely, and only authorized personnel have access to it.\n*   **Contact Admin:** If for any reason you have difficulty updating your profile or you do not see the option, don’t hesitate to contact the admin using the ticket system.\n\nI hope that helps you to update your phone number and any other details you need to update! If you have more questions or need further assistance, please don't hesitate to ask. I'm always here to help with lots of enthusiasm and joy!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "i can make chages in other section too in profile if i want??\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Absolutely! That's a fantastic question, and I'm thrilled to confirm that, with a burst of enthusiasm, **yes, you can definitely make changes to other sections of your profile too!** Society-Housing is designed to give you control over your information.\n\nHere's what you can typically expect to be able to change in your profile, besides your phone number:\n\n**1. Basic Personal Details:**\n\n*   **Name:** You can update your first and last name if there's been a change.\n*   **Email Address:** If you’ve changed your email address, you can update it here so you receive all communications on your updated mail.\n*   **Residential Address:** If your residential address has changed, you can update it in this section.\n*  **Apartment/Unit Number:** You can update your apartment number here as well.\n\n**2. Contact Information:**\n\n*   As you already know, you can update your phone number.\n\n**3. Additional Information (Society Specific):**\n\n*   Depending on how your society has configured the profile section, you might be able to update other details, like the number of people in your family, car parking number, or any other details relevant to your community.\n\n**4. Password (Usually in a separate \"Security\" Section):**\n*You can also change your password through the security section.\n\n**How to Make Changes:**\n\n*   **Access Profile:** As we discussed before, you’ll log into your Society-Housing account and go to the \"Profile\" or \"Settings\" section.\n*   **Editable Fields:** Most fields in your profile will be editable. You just need to click or tap into them and enter the new information.\n*   **Save Changes:** Don’t forget to click the \"Save,\" \"Update,\" or \"Submit\" button to save the changes once you have made them.\n\n**Why Is This Flexibility Important?**\n\n*   **Up-to-Date Information:** By being able to make changes, you can ensure that all your information is always up to date, which is essential for efficient communication with your society.\n*   **Personal Control:** You have control over what information is shared and you can update it whenever required.\n*   **Easy Management:** It's easy to manage all your essential information in one place.\n\nI hope this helps you understand how flexible your profile is with Society-Housing! It really puts you in charge of your information. If you have more questions, please don't hesitate to ask! I'm always here with a whole lot of enthusiasm and joy to help!\n"},
		  ],
		},
		{
		  role: "user",
		  parts: [
			{text: "and how many members are there in the society and how can i see their name and phone number i want to before moving to this society?\n"},
		  ],
		},
		{
		  role: "model",
		  parts: [
			{text: "Okay, that's a really important question when considering a move to a new community! I understand you'd like to know more about the existing members of the society, and I'm happy to address this with all my enthusiasm!\n\nHowever, there are a few things to keep in mind about member information within Society-Housing:\n\n**1. Privacy Considerations:**\n\n*   Society-Housing, like other platforms, takes member privacy very seriously. It's crucial to protect the personal information of all residents.\n*   Therefore, you might not be able to access a full list of names and phone numbers of all the members of the society without being a registered member yourself.\n\n**2. What You Can Typically See as a Potential Resident (Before Moving In):**\n\n*   **Total Number of Members/Apartments:** Usually the admins can post such information on notice board.\n*   **General Information about the Society:** You may find information such as the type of community, the facilities, or any special features of the society, which the admin or society may choose to share on the platform or the website.\n*   **Admin Contact Information:** You will usually have access to contact the admin to ask questions about the society.\n\n**3. What Registered Members Can Usually See (After Moving In):**\n\n*   **Member Directory:** Once you become a registered member and your account is activated, you will likely be able to see a member directory within the Society-Housing app.\n*   **Limited Information:** The directory might show names, apartment numbers, and possibly a way to send them a message via the platform.\n*   **Phone Numbers:** Due to privacy concerns, phone numbers are usually not made public.\n*   **With Approval:** You will only have access to the member directory with the society admin's approval.\n\n**4. How to Inquire Before Moving In:**\n\n*   **Contact the Society Admin:** The best approach is to contact the society admin directly using the contact methods we have discussed earlier, or via the contact page of your society.\n    *   You can ask general questions about the community, how many members they have, and about the social interaction within the society.\n    *  You can try to ask specific questions such as whether they have a community messaging platform if they allow phone numbers to be shared among the members.\n*   **Request More Information:** Ask for more information about the community if there's any public details or information that can be shared with you before you become a member.\n\n**Important Note:** The specific features and level of access can vary from society to society. Some communities might be more open with sharing information among members, while others might have stricter privacy policies.\n\nI hope this gives you a better understanding of what information you can access and how you can learn more about the community before moving in. It’s completely normal to want to know more, and contacting the admin is usually the best first step! If you have any other questions, please don't hesitate to ask! I'm always here with a lot of enthusiasm and joy to help!\n"},
		  ],
		},
	  ],
	});
  
	const result = await chat.sendMessage(userInput);
	const response = result.response;
	return response.text();
  }

  
//   // Serve the chatbox page
//   app.get('/chatbox', (req, res) => {
// 	res.render('chatbox');
//   });

//   app.post('/chatbot', async (req, res) => {
// 	const userMessage = req.body.message;
  
// 	try {
// 	  // Ensure the message is in the correct format
// 	  const result = await geminiModel.generateContent({
// 		contents: [{ role: 'user', parts: [{ text: userMessage }] }]
// 	  });
  
// 	  // Check if we got a valid response
// 	  if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
// 		const responseText = result.response.candidates[0].content.parts[0].text;
  
// 		// Respond with the AI's answer
// 		res.json({ response: responseText });
// 	  } else {
// 		// Handle no valid response
// 		res.json({ response: 'Sorry, I could not understand your question.' });
// 	  }
// 	} catch (error) {
// 	  console.error('Error:', error);
// 	  res.json({ response: 'Sorry, there was an error processing your request.' });
// 	}
//   });


app.get('/chatbox', (req, res) => {
	res.render('chatbox');
	});

	app.get('/loader.gif', (req, res) => {
		res.render('loader.gif');
		  });

  app.post('/chat', async (req, res) => {
	try {
	  const userInput = req.body?.userInput;
	  console.log('incoming /chat req', userInput)
	  if (!userInput) {
		return res.status(400).json({ error: 'Invalid request body' });
	  }
  
	  const response = await runChat(userInput);
	  res.json({ response });
	} catch (error) {
	  console.error('Error in chat endpoint:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
  
  


app.get("/", (req,res) => {
	// Track page visits + users & societies registered
	visit_collection.Visit.findOne((err,pageVisit) => {
		if(!pageVisit){
			pageVisit = new visit_collection.Visit({
				count: 0
			})
		}
		pageVisit.count += 1;
		society_collection.Society.find((err,foundSociety) => {
			const societyCount = foundSociety.length
			const cities = foundSociety.map(society => society.societyAddress.city.toLowerCase())
			const cityCount = [...new Set(cities)].length
			user_collection.User.find((err,foundUser) => {
				const userCount = foundUser.length
				pageVisit.save(function() {
					const pageVisits = pageVisit.count
					res.render("index", {city:cityCount, society:societyCount, user:userCount, visit:pageVisits});
				})
			})
		})
	})	
});

app.get('/policy', (req, res) => {
    res.render('info'); // Render 'info.ejs'
});

app.get('/terms', (req, res) => {
    res.render('terms'); // Render 'terms.ejs'
});


app.get("/login", (req,res) => {
	res.render("login");
});

app.get("/signup", (req,res) => {
	society_collection.Society.find((err,foundSociety) => {
		res.render("signup", {societies: foundSociety});
	})
});

app.get("/register", (req,res) => {
	res.render("register");
});

app.get("/home", (req,res) => {
	if(req.isAuthenticated()){
		// Conditionally render home as per user validation status
		if(req.user.validation=='approved'){
			res.render("home");
		} else if(req.user.validation=='applied') {
			res.render("homeStandby",{
				icon: 'fa-user-clock',
				title: 'Account pending for approval',
				content: 'Your account will be active as soon as it is approved by your community.'+
                'It usually takes 1-2 days for approval. If it is taking longer to get approval, ' +
                'contact your society admin.'
			});
		} else {
			res.render("homeStandby",{
				icon: 'fa-user-lock',
				title: 'Account approval declined',
				content: 'Your account registration has been declined. '+
                'Please contact the society administrator for more details.' +
				'You can edit the request and apply again.'
			});
		}
	} else {
		res.redirect("/login");
	}
});

app.get("/newRequest", (req,res) => {
	if(req.isAuthenticated() && req.user.validation!='approved'){
		society_collection.Society.find((err,foundSociety) => {
			res.render("signupEdit", {user: req.user, societies: foundSociety});
		})
	} else {
		res.redirect("/home")
	}
})

app.get("/logout", (req,res) => {
	req.logout();
	res.redirect("/")
})

app.get("/loginFailure", (req,res) => {
	const failureMessage = "Sorry, entered password was incorrect, Please double-check.";
	const hrefLink = "/login";
	const secondaryMessage = "Account not created?";
	const hrefSecondaryLink = "/signup";
	const secondaryButton = "Create Account";
	res.render("failure",{
		message:failureMessage,
		href:hrefLink,
		messageSecondary:secondaryMessage,
		hrefSecondary:hrefSecondaryLink,
		buttonSecondary:secondaryButton
	})
});

app.get("/residents", (req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		const userSocietyName = req.user.societyName;
		user_collection.User.find({$and: [{"societyName":userSocietyName}, {"validation":"approved"}]},
		(err,foundUsers) => {
			if(!err && foundUsers){
				// Fetch users with applied status
				user_collection.User.find({$and: [{"societyName":userSocietyName}, {"validation":"applied"}]},
				(err,foundAppliedUsers) => {
					if(!err && foundAppliedUsers){
						res.render("residents", {
							societyResidents: foundUsers, 
							appliedResidents: foundAppliedUsers,
							societyName: userSocietyName,
							isAdmin: req.user.isAdmin
						});
					}
				})
			}
		})
	} else {
		res.redirect("/login");
	}
})

app.get("/noticeboard", (req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		society_collection.Society.findOne({societyName: req.user.societyName}, (err,foundSociety) => {
			if(!err && foundSociety){
				// Check if no notice is present
				if(!foundSociety.noticeboard.length){
					foundSociety.noticeboard = [{
						'subject': 'Access all important announcements, notices and circulars here.'
					}]
				}
				res.render("noticeboard", {notices:foundSociety.noticeboard, isAdmin:req.user.isAdmin});
			}
		})	
	} else {
		res.redirect("/login");
	}
})

app.get("/notice", (req,res) => {
	if(req.isAuthenticated() && req.user.isAdmin){
		res.render("notice");
	} else {
		res.redirect("/login");
	}
})
app.get("/bill", (req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		user_collection.User.findById(req.user.id, (err, foundUser) => {
			if(!err && foundUser){
				society_collection.Society.findOne({societyName: foundUser.societyName}, (err,foundSociety) => {
					const dateToday = new Date();
					// Payment required for total number of months
					let totalMonth = 0
					// If lastPayment doesn't exists
					let dateFrom = foundUser.createdAt;
					// If lastPayment exists
					if(foundUser.lastPayment.date){
						dateFrom = foundUser.lastPayment.date;
						totalMonth = date.monthDiff(dateFrom,dateToday)
					}
					else {
						// Add an extra month, as users joining date month payment's also pending
						totalMonth = date.monthDiff(dateFrom,dateToday) + 1
					}
					// Calculate monthly bill of society maintenance
					const monthlyTotal  = Object.values(foundSociety.maintenanceBill)
						.filter(ele => typeof(ele)=='number')
						.reduce((sum,ele) => sum+ele, 0)
					let credit = 0;
					let due = 0;
					if(totalMonth==0){
						// Calculate credit balance
						credit = monthlyTotal;
					}
					else if(totalMonth>1){
						// Calculate pending due
						due =  (totalMonth-1)*monthlyTotal
					}
					const totalAmount = monthlyTotal + due - credit
					
					// Fetch validated society residents for admin features
					user_collection.User.find({$and: [{"societyName":req.user.societyName}, {"validation":"approved"}]},(err,foundUsers) => {
						if(!err && foundUsers){
							// Update amount to be paid on respective user collection
							user_collection.User.findOne({_id: req.user.id}, (err,foundUser) => {
								foundUser.makePayment = totalAmount;
								foundUser.save(function() {
									res.render("bill", {
										resident:foundUser, 
										society:foundSociety,
										totalAmount: totalAmount,
										pendingDue: due,
										creditBalance: credit,
										monthName: date.month,
										date: date.today,
										year: date.year,
										receipt: foundUser.lastPayment,
										societyResidents:foundUsers,
										monthlyTotal: monthlyTotal
									});
								})
							})
						}
					})
				})
			}
		})	
	} else {
		res.redirect("/login");
	}
})


app.get("/editBill", (req,res) => {
	if(req.isAuthenticated() && req.user.isAdmin){
		society_collection.Society.findOne({societyName: req.user.societyName}, (err, foundSociety) => {
			if(!err && foundSociety){
				res.render("editBill", {maintenanceBill:foundSociety.maintenanceBill});
			}
		})
	} else {
		res.redirect("/login");
	}
})

app.get("/helpdesk",(req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved') {
		// Conditonally render user/admin helpdesk
		if(req.user.isAdmin) {
			user_collection.User.find({$and: [{"societyName":req.user.societyName}, {"validation":"approved"}]}, (err, foundUsers) => {
				if(!err && foundUsers) {
					res.render("helpdeskAdmin", {users:foundUsers});
				}
			})
		} else {
			// Check if no complaint is present
			if(!req.user.complaints.length){
				req.user.complaints = [{
					'category': 'You have not raised any complaint',
					'description': ''
				}]
			}
			res.render("helpdesk", {complaints:req.user.complaints});
		}
	} else {
		res.redirect("/login");
	}
})

app.get("/complaint",(req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		res.render("complaint");
	} else {
		res.redirect("/login");
	}
})



app.get("/lostfound",(req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved') {
		// Conditonally render user/admin helpdesk
		if(req.user.isAdmin) {
			user_collection.User.find({$and: [{"societyName":req.user.societyName}, {"validation":"approved"}]}, (err, foundUsers) => {
				if(!err && foundUsers) {
					res.render("lostFoundAdmin", {users:foundUsers});
				}
			})
		} else {
			// Check if no complaint is present
			if(!req.user.lostItems.length){
				req.user.lostItems = [{
					'category': 'You have not raised any Lost & Found item',
					'description': ''
				}]
			}
			res.render("lostFound", {lostItems:req.user.lostItems});
		}
	} else {
		res.redirect("/login");
	}
})

app.get("/report",(req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		res.render("reportLostItem");
	} else {
		res.redirect("/login");
	}
})









app.get("/contacts",(req,res) => {
	if(req.isAuthenticated()  && req.user.validation=='approved'){
		const userSocietyName = req.user.societyName;
		society_collection.Society.findOne({"societyName":userSocietyName},(err,foundSociety) => {
			if(!err && foundSociety){
				res.render("contacts", {contact:foundSociety.emergencyContacts, isAdmin: req.user.isAdmin});
			}
		})	
	} else {
		res.redirect("/login");
	}
})

app.get("/editContacts",(req,res) => {
	if(req.isAuthenticated() && req.user.isAdmin){
		society_collection.Society.findOne({societyName: req.user.societyName}, (err, foundSociety) => {
			if(!err && foundSociety){
				res.render("editContacts", {contact:foundSociety.emergencyContacts});
			}
		})	
	} else {
		res.redirect("/login");
	}
})

app.get("/profile", (req,res) => {
	if(req.isAuthenticated()  && req.user.validation=='approved'){
		user_collection.User.findById(req.user.id, (err, foundUser) => {
			if(!err && foundUser){
				society_collection.Society.findOne({societyName: foundUser.societyName}, (err,foundSociety) => {
					res.render("profile", {resident:foundUser, society:foundSociety});
				})
			}
		})	
	} else {
		res.redirect("/login");
	}
})

app.get("/editProfile", (req,res) => {
	if(req.isAuthenticated() && req.user.validation=='approved'){
		user_collection.User.findById(req.user.id, (err, foundUser) => {
			if(!err && foundUser){
				society_collection.Society.findOne({societyName: foundUser.societyName}, (err,foundSociety) => {
					res.render("editProfile", {resident:foundUser, society:foundSociety});
				})				
			}
		})	
	} else {
		res.redirect("/login");
	}
})

app.get('/success', async (req, res) => {
    console.log("🔹 /success route hit");

    try {
        if (!req.query.session_id) {
            console.log("❌ No session_id in request");
            return res.status(400).send("Session ID missing");
        }

        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        console.log("✅ Stripe Session Retrieved:", session);

        if (!session) {
            console.log("❌ Invalid session ID");
            return res.status(400).send("Invalid session ID");
        }

        // Update the user's payment status
        const user = await user_collection.User.findOne({ _id: req.user.id });
        if (user) {
            // Calculate the payment amount (if any due)
            let newMakePayment = 0;

            // Add logic to check if user still has outstanding payments
            // If the user has pending dues, we will calculate and update the 'makePayment'
            if (user.makePayment > 0) {
                newMakePayment = user.makePayment - (session.amount_total / 100);
            }

            // Reset makePayment to 0 if no dues are left
            if (newMakePayment < 0) {
                newMakePayment = 0;
            }

            user.makePayment = newMakePayment;

            // Optionally: Add the payment amount to their lastPayment details
            user.lastPayment.amount = session.amount_total / 100;
            user.lastPayment.date = new Date(session.created * 1000);
            user.lastPayment.invoice = session.id;

            // Save updated user data
            await user.save();
            console.log("✅ User payment updated in database");

            // Redirect to bill page
            res.redirect('/bill');
        } else {
            console.log("❌ User not found in database");
            res.status(404).send("User not found");
        }

    } catch (error) {
        console.error("❌ Error in /success route:", error);
        res.status(500).send("An error occurred");
    }
});


app.post('/checkout-session', async (req, res) => {
	const session = await stripe.checkout.sessions.create({
	  payment_method_types: ['card'],
	  line_items: [
		{
		  price_data: {
			currency: 'inr',
			product_data: {
			  name: req.user.societyName,
			  images: ['https://www.flaticon.com/svg/vstatic/svg/3800/3800518.svg?token=exp=1615226542~hmac=7b5bcc7eceab928716515ebf044f16cd'],
			},
			unit_amount: req.user.makePayment*100,
		  },
		  quantity: 1,
		},
	  ],
	  mode: 'payment',
	  success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
	  cancel_url: "http://localhost:3000/bill",
	//   success_url: "https://esociety-fdbd.onrender.com/https://esociety-fdbd.onrender.com//success?session_id={CHECKOUT_SESSION_ID}",
	//   cancel_url: "https://esociety-fdbd.onrender.com/https://esociety-fdbd.onrender.com//bill",
	});
  
	res.json({ id: session.id });
  });


  app.post("/approveResident",(req,res) => {
	const user_id = Object.keys(req.body.validate)[0]
	const validate_state = Object.values(req.body.validate)[0]
	user_collection.User.updateOne(
		{_id:user_id},
		{ $set: {
			validation: validate_state
		}},
		(err,result) => {
			if(!err){
				res.redirect("/residents");
			}
		}
	)
})

app.post("/complaint",(req,res) => {
	user_collection.User.findById(req.user.id, (err, foundUser) => {
		if(!err && foundUser){
			complaint = {
				'date': date.dateString,
				'category': req.body.category,
				'type': req.body.type,
				'description': req.body.description,
				'status': 'open'
			}
			foundUser.complaints.push(complaint);
			foundUser.save(function() {
				res.redirect("/helpdesk");
			})
		}
	})
})

app.post("/closeTicket",(req,res) => {
	const user_id = Object.keys(req.body.ticket)[0]
	const ticket_index = Object.values(req.body.ticket)[0]
	const ticket = 'complaints.'+ticket_index
	// Find user for fetching ticket data
	user_collection.User.findById(user_id, (err, foundUser) => {
		if(!err && foundUser){
			user_collection.User.updateOne(
				{_id:user_id},
				{ $set: {
					[ticket]: {
						status: 'close',
						'date': foundUser.complaints[ticket_index].date,
						'category': foundUser.complaints[ticket_index].category,
						'type': foundUser.complaints[ticket_index].type,
						'description': foundUser.complaints[ticket_index].description
					}
				}},
				(err,result) => {
					if(!err){
						res.redirect("/helpdesk");
					}
				}
			)		
		}
	})
})


app.post("/report",(req,res) => {
	user_collection.User.findById(req.user.id, (err, foundUser) => {
		if(!err && foundUser){
			lostItem = {
				'date': date.dateString,
				'category': req.body.category,
				'type': req.body.type,
				'description': req.body.description,
				'status': 'open'
			}
			foundUser.lostItems.push(lostItem);
			foundUser.save(function() {
				res.redirect("/lostfound");
			})
		}
	})
})

app.post("/closereport",(req,res) => {
	const user_id = Object.keys(req.body.ticket)[0]
	const ticket_index = Object.values(req.body.ticket)[0]
	const ticket = 'lostItems.'+ticket_index
	// Find user for fetching ticket data
	user_collection.User.findById(user_id, (err, foundUser) => {
		if(!err && foundUser){
			user_collection.User.updateOne(
				{_id:user_id},
				{ $set: {
					[ticket]: {
						status: 'close',
						'date': foundUser.lostItems[ticket_index].date,
						'category': foundUser.lostItems[ticket_index].category,
						'type': foundUser.lostItems[ticket_index].type,
						'description': foundUser.lostItems[ticket_index].description
					}
				}},
				(err,result) => {
					if(!err){
						res.redirect("/lostfound");
					}
				}
			)		
		}
	})
})



app.post("/notice",(req,res) => {
	society_collection.Society.findOne({societyName: req.user.societyName}, (err,foundSociety) => {
		if(!err && foundSociety){
			notice = {
				'date': date.dateString,
				'subject': req.body.subject,
				'details': req.body.details
			}
			foundSociety.noticeboard.push(notice);
			foundSociety.save(function() {
				res.redirect("/noticeboard");
			})
		}
	})
})

app.post("/editBill",(req,res) => {
	society_collection.Society.updateOne(
		{societyName: req.user.societyName}, 
		{ $set: {
			maintenanceBill: {
				societyCharges: req.body.societyCharges,
				repairsAndMaintenance: req.body.repairsAndMaintenance,
				sinkingFund: req.body.sinkingFund,
				waterCharges: req.body.waterCharges,
				insuranceCharges: req.body.insuranceCharges,
				parkingCharges: req.body.parkingCharges
			}
		}},
		(err,result) => {
			if(!err){
				res.redirect("/bill");
			}
		}
	)
})

app.post("/editContacts",(req,res) => {
	society_collection.Society.updateOne(
		{societyName: req.user.societyName}, 
		{ $set: {
			emergencyContacts: {
				plumbingService: req.body.plumbingService,
				medicineShop: req.body.medicineShop,
				ambulance: req.body.ambulance,
				doctor: req.body.doctor,
				fireStation: req.body.fireStation,
				guard: req.body.guard,
				policeStation: req.body.policeStation
			}
		}},
		(err,result) => {
			if(!err){
				res.redirect("/contacts");
			}
		}
	)
})

app.post("/editProfile",(req,res) => {
	user_collection.User.updateOne(
		{_id: req.user.id}, 
		{ $set: { 
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
			flatNumber: req.body.flatNumber
		}},
		(err,result) => {
			if(!err){
				// Update society data if any ~admin
				if(req.body.address){
					society_collection.Society.updateOne(
						{admin: req.user.username}, 
						{ $set: { 
							societyAddress: {
								address: req.body.address,
								city: req.body.city,
								district: req.body.district,
								postalCode: req.body.postalCode
							}
						}},
						(err,result) => {
							if(!err){
								res.redirect("/profile");
							}
						}
					)
				}
				else {
					res.redirect("/profile");
				}
			}
		}
	)
})

app.post("/newRequest", (req,res) => {
	// Submit new signup only if society exists
	society_collection.Society.findOne({societyName: req.body.societyName}, (err,foundSociety) => {
		if(!err && foundSociety){
			user_collection.User.updateOne(
				{_id: req.user.id}, 
				{ $set: {
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					phoneNumber: req.body.phoneNumber,
					societyName: req.body.societyName,
					flatNumber: req.body.flatNumber,
					validation: 'applied'
				}},
				(err,result) => {
					if(!err){
						res.redirect("/home");
					}
				}
			);
		}
		else{
			const failureMessage = "Sorry, society is not registered, Please double-check society name."
			const hrefLink = "/newRequest"
			const secondaryMessage = "Account not created?";
			const hrefSecondaryLink = "/signup";
			const secondaryButton = "Create Account";
			res.render("failure",{
				message:failureMessage,
				href:hrefLink,
				messageSecondary:secondaryMessage,
				hrefSecondary:hrefSecondaryLink,
				buttonSecondary:secondaryButton
			});
		}
	});
})

app.post("/signup", (req,res) => {
	// Signup only if society is created
	society_collection.Society.findOne({societyName: req.body.societyName}, (err,foundSociety) => {
		if(!err && foundSociety){
			user_collection.User.register(
				{
					username: req.body.username,
					societyName: req.body.societyName,
					flatNumber: req.body.flatNumber,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					phoneNumber: req.body.phoneNumber
				},
				req.body.password,function(err,user){
					if(err){
						const failureMessage = "Sorry, this email address is not available. Please choose a different address.";
						const hrefLink = "/signup";
						const secondaryMessage = "Society not registered?";
						const hrefSecondaryLink = "/register";
						const secondaryButton = "Register Society";
						res.render("failure",{
							message:failureMessage,
							href:hrefLink,
							messageSecondary:secondaryMessage,
							hrefSecondary:hrefSecondaryLink,
							buttonSecondary:secondaryButton
						});
					} else {
						passport.authenticate("local")(req,res,function(){
							res.redirect("/home");
						});
					}
				}
			);
		}
		else{
			const failureMessage = "Sorry, society is not registered, Please double-check society name."
			const hrefLink = "/signup"
			const secondaryMessage = "Society not registered?";
			const hrefSecondaryLink = "/register";
			const secondaryButton = "Register Society";
			res.render("failure",{
				message:failureMessage,
				href:hrefLink,
				messageSecondary:secondaryMessage,
				hrefSecondary:hrefSecondaryLink,
				buttonSecondary:secondaryButton
			});
		}
	});
});

app.post("/register", (req,res) => {
	// Signup only if society not registered
	society_collection.Society.findOne({societyName: req.body.societyName},function(err,result){
		if(!err && !result){
			user_collection.User.register(
				{
					validation: 'approved',
					isAdmin: true,
					username: req.body.username,
					societyName: req.body.societyName,
					flatNumber: req.body.flatNumber,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					phoneNumber: req.body.phoneNumber
				},
				req.body.password,(err,user) => {
					if(err){
						console.log(err);
						res.redirect("/register");
					} else {
						passport.authenticate("local")(req,res,function(){
							// Create new society in collection
							const society = new society_collection.Society({
								societyName: user.societyName,
								societyAddress: {
									address: req.body.address,
									city: req.body.city,
									district: req.body.district,
									postalCode: req.body.postalCode
								},
								admin: user.username
							});
							society.save();
							res.redirect("/home");
						});
					}
				}
			);
		}
		else{
			const failureMessage = "Sorry, society is already registered, Please double-check society name.";
			const hrefLink = "/register";
			const secondaryMessage = "Account not created?";
			const hrefSecondaryLink = "/signup";
			const secondaryButton = "Create Account";
			res.render("failure",{
				message:failureMessage,
				href:hrefLink,
				messageSecondary:secondaryMessage,
				hrefSecondary:hrefSecondaryLink,
				buttonSecondary:secondaryButton
			});
		}
	});
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "/loginFailure"
}));

app.listen(
    process.env.PORT || 3000, 
    console.log("Server started")
);



