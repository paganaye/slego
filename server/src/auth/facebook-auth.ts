import facebook from "passport-facebook";

import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from "../config/private_keys";
import { logs } from "../app";
import { SLEGO_SERVICE } from "../init";
import { PassportStatic } from "passport";
import { db } from "../db";

export function useFacebookLogin(passport: PassportStatic) {
  var FacebookStrategy = facebook.Strategy;

  passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "https://ganaye.com/" + SLEGO_SERVICE + "/auth/facebook/callback"
  },

    async function (accessToken, refreshToken, profile, cb) {
      //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
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
  var facebookId = profile.id;
  const [rows]: any = await db.query('SELECT * FROM user WHERE facebookId = ?', [facebookId]);

  if (rows.length > 0) {
    return rows[0];
  } else {
    const userData = JSON.stringify(profile);
    const [result]: any = await db.query('INSERT INTO user (facebookId, userData) VALUES (?, ?)', [facebookId, userData]);
    const [newRows]: any = await db.query('SELECT * FROM user WHERE userId = ?', [result.insertId]);
    return newRows[0];
  }
}
