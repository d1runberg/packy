# Packy

Elephants never forget! This baby elephant is no exception. Packy was born from the project named [Phant](https://www.npmjs.com/package/phant) who we are very proud of, but it has seen better days.

 Packy is a lighter, simpler version of Phant that is small enough to fit on ANY single board computer that can run node.js as well as easier to maintain as a local service.

 ![Packy](http://media.oregonlive.com/portland_impact/photo/packy4jpg-f24c15270bcf002e.jpg)

## From download (zip)
1. download zip folder
2. unzip
3. in the command line navigate to folder
4. install with `npm install`
5. run with `npm start`


## From NPM (Not yet supported)
1. Create a project directory
2. intialize it with `npm init`
3. install packy with `npm install packy`
4. `cd node_packages/packy`
5. start packy with `npm start`
6. navigate to http://localhost:8080

### Create a stream

1. use GET request:
  - make a GET request to http://localhost:8080/streams/create/[NAME]?[field1]=&[field2]=&[fieldn]=
  - fill in [field1], etc with your own field names (no []). Leave values blank for creation.
  - Packy will return a private key and a delete key

2. Through UI:
  - **Under Development**

### Add Data to a stream
1. use a GET call to add data using a query string with your fields: http://localhost:8080/streams/input/[NAME]/[private key]?[field1]=32&[field2]=85&[fieldn]=Jim

### Delete a Stream
1. Use a GET call to delete a Stream with your delete key:
http://localhost:8080/streams/delete/[NAME]/[delete key]

### Download Data from Stream
1. Use a GET call to download data in document form:
http://localhost:8080/streams/download/[NAME]?format=[FORMAT]

- Packy currently  supports csv and json formats for download


### View Data in Browser
1. Use a GET call to view data in the Browser
http://localhost:8080/streams/view/[name]

### Viewing list of streams
1. Use a GET call to view data in the Browser
http://localhost:8080/streams/view
