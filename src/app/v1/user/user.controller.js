import { genToken } from 'Utils/authentication';
import userModel from './user.model';
import { comparePass, encryptPass } from '../../../Utils/cryptPass';
import { uploadOneFile } from 'Utils/cloudFile';

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: 'Las credenciales ingresadas son invalidas',
      success: false,
      error: true,
    });
  }
  const isMatch = await comparePass(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      message: 'Las credenciales ingresadas son invalidas',
      success: false,
      error: true,
    });
  }
  const tokenData = {
    _id: user._id,
    email: user.email,
  };
  const token = genToken(tokenData);

  const tokenOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  };

  return res.cookie('token', token, tokenOptions).json({
    message: 'Login success',
    data: token,
    success: true,
    error: false,
  });
};

export const signUp = async (req, res) => {
  const { name, email, password, profilePic} = req.body;
  const user = await userModel.findOne({ email });

  if (!profilePic) {
    return res.status(400).json({
      message: 'Not file uploaded',
      error: true,
      success: false,
    });
  }

  if (user) {
    return res.status(409).json({
      message: 'El email ya esta registrado, por favor ingrese otro',
      error: true,
      success: false,
    });
  }
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Todos los campos son requeridos',
      error: true,
      success: false,
    });
  }

  const hashPassword = await encryptPass(password);

  try {
    let image = {};
    const result = await uploadOneFile(
      profilePic,
      'techplanet/users',
    );
    image = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
    const newUser = {
      name,
      email,
      password: hashPassword,
      profilePic: image,
    };
    const saveUser = await userModel.create(newUser);
    return res.status(201).json({
      data: saveUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const test = async (req, res) => {
  return res.json({ test: 'Esto es una prueba' });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');

    res.json({
      message: 'Cerró sesión exitosamente',
      error: false,
      success: true,
      data: [],
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  const sessionUserId = req.userId;
  const sessionUser = await userModel.findById(sessionUserId);

  const { userId, name, email, role } = req.body;
  const user = await userModel.findOne({ userId });
  const verifyEmail = await userModel.findOne({ email });

  if (sessionUser.role === 'admin') {
    if(user){
      if (user?.email !== email && verifyEmail) {
        return res.status(400).json({
          message: 'El email ya esta en uso',
          error: true,
          success: false,
        });
      }
    }

    console.log(userId);

    const payload = {
      ...(email && { email: email }),
      ...(name && { name: name }),
      ...(role && { role: role }),
    };
    try {
      const data = await userModel.findByIdAndUpdate(userId, payload);
      return res.status(200).json({
        data,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: 'No estas autorizado para realizar esa accion',
      error: true,
      success: false,
    });
  }
};

export const getAllUsers = async (req, res) => {
  const sessionUserId = req.userId;
  const sessionUser = await userModel.findById(sessionUserId);

  if (sessionUser.role === 'admin') {
    try {
      const allUsers = await userModel.find();

      res.status(200).json({
        data: allUsers,
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  } else {
    return res.status(401).json({
      message: 'No estas autorizado para realizar esa accion',
      error: true,
      success: false,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const sessionUserId = req.userId;
    const user = await userModel.findById(sessionUserId);

    res.status(200).json({
      data: user,
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
