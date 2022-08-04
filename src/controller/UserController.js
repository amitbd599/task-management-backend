const JWT = require("jsonwebtoken");
const userModel = require("../models/UserModel");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utility/SendEmailUtility");

//! Registration

exports.registration = (req, res) => {
  let reqBody = req.body;
  userModel.create(reqBody, (error, data) => {
    if (error) {
      res.status(200).json({ status: "Fail", data: error });
    } else {
      res.status(200).json({ status: "Success", data: data });
    }
  });
};

//! Login

exports.login = (req, res) => {
  let reqBody = req.body;

  userModel.aggregate(
    [
      { $match: reqBody },
      {
        $project: {
          _id: 1,
          email: 1,
          fastName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ],
    (error, data) => {
      if (data.length > 0) {
        let Payload = {
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          data: data[0]["email"],
        };
        let token = JWT.sign(Payload, "SecretKey123");
        res
          .status(200)
          .json({ status: "Success", token: token, data: data[0] });
      } else {
        res.status(200).json({ status: "Unauthorized" });
      }
    }
  );
};

//!  Profile Update

exports.profileUpdate = (req, res) => {
  let email = req.headers["email"];
  let reqBody = req.body;

  userModel.updateOne({ email: email }, reqBody, (error, data) => {
    if (error) {
      res.status(400).json({
        status: "Fail",
        data: error,
      });
    } else {
      res.status(200).json({ status: "Success" });
    }
  });
};

// Profile Details For update Profile

exports.updateProfileDetails = (req, res) => {
  let email = req.headers["email"];
  userModel.aggregate(
    [
      { $match: { email: email } },
      {
        $project: {
          _id: 1,
          email: 1,
          fastName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
          password: 1,
        },
      },
    ],
    (error, data) => {
      if (error) {
        res.status(400).json({ status: "Fail", data: error });
        console.log(data);
      } else {
        res.status(200).json({ status: "Success", data: data });
      }
    }
  );
};

exports.RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);

  try {
    // Email Account Query
    let UserCount = await userModel.aggregate([
      { $match: { email: email } },
      { $count: "total" },
    ]);

    if (UserCount.length > 0) {
      //Create OTP
      let CreateOTP = await OTPModel.create({
        email: email,
        otp: OTPCode,
      });
      // Send Email
      let SendEmail = await SendEmailUtility(
        email,
        "Your PIN Code is =" + OTPCode,
        "Task Manager PIN Verification"
      );

      res.status(200).json({ status: "Success", data: SendEmail });
    } else {
      res.status(200).json({ status: "Fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: "Wrong Wrong" });
  }
};

exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let Update = 1;

  try {
    let OTPCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTPCode, status: status } },
      { $count: "total" },
    ]);

    if (OTPCount.length > 0) {
      let OTPUpdate = await OTPModel.updateOne(
        {
          email: email,
          otp: OTPCode,
          status: status,
        },
        {
          email: email,
          otp: OTPCode,
          status: Update,
        }
      );
      res.status(200).json({ status: "Success", data: OTPUpdate });
    } else {
      res.status(200).json({ status: "Fail", data: "Invalid OTP Code" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};

exports.RecoverResetPassword = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPass = req.body["password"];

  let statusUpdate = 1;
  try {
    let OTPUsedCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTPCode, status: statusUpdate } },
      { $count: "total" },
    ]);
    if (OTPUsedCount.length > 0) {
      let PassUpdate = await userModel.updateOne(
        { email: email },
        { password: NewPass }
      );
      res.status(200).json({ status: "Success", data: PassUpdate });
    } else {
      res.status(200).json({ status: "Fail", data: "Something is Wrong!" });
    }
  } catch (e) {
    res.status(200).json({ status: "Fail", data: e });
  }
};
