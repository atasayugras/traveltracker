# Travel Tracker App

---

## Description

The **Travel Tracker** application allows users to track the countries they have visited. Built with Node.js, Express, and EJS, this app interacts with a PostgreSQL database hosted on Render to manage country data efficiently.

---

## Features

- **Add countries** to your visited list by entering the country name.
- **Display total number of visited countries** on the home page.
- **Dynamic user interface** that visually highlights the countries visited.

---

## Dependencies

This project relies on the following packages:

- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **EJS**: Embedded JavaScript templating for rendering HTML views.
- **pg**: Non-blocking PostgreSQL client for Node.js.
- **dotenv**: Module for loading environment variables from a `.env` file into `process.env`.
- **body-parser**: Middleware for parsing request bodies.

---

## Database

This project utilizes a PostgreSQL database to store country data, including country codes and names, as well as a record of visited countries.

### Tables Used:

- **countries**: Stores the country codes and names.
- **visited_countries**: Records the countries that have been visited by the user.

---

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- PostgreSQL database (e.g., Render).

### Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

Install dependencies:
npm install
Create a .env file with your database credentials:
```bash
   PORT=3000
   DB_USER=<your_db_user>
   DB_HOST=<your_db_host>
   DB_NAME=<your_db_name>
   DB_PASSWORD=<your_db_password>
   DB_PORT=5432
```

Start the server:
node index.js

Directory Structure
.
├── public/            # Static assets (CSS, JS, images)
├── views/             # EJS templates
├── config/            # Database configuration
├── .env               # Environment variables
├── package.json       # Project dependencies
└── index.js           # Main server file

Contributing
Feel free to fork the repository and submit pull requests for any improvements or new features!

License
This project is licensed under the MIT License.

Instructions for Use
Replace <repository-url> and <repository-folder> with the actual URL and name for your project. Add or modify sections as needed based on your project specifics or to include any additional relevant information.

### Summary

- **Description**: A brief overview of the application and its purpose.
- **Features**: A list of functionalities that users can expect.
- **Database**: Information about the tables used in the PostgreSQL database.
- **Getting Started**: Steps to clone, install dependencies, set up the environment, and run the application.
- **Directory Structure**: A simple layout of the project structure.
- **Contributing and License**: Encouragement for collaboration and licensing details.

Feel free to adjust any sections to better fit your project specifics or preferences! If you need any more changes or additions, just let me know!
