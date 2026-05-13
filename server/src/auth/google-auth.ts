import { PassportStatic } from "passport";
import google from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DB_NAME, DB_USER, DB_HOST, DB_PASS } from "../config/private_keys";
import { logs } from "../app";
import { SLEGO_SERVICE } from "../init";
import { db } from "../db";

export function useGoogleLogin(passport: PassportStatic) {
  var GoogleStrategy = google.Strategy;

  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://ganaye.com/" + SLEGO_SERVICE + "/auth/google/callback"
  },
    async function (accessToken, refreshToken, profile, cb) {
      //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      logs.push("accessToken:" + JSON.stringify(accessToken))
      logs.push("refreshToken:" + JSON.stringify(refreshToken))
      logs.push("profile:" + JSON.stringify(profile))
      let err = null;
      // });
      try {
        //const user = { id: "user1" } 
        const user = await findOrCreateUser(profile);
        return cb(null, user!);
      } catch (err: any) {
        return cb(err);
      }
      // return cb(err, { id: "user1" });

    }
  ));
}


async function findOrCreateUser(profile: any) {
  var googleId = profile.id;
  const [rows]: any = await db.query('SELECT * FROM user WHERE googleId = ?', [googleId]);

  if (rows.length > 0) {
    return rows[0];
  } else {
    const userData = JSON.stringify(profile);
    const [result]: any = await db.query('INSERT INTO user (googleId, userData) VALUES (?, ?)', [googleId, userData]);
    const [newRows]: any = await db.query('SELECT * FROM user WHERE userId = ?', [result.insertId]);
    return newRows[0];
  }
}
