const pool = require("../config/db.js");

exports.storeTestBasicInfo = async (req, res) => {
  const { testno, testtype, totalmarks, duration, testTitle } = req.body;

  try {
    await pool.query(
      "INSERT INTO Available_Tests (Testno, total_marks, test_type, duration_minutes, test_Title, no_ques) VALUES ($1, $2, $3, $4, $5, $6);",
      [testno, totalmarks, testtype, duration, testTitle, 10],
    );

    res.status(200).json({
      success: true,
      message: "Test created successfully!",
      marks: totalmarks,
      testno: testno,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Test number already exists",
      });
    }
    throw err;
  }
};

exports.storeQuesAnsInfo = async (req, res) => {
  const { question, testno, marks, answer, options } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const questionResult = await client.query(
      `INSERT INTO MCQ_Questions (Testno, question, marks)
       VALUES ($1, $2, $3)
       RETURNING question_id`,
      [testno, question, marks],
    );

    const questionId = questionResult.rows[0].question_id;

    for (const opt of options) {
      await client.query(
        `INSERT INTO MCQ_Options (Testno, question_id, option_text, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [testno, questionId, opt, opt === answer],
      );
    }

    await client.query("COMMIT");

    res.status(200).json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error inserting MCQ:", err);

    res.status(500).json({
      success: false,
      message: "Failed to store MCQ question",
    });
  } finally {
    client.release();
  }
};

exports.storeQuesCount = async (req, res) => {
  const { testno } = req.body;

  try {
    await pool.query(
      "UPDATE Available_Tests SET no_ques = ( SELECT COUNT(*) FROM MCQ_Questions WHERE MCQ_Questions.testno = Available_Tests.Testno) WHERE Testno = $1;",
      [testno],
    );

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to store MCQ question",
    });
  }
};

exports.submitMCQs = async (req, res) => {
  const { testno, userid, answers } = req.body;

  try {
    const QuesIds = Object.keys(answers).map(Number);
    const optionIds = Object.values(answers).map(Number);

    const scoreResult = await pool.query(
      `
      SELECT COALESCE(SUM(q.marks), 0) AS score
      FROM MCQ_Options o
      JOIN MCQ_Questions q ON q.question_id = o.question_id
      WHERE o.option_id = ANY($1::int[])
      AND o.is_correct = true
      AND q.testno = $2;
      `,
      [optionIds, testno],
    );

    const score = scoreResult.rows[0].score;

    await pool.query(
      `
      INSERT INTO Users_Attempted_Tests (user_id, Testno, Marks_Scored)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, Testno)
      DO UPDATE SET Marks_Scored = EXCLUDED.Marks_Scored
      `,
      [userid, testno, score],
    );

    for (let i = 0; i < QuesIds.length; i++) {
      await pool.query(
        `
        INSERT INTO MCQ_User_Answers (user_id, testno, question_id, selected_option_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, question_id)
        DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id
        `,
        [userid, testno, QuesIds[i], optionIds[i]],
      );
    }

    res.status(200).json({ success: true, score });
  } catch (err) {
    console.error("Error calculating score:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit test",
    });
  }
};
