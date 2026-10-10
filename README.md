# Event Feedback System

A web-based application for exploring events and managing event feedback. Built with Node.js, it connects a frontend interface with backend APIs and database operations.

## Features

- Browse events with details such as titles, descriptions, dates, locations, and categories.
- Submit feedback through a simple interface.
- Connect frontend pages with backend APIs.
- Manage event and feedback data through the application.
- Provide an admin interface for event-related management.
- Organize frontend assets using HTML, CSS, and JavaScript.

## Project Preview

### Home Page
![Home Page](docs/home.png.png)

### Events Page
![Events Page](docs/event.png.png)

### Feedback Page
![Feedback Page](docs/feedback.png.png)

### Dashboard
![Dashboard](docs/dashboard.png.png)

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** As configured in the project
- **Package Management:** npm
- **Tools:** Git, GitHub, Visual Studio Code

## Project Structure

```text
event-feedback-system/
├── public/
│   ├── admin.html
│   ├── app.js
│   ├── events.html
│   ├── feedback.html
│   ├── index.html
│   └── styles.css
├── database.js
├── server.js
├── test.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/pranavvv-git/Event-Feedback-System.git
```

### 2. Navigate to the project folder

```bash
cd Event-Feedback-System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

Open the local URL displayed in the terminal to use the application. If the server runs on port 3000, visit `http://localhost:3000`.

## Database

The project includes a separate `database.js` module for database initialization and data operations. The exact storage behaviour depends on the current database configuration.

## Testing

Review `test.js` for the available tests and their requirements. Run `npm test` if a test script is configured in `package.json`.

## What I Learned

While building this project, I worked on connecting frontend functionality with backend APIs, organizing application files, handling user input, and understanding how different parts of a web application work together.

## Future Improvements

- Add user authentication and role-based access.
- Improve event search and filtering.
- Expand feedback analytics and reporting.
- Improve validation and error handling.
- Enhance responsive design and accessibility.

## Author

**Pranav Thakur**

Computer Science Engineering Student | Full Stack Development

GitHub: [pranavvv-git](https://github.com/pranavvv-git)

This project is part of my hands-on software development journey, focused on building practical web applications and strengthening backend development skills.