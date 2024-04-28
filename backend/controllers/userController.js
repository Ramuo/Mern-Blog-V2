import bcrypt from "bcryptjs";
import asyncHandler from '../middlewares/asyncHandler.js';
import User  from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';



//@desc     Login user & and get the token (signin)
//@route    POST /api/users/login
//@access   Public
const login = asyncHandler(async(req, res) => {
   const {email, password} = req.body;

   //Let us find a user
   const user = await User.findOne({ email });

   // Let's validate user cedentials
   if(user && (await user.matchPassword(password))){
    generateToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
   }else{
    res.status(401);
    throw new Error("Email ou mot de passe invalide");
   }
});


//@desc     Register new user (signup)
//@route    POST /api/users
//@access   Public
const register = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    // Find user by email
    const userExist = await User.findOne({ email });

    // Check if user exist alredy
    if(userExist){
        res.status(400);
        throw new Error("L'utilistaur existe déjà")
    };

    //To create new user it does'nt exist
    const user = await User.create({
        name,
        email,
        password
    });

    //Once user created, then set it into db
    if(user){
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }else{
        res.status(400);
        throw new Error("Information invalide")
    };

});


//@desc     Login with google
//@route    POST /api/users/login
//@access   Public
const google = asyncHandler(async (req, res) => {
    const { email, name, googlePhotoUrl } = req.body;

        const user = await User.findOne({ email });
        if(user){
            generateToken(res, user._id);

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture
            });
            
        }else{
            const generatedPassword = 
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);


            const user = await User.create({
                name: name.toLowerCase().split(' ').join('') +  Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            });

            if(user){
                generateToken(res, user._id);

                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    profilePicture: user.profilePicture
                })
            }
        }
    res.status(400);
    throw new Error("Une erreur s'est produite avec google");  
});


//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    //Check if user 
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        user.isAdmin = Boolean(req.body.isAdmin);

        //Let's check if in the request sent, if there is a password
        if(req.body.password){
            user.password = req.body.password
        };

        //Save the updated changes
        const updatedUser = await user.save();
        console.log(updatedUser);

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture: updatedUser.profilePicture,
        });
        
    }else{
        res.status(404);
        throw new Error("Utilisateur non trové")
    }; 

});

//@desc     Delete User Profile 
//@route    DELETE /api/users/:id
//@access   Private 
const deleteUser = asyncHandler (async ( req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error("Vous ne pouver pas supprimé un utilisateur Admin")
        };
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: "Utilisateur supprimé"})
    }else{
        res.status(404);
        throw new Error("Utilisateur non trouvé");
    }   
});

//@desc     Get All Users 
//@route    GET /api/users
//@access   Private/admin
const getUsers = asyncHandler(async(req, res)=>{
    if (!req.user.isAdmin) {
        res.status(404);
        throw new Error("You are not allowed to see all users");
      }
      try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
        const users = await User.find()
          .sort({ createdAt: sortDirection })
          .skip(startIndex)
          .limit(limit);
    
        const usersWithoutPassword = users.map((user) => {
          const { password, ...rest } = user._doc;
          return rest;
        });
    
        const totalUsers = await User.countDocuments();
    
        const now = new Date();
    
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
    
        res.status(200).json({
          users: usersWithoutPassword,
          totalUsers,
          lastMonthUsers,
        });
      } catch (error) {
        res.status(404);
        throw new Error("You are not allowed to see all users");
      }
});

//@desc     Get user by ID
//@route    GET /api/users/:id
//@access   Public
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user)
    }else{
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});


//@desc     Update User  
//@route    PUT /api/users/:id
//@access   Private/admin 
const updateUser = asyncHandler (async ( req, res) => {
        
});
 
 //@desc     Logout user / clear the cookie
 //@route    POST /api/users/logout
 //@access   Private
 const logout = asyncHandler(async(req, res) => {
    res.clearCookie('jwt');
     res.status(200).json({message: "Déconnecté avec succès"});
 });

//@desc     Get  User Profile
//@route    GET /api/users/profile
//@access   Private 
const getProfile = asyncHandler (async ( req, res) => {
    res.json("Get User Profile");
    
});








export {
    register,
    login,
    google,
    logout,
    getProfile,
    getUserById,
    updateUserProfile,
    getUsers,
    updateUser,
    deleteUser
};

