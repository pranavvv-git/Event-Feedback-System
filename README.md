# Event Feedback System

A web-based application designed to make event discovery and feedback management easier. The project provides a platform where users can explore events and share their feedback through a simple interface.

## Overview

The Event Feedback System is a web development project built to explore backend development, database integration, and the interaction between frontend and server-side components.

The application includes event-related functionality and a backend that manages application data. It is also an opportunity to practice building and organizing a complete web application.

## Features

- **Event Management:** Work with event information such as titles, descriptions, dates, locations, and categories.
- **Feedback System:** Designed around collecting and managing event feedback.
- **Database Integration:** Uses a database to store application data.
- **Backend API:** Handles server-side logic and application requests.
- **Web Interface:** Provides a frontend for interacting with the application.
- **Sample Event Data:** Includes sample events for testing and development.

## Tech Stack

- **Backend:** Node.js
- **Server:** Express.js, if configured in the project
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite / local database storage
- **Development Tools:** Visual Studio Code, npm, Git, GitHub

## Project Structure

```text
event-feedback-system/
├── public/              # Frontend assets and files
├── database.js          # Database setup and operations
├── server.js            # Server-side application
├── test.js              # Tests
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lockfile
├── .gitignore           # Files excluded from Git
└── README.md            # Project documentation
```

*The exact files and folders may vary depending on the current version of the project.*

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**

```bash
git clone YOUR_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd event-feedback-system
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the application**

Check `package.json` for the available scripts. If the project defines a `start` script, run:

```bash
npm start
```

If no start script is configured, run the server using the appropriate command, for example:

```bash
node server.js
```

**5. Open the application**

Visit the local URL displayed in your terminal. For example, if the server runs on port 3000:

```text
http://localhost:3000
```

## Database

The project includes a database module responsible for handling application data.

Depending on the current configuration, the application may use a local SQLite database or a JSON-based fallback. The database setup and operations are managed through `database.js`.

## Learning Outcomes

Working on this project provides practical experience with:

- Structuring a Node.js application
- Handling HTTP requests and server-side logic
- Connecting application logic with a database
- Organizing frontend and backend files
- Managing dependencies with npm
- Testing and debugging application behaviour
- Using Git and GitHub for version control

## Future Improvements

- Add user authentication and authorization
- Improve event search and filtering
- Introduce feedback ratings and summaries
- Add input validation and error handling
- Improve the responsive design
- Expand automated testing
- Add an admin dashboard for event and feedback management

## Running Tests

If test scripts are configured in `package.json`, run:

```bash
npm test
```

Otherwise, check `test.js` for the available test commands and setup.

## Author

**Pranav Thakur**

Computer Science Engineering Student | Interested in Full Stack Development and Backend Engineering

GitHub: [pranavvv-git](https://github.com/pranavvv-git)

---

This project is part of my hands-on learning journey in software development, with a focus on building practical applications and strengthening backend development fundamentals.
