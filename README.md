# Event Feedback System

A web-based application for exploring events and managing event feedback. Built with Node.js, it combines a frontend interface, server-side logic, and database integration to provide a foundation for event and feedback management.

## Features

- Event listings with titles, descriptions, dates, locations, and categories.
- Dedicated pages for browsing events and interacting with the application.
- Backend request handling using Node.js.
- Database operations managed through a separate database module.
- Sample event data for development and testing.
- Admin interface for event-related management, where implemented.
- Organized frontend assets using HTML, CSS, and JavaScript.
- Local development and testing support.

## Project Preview

Add screenshots of the running application here.

**Home Page**

![Event Feedback System Home Page](docs/homepage.png)

**Events Page**

![Event Feedback System Events Page](docs/events.png)

**Feedback Page**

![Event Feedback System Feedback Page](docs/feedback.png)

*Replace these image paths with your actual screenshots after adding them to the repository.*

## Tech Stack

- **Backend:** Node.js
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite / configured local database
- **Package Management:** npm
- **Development Tools:** Git, GitHub, Visual Studio Code

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

## Requirements

- Node.js and npm
- Git (optional, for cloning the repository)

## Getting Started

### Installation

Clone the repository:

```bash
git clone https://github.com/pranavvv-git/Event-Feedback-System.git
```

Navigate to the project directory:

```bash
cd Event-Feedback-System
```

Install dependencies:

```bash
npm install
```

### Run the Application

Start the server using the script configured in `package.json`. If a `start` script is available:

```bash
npm start
```

Otherwise, run the server directly:

```bash
node server.js
```

Open the local address displayed in the terminal. If the server uses port 3000, visit:

```text
http://localhost:3000
```

## Database

The application includes a dedicated `database.js` module for database initialization and data operations.

The project contains a local database file for development. Database configuration and storage behaviour depend on the implementation in `database.js`.

## Testing

Run the configured test script, if available:

```bash
npm test
```

You can also review `test.js` for the project's test coverage and execution requirements.

## Key Learning Areas

- Building a web application with Node.js.
- Connecting frontend components with backend logic.
- Managing persistent application data.
- Organizing code into maintainable modules.
- Handling application requests and debugging issues.
- Using npm and Git for project development.

## Future Improvements

- Add user authentication and role-based access.
- Improve event search, filtering, and sorting.
- Expand feedback submission and rating functionality.
- Add feedback analytics and reporting.
- Improve validation, error handling, and automated testing.
- Enhance responsive design and accessibility.

## Author

**Pranav Thakur**

Computer Science Engineering Student | Full Stack Development

GitHub: [pranavvv-git](https://github.com/pranavvv-git)

---

This project is part of my hands-on software development journey, focused on building practical web applications and strengthening backend development skills.

