# Internet Gateway Manager

This is a web application for managing internet gateways.

a demo of the app is available at [https://gateways-manager.mohamednagah.com/](https://gateways-manager.mohamednagah.com/)

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository from GitHub:

```
git clone https://github.com/mohamednaga7/managing-gateways.git
```

2. Navigate to the project directory:

```
cd managing-gateways
```

3. Start the application with Docker Compose:

```
docker compose -f docker-compose.dev.yml up -d
```

This will start a mongodb instance along with the application code, backend server and frontend code served with nginx.

the app will start in detached mode, which means it will run in the background. You can access the application at [http://localhost:8000](http://localhost:8000).

## Usage

Once the application is running, you can use it to manage your internet gateways. Here are the available endpoints:

- `/gateways`: Returns a list of all gateways.
- `/gateways/:id`: Returns a single gateway by ID.
- `/devices`: Returns a list of all devices.

## Development

If you want to modify the code, you can do so and then rebuild the Docker image with:

```

docker compose -f docker-compose.dev.yml up -d --build

```

This will rebuild the image with your changes, then it will start the app automatically

4. To stop the app, run the following command

```
docker compose down
```
