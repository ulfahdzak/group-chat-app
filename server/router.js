const express = require("express");
const router = express.Router();
const db = require("./config");

router.get("/", (req, res) => res.redirect("http://localhost:3000/"));

// CREATE NEW ACCOUNT
router.post("/api/create/member", (req, res) => {
  const {
    user_id,
    user_name,
    user_email,
    user_pic,
    user_pass,
    user_gender,
  } = req.body;
  const SQLQuery =
    "INSERT INTO user (id_user , user_name , user_pass , user_pic , user_gender , user_email) VALUES (?,?,?,?,?,?)";
  db.query(
    SQLQuery,
    [user_id, user_name, user_pass, user_pic, user_gender, user_email, user_id],
    (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        console.log(err);
      }
    }
  );
});

// GET USER
router.get("/api/get/member/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  const selectQuery = "SELECT * FROM user where id_user = ?";
  db.query(selectQuery, user_id, (err, result) => res.send(result));
});

// GET USER BY EMAIL
router.get("/api/get/member/email/:user_email", (req, res) => {
  const { user_email } = req.params;
  const selectQuery = "SELECT id_user FROM user where user_email = ?";
  db.query(selectQuery, user_email, (err, result) => res.send(result));
});

// GET ALL USER
router.get("/api/get/member", (req, res) => {
  const selectQuery = "SELECT id_user, user_email, user_name FROM user";
  db.query(selectQuery, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

// CREATE NEW GROUP
router.post("/api/create/group", (req, res) => {
  const { id_user, id_group, group_name, status } = req.body;
  const groupStatus = status ? 1 : 0;
  const insertGroupQuery =
    "INSERT INTO groups(id_group, group_name, group_status) VALUES(?,?,?); INSERT INTO request(id_user,id_group,status) VALUES(?,?,'admin')";
  db.query(
    insertGroupQuery,
    [id_group, group_name, groupStatus, id_user, id_group],
    (err, result) => {
      if (!err) {
        console.log(result);
        res.send(result);
      } else {
        console.log(err);
      }
    }
  );
});

// SELECT GROUP BY USER
router.get("/api/get/group/:user_id", (req, res) => {
  const id_user = req.params.user_id;
  const selectQuery = `SELECT DISTINCT groups.id_group, group_name, group_status, request.status from user JOIN request JOIN groups where user.id_user = request.id_user AND 
  groups.id_group = request.id_group AND 
  user.id_user = ? ORDER BY groups.timestamp DESC`;
  db.query(selectQuery, id_user, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});

// SELECT PUBLIC GROUP
router.get("/api/get/group", (req, res) => {
  const selectQuery = `SELECT  r.id_group, group_name, r.id_user, COUNT(r.id_user) AS member FROM groups g JOIN request r JOIN user u WHERE r.status NOT IN("pending") AND g.id_group = r.id_group AND r.id_user = u.id_user AND g.group_status = true GROUP BY(r.id_group) ORDER BY g.timestamp DESC`;
  db.query(selectQuery, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});

// JOIN NEW GROUP
router.post("/api/join/group", (req, res) => {
  const { id_user, id_group } = req.body;
  const insertQuery = `INSERT INTO request(id_user,id_group,status) VALUES(?,?,"member")`;
  db.query(insertQuery, [id_user, id_group], (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});

// GET GROUP STATUS
router.get("/api/get/group/request/:id_group/:id_user", (req, res) => {
  const { id_group, id_user } = req.params;
  const userStatus = `SELECT group_name , status FROM request JOIN groups WHERE request.id_group = groups.id_group AND id_user = ? AND request.id_group= ?`;
  db.query(userStatus, [id_user, id_group], (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

// ADMIN LEAVE GROUP
router.delete("/api/delete/group/:group_id", (req, res) => {
  const { group_id } = req.params;
  const sqlDeleteQuery = "DELETE FROM groups WHERE id_group=?";
  db.query(sqlDeleteQuery, group_id, (err, result) => {
    if (!err) {
      console.log(result);
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

// MEMBER LEAVE GROUP
router.delete("/api/delete/request/:id_user/:group_id/:status", (req, res) => {
  const { id_user, group_id, status } = req.params;
  const sqlDeleteQuery =
    "DELETE FROM request WHERE id_user = ? AND id_group = ? AND status = ?; DELETE FROM message WHERE id_user = ? AND id_group = ?";
  db.query(
    sqlDeleteQuery,
    [id_user, group_id, status, id_user, group_id],
    (err, result) => {
      if (!err) {
        console.log(result);
        res.send(result);
      } else {
        console.log(err);
      }
    }
  );
});

// SEND MESSAGE
router.post("/api/send/message", (req, res) => {
  const { id_message, id_user, id_group, message, timestamp } = req.body;
  const sendQuery = `INSERT INTO message VALUES(?,?,?,?,?)`;
  db.query(
    sendQuery,
    [id_message, id_user, id_group, message, timestamp],
    (err, result) => {
      if (!err) {
        res.send(result);
        console.log(result);
      } else {
        console.log(err);
      }
    }
  );
});

// GET MESSAGE
router.get("/api/get/message/:group_id", (req, res) => {
  const { group_id } = req.params;
  const selectQuery = `SELECT group_name, user_name, user_pic, user_email, message.id_user, message, message.timestamp FROM user JOIN message JOIN groups WHERE user.id_user = message.id_user AND groups.id_group = message.id_group AND message.id_group = ? ORDER BY message.timestamp ASC`;
  db.query(selectQuery, group_id, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

// GET GROUP MEMBER
router.get("/api/get/group/member/:group_id", (req, res) => {
  const { group_id } = req.params;
  const getQuery = `SELECT r.id_user, user_email, user_name, user_pic, r.id_group, group_name, r.status FROM user u JOIN request  r JOIN groups g WHERE u.id_user = r.id_user AND g.id_group = r.id_group AND r.id_group = ? ORDER BY r.status DESC, u.user_name ASC`;
  db.query(getQuery, group_id, (err, result) => {
    if (!err) {
      res.send(result);
    } else {
      console.log(err);
    }
  });
});

// INVITE MEMBER
router.post("/api/invite/member", (req, res) => {
  const { id_user, id_group } = req.body;
  const insertQuery = `INSERT INTO request(id_user,id_group,status) VALUES(?,?,"pending")`;
  db.query(insertQuery, [id_user, id_group], (err, result) => {
    if (!err) {
      res.send(result);
      console.log(result);
    } else {
      console.log(err);
    }
  });
});

// UPDATE MEMBER
router.put("/api/update/member", (req, res) => {
  const { id_user, id_group } = req.body;
  const updateMemberQuery = `UPDATE request SET status="member" WHERE id_user= ? AND id_group= ?`;
  db.query(updateMemberQuery, [id_user, id_group], (err, result) => {
    if (!err) {
      res.send(result);
      console.log(result);
    } else {
      console.log(err);
    }
  });
});

// DECLINE REQUEST
router.delete("/api/delete/request/:id_user/:id_group", (req, res) => {
  const { id_user, id_group } = req.params;
  const deleteGroupQuery = `DELETE FROM request WHERE id_user=? AND id_group=? AND status="pending"`;
  db.query(deleteGroupQuery, [id_user, id_group], (err, result) => {
    if (!err) {
      res.send(result);
      console.log(result);
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
