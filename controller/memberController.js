import jwt from "jsonwebtoken";
import database from "../service/database.js";
import bcrypt from "bcrypt";
export async function postMember(req, res) {
  console.log(`Post Member is req`);
  try {
    if (req.body.memEmail == null || req.body.memName == null) {
      //   return res.status(422).json({ error: `Email and Name is required` });
      return res.json({ regist: false });
    }

    const existRowResult = await database.query({
      text: `SELECT EXISTS (SELECT * FROM members WHERE "memEmail" = $1)`,
      values: [req.body.memEmail],
    });

    if (existRowResult.rows[0].exists) {
      return res.json({
        regist: false,
        message: `member ${req.body.memEmail} is exists`,
      });
    }
    const pwd = req.body.password;
    const saltround = 11;
    const pwdHash = await bcrypt.hash(pwd, saltround);
    const result = await database.query({
      text: `INSERT INTO members ("memEmail","memName","memHash") VALUES($1,$2,$3)`,
      values: [req.body.memEmail, req.body.memName, pwdHash],
    });

    const bodyData = req.body;
    bodyData.regist = true;
    const datetime = new Date();
    bodyData.createDate = datetime;
    res.json(bodyData);
  } catch (error) {
    return res.json({ regist: false, message: error });
  }
}
export async function loginUser(req, res) {
  console.log(`Post /loginUser is req`);
  const bodyData = req.body;
  try {
    if (req.body.loginName == null || req.body.password == null) {
      //   return res.status(422).json({ error: `Email and Password is required` });
      return res.json({ login: false });
    }

    const existRowResult = await database.query({
      text: `SELECT EXISTS (SELECT * FROM members m WHERE m."memEmail" = $1)`,
      values: [req.body.loginName],
    });

    if (!existRowResult.rows[0].exists) {
      //   return res.status(409).json({ messageLogin: `login fail` });
      return res.json({ login: false });
    }
    // const pwd = req.body.password;
    // const pwdHash = await bcrypt.hash(pwd, saltround);
    const result = await database.query({
      text: `SELECT * FROM members m WHERE m."memEmail"=$1`,
      values: [req.body.loginName],
    });
    // console.log(result.rows[0].memHash);
    const loginOk = await bcrypt.compare(
      req.body.password,
      result.rows[0].memHash
    );
    if (loginOk) {
      const theuser = {
        memEmail: result.rows[0].memEmail,
        memName: result.rows[0].memName,
        dutyId: result.rows[0].dutyId,
      };
      const secret_key = process.env.SECRET_KEY;
      const token = jwt.sign(theuser, secret_key, {
        expiresIn: "1h",
      });
      res.cookie('token', token, {
        maxAge: 3600000,
        secure: true,
        sameSite: "none",
      });
      //   res.status(201).json({ messageLogin: `login success` });
      return res.json({ login: true });
    } else {
      res.clearCookie("token", {
        secure: true,
        sameSite: "none",
      });
      //   res.status(400).json({ messageLogin: `login fail` });
      return res.json({ login: false });
    }
  } catch (error) {
    // return res.status(500).json({ error: error.message });
    return res.json({ login: false });
  }
}
export async function logOutUser(req, res) {
  console.log(`Get /logout is req`);
  try {
    res.clearCookie("token", { secure: true, sameSite: "none" });
    return res.json({ login: false });
    
  } catch (error) {
    return res.json({ login: true });
  }
}
