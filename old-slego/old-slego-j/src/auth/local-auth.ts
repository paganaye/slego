import { PassportStatic } from "passport";
import local from "passport-local";
import { logs } from "../app";
import { db } from "../db";
import crypto from 'crypto';
import { PASSWORD_SALT } from "../config/private_keys";

export function useLocalLogin(passport: PassportStatic) {
  var LocalStrategy = local.Strategy;

  passport.use(new LocalStrategy(
    async function (username: string, password: string, cb: any) {
      try {
        const user = await findOne(username);
        if (!user) { return cb(null, false); }
        if (await verifyPassword(user, username, password)) cb(null, { username, provider: "local" });
        else return cb( "Wrong password");
      } catch (err: any) {
        return cb(err);
      }
    }
  ));
}

async function findOne(username: string) {
  const [rows]: any = await db.query('SELECT * FROM user WHERE localId = ?', [username]);
  return rows && rows[0];
}

async function verifyPassword(user: any, username: string, password: string) {
  const hash = await hashPassword(username + " " + password)
  let userData = JSON.parse(user.userData);
  let expectedHash = userData.hash;
  return (hash === expectedHash);
}


async function hashPassword(password: string, salt = PASSWORD_SALT, keyLength = 64) {
  // Hash the password with the fixed salt
  const hashedPassword = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10_000, keyLength, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return hashedPassword;
}