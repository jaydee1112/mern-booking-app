Always Remember,
You cannot use process.env.\* (environment variables ) without installing npm install dotenv

Always Remember
To run the test environment, we will use command npm run e2e, as e2e is defined in package.json and will set a cross environment variable to use .env according to the environment

\***\*\*\*\***Deployments on RENDER.COM**\*\***\*\*\***\*\***
Step 1: add tsconfig.json file in backend folder using this command
npx tsc --init npm is for managing packages, while npx is for executing packages.

Step 2: in tsconfig.json, in compilerOptions, add this
"outDir": "./dist",

Step 3: Add these two scripts in package.json
"build": "npm install && npx tsc",
"start": "node ./dist/index.js",

Step 4: run npm build (test by running npm start)

FRONT END

Step 1: in package.json file, add
"build": "tsc && vite build",

Step 2: run npm build

Big thing, we can make a single server run both frontend and backend without using two ports.
app.use(express.static) is a middleware function in Express.js used to serve static files such as images, CSS files, and JavaScript files.
When you call app.use(express.static), you are telling Express to serve static files from a specific directory on your server. For example, if you have a directory named public that contains your static files, you would use app.use(express.static('public')).

Step 3: make express to serve the static files (our frontend folder)
app.use(express.static(path.join(\_\_dirname, '../../frontend/dist')));

cd backend > npm run build > npm start

VERCEL build command
cd frontend && npm install && npm run build && cd ../backend && npm run build

OUTPUT directory in your vercel build configurations is frontend/dist
