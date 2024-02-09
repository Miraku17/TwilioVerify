const functions = require("firebase-functions");
const admin = require("firebase-admin");
const client = require("twilio")(
  "accountSid ",
  "authToken"
);

admin.initializeApp();

exports.sendOTP = functions.https.onRequest(async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;

    if (!phoneNumber) {
      res.status(400).send("Phone number is required");
      return;
    }

    // Send OTP
    const verification = await client.verify.v2
      .services("VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log(verification.status);
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sendingOTP");
  }
});

exports.verifyOTP = functions.https.onRequest(async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const otp = req.body.otp;

    if (!phoneNumber || !otp) {
      res.status(400).send("Phone number and OTP are required");
      return;
    }

    //verify the OTP

    const verificationCheck = await client.verify.v2
    .services("VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    .verificationChecks.create({ to: phoneNumber , code: otp });

    if (verificationCheck.status === "approved") {
      res.status(200).send("OTP verified successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error verifying OTP");
  }
});
