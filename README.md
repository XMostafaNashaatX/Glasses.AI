# Glasses.AI
Project introduction:
Glasses.AI is a web-based platform designed for book lovers with a diverse catalog of books, Glasses.AI offers readers to give reviews to books they have read and rate them on a scale of 1 to 5 stars.
The idea is inspired by IMDB for movies. Glasses.AI will also be powered by a machine learning algorithm that can recommend books to users by the ones they liked and the ones in their readlist.

Vision and Competitive Analysis:
Our vision is to create the go-to spot for readers and book enthusiasts where they can rate,find and discover books to feed their passion for reading , There are other platforms that offer a rating platform for books but they lack in the recommendation part and we plan to give the best use-experience for those that want to discover new books.

●	Offering AI-driven, tailored recommendations, which consider not just book genre, but also user behavior and preferences.
●	Providing a highly interactive experience with features like reading challenges, book clubs, and dynamic recommendations.
●	Utilizing sentiment analysis to summarize reviews, helping users quickly gauge a book’s reception without reading through lengthy comments.

Technical Approach:
Frontend: We’ll build the frontend using React for a responsive, user-friendly interface. It will support various features like book review submission, rating, recommendations, and admin dashboard.

Backend: The backend will be developed with Django, a robust and feature-rich web framework in Python. Django will handle data requests, user authentication, and manage the core features of our book catalog and review systems. Its built-in ORM and admin interface will streamline database management, while Django's extensive libraries and modular design will enhance scalability and security.

Database: A SQL database, such as MySQL, will be used to manage structured data on users, books, reviews, and ratings. SQL will be crucial for supporting quick and complex queries needed for efficient data retrieval.

Recommendation Engine: A recommendation system, using machine learning algorithms will be developed in Python. It will provide personalized book recommendations based on user data and preferences (KNN or Logistic regression model)







Challenges/Risks :
●	Data handling: with the large amounts of data we are planning to input the website must be able to support a huge load and it will be challenging to ensure it can support the information without any failure.

●	Security: users will be prompted to input sensitive information like credit card numbers, passwords and email addresses , The risk of a breach will be detrimental.

●	Implementation: The plan is to use an advanced learning model for the recommendation algorithm and while most of the time working on an ai model is done through cloud but to deploy it on a live server it will require the server to have enough computing power to handle it and enough bandwidth to run it and also enough space to store the data.

●	Accuracy: we plan to use this model to inform users on what they would like and eventually buy, when a user’s money is involved that means their trust in our website is also at risk if any recommendation is not correct which means we need an accurate model that the users can depend on.


Members:
Mostafa Nashaat
Ahmed Abdelsamad
Fares Wael
Abdelrahman Hesham
Abdelwahab Hassan
