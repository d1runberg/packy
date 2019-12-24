# Packy

Elephants never forget! This baby elephant is no exception. Packy was born from the project named [Phant](https://www.npmjs.com/package/phant) who we are very proud of, but it has seen better days.

![Packy](http://media.oregonlive.com/portland_impact/photo/packy4jpg-f24c15270bcf002e.jpg)

 Packy is a lighter, simpler version of Phant that is designed to be deployed on single board computers as a local service. **NOTE:** _It is **NOT** designed to be scaled beyond a local service in a classroom, home or office._ Packy is designed using Node.js and implements a flat file system rather than a database for ease of use, smaller footprint and simplicity for customizing, hacking and/or bending it to your will.


## Development Projects
- [ ] Detailed descriptions for docs page
- [ ] Copy key(s) to clipboard
- [ ] Email key(s) option if server connected to the the Internet.
- [ ] Functional Download JSON button
- [ ] Functional Download CSV button
- [ ] specify the location for the Streams directory in a config file
- [ ] front end list of all streams
    - [ ] list into html
    - [ ] list item link to stream
- [ ] query a stream using known queries and return a specified format
- [ ] prepare and publish on npm
- [ ] test installation on major SBCs
    - [ ] RaspPi
    - [ ] Edison
    - [ ] Tessel 2
    - [ ] ???


## Installation
### From download (zip)
1. download zip folder
2. unzip
3. in the command line navigate to folder
4. install with `npm install`
5. run with `node index.js`
6. Server should run on http://localhost:5000

### From NPM (Not yet supported)
1. Create a project directory
2. intialize it with `npm init`
3. install packy with `npm install packy`
4. `cd node_packages/packy`
5. start packy with `npm start`
6. navigate to http://localhost:5000

##Use Documentation
### Create a stream

1. use GET request:
  - make a GET request to http://localhost:5000/streams/create/[NAME]?[field1]=&[field2]=&[fieldn]=
  - fill in [field1], etc with your own field names (no []). Leave values blank for creation.
  - Packy will return a private key and a delete key

2. Through UI:
  - navigate to http://localhost:5000/streams/create or click on the Create button on the home page.

### Add Data to a stream
1. use a GET call to add data using a query string with your fields: http://localhost:5000/streams/input/[NAME]/[private key]?[field1]=32&[field2]=85&[fieldn]=Jim

### Delete a Stream
1. Use a GET call to delete a Stream with your delete key:
http://localhost:5000/streams/delete/[NAME]/[delete key]

### Download Data from Stream
1. Use a GET call to download data in document form:
http://localhost:5000/streams/download/[NAME]?format=[FORMAT]

- Packy currently  supports csv and json formats for download

###Clear a Stream
1. Use a GET call to clear a stream of its current data:
http://localhost:5000/streams/clear/[NAME]/[Private Key]?backup=[BOOLEAN]&format[FORMAT]

- backup query is `true` or `false`, if true data will be downloaded. If no format is given it defaults to csv
- format query is either `csv` or `json` currently.

### View Data in Browser
1. Use a GET call to view data in the Browser
http://localhost:5000/streams/view/[NAME]

### Viewing list of streams
1. Use a GET call to view data in the Browser
http://localhost:5000/streams/view
