This is a simple Sudoku application built in React. It provides a frontend that
renders the board. And a server which can generate and solve boards. The server is not strictly necessary since the Sudoku solving and board generation could be written in Javascript but this is also an exercise in networking among multiple Docker containers.

The frontend code is in `frontend/`  
The server code is in `server/`  

See http://sudoku.benrifkind.com:8080/ for the code in action.


### Development
Run `make develop`  
This will spin up a docker container for the frontend which serves the React app and a docker container for the server which solves and generates Sudoku boards.  
The frontend can be accessed in the browser at: 
```
FRONTEND_HOST:FRONTEND_PORT
```
THe backend can be accessed at:
```

REACT_APP_SERVER_HOST:REACT_APP_SERVER_PORT
```
See `docker-compose.yml` for the value of these variables.


### Deployment
I deployed this using `docker-machine` on AWS. There is an EC2 machine that is running the docker containers. The DNS of the EC2 machine is `sudoku.benrifkind.com`. This is equivalent to running `docker-compose up` locally and navigating to the localhost in the browser. In production the localhost is the EC2 machine and its IP address is exposed.  
The deployment procedure for me was to first use docker-machine to create a docker host on EC2
```
docker-machine create --driver amazonec2 --amazonec2-vpc-id vpc-***** --amazonec2-region us-east-2  name_of_instance
```
Point docker to this machine:
```bash
docker-machine ls  # To find the instance name
docker env name_of_instance
```
And then run
```bash
docker-compose --file docker-compose.production.yml up -d
```
This runs `docker-compose up` in the EC2 machine with production settings.

Similar to development, you need to specify the FRONTEND_HOST and REACT_APP_SERVER_HOST in docker-compose.production.yml. These should be the DNS of the machine that is hosting the app.  
You also need to make sure that the FRONTEND_HOST:FRONTEND_PORT is accessible. 
In AWS, this can be done by navigating:  
 Instances -> Security Groups -> Inbound (Tab)  
and adding a custom TCP Rule
