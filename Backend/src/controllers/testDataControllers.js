const pool = require("../config/db.js");

exports.getTestsData = async (req, res) => {
  const { userid } = req.body;
  try {
    const TestData = await pool.query(
      "SELECT * FROM Available_Tests WHERE Testno NOT IN (SELECT testno FROM Users_Attempted_Tests WHERE user_id = $1);",
      [userid],
    );
    res.status(200).json({ success: true, data: TestData.rows });
  } catch (err) {
    console.error("Error verifying user: ", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ADMIN SIDE CONTROLLERS
exports.getAllTests = async (req, res) => {
  try {
    const TestData = await pool.query("SELECT * FROM Available_Tests;");
    res.status(200).json({ success: true, data: TestData.rows });
  } catch (err) {
    console.error("Error fetching data: ", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getQuesAns = async (req, res) => {
  const { testno } = req.body;
  try {
    const TestQues = await pool.query(
      "SELECT a.duration_minutes, q.question_id, q.question, q.marks , o.option_id, o.option_text FROM Available_Tests as a JOIN MCQ_Questions as q ON q.Testno = a.Testno JOIN MCQ_Options o ON q.question_id = o.question_id WHERE q.testno = $1;",
      [testno],
    );

    res.status(200).json({
      success: true,
      data: TestQues.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in fetching data!!",
    });
  }
};

exports.getAttemptedTestsData = async (req, res) => {
  const { userid } = req.body;
  try {
    const attemptedTestsData = await pool.query(
      "SELECT a.Test_title, a.total_marks, u.testno, u.marks_scored, u.attempted_at FROM Users_Attempted_Tests as u JOIN Available_Tests as a ON u.testno = a.Testno WHERE user_id = $1;",
      [userid],
    );

    res.status(200).json({
      success: true,
      data: attemptedTestsData.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in fetching data!!",
    });
  }
};

exports.getTestResults = async (req, res) => {
  const { userid, testno } = req.body;

  try {
    const response = await pool.query(
      "SELECT q.question, q.marks, o_user.option_text AS selected_option, o_correct.option_text AS correct_option, o_user.is_correct AS is_correct, CASE WHEN o_user.is_correct THEN q.marks ELSE 0 END AS marks_scored FROM MCQ_User_Answers ua JOIN MCQ_Questions q ON ua.question_id = q.question_id JOIN MCQ_Options o_user ON ua.selected_option_id = o_user.option_id JOIN MCQ_Options o_correct ON q.question_id = o_correct.question_id AND o_correct.is_correct = TRUE WHERE ua.user_id = $1 AND ua.testno = $2;",
      [userid, testno],
    );

    res.status(200).json({
      success: true,
      data: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error!!",
    });
  }
};
