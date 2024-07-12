const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const os = require("os");
const excel = require("exceljs");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// MySQL database configuration
const db = mysql.createConnection({
  host: "corusview-it.cn8suoemkml0.us-east-2.rds.amazonaws.com",
  user: "corusview",
  password: "corusviewitservices",
  database: "corusview_it",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

const imagesPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(imagesPath));

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

// Multer storage configuration
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("Only images are allowed with extensions jpeg, jpg, png, gif")
    );
  }
};

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
// ========================HOME PAGE==========================
app.put("/main_table", uploadImage.none(), (req, res) => {
  const { heading_1, heading_2, about_us, recent_work_heading } = req.body;

  // Check if the record with id=1 exists
  db.query("SELECT * FROM main_table WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // If record exists, update it
      const existingRecord = results[0];
      const updatedRecord = {
        heading_1: heading_1 || existingRecord.heading_1,
        heading_2: heading_2 || existingRecord.heading_2,
        about_us: about_us || existingRecord.about_us,
        recent_work_heading:
          recent_work_heading || existingRecord.recent_work_heading,
      };

      db.query(
        "UPDATE main_table SET heading_1 = ?, heading_2 = ?, about_us = ?, recent_work_heading = ? WHERE id = 1",
        [
          updatedRecord.heading_1,
          updatedRecord.heading_2,
          updatedRecord.about_us,
          updatedRecord.recent_work_heading,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      // If record does not exist, insert a new one
      db.query(
        "INSERT INTO main_table (heading_1, heading_2, about_us, recent_work_heading) VALUES (?, ?, ?, ?)",
        [heading_1, heading_2, about_us, recent_work_heading],
        (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: "Record inserted successfully" });
        }
      );
    }
  });
});
app.get("/main_table", (req, res) => {
  db.query("SELECT * FROM main_table WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const record = results[0];
      res.json(record);
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });
});
// ======================SERVICES PAGE====================
// Home page our services section
app.post("/our_services", uploadImage.single("icon_img"), (req, res) => {
  const { heading, content } = req.body;
  const icon_img_originalname = req.file ? req.file.originalname : null;
  const icon_img = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO our_services ( icon_img, icon_img_originalname, heading, content) VALUES ( ?, ?, ?, ?)",
    [icon_img, icon_img_originalname, heading, content],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Record inserted successfully" });
    }
  );
});
app.put("/our_services/:id", uploadImage.single("icon_img"), (req, res) => {
  const { id } = req.params;
  const { heading, content } = req.body;
  const icon_img_originalname = req.file ? req.file.originalname : null;
  const icon_img = req.file ? `/uploads/${req.file.filename}` : null;

  // Fetch existing record
  db.query("SELECT * FROM our_services WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const oldRecord = results[0];

    const updatedRecord = {
      heading: heading || oldRecord.heading,
      content: content || oldRecord.content,
      icon_img: icon_img || oldRecord.icon_img,
      icon_img_originalname:
        icon_img_originalname || oldRecord.icon_img_originalname,
    };

    // Update record in database
    db.query(
      "UPDATE our_services SET heading = ?, content = ?, icon_img = ?, icon_img_originalname = ? WHERE id = ?",
      [
        updatedRecord.heading,
        updatedRecord.content,
        updatedRecord.icon_img,
        updatedRecord.icon_img_originalname,
        id,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Delete old image if new image is uploaded
        if (req.file && oldRecord.icon_img) {
          const oldImagePath = path.join(__dirname, oldRecord.icon_img);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old image:", err);
            }
          });
        }

        res.json({ message: "Record updated successfully" });
      }
    );
  });
});
app.get("/our_services", (req, res) => {
  db.query("SELECT * FROM our_services", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Modify icon_img to include full URL
    const modifiedResults = results.map((record) => ({
      ...record,
      icon_img: `http://${req.hostname}:${PORT}${record.icon_img}`,
    }));

    res.json(modifiedResults);
  });
});
app.get("/getOurServicesHeading", (req, res) => {
  db.query("SELECT id, heading FROM our_services", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// service page heading content
app.post("/services_details", uploadImage.none(), (req, res) => {
  const { service_id, services_heading, services_content } = req.body;

  // Validate incoming data
  if (!service_id || !services_heading || !services_content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if a record with the same service_id already exists
  const checkSql = "SELECT * FROM services_details WHERE service_id = ?";
  db.query(checkSql, [service_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking for existing service_id:", checkErr);
      return res.status(500).json({ error: "Database error" });
    }

    if (checkResult.length > 0) {
      // Record with the same service_id already exists
      return res
        .status(400)
        .json({ error: "Record with the same service_id already exists" });
    }

    // Insert data into services_details table
    const insertSql =
      "INSERT INTO services_details (service_id, services_heading, services_content) VALUES (?, ?, ?)";
    const values = [service_id, services_heading, services_content];

    db.query(insertSql, values, (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error inserting into services_details:", insertErr);
        return res.status(500).json({ error: "Database error" });
      }
      console.log("Inserted into services_details:", insertResult);
      return res.status(200).json({ message: "Data inserted successfully" });
    });
  });
});
app.put("/services_details/:id", uploadImage.none(), (req, res) => {
  const { id } = req.params;
  const { service_id, services_heading, services_content } = req.body;

  // Validate incoming data
  if (!service_id && !services_heading && !services_content) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update" });
  }

  // Fetch existing record
  db.query(
    "SELECT * FROM services_details WHERE details_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching existing record:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      const oldRecord = results[0];

      const updatedRecord = {
        service_id: service_id || oldRecord.service_id,
        services_heading: services_heading || oldRecord.services_heading,
        services_content: services_content || oldRecord.services_content,
      };

      // Update record in database
      db.query(
        "UPDATE services_details SET service_id = ?, services_heading = ?, services_content = ? WHERE details_id = ?",
        [
          updatedRecord.service_id,
          updatedRecord.services_heading,
          updatedRecord.services_content,
          id,
        ],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating record:", updateErr);
            return res.status(500).json({ error: "Database error" });
          }

          console.log("Updated services_details:", updateResult);
          return res
            .status(200)
            .json({ message: "Record updated successfully" });
        }
      );
    }
  );
});
app.delete("/services_details/:id", (req, res) => {
  const { id } = req.params;

  // Check if the id is provided
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  // Construct SQL DELETE statement
  const sql = "DELETE FROM services_details WHERE details_id = ?";

  // Execute the delete query
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    // Check if any row was affected (deleted)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("Deleted services_details:", result);
    return res.status(200).json({ message: "Record deleted successfully" });
  });
});
app.get("/services_details", (req, res) => {
  // Query to fetch all data from services_details table and join with our_services table
  const sql = `
    SELECT sd.*, os.heading AS our_services_heading
    FROM services_details sd
    JOIN our_services os ON sd.service_id = os.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching services details:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if any data is returned
    if (results.length === 0) {
      return res.status(404).json({ error: "No services details found" });
    }

    // Data found, return it
    return res.status(200).json(results);
  });
});

// services what you get
app.post("/services_wyg", uploadImage.none(), (req, res) => {
  const { service_id, heading } = req.body;

  // Validate incoming data
  if (!service_id || !heading) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert data into services_wyg table
  const sql = "INSERT INTO services_wyg (service_id, heading) VALUES (?, ?)";
  const values = [service_id, heading];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting into services_wyg:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Inserted into services_wyg:", result);
    return res.status(200).json({ message: "Data inserted successfully" });
  });
});
app.put("/services_wyg/:id", uploadImage.none(), (req, res) => {
  const { id } = req.params;
  const { service_id, heading } = req.body;

  // Fetch the existing record to get current values
  const fetchSql = "SELECT * FROM services_wyg WHERE wyg_id = ?";

  db.query(fetchSql, [id], (fetchErr, fetchResult) => {
    if (fetchErr) {
      console.error("Error fetching existing record:", fetchErr);
      return res
        .status(500)
        .json({ error: "Database error: " + fetchErr.message });
    }

    if (fetchResult.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const existingRecord = fetchResult[0];

    // Set new values, keeping old values if new values are not provided
    const updatedRecord = {
      service_id:
        service_id !== undefined ? service_id : existingRecord.service_id,
      heading: heading !== undefined ? heading : existingRecord.heading,
    };

    // Update the record in the database
    const updateSql =
      "UPDATE services_wyg SET service_id = ?, heading = ? WHERE wyg_id = ?";
    const updateValues = [updatedRecord.service_id, updatedRecord.heading, id];

    db.query(updateSql, updateValues, (updateErr, updateResult) => {
      if (updateErr) {
        console.error("Error updating record:", updateErr);
        return res
          .status(500)
          .json({ error: "Database error: " + updateErr.message });
      }

      console.log("Updated services_wyg:", updateResult);
      return res.status(200).json({ message: "Record updated successfully" });
    });
  });
});
app.delete("/services_wyg/:id", (req, res) => {
  const { id } = req.params;

  // Check if the wyg_id is provided
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  // Construct SQL DELETE statement
  const sql = "DELETE FROM services_wyg WHERE wyg_id = ?";

  // Execute the delete query
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    // Check if any row was affected (deleted)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    console.log("Deleted services_wyg:", result);
    return res.status(200).json({ message: "Record deleted successfully" });
  });
});
app.get("/services_wyg", (req, res) => {
  // Query to fetch all data from services_wyg table and join with our_services table
  const sql = `
    SELECT sw.*, os.heading AS our_services_heading
    FROM services_wyg sw
    JOIN our_services os ON sw.service_id = os.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching records:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    return res.status(200).json(results);
  });
});

// problems
app.post("/problems", uploadImage.none(), (req, res) => {
  const { service_id, problems_inner_heading, problems_inner_content } =
    req.body;

  // Validate incoming data
  if (!service_id || !problems_inner_heading || !problems_inner_content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert data into problems table
  const sql =
    "INSERT INTO problems (service_id,  problems_inner_heading, problems_inner_content) VALUES ( ?, ?, ?)";
  const values = [service_id, problems_inner_heading, problems_inner_content];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting into problems:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Inserted into problems:", result);
    return res.status(200).json({ message: "Data inserted successfully" });
  });
});
app.put("/problems/:id", uploadImage.none(), (req, res) => {
  const problemsId = req.params.id;
  const { service_id, problems_inner_heading, problems_inner_content } =
    req.body;

  // Validate incoming data (at least one field is required)
  if (!service_id && !problems_inner_heading && !problems_inner_content) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update" });
  }

  // Construct SQL UPDATE statement based on provided fields
  let sql = "UPDATE problems SET ";
  const values = [];
  const updateFields = [];

  if (service_id) {
    updateFields.push("service_id = ?");
    values.push(service_id);
  }

  if (problems_inner_heading) {
    updateFields.push("problems_inner_heading = ?");
    values.push(problems_inner_heading);
  }
  if (problems_inner_content) {
    updateFields.push("problems_inner_content = ?");
    values.push(problems_inner_content);
  }

  sql += updateFields.join(", ") + " WHERE problems_id = ?";
  values.push(problemsId);

  // Execute the update query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating problems:", err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Updated problems:", result);
    return res.status(200).json({ message: "Data updated successfully" });
  });
});
app.delete("/problems/:id", (req, res) => {
  const problemsId = req.params.id;

  // Validate incoming ID (optional, depending on your application logic)
  if (!problemsId) {
    return res.status(400).json({ error: "Missing problems ID" });
  }

  // Check if the record with the given problems_id exists
  db.query(
    "SELECT * FROM problems WHERE problems_id = ?",
    [problemsId],
    (err, results) => {
      if (err) {
        console.error("Error checking problems record:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Problem record not found" });
      }

      // If the record exists, proceed with deletion
      db.query(
        "DELETE FROM problems WHERE problems_id = ?",
        [problemsId],
        (deleteErr, deleteResult) => {
          if (deleteErr) {
            console.error("Error deleting problem record:", deleteErr);
            return res.status(500).json({ error: "Database error" });
          }

          console.log("Deleted problem record:", deleteResult);
          return res
            .status(200)
            .json({ message: "Problem record deleted successfully" });
        }
      );
    }
  );
});
app.get("/problems", (req, res) => {
  // Query to fetch all data from problems table and join with our_services table
  const sql = `
    SELECT p.*, os.heading AS our_services_heading
    FROM problems p
    JOIN our_services os ON p.service_id = os.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching records:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    return res.status(200).json(results);
  });
});

// solutions
app.post("/solutions", uploadImage.none(), (req, res) => {
  const { service_id, solutions_inner_heading, solutions_inner_content } =
    req.body;

  // Validate incoming data
  if (!service_id || !solutions_inner_heading || !solutions_inner_content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert data into solutions table
  const sql =
    "INSERT INTO solutions (service_id,  solutions_inner_heading, solutions_inner_content) VALUES ( ?, ?, ?)";
  const values = [service_id, solutions_inner_heading, solutions_inner_content];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting into solutions:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Inserted into solutions:", result);
    return res.status(200).json({ message: "Data inserted successfully" });
  });
});
app.put("/solutions/:id", uploadImage.none(), (req, res) => {
  const solutionsId = req.params.id;
  const { service_id, solutions_inner_heading, solutions_inner_content } =
    req.body;

  // Validate incoming data (at least one field is required)
  if (!service_id && !solutions_inner_heading && !solutions_inner_content) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update" });
  }

  // Construct SQL UPDATE statement based on provided fields
  let sql = "UPDATE solutions SET ";
  const values = [];
  const updateFields = [];

  if (service_id) {
    updateFields.push("service_id = ?");
    values.push(service_id);
  }

  if (solutions_inner_heading) {
    updateFields.push("solutions_inner_heading = ?");
    values.push(solutions_inner_heading);
  }
  if (solutions_inner_content) {
    updateFields.push("solutions_inner_content = ?");
    values.push(solutions_inner_content);
  }

  sql += updateFields.join(", ") + " WHERE solutions_id = ?";
  values.push(solutionsId);

  // Execute the update query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating solutions:", err);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("Updated solutions:", result);
    return res.status(200).json({ message: "Data updated successfully" });
  });
});
app.delete("/solutions/:id", (req, res) => {
  const solutionsId = req.params.id;

  // Check if the solutionsId is provided
  if (!solutionsId) {
    return res.status(400).json({ error: "Solution ID is required" });
  }

  // Construct SQL DELETE statement
  const sql = "DELETE FROM solutions WHERE solutions_id = ?";

  // Execute the delete query
  db.query(sql, [solutionsId], (err, result) => {
    if (err) {
      console.error("Error deleting solution:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if any row was affected (deleted)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Solution not found" });
    }

    console.log("Deleted solution:", result);
    return res.status(200).json({ message: "Solution deleted successfully" });
  });
});
app.get("/solutions", (req, res) => {
  // Query to fetch all data from solutions table and join with our_services table
  const sql = `
    SELECT s.*, os.heading AS our_services_heading
    FROM solutions s
    JOIN our_services os ON s.service_id = os.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching records:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    return res.status(200).json(results);
  });
});

// get by ID
// app.get("/getServicesPageData/:id", (req, res) => {
//   const serviceId = req.params.id;

//   db.query(
//     `
//     SELECT
//       os.id, CONCAT('http://${ipAddress}:${PORT}', os.icon_img) AS icon_img_full_url, os.icon_img_originalname, os.heading, os.content,
//       GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', sd.service_id, 'details_id', sd.details_id, 'services_heading', sd.services_heading, 'services_content', sd.services_content)) as service_details,
//       GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', p.service_id, 'problems_id', p.problems_id, 'problems_inner_heading', p.problems_inner_heading, 'problems_inner_content', p.problems_inner_content)) as problems,
//       GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', s.service_id, 'solutions_id', s.solutions_id, 'solutions_inner_heading', s.solutions_inner_heading, 'solutions_inner_content', s.solutions_inner_content)) as solutions,
//       GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', wyg.service_id, 'wyg_id', wyg.wyg_id, 'heading', wyg.heading)) as services_wyg
//     FROM our_services AS os
//     LEFT JOIN services_details AS sd ON os.id = sd.service_id
//     LEFT JOIN problems AS p ON os.id = p.service_id
//     LEFT JOIN solutions AS s ON os.id = s.service_id
//     LEFT JOIN services_wyg AS wyg ON os.id = wyg.service_id
//     WHERE os.id = ?
//     GROUP BY os.id
//   `,
//     [serviceId],
//     (err, results) => {
//       if (err) {
//         console.error("Error fetching data:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "Service not found" });
//       }

//       // Extracting the first result (should be only one due to GROUP BY)
//       const mainService = results[0];

//       // Parsing the aggregated JSON strings into arrays
//       mainService.service_details = mainService.service_details
//         ? JSON.parse(`[${mainService.service_details}]`)
//         : [];
//       mainService.problems = mainService.problems
//         ? JSON.parse(`[${mainService.problems}]`)
//         : [];
//       mainService.solutions = mainService.solutions
//         ? JSON.parse(`[${mainService.solutions}]`)
//         : [];
//       mainService.services_wyg = mainService.services_wyg
//         ? JSON.parse(`[${mainService.services_wyg}]`)
//         : [];

//       // Adding service_id to each array element
//       mainService.service_details.forEach((detail) => {
//         detail.service_id = serviceId;
//       });
//       mainService.problems.forEach((problem) => {
//         problem.service_id = serviceId;
//       });
//       mainService.solutions.forEach((solution) => {
//         solution.service_id = serviceId;
//       });
//       mainService.services_wyg.forEach((wyg) => {
//         wyg.service_id = serviceId;
//       });

//       // Adding full URL to icon_img
//       mainService.icon_img_full_url = mainService.icon_img_full_url;

//       // Remove original icon_img and icon_img_originalname if needed
//       delete mainService.icon_img;
//       delete mainService.icon_img_originalname;

//       res.status(200).json(mainService);
//     }
//   );
// });

app.get("/getServicesPageData/:id", (req, res) => {
  const serviceId = req.params.id;

  db.query(`SET SESSION group_concat_max_len = 1000000`, (err) => {
    if (err) {
      console.error("Error setting group_concat_max_len:", err);
      return res.status(500).json({ error: "Database error" });
    }

    db.query(
      `
      SELECT 
        os.id, CONCAT('http://${ipAddress}:${PORT}', os.icon_img) AS icon_img_full_url, os.icon_img_originalname, os.heading, os.content,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', sd.service_id, 'details_id', sd.details_id, 'services_heading', sd.services_heading, 'services_content', sd.services_content) ORDER BY sd.details_id ASC) as service_details,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', p.service_id, 'problems_id', p.problems_id, 'problems_inner_heading', p.problems_inner_heading, 'problems_inner_content', p.problems_inner_content) ORDER BY p.problems_id ASC) as problems,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', s.service_id, 'solutions_id', s.solutions_id, 'solutions_inner_heading', s.solutions_inner_heading, 'solutions_inner_content', s.solutions_inner_content) ORDER BY s.solutions_id ASC) as solutions,
        GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', wyg.service_id, 'wyg_id', wyg.wyg_id, 'heading', wyg.heading) ORDER BY wyg.wyg_id ASC) as services_wyg
      FROM our_services AS os
      LEFT JOIN services_details AS sd ON os.id = sd.service_id
      LEFT JOIN problems AS p ON os.id = p.service_id
      LEFT JOIN solutions AS s ON os.id = s.service_id
      LEFT JOIN services_wyg AS wyg ON os.id = wyg.service_id
      WHERE os.id = ?
      GROUP BY os.id
    `,
      [serviceId],
      (err, results) => {
        if (err) {
          console.error("Error fetching data:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Service not found" });
        }

        // Extracting the first result (should be only one due to GROUP BY)
        const mainService = results[0];

        // Parsing the aggregated JSON strings into arrays
        mainService.service_details = mainService.service_details
          ? JSON.parse(`[${mainService.service_details}]`)
          : [];
        mainService.problems = mainService.problems
          ? JSON.parse(`[${mainService.problems}]`)
          : [];
        mainService.solutions = mainService.solutions
          ? JSON.parse(`[${mainService.solutions}]`)
          : [];
        mainService.services_wyg = mainService.services_wyg
          ? JSON.parse(`[${mainService.services_wyg}]`)
          : [];

        // Adding service_id to each array element
        mainService.service_details.forEach((detail) => {
          detail.service_id = serviceId;
        });
        mainService.problems.forEach((problem) => {
          problem.service_id = serviceId;
        });
        mainService.solutions.forEach((solution) => {
          solution.service_id = serviceId;
        });
        mainService.services_wyg.forEach((wyg) => {
          wyg.service_id = serviceId;
        });

        // Adding full URL to icon_img
        mainService.icon_img_full_url = mainService.icon_img_full_url;

        // Remove original icon_img and icon_img_originalname if needed
        delete mainService.icon_img;
        delete mainService.icon_img_originalname;

        res.status(200).json(mainService);
      }
    );
  });
});

// get all service page Data
app.get("/getServicesPageData", (req, res) => {
  db.query(
    `
    SELECT 
      os.id, CONCAT('http://${ipAddress}:${PORT}', os.icon_img) AS icon_img_full_url, os.icon_img_originalname, os.heading, os.content,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', sd.service_id, 'details_id', sd.details_id, 'services_heading', sd.services_heading, 'services_content', sd.services_content)) as service_details,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', p.service_id, 'problems_id', p.problems_id, 'problems_inner_heading', p.problems_inner_heading, 'problems_inner_content', p.problems_inner_content)) as problems,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', s.service_id, 'solutions_id', s.solutions_id, 'solutions_inner_heading', s.solutions_inner_heading, 'solutions_inner_content', s.solutions_inner_content)) as solutions,
      GROUP_CONCAT(DISTINCT JSON_OBJECT('service_id', wyg.service_id, 'wyg_id', wyg.wyg_id, 'heading', wyg.heading)) as services_wyg
    FROM our_services AS os
    LEFT JOIN services_details AS sd ON os.id = sd.service_id
    LEFT JOIN problems AS p ON os.id = p.service_id
    LEFT JOIN solutions AS s ON os.id = s.service_id
    LEFT JOIN services_wyg AS wyg ON os.id = wyg.service_id
    GROUP BY os.id
  `,
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No services found" });
      }

      // Transform each result item
      const formattedResults = results.map((result) => ({
        id: result.id,
        icon_img_full_url: result.icon_img_full_url,
        heading: result.heading,
        content: result.content,
        service_details: result.service_details
          ? JSON.parse(`[${result.service_details}]`)
          : [],
        problems: result.problems ? JSON.parse(`[${result.problems}]`) : [],
        solutions: result.solutions ? JSON.parse(`[${result.solutions}]`) : [],
        services_wyg: result.services_wyg
          ? JSON.parse(`[${result.services_wyg}]`)
          : [],
      }));

      // Adding service_id to each array element
      formattedResults.forEach((item) => {
        item.service_details.forEach((detail) => {
          detail.service_id = item.id;
        });
        item.problems.forEach((problem) => {
          problem.service_id = item.id;
        });
        item.solutions.forEach((solution) => {
          solution.service_id = item.id;
        });
        item.services_wyg.forEach((wyg) => {
          wyg.service_id = item.id;
        });

        // Remove original icon_img and icon_img_originalname if needed
        delete item.icon_img_originalname;
        delete item.icon_img;
      });

      res.status(200).json(formattedResults);
    }
  );
});
// delete service
app.delete("/deleteServiceData/:service_id", (req, res) => {
  const { service_id } = req.params;

  // Validate the service_id
  if (!service_id) {
    return res.status(400).json({ error: "Service ID is required" });
  }

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    // Fetch the icon_img path from our_services table
    const fetchSql = "SELECT icon_img FROM our_services WHERE id = ?";
    db.query(fetchSql, [service_id], (fetchErr, fetchResults) => {
      if (fetchErr) {
        console.error("Error fetching icon image:", fetchErr);
        return res
          .status(500)
          .json({ error: "Database error: " + fetchErr.message });
      }

      if (fetchResults.length === 0) {
        return res.status(404).json({ error: "Service not found" });
      }

      const iconImgPath = fetchResults[0].icon_img;

      // Delete queries for each table
      const deleteQueries = [
        "DELETE FROM our_services WHERE id = ?",
        "DELETE FROM services_details WHERE service_id = ?",
        "DELETE FROM problems WHERE service_id = ?",
        "DELETE FROM solutions WHERE service_id = ?",
        "DELETE FROM services_wyg WHERE service_id = ?",
      ];

      // Execute all delete queries
      const deleteTasks = deleteQueries.map((query) => {
        return new Promise((resolve, reject) => {
          db.query(query, [service_id], (deleteErr, result) => {
            if (deleteErr) {
              return reject(deleteErr);
            }
            resolve(result);
          });
        });
      });

      // Run all delete queries
      Promise.all(deleteTasks)
        .then(() => {
          // Commit transaction if all queries succeed
          db.commit((commitErr) => {
            if (commitErr) {
              console.error("Error committing transaction:", commitErr);
              return res
                .status(500)
                .json({ error: "Database error: " + commitErr.message });
            }

            // Delete the image file from the uploads folder
            const fullPath = path.join(imagesPath, path.basename(iconImgPath));
            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Error deleting image file:", unlinkErr);
                return res
                  .status(500)
                  .json({ error: "File system error: " + unlinkErr.message });
              }
              return res
                .status(200)
                .json({ message: "Service data deleted successfully" });
            });
          });
        })
        .catch((deleteErr) => {
          // Rollback transaction if any query fails
          db.rollback(() => {
            console.error("Error deleting service data:", deleteErr);
            return res
              .status(500)
              .json({ error: "Database error: " + deleteErr.message });
          });
        });
    });
  });
});

// ==========================================================

app.post("/testimonials", uploadImage.single("img"), (req, res) => {
  const { description, designation, name } = req.body;
  const img_originalname = req.file ? req.file.originalname : null;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO testimonials (description, img, img_originalname, designation, name) VALUES (?, ?, ?, ?, ?)",
    [description, img, img_originalname, designation, name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Record inserted successfully" });
    }
  );
});
app.put("/testimonials/:id", uploadImage.single("img"), (req, res) => {
  const { id } = req.params;
  const { description, designation, name } = req.body;
  const newImg = req.file ? `/uploads/${req.file.filename}` : null;
  const img_originalname = req.file ? req.file.originalname : null;

  db.query("SELECT * FROM testimonials WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const existingRecord = results[0];
      const updatedRecord = {
        description: description || existingRecord.description,
        img: newImg || existingRecord.img,
        img_originalname: img_originalname || existingRecord.img_originalname,
        designation: designation || existingRecord.designation,
        name: name || existingRecord.name,
      };

      if (newImg && existingRecord.img) {
        // Delete old image file
        const oldImagePath = path.join(__dirname, existingRecord.img);
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete old image:", unlinkErr);
          }
        });
      }

      db.query(
        "UPDATE testimonials SET description = ?, img = ?, img_originalname = ?, designation = ? , name = ?WHERE id = ?",
        [
          updatedRecord.description,
          updatedRecord.img,
          updatedRecord.img_originalname,
          updatedRecord.designation,
          updatedRecord.name,
          id,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });
});
app.delete("/testimonials/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM testimonials WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const existingRecord = results[0];
      const imagePath = path.join(__dirname, existingRecord.img);

      db.query(
        "DELETE FROM testimonials WHERE id = ?",
        [id],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            return res.status(500).json({ error: deleteErr.message });
          }

          // Delete image file
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete image:", unlinkErr);
            }
          });

          res.json({ message: "Record deleted successfully" });
        }
      );
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });
});
app.get("/testimonials", (req, res) => {
  db.query("SELECT * FROM testimonials", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Modify img to include full URL
    const modifiedResults = results.map((record) => ({
      ...record,
      img: `http://${req.hostname}:${PORT}${record.img}`,
    }));

    res.json(modifiedResults);
  });
});
app.post("/recent_work", uploadImage.single("img"), (req, res) => {
  const img_originalname = req.file ? req.file.originalname : null;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO recent_work (img, img_originalname) VALUES (?, ?)",
    [img, img_originalname],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Record inserted successfully" });
    }
  );
});
app.put("/recent_work/:id", uploadImage.single("img"), (req, res) => {
  const { id } = req.params;
  const img_originalname = req.file ? req.file.originalname : null;
  const newImg = req.file ? `/uploads/${req.file.filename}` : null;

  db.query("SELECT * FROM recent_work WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const existingRecord = results[0];

      if (newImg && existingRecord.img) {
        // Delete old image file
        const oldImagePath = path.join(__dirname, existingRecord.img);
        fs.unlink(oldImagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete old image:", unlinkErr);
          }
        });
      }

      db.query(
        "UPDATE recent_work SET img = ?, img_originalname = ? WHERE id = ?",
        [
          newImg || existingRecord.img,
          img_originalname || existingRecord.img_originalname,
          id,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });
});
app.delete("/recent_work/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM recent_work WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      const existingRecord = results[0];
      const imagePath = path.join(__dirname, existingRecord.img);

      db.query(
        "DELETE FROM recent_work WHERE id = ?",
        [id],
        (deleteErr, deleteResults) => {
          if (deleteErr) {
            return res.status(500).json({ error: deleteErr.message });
          }

          // Delete image file
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete image:", unlinkErr);
            }
          });

          res.json({ message: "Record deleted successfully" });
        }
      );
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  });
});
app.get("/recent_work", (req, res) => {
  db.query("SELECT * FROM recent_work", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Modify img to include full URL
    const modifiedResults = results.map((record) => ({
      ...record,
      img: `http://${req.hostname}:${PORT}${record.img}`,
    }));

    res.json(modifiedResults);
  });
});
app.get("/getHomePageAllData", (req, res) => {
  // Object to store results from different queries
  const data = {};

  // Fetch main_table data
  db.query("SELECT * FROM main_table WHERE id = 1", (errMain, resultsMain) => {
    if (errMain) {
      return res.status(500).json({ error: errMain.message });
    }

    if (resultsMain.length > 0) {
      data.main_table = resultsMain[0]; // Assuming there's only one row with id=1
    } else {
      data.main_table = {}; // Return an empty object if no record found
    }

    // Fetch our_services data
    db.query("SELECT * FROM our_services", (errServices, resultsServices) => {
      if (errServices) {
        return res.status(500).json({ error: errServices.message });
      }

      // Modify icon_img to include full URL for each record
      data.our_services = resultsServices.map((record) => ({
        ...record,
        icon_img: `http://${req.hostname}:${PORT}${record.icon_img}`,
      }));

      // Fetch testimonials data
      db.query(
        "SELECT * FROM testimonials",
        (errTestimonials, resultsTestimonials) => {
          if (errTestimonials) {
            return res.status(500).json({ error: errTestimonials.message });
          }

          // Modify img to include full URL for each record
          data.testimonials = resultsTestimonials.map((record) => ({
            ...record,
            img: `http://${req.hostname}:${PORT}${record.img}`,
          }));

          // Fetch recent_work data
          db.query(
            "SELECT * FROM recent_work",
            (errRecentWork, resultsRecentWork) => {
              if (errRecentWork) {
                return res.status(500).json({ error: errRecentWork.message });
              }

              // Modify img to include full URL for each record
              data.recent_work = resultsRecentWork.map((record) => ({
                ...record,
                img: `http://${req.hostname}:${PORT}${record.img}`,
              }));

              // Return the combined data object
              res.json(data);
            }
          );
        }
      );
    });
  });
});

// =====================ABOUT PAGE===========================
app.put("/aboutUsCompany", uploadImage.none(), (req, res) => {
  const fixedId = 1; // Fixed id for company_details

  const { company_content, story_content, vision_content } = req.body;

  // Construct the update query based on provided fields
  let updateQuery = "UPDATE company_details SET ";
  const updateValues = [];

  if (company_content !== undefined) {
    updateQuery += "company_content = ?, ";
    updateValues.push(company_content);
  }
  if (story_content !== undefined) {
    updateQuery += "story_content = ?, ";
    updateValues.push(story_content);
  }
  if (vision_content !== undefined) {
    updateQuery += "vision_content = ?, ";
    updateValues.push(vision_content);
  }

  // Remove the last comma and space
  updateQuery = updateQuery.slice(0, -2);

  // Add WHERE clause for fixedId
  updateQuery += " WHERE id = ?";
  updateValues.push(fixedId);

  // Check if fixedId exists in database
  db.query(
    "SELECT * FROM company_details WHERE id = ?",
    [fixedId],
    (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).send("Error querying database");
      }

      if (results.length === 0) {
        // If fixedId does not exist, treat as POST behavior
        db.query(
          "INSERT INTO company_details (id, company_content, story_content, vision_content) VALUES (?, ?, ?, ?)",
          [fixedId, company_content, story_content, vision_content],
          (err, result) => {
            if (err) {
              console.error("Error inserting new record:", err);
              return res.status(500).send("Error inserting new record");
            }

            res.json({ message: "New company details created" });
          }
        );
      } else {
        // If fixedId exists, update existing record
        db.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error("Error updating record:", err);
            return res.status(500).send("Error updating record");
          }
          res.json({ message: "Data updated successfully" });
        });
      }
    }
  );
});
// GET API to fetch all company details
app.get("/aboutUsCompany", (req, res) => {
  // Query database to retrieve all records from company_details table
  db.query("SELECT * FROM company_details", (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Error querying database");
    }

    // Return all company details as JSON response
    res.status(200).json(results);
  });
});
app.put("/OurValues/:id", uploadImage.none(), (req, res) => {
  const id = req.params.id;
  const { company_id, heading, content } = req.body;

  // Check if ID exists between 1 and 4
  if (id >= 1 && id <= 4) {
    // Check if data for the given ID exists
    db.query(
      "SELECT * FROM values_details WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).send("Error querying database");
        }

        if (results.length === 0) {
          // If no data exists for the ID, treat it as a POST behavior
          db.query(
            "INSERT INTO values_details (id, company_id, heading, content) VALUES (?, ?, ?, ?)",
            [id, company_id, heading, content],
            (err, result) => {
              if (err) {
                console.error("Error inserting new record:", err);
                return res.status(500).send("Error inserting new record");
              }
              res.status(201).send("New record created");
            }
          );
        } else {
          // If data exists for the ID, determine which columns to update
          const existingData = results[0];
          let updatedHeading =
            heading !== undefined ? heading : existingData.heading;
          let updatedContent =
            content !== undefined ? content : existingData.content;

          // Update the record
          db.query(
            "UPDATE values_details SET company_id = ?, heading = ?, content = ? WHERE id = ?",
            [company_id, updatedHeading, updatedContent, id],
            (err, result) => {
              if (err) {
                console.error("Error updating record:", err);
                return res.status(500).send("Error updating record");
              }

              res.json({ message: "Record updated successfully" });
            }
          );
        }
      }
    );
  } else {
    // ID is not between 1 and 4
    return res.status(400).send("ID must be between 1 and 4");
  }
});
// GET API to fetch all values details
app.get("/OurValues", (req, res) => {
  // Query database to retrieve all records from values_details table
  db.query("SELECT * FROM values_details", (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Error querying database");
    }

    // Return all values details as JSON response
    res.status(200).json(results);
  });
});
app.get("/getAllAboutUs", (req, res) => {
  let combinedData = {};

  // Query to fetch company details
  db.query(
    "SELECT * FROM company_details WHERE id = 1",
    (err, companyResults) => {
      if (err) {
        console.error("Error querying company_details:", err);
        return res.status(500).send("Error querying company_details");
      }

      if (companyResults.length === 0) {
        return res.status(404).send("Company details not found");
      }

      combinedData.company_details = companyResults[0];

      // Query to fetch all values details
      db.query(
        "SELECT * FROM values_details WHERE id IN (1, 2, 3, 4)",
        (err, valuesResults) => {
          if (err) {
            console.error("Error querying values_details:", err);
            return res.status(500).send("Error querying values_details");
          }

          combinedData.values_details = valuesResults;

          // Return combined details as JSON response
          res.status(200).json(combinedData);
        }
      );
    }
  );
});

// =====================CARRER PAGE======================
app.put("/carrerHead", uploadImage.none(), (req, res) => {
  const { carrer_heading, carrer_content, ryh_heading, ryh_content } = req.body;

  // Check if the record with id=1 exists
  db.query("SELECT * FROM carrer_head WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // If record exists, update it
      const existingRecord = results[0];
      const updatedRecord = {
        carrer_heading: carrer_heading || existingRecord.carrer_heading,
        carrer_content: carrer_content || existingRecord.carrer_content,
        ryh_heading: ryh_heading || existingRecord.ryh_heading,
        ryh_content: ryh_content || existingRecord.ryh_content,
      };

      db.query(
        "UPDATE carrer_head SET carrer_heading = ?, carrer_content = ? ,ryh_heading = ?, ryh_content = ? WHERE id = 1",
        [
          updatedRecord.carrer_heading,
          updatedRecord.carrer_content,
          updatedRecord.ryh_heading,
          updatedRecord.ryh_content,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      // If record does not exist, insert a new one
      db.query(
        "INSERT INTO carrer_head (carrer_heading, carrer_content,ryh_heading ,ryh_content) VALUES (?, ? , ? ,?)",
        [carrer_heading, carrer_content, ryh_heading, ryh_content],
        (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: "Record inserted successfully" });
        }
      );
    }
  });
});
app.get("/carrerHead", (req, res) => {
  // Fetch record where id = 1
  db.query("SELECT * FROM carrer_head WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Extract relevant fields
    const { id, carrer_heading, carrer_content, ryh_heading, ryh_content } =
      results[0];
    res.json({
      id,
      carrer_heading,
      carrer_content,
      ryh_heading,
      ryh_content,
    });
  });
});
const uploadCarrerImages = multer({
  storage: imageStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
}).fields([
  { name: "img_1", maxCount: 1 },
  { name: "img_2", maxCount: 1 },
  { name: "img_3", maxCount: 1 },
  { name: "img_4", maxCount: 1 },
  { name: "img_5", maxCount: 1 },
  { name: "img_6", maxCount: 1 },
  { name: "img_7", maxCount: 1 },
  { name: "img_8", maxCount: 1 },
]);
app.post("/career_images", (req, res) => {
  uploadCarrerImages(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Check if req.files is defined and has data
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }

    // Extract uploaded images data
    const images = [];
    for (let i = 1; i <= 8; i++) {
      const fieldName = `img_${i}`;
      if (req.files[fieldName]) {
        const file = req.files[fieldName][0];
        images.push({
          img: `uploads/${file.filename}`,
          img_originalname: file.originalname,
        });
      }
    }

    // Prepare SQL query to insert images into database
    const sql = `
          INSERT INTO carrer_images 
            (img_1, img_1_originalname, img_2, img_2_originalname, 
            img_3, img_3_originalname, img_4, img_4_originalname, 
            img_5, img_5_originalname, img_6, img_6_originalname, 
            img_7, img_7_originalname, img_8, img_8_originalname) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const imageValues = images.reduce((acc, image) => {
      acc.push(image.img, image.img_originalname);
      return acc;
    }, []);

    // Execute SQL query
    db.query(sql, imageValues, (err, result) => {
      if (err) {
        console.error("Failed to add images:", err);
        return res.status(500).json({ error: "Failed to add images" });
      }
      res.status(201).json({ message: "Images added successfully" });
    });
  });
});
app.put("/career_images/:id", (req, res) => {
  const id = req.params.id;

  // Get existing images from the database
  const sqlGetImages = "SELECT * FROM carrer_images WHERE id = ?";
  db.query(sqlGetImages, [id], (err, results) => {
    if (err) {
      console.error("Failed to get existing images:", err);
      return res.status(500).json({ error: "Failed to get existing images" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No images found for the given ID" });
    }

    const existingImages = results[0];

    // Upload new images
    uploadCarrerImages(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Check if req.files is defined and has data
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "No files were uploaded" });
      }

      // Extract uploaded images data
      const images = [];
      for (let i = 1; i <= 8; i++) {
        const fieldName = `img_${i}`;
        if (req.files[fieldName]) {
          const file = req.files[fieldName][0];
          images.push({
            img: `uploads/${file.filename}`,
            img_originalname: file.originalname,
          });
        } else {
          // Keep existing image if not updated
          images.push({
            img: existingImages[`img_${i}`],
            img_originalname: existingImages[`img_${i}_originalname`],
          });
        }
      }

      // Prepare SQL query to update images in database
      const sqlUpdate = `
            UPDATE carrer_images SET
              img_1 = ?, img_1_originalname = ?, img_2 = ?, img_2_originalname = ?, 
              img_3 = ?, img_3_originalname = ?, img_4 = ?, img_4_originalname = ?, 
              img_5 = ?, img_5_originalname = ?, img_6 = ?, img_6_originalname = ?, 
              img_7 = ?, img_7_originalname = ?, img_8 = ?, img_8_originalname = ?
            WHERE id = ?
          `;

      const imageValues = images.reduce((acc, image) => {
        acc.push(image.img, image.img_originalname);
        return acc;
      }, []);
      imageValues.push(id);

      // Execute SQL query
      db.query(sqlUpdate, imageValues, (err, result) => {
        if (err) {
          console.error("Failed to update images:", err);
          return res.status(500).json({ error: "Failed to update images" });
        }

        // Delete old images from uploads folder if they have been replaced
        images.forEach((image, index) => {
          const fieldName = `img_${index + 1}`;
          if (
            existingImages[fieldName] &&
            existingImages[fieldName] !== image.img
          ) {
            const oldImagePath = path.join(
              __dirname,
              existingImages[fieldName]
            );
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error(
                  `Failed to delete old image ${oldImagePath}:`,
                  err
                );
              }
            });
          }
        });

        res.status(200).json({ message: "Images updated successfully" });
      });
    });
  });
});
app.delete("/career_images/:id", (req, res) => {
  const { id } = req.params;

  // Get existing images from the database
  const sqlGetImages = "SELECT * FROM carrer_images WHERE id = ?";
  db.query(sqlGetImages, [id], (err, results) => {
    if (err) {
      console.error("Failed to get existing images:", err);
      return res.status(500).json({ error: "Failed to get existing images" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No images found for the given ID" });
    }

    const existingImages = results[0];

    // Prepare SQL query to delete images from the database
    const sqlDelete = "DELETE FROM carrer_images WHERE id = ?";

    // Execute SQL query
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error("Failed to delete images:", err);
        return res.status(500).json({ error: "Failed to delete images" });
      }

      // Delete image files from the uploads folder
      for (let i = 1; i <= 8; i++) {
        const fieldName = `img_${i}`;
        if (existingImages[fieldName]) {
          const imagePath = path.join(__dirname, existingImages[fieldName]);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Failed to delete image ${imagePath}:`, err);
            }
          });
        }
      }

      res.status(200).json({ message: "Images deleted successfully" });
    });
  });
});
app.get("/career_images", (req, res) => {
  const sql = `
      SELECT 
        id,
        img_1, img_1_originalname,
        img_2, img_2_originalname,
        img_3, img_3_originalname,
        img_4, img_4_originalname,
        img_5, img_5_originalname,
        img_6, img_6_originalname,
        img_7, img_7_originalname,
        img_8, img_8_originalname
      FROM carrer_images
    `;

  // Execute the query
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch career images:", err);
      return res.status(500).json({ error: "Failed to fetch career images" });
    }

    // Organize the data into an array of objects with IDs
    const formattedImages = results.map((row) => {
      return {
        id: row.id,
        images: [
          {
            img_1: {
              url: `http://${ipAddress}:${PORT}/${row.img_1}`,
              originalname: row.img_1_originalname,
            },
          },
          {
            img_2: {
              url: `http://${ipAddress}:${PORT}/${row.img_2}`,
              originalname: row.img_2_originalname,
            },
          },
          {
            img_3: {
              url: `http://${ipAddress}:${PORT}/${row.img_3}`,
              originalname: row.img_3_originalname,
            },
          },
          {
            img_4: {
              url: `http://${ipAddress}:${PORT}/${row.img_4}`,
              originalname: row.img_4_originalname,
            },
          },
          {
            img_5: {
              url: `http://${ipAddress}:${PORT}/${row.img_5}`,
              originalname: row.img_5_originalname,
            },
          },
          {
            img_6: {
              url: `http://${ipAddress}:${PORT}/${row.img_6}`,
              originalname: row.img_6_originalname,
            },
          },
          {
            img_7: {
              url: `http://${ipAddress}:${PORT}/${row.img_7}`,
              originalname: row.img_7_originalname,
            },
          },
          {
            img_8: {
              url: `http://${ipAddress}:${PORT}/${row.img_8}`,
              originalname: row.img_8_originalname,
            },
          },
        ],
      };
    });

    // Send the formatted response
    res.status(200).json(formattedImages);
  });
});
app.post("/carrer_see_and_get", uploadImage.none(), (req, res) => {
  const { heading, content } = req.body;
  const sql =
    "INSERT INTO corusview_it.career_wys_and_wyg (heading, content) VALUES (?, ?)";
  const values = [heading, content];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Failed to insert career_wys_and_wyg:", err);
      return res
        .status(500)
        .json({ error: "Failed to insert career_wys_and_wyg" });
    }

    res
      .status(201)
      .json({ message: "Record inserted successfully", id: result.insertId });
  });
});
app.put("/carrer_see_and_get/:id", uploadImage.none(), (req, res) => {
  const { id } = req.params;
  const { heading, content } = req.body;

  // Check if either heading or content is provided
  if (!heading && !content) {
    return res
      .status(400)
      .json({ error: "Either heading or content must be provided for update" });
  }

  // Prepare SQL query and values based on provided data
  let sql = "UPDATE corusview_it.career_wys_and_wyg SET ";
  const values = [];
  const setClauses = [];

  if (heading) {
    setClauses.push("heading = ?");
    values.push(heading);
  }

  if (content) {
    setClauses.push("content = ?");
    values.push(content);
  }

  sql += setClauses.join(", ") + " WHERE id = ?";
  values.push(id);

  // Execute SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Failed to update career_wys_and_wyg:", err);
      return res
        .status(500)
        .json({ error: "Failed to update career_wys_and_wyg" });
    }

    // Check if any rows were affected (i.e., if the id exists)
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json({ message: "Record updated successfully" });
  });
});
app.delete("/carrer_see_and_get/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM corusview_it.career_wys_and_wyg WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Failed to delete career_wys_and_wyg:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete career_wys_and_wyg" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  });
});
app.get("/carrer_see_and_get", (req, res) => {
  const sql = "SELECT * FROM corusview_it.career_wys_and_wyg";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching career_wys_and_wyg records:", err);
      return res
        .status(500)
        .json({ error: "Error fetching career_wys_and_wyg records" });
    }

    res.status(200).json(result);
  });
});

app.post("/jobOpenings", uploadImage.none(), (req, res) => {
  const { role, position, location, level } = req.body;
  const posted_date = new Date().toISOString().slice(0, 10);

  const checkRoleSql = "SELECT role_id FROM job_role WHERE role = ?";
  db.query(checkRoleSql, [role], (err, results) => {
    if (err) {
      console.error("Error checking role:", err);
      res.status(500).json({ error: "Error inserting job opening" });
      return;
    }

    if (results.length === 0) {
      res.status(400).json({ error: "Invalid role specified" });
      return;
    }

    const role_id = results[0].role_id;

    const sql =
      "INSERT INTO job_openings_new (role_id, position, location, posted_date, level) VALUES (?, ?, ?, ?, ?)";
    const values = [role_id, position, location, posted_date, level];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting job opening:", err);
        res.status(500).json({ error: "Error inserting job opening" });
        return;
      }
      console.log("New job opening inserted");
      res.status(201).json({ message: "Job opening inserted successfully" });
    });
  });
});
app.put("/jobOpenings/:id", uploadImage.none(), (req, res) => {
  const jobId = req.params.id; // Job opening ID from request params
  const { role, position, location, level } = req.body;

  // Build the SQL query dynamically based on provided fields
  let sql = "UPDATE job_openings_new SET ";
  const values = [];

  if (role) {
    sql += "role_id = (SELECT role_id FROM job_role WHERE role = ?), ";
    values.push(role);
  }
  if (position) {
    sql += "position = ?, ";
    values.push(position);
  }
  if (location) {
    sql += "location = ?, ";
    values.push(location);
  }
  if (level) {
    sql += "level = ?, ";
    values.push(level);
  }

  // Remove the trailing comma and space
  sql = sql.slice(0, -2);

  // Add WHERE clause for the specific job opening ID
  sql += " WHERE id = ?";
  values.push(jobId);

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating job opening:", err);
      res.status(500).json({ error: "Error updating job opening" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Job opening not found" });
      return;
    }
    console.log("Job opening updated successfully");
    res.status(200).json({ message: "Job opening updated successfully" });
  });
});
app.delete("/jobOpenings/:id", (req, res) => {
  const jobId = req.params.id; // Job opening ID from request params

  const sql = "DELETE FROM job_openings_new WHERE id = ?";
  const values = [jobId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error deleting job opening:", err);
      res.status(500).json({ error: "Error deleting job opening" });
      return;
    }
    if (result.affectedRows === 0) {
      // If no rows were affected, the job opening with that ID was not found
      res.status(404).json({ error: "Job opening not found" });
      return;
    }
    console.log("Job opening deleted successfully");
    res.status(200).json({ message: "Job opening deleted successfully" });
  });
});
app.get("/jobOpenings/:role?", (req, res) => {
  const { role } = req.params;

  let sql = `
      SELECT jo.*, jr.role
      FROM job_openings_new jo
      JOIN job_role jr ON jo.role_id = jr.role_id
    `;
  const values = [];

  // Add WHERE clause if role is provided
  if (role) {
    sql += " WHERE jr.role = ?";
    values.push(role);
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error fetching job openings:", err);
      res.status(500).json({ error: "Error fetching job openings" });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/jobPositions", (req, res) => {
  let sql = `
      SELECT id, position
      FROM job_openings_new
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching job positions:", err);
      res.status(500).json({ error: "Error fetching job positions" });
      return;
    }
    // Extract positions and IDs from results
    const positions = results.map((result) => ({
      id: result.id,
      position: result.position,
    }));

    res.status(200).json(positions);
  });
});

app.post("/jobRoles", uploadImage.none(), (req, res) => {
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ error: "Role is required" });
    return;
  }

  const sql = "INSERT INTO job_role (role) VALUES (?)";
  const values = [role];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting job role:", err);
      res.status(500).json({ error: "Error inserting job role" });
      return;
    }
    console.log("New job role inserted");
    res.status(201).json({ message: "Job role inserted successfully" });
  });
});
app.put("/jobRoles/:role_id", uploadImage.none(), (req, res) => {
  const role_id = req.params.role_id;
  const { role } = req.body;

  if (!role) {
    res.status(400).json({ error: "Role is required" });
    return;
  }

  const sql = "UPDATE job_role SET role = ? WHERE role_id = ?";
  const values = [role, role_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating job role:", err);
      res.status(500).json({ error: "Error updating job role" });
      return;
    }
    console.log("Job role updated");
    res.status(200).json({ message: "Job role updated successfully" });
  });
});
app.delete("/jobRoles/:role_id", (req, res) => {
  const role_id = req.params.role_id;

  // First, delete from job_openings_new table where role_id matches
  const deleteJobOpeningsSql = "DELETE FROM job_openings_new WHERE role_id = ?";
  db.query(deleteJobOpeningsSql, [role_id], (err, result) => {
    if (err) {
      console.error("Error deleting job openings for role:", err);
      res.status(500).json({ error: "Error deleting job openings for role" });
      return;
    }
    // Now, delete from job_role table where role_id matches
    const deleteRoleSql = "DELETE FROM job_role WHERE role_id = ?";
    db.query(deleteRoleSql, [role_id], (err, result) => {
      if (err) {
        console.error("Error deleting job role:", err);
        res.status(500).json({ error: "Error deleting job role" });
        return;
      }
      console.log("Job role and related openings deleted successfully");
      res.status(200).json({
        message: "Job role and related openings deleted successfully",
      });
    });
  });
});
app.get("/jobRoles", (req, res) => {
  const sql =
    "SELECT MIN(role_id) AS role_id, role FROM job_role GROUP BY role";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching job roles:", err);
      res.status(500).json({ error: "Error fetching job roles" });
      return;
    }
    res.status(200).json(results);
  });
});

app.post("/applicants", upload.single("drop_cv"), (req, res) => {
  const {
    name,
    surname,
    email,
    contact,
    applied_for,
    position,
    last_ctc,
    year_of_exp,
  } = req.body;
  const drop_cv = req.file ? req.file.path : null;

  if (
    !name ||
    !surname ||
    !email ||
    !contact ||
    !drop_cv ||
    !applied_for ||
    !position ||
    !last_ctc ||
    !year_of_exp
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const query = `
      INSERT INTO applicant_details (name, surname, email, contact, drop_cv, applied_for,position, last_ctc, year_of_exp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      name,
      surname,
      email,
      contact,
      drop_cv,
      applied_for,
      position,
      last_ctc,
      year_of_exp,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to insert data" });
      }
      res.status(201).send({
        message: "Applicant details added successfully",
        id: result.insertId,
      });
    }
  );
});
app.get("/applicants", (req, res) => {
  const roleFilter = req.query.role;
  let query = `
      SELECT 
          ad.id, 
          ad.name, 
          ad.surname, 
          ad.email, 
          ad.contact, 
          CONCAT('http://${ipAddress}:${PORT}', '/', ad.drop_cv) AS drop_cv, 
          jr.role AS applied_for,
          ad.position, 
          ad.last_ctc, 
          ad.year_of_exp,
          jr.role -- Include role from job_role table
      FROM 
          applicant_details ad
      JOIN 
          job_role jr ON ad.applied_for = jr.role_id
  `;

  const params = [];

  if (roleFilter) {
    query += `
          WHERE jr.role = ?
      `;
    params.push(roleFilter);
  }

  query += `
      ORDER BY ad.id DESC -- Sort by ID in descending order to show latest data first
  `;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Failed to retrieve data" });
    }
    res.status(200).send(results);
  });
});
app.put("/applicants/:id", upload.single("drop_cv"), (req, res) => {
  const applicantId = req.params.id;
  const {
    name,
    surname,
    email,
    contact,
    applied_for,
    position,
    last_ctc,
    year_of_exp,
  } = req.body;
  const drop_cv = req.file ? req.file.path : null;

  // Check if at least one field is being updated
  if (
    !name &&
    !surname &&
    !email &&
    !contact &&
    !applied_for &&
    !position &&
    !last_ctc &&
    !year_of_exp &&
    !drop_cv
  ) {
    return res
      .status(400)
      .send({ message: "At least one field must be provided for update" });
  }

  // Retrieve current drop_cv path to delete the old file
  const getDropCvQuery = `
      SELECT drop_cv FROM applicant_details WHERE id = ?
  `;
  db.query(getDropCvQuery, [applicantId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Failed to update data" });
    }

    // Delete old drop_cv file if exists and new drop_cv is uploaded
    if (results.length > 0 && results[0].drop_cv && drop_cv) {
      const oldFilePath = results[0].drop_cv;
      fs.unlinkSync(oldFilePath); // Delete the old file synchronously
    }

    // Build the update query dynamically based on provided fields
    const fieldsToUpdate = [];
    const params = [];

    if (name) {
      fieldsToUpdate.push("name = ?");
      params.push(name);
    }
    if (surname) {
      fieldsToUpdate.push("surname = ?");
      params.push(surname);
    }
    if (email) {
      fieldsToUpdate.push("email = ?");
      params.push(email);
    }
    if (contact) {
      fieldsToUpdate.push("contact = ?");
      params.push(contact);
    }
    if (applied_for) {
      fieldsToUpdate.push("applied_for = ?");
      params.push(applied_for);
    }
    if (position) {
      fieldsToUpdate.push("position = ?");
      params.push(position);
    }
    if (last_ctc) {
      fieldsToUpdate.push("last_ctc = ?");
      params.push(last_ctc);
    }
    if (year_of_exp) {
      fieldsToUpdate.push("year_of_exp = ?");
      params.push(year_of_exp);
    }
    if (drop_cv) {
      fieldsToUpdate.push("drop_cv = ?");
      params.push(drop_cv);
    }

    // Construct the update query
    const updateQuery = `
          UPDATE applicant_details
          SET ${fieldsToUpdate.join(", ")}
          WHERE id = ?
      `;
    params.push(applicantId); // Add applicantId to the params array

    db.query(updateQuery, params, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to update data" });
      }
      res
        .status(200)
        .send({ message: "Applicant details updated successfully" });
    });
  });
});
app.delete("/applicants/:id", (req, res) => {
  const applicantId = req.params.id;

  // Check if applicant exists
  const checkApplicantQuery = `
      SELECT drop_cv FROM applicant_details WHERE id = ?
  `;
  db.query(checkApplicantQuery, [applicantId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Failed to delete applicant" });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "Applicant not found" });
    }

    // Delete drop_cv file if exists
    if (results[0].drop_cv) {
      const dropCvFilePath = results[0].drop_cv;
      fs.unlinkSync(dropCvFilePath); // Delete the drop_cv file synchronously
    }

    // Delete the applicant from database
    const deleteApplicantQuery = `
          DELETE FROM applicant_details WHERE id = ?
      `;
    db.query(deleteApplicantQuery, [applicantId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to delete applicant" });
      }
      res.status(200).send({ message: "Applicant deleted successfully" });
    });
  });
});

// -------------------------EXPORT PDF TO EXCEL SHEET -----------------------------------------
app.get("/export/applicants", (req, res) => {
  const query = `
      SELECT 
          ad.id, 
          ad.name, 
          ad.surname, 
          ad.email, 
          ad.contact, 
          CONCAT('http://${ipAddress}:${PORT}', '/', ad.drop_cv) AS drop_cv, 
          jr.role AS applied_for, 
          ad.position,
          ad.last_ctc, 
          ad.year_of_exp
      FROM 
          applicant_details ad
      JOIN 
          job_role jr ON ad.applied_for = jr.role_id
      ORDER BY ad.id DESC -- Sort by ID in descending order to show latest data first
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Failed to retrieve data" });
    }

    // Create a new workbook and worksheet
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    // Define headers for the Excel file
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Surname", key: "surname", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Contact", key: "contact", width: 12 },
      { header: "Drop CV", key: "drop_cv", width: 50 },
      { header: "Applied For", key: "applied_for", width: 20 },
      { header: "Position", key: "position", width: 20 },
      { header: "Last CTC", key: "last_ctc", width: 15 },
      { header: "Years of Experience", key: "year_of_exp", width: 16 },
    ];

    // Add data to the worksheet
    results.forEach((applicant) => {
      worksheet.addRow({
        id: applicant.id,
        name: applicant.name,
        surname: applicant.surname,
        email: applicant.email,
        contact: applicant.contact,
        drop_cv: applicant.drop_cv,
        applied_for: applicant.applied_for,
        position: applicant.position,
        last_ctc: applicant.last_ctc,
        year_of_exp: applicant.year_of_exp,
      });
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applicants.xlsx"
    );

    // Pipe the Excel file to the response stream
    workbook.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(500)
          .send({ message: "Failed to export data to Excel" });
      });
  });
});

app.get("/getAllCareerData", (req, res) => {
  const sql = `
    SELECT 
      ch.id AS carrer_head_id, 
      ch.carrer_heading, 
      ch.carrer_content, 
      ch.ryh_heading, 
      ch.ryh_content, 
      ci.id AS carrer_images_id,
      ci.img_1, 
      ci.img_1_originalname,
      ci.img_2, 
      ci.img_2_originalname,
      ci.img_3, 
      ci.img_3_originalname,
      ci.img_4, 
      ci.img_4_originalname,
      ci.img_5, 
      ci.img_5_originalname,
      ci.img_6, 
      ci.img_6_originalname,
      ci.img_7, 
      ci.img_7_originalname,
      ci.img_8, 
      ci.img_8_originalname,
      cw.id AS career_wys_and_wyg_id,
      cw.heading AS career_wys_and_wyg_heading,
      cw.content AS career_wys_and_wyg_content
    FROM carrer_head ch
    LEFT JOIN carrer_images ci ON ch.id = ci.id
    LEFT JOIN career_wys_and_wyg cw ON ch.id = cw.id
    WHERE ch.id = 1;  -- Assuming you want data where carrer_head.id = 1
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all career data:", err);
      res.status(500).json({ error: "Error fetching all career data" });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No career data found" });
    }

    // Assuming only one row is expected since we filter by carrer_head.id = 1
    const careerData = results[0];

    // Formatting the response as needed
    const formattedData = {
      carrer_head: {
        id: careerData.carrer_head_id,
        carrer_heading: careerData.carrer_heading,
        carrer_content: careerData.carrer_content,
        ryh_heading: careerData.ryh_heading,
        ryh_content: careerData.ryh_content,
      },
      carrer_images: {
        id: careerData.carrer_images_id,
        images: [
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_1}`,
            originalname: careerData.img_1_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_2}`,
            originalname: careerData.img_2_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_3}`,
            originalname: careerData.img_3_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_4}`,
            originalname: careerData.img_4_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_5}`,
            originalname: careerData.img_5_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_6}`,
            originalname: careerData.img_6_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_7}`,
            originalname: careerData.img_7_originalname,
          },
          {
            url: `http://${ipAddress}:${PORT}/${careerData.img_8}`,
            originalname: careerData.img_8_originalname,
          },
        ],
      },
      career_wys_and_wyg: {
        id: careerData.career_wys_and_wyg_id,
        heading: careerData.career_wys_and_wyg_heading,
        content: careerData.career_wys_and_wyg_content,
      },
    };

    res.status(200).json(formattedData);
  });
});

// =====================CONTACT US PAGE====================
app.put("/contactUs", uploadImage.none(), (req, res) => {
  const { heading, email, phone, address } = req.body;

  // Check if the record with id=1 exists
  db.query("SELECT * FROM contact_us WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // If record exists, update it
      const existingRecord = results[0];
      const updatedRecord = {
        heading: heading || existingRecord.heading,
        email: email || existingRecord.email,
        phone: phone || existingRecord.phone,
        address: address || existingRecord.address,
      };

      db.query(
        "UPDATE contact_us SET heading = ?, email = ?, phone = ?, address = ? WHERE id = 1",
        [
          updatedRecord.heading,
          updatedRecord.email,
          updatedRecord.phone,
          updatedRecord.address,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      // If record does not exist, insert a new one
      db.query(
        "INSERT INTO contact_us (heading, email, phone, address) VALUES (?, ?, ?, ?)",
        [heading, email, phone, address],
        (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: "Record inserted successfully" });
        }
      );
    }
  });
});
app.get("/contactUs", (req, res) => {
  // Fetch record where id = 1
  db.query("SELECT * FROM contact_us WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Extract relevant fields
    const { id, heading, email, phone, address } = results[0];
    res.json({
      id,
      heading,
      email,
      phone,
      address,
    });
  });
});
app.post("/contactForm", uploadImage.none(), (req, res) => {
  const { name, email, message } = req.body;
  const sql =
    "INSERT INTO contact_us_form ( name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, results) => {
    if (err) throw err;
    res.status(201).json({ message: "Submit form successfully" });
  });
});
app.put("/contactForm/:id", uploadImage.none(), (req, res) => {
  const { name, email, message } = req.body;
  const id = req.params.id;

  // Fetch the existing record
  const fetchSql = "SELECT * FROM contact_us_form WHERE id = ?";
  db.query(fetchSql, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const existingRecord = results[0];

    // Update only the fields that are provided in the request body

    const updatedName = name !== undefined ? name : existingRecord.name;
    const updatedEmail = email !== undefined ? email : existingRecord.email;
    const updatedMessage =
      message !== undefined ? message : existingRecord.message;

    const updateSql =
      "UPDATE contact_us_form SET  name = ?, email = ?, message = ? WHERE id = ?";
    db.query(
      updateSql,
      [updatedName, updatedEmail, updatedMessage, id],
      (err, results) => {
        if (err) throw err;
        res.status(200).json({ message: "Updated form data successfully" });
      }
    );
  });
});
app.delete("/contactForm/:id", (req, res) => {
  const sql = "DELETE FROM contact_us_form WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.send({ message: "Deleted successfully." });
  });
});
app.get("/contactForm", (req, res) => {
  const sql = "SELECT * FROM contact_us_form";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// =======================PRODUCTS PAGE===================================
app.post("/products", uploadImage.none(), (req, res) => {
  const { heading, content, video_link, link1, link2 } = req.body;
  const sql =
    "INSERT INTO products (heading, content, video_link, link1, link2) VALUES (?, ?, ?, ? ,?)";
  db.query(sql, [heading, content, video_link, link1, link2], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(201)
        .json({ message: "Product created successfully", id: result.insertId });
      // res.status(500).json({ error: err.message });
    }
  });
});
app.put("/products/:id", uploadImage.none(), (req, res) => {
  const productId = req.params.id;
  const { heading, content, video_link, link1, link2 } = req.body;
  let updates = [];
  let placeholders = [];

  // Prepare SQL based on provided fields
  if (heading) {
    updates.push("heading = ?");
    placeholders.push(heading);
  }
  if (content) {
    updates.push("content = ?");
    placeholders.push(content);
  }
  if (video_link) {
    updates.push("video_link = ?");
    placeholders.push(video_link);
  }
  if (link1) {
    updates.push("link1 = ?");
    placeholders.push(link1);
  }
  if (link2) {
    updates.push("link2 = ?");
    placeholders.push(link2);
  }

  // If no fields to update, return error
  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const sql = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;
  placeholders.push(productId);

  db.query(sql, placeholders, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Product updated successfully" });
      // res.status(500).json({ error: err.message });
    }
  });
});
app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, productId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  });
});
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// ========================HEADER PAGE======================
app.put("/header", uploadImage.none(), (req, res) => {
  const { header_color1, header_color2 } = req.body;

  // Check if the record with id=1 exists
  db.query("SELECT * FROM header WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // If record exists, update it
      const existingRecord = results[0];
      const updatedRecord = {
        header_color1: header_color1 || existingRecord.header_color1,
        header_color2: header_color2 || existingRecord.header_color2,
      };

      db.query(
        "UPDATE header SET header_color1 = ?, header_color2 = ? WHERE id = 1",
        [updatedRecord.header_color1, updatedRecord.header_color2],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      // If record does not exist, insert a new one
      db.query(
        "INSERT INTO header (id, header_color1, header_color2) VALUES (1, ?, ?)",
        [header_color1, header_color2],
        (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: "Record inserted successfully" });
        }
      );
    }
  });
});
app.get("/header", (req, res) => {
  db.query("SELECT * FROM header WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Header colors not found" });
    }
    const headerColors = results[0];
    res.json(headerColors);
  });
});

// ========================FOOTER PAGE======================
app.put("/footer", uploadImage.none(), (req, res) => {
  const { footer_color, address, email, phone, link1, link2, link3 } = req.body;

  // Check if the record with id=1 exists
  db.query("SELECT * FROM footer WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // If record exists, update it
      const existingRecord = results[0];
      const updatedRecord = {
        footer_color: footer_color || existingRecord.footer_color,
        email: email || existingRecord.email,
        phone: phone || existingRecord.phone,
        address: address || existingRecord.address,
        link1: link1 || existingRecord.link1,
        link2: link2 || existingRecord.link2,
        link3: link3 || existingRecord.link3,
      };

      db.query(
        "UPDATE footer SET footer_color = ?, email = ?, phone = ?, address = ?, link1 = ?, link2 = ?, link3 = ? WHERE id = 1",
        [
          updatedRecord.footer_color,
          updatedRecord.email,
          updatedRecord.phone,
          updatedRecord.address,
          updatedRecord.link1,
          updatedRecord.link2,
          updatedRecord.link3,
        ],
        (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
          res.json({ message: "Record updated successfully" });
        }
      );
    } else {
      // If record does not exist, insert a new one
      db.query(
        "INSERT INTO footer (id, footer_color, email, phone, address, link1, link2, link3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [1, footer_color, email, phone, address, link1, link2, link3],
        (insertErr, insertResults) => {
          if (insertErr) {
            return res.status(500).json({ error: insertErr.message });
          }
          res.json({ message: "Record inserted successfully" });
        }
      );
    }
  });
});
app.get("/footer", (req, res) => {
  // Fetch record where id = 1
  db.query("SELECT * FROM footer WHERE id = 1", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Extract relevant fields
    const { id, footer_color, email, phone, address, link1, link2, link3 } =
      results[0];
    res.json({
      id,
      footer_color,
      email,
      phone,
      address,
      link1,
      link2,
      link3,
    });
  });
});
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }

  return res.status(500).json({ error: err.message });
});

const ifaces = os.networkInterfaces();
let ipAddress;
Object.keys(ifaces).forEach((ifname) => {
  ifaces[ifname].forEach((iface) => {
    if (iface.family === "IPv4" && !iface.internal) {
      ipAddress = iface.address;
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://${ipAddress}:${PORT}`);
});
