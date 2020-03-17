const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
// import passport and passport-jwt modules
const passport = require('passport');
const passportJWT = require('passport-jwt');
const cookieParser = require('cookie-parser');
const multer = require('multer');


const { port, userTypeAdmin, userTypeProjectManager, userTypeTeam } = require('./config');

const sequelize = require('./utils/database');
const User = require('./models/user');
// const Role = require('./models/role');
// const UserRole = require('./models/user-role');
const UserType = require('./models/userType');
const Project = require('./models/project');
const ProjectManagerProject = require('./models/projectManager-Projects');
const TeamProject = require('./models/team-Projects');
const Subscribe = require('./models/subscribe')
// const Conversation = require('./models/conversation');
//Routes
const adminRoutes = require('./routes/auth/admin');
const authData = require('./routes/auth/auth');
// const listingRoutes = require('./routes/listing');
const subscribeRoutes = require('./routes/subscribe');





const app = express();

app.use(cookieParser());

app.use( (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies['jwt'];
  }
  return token;
};
// jwtOptions.jwtFromRequest = cookieExtractor;

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    User.findOne( {where: {id: jwt_payload.id, isActive: true}, include: [{model: UserType}]})
    .then(user => {
        if (user) {
            jwtOptions.user = user;
            next(null, user);
          } else {
            next(null, false);
          }
    })
    .catch(err => console.log(err));
  });
  // use the strategy
  passport.use(strategy);

  app.use(passport.initialize());

// app.set('view engine', 'ejs');
// app.set('views', 'views');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyparser.json({ limit: '50mb' }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl'));
app.use(bodyparser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    req.jwtOptions = jwtOptions;
    next();
});


//  ====================== Routes ======================
app.use(authData);
app.use('/admin', adminRoutes);
// app.use('/client', listingRoutes);
// app.use('/subscribe', subscribeRoutes);

//If Page not found
app.use((req, res, next) => {
    res.status(404).json('404 not found');
});


// Relationships
// Role.belongsTo(User);
// User.hasMany(Role);
Project.belongsToMany(User, { through: ProjectManagerProject }); //Project Manager type user
User.belongsToMany(Project, { through: ProjectManagerProject }); //Project Manager type user
// Role.belongsTo(User);
// User.hasMany(Role);
UserType.hasMany(User);
User.belongsTo(UserType);

Project.belongsToMany(User, { through: TeamProject }); // Team member type user
User.belongsToMany(Project, { through: TeamProject }); // Team member type user

// Listing.hasMany(ListingImage);
// ListingImage.belongsTo(Listing);
// User.hasMany(Listing);
// Listing.belongsTo(User);
// Catagory.hasMany(Listing);
// Listing.belongsTo(Catagory);

// // Conversation
// Listing.hasOne(Conversation);
// // Conversation.belongsTo(listing);

// User.hasOne(Conversation);


sequelize
// .sync({ force: true })
.sync()
.then( result => {
    // console.log(result);
    console.log('Connection has been established successfully port ' + process.env.PORT);
    const server = app.listen(process.env.PORT || port);

    const io = require('./socket').init(server);
    io.on('connected', socket => {
      console.log('User Connected');
      socket.on('disconnected', () => console.log('User Disconnected'));
    });
    UserType.findAll().then(userTypes => {
      if(userTypes.length == 0) {
        UserType.create({title: userTypeAdmin});
        UserType.create({title: userTypeProjectManager});
        UserType.create({title: userTypeTeam});
      }
    });
})
.catch( err => console.log(err));
