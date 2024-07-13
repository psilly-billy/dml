# Music Library Application

This project is a Music Library Application that allows users to search and manage a music database. The application includes a backend built with Flask and MongoDB and a frontend built with React.

## Features

- **Search**: Users can search for artists, albums, and songs.
- **CRUD Operations**: Users can create, read, update, and delete artists, albums, and songs.
- **Gen AI Search**: An advanced search feature that uses the Gemini API to retrieve relevant information from the music library database. 
     - To use the Gemini API for free, you need:
     - **Gemini API Key**: Get your API key from Google AI Studio.
     - **VPN**: Use a VPN to emulate that you are in the USA to access the Gemini API for free.
     

## Prerequisites

- Node.js and npm
- Python and pip
- MongoDB - install from here https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.12-signed.msi

## Getting Started

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/psilly-billy/dml.git
    cd <repository_directory>
    ```

2. Create a virtual environment and activate it:
    ```sh
    python -m venv env
    source env/bin/activate   # On Windows, use `env\\Scripts\\activate`
    ```

3. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

4. Start MongoDB:
    ```sh
    mongod
    ```

5. Import initial data into MongoDB:
    ```sh
    cd ../backend
    python scripts/import.py
    ```

6. Run the Flask in the backend folder:
    ```sh
    flask run
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install the required packages:
    ```sh
    npm install
    ```

3. Start the React frontend:
    ```sh
    npm start
    ```


## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Use the search bar to find artists, albums, or songs.
3. Use the CRUD operations to manage the music library.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
