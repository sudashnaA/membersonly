const pool = require("./pool");

module.exports.createPost = async (userid, title, text) => {
    await pool.query("INSERT INTO posts (userid, title, text) VALUES ($1, $2, $3)", [userid, title, text]);
};

module.exports.getAllPosts = async () => {
    const { rows } = await pool.query("SELECT postsid, posts.userid, username, title, timestamp, text FROM posts JOIN users ON posts.userid = users.userid;");
    return rows;
};

module.exports.deletePostByID = async (postid) => {
    await pool.query("DELETE FROM posts WHERE postsid = $1", [postid]);
};
