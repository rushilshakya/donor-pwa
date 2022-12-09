const ethers = require("ethers");
const axios = require("axios");
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(otpRoute, {
  cookieName: "secret_otp",
  password: "password@12345678910112231123213213",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

async function otpRoute(req, res) {
  if (req.method === "POST") {
    const phoneNumber = req.body.phoneNum;
    console.log("the req session is", req.session);
    if (phoneNumber) {
      let wallet = new ethers.Wallet(
        "0x8fb2d8e49fdc7bb4cc946e41813f335024eb766300cada35f80545341d19273f"
      );
      console.log("Wallet address:", wallet.address);

      const signature = await wallet.signMessage("rumsan");

      const otp = Math.floor(1000 + Math.random() * 9000);

      if (Object.keys(req.session).length) {
        console.log("the if entered");
        req.session = {
          ...req.session,
          otp,
        };
      } else {
        console.log("the else entered");
        req.session = {
          otp,
          tries: 5,
        };
      }
      console.log("the line 40 ", req.session);
      await req.session.save();
      res.send({ ok: true });

      const { data } = await axios.post(
        `https://services.rumsan.net/sms`,
        { phone: 9991109671, message: JSON.stringify(otp) },
        {
          headers: {
            signature,
          },
        }
      );
      console.log(data);
    } else {
      res.status(400).json({ msg: "Please specificy your phone number" });
    }
  }
}
