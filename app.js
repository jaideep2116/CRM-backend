require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')

require('./db/conn');

// const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//     console.log(`Master process ${process.pid} is running`);
  
//     for (let i = 0; i < numCPUs; i++) {
//       cluster.fork();
//     }
  
//     cluster.on('exit', (worker, code, signal) => {
//       console.log(`Worker process ${worker.process.pid} died. Restarting...`);
//       cluster.fork();
//     });
//   } else {
    const app = express();
    const authRouter = require('./routers/authRoutes.js');
    const fieldRouter = require('./routers/fieldRoutes.js');
    const client = require('./routers/clientRoutes.js');
    const empRouter = require('./routers/empRouters.js');
    const TLRouter = require('./routers/teamLeaderRouter.js');
    const messageRouter = require('./routers/messageRouter.js');
    const landingPageRouter = require('./routers/landingPages/landingPageRouter.js');
    const accountRouter = require('./routers/account/accountRouter.js');
    app.use(cookieParser());
    const allowedOrigins = [
        'http://88.222.214.93:3000',
        'https://account-project.netlify.app',
        'http://localhost:3000'
    ];
    
    // CORS configuration
    const corsOptions = {
        origin: function (origin, callback) {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allow specific HTTP methods
    };
    app.use(cors(corsOptions));
   
    app.use(cors());
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({ extended: true })); 

    app.use("/auth",authRouter);
    app.use("/field",fieldRouter);
    app.use("/client",client);
    app.use("/emp",empRouter);
    app.use('/tl',TLRouter);
    app.use("/message", messageRouter);
    app.use("/landingPage", landingPageRouter);
    app.use("/account", accountRouter);
    const port = 8080;
    app.listen(port, ()=>{
        console.log(`server is running ${port}`);
    })

//   }
