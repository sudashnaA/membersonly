const pool = require("./pool");

module.exports.getUserByUsername = async (username) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return rows[0];
}

module.exports.getUserByID = async (userid) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
    return rows[0];
}

module.exports.addUser = async (username, firstname, lastname, hash, salt) => {
    await pool.query("INSERT INTO users (username, firstname, lastname, hash, salt, membershipstatus) VALUES ($1, $2, $3, $4, $5, $6)", [username, firstname, lastname, hash, salt, false]);
}

module.exports.grantAccess = async (userid) => {
    await pool.query("UPDATE users SET membershipstatus = true WHERE userid = $1", [userid]);
}