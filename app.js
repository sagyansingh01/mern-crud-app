const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));   // Serve CSS, JS, images from /public
app.set("view engine", "ejs");

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Schema & Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  // store courses as an array of strings
  course: { type: [String], required: true },
  roll_no: { type: String, required: true, unique: true }
});

// 🔒 Ensure unique index in DB
studentSchema.index({ roll_no: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

// 🏠 Home (Read all students)
app.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.render("index", { students, error: null });   // ✅ always pass error
  } catch (err) {
    console.error("Error fetching students:", err.message);
    res.status(500).send("Error fetching students.");
  }
});

// ➕ Add student
app.post("/add", async (req, res) => {
  try {
    // allow comma-separated course input and store as array of trimmed non-empty strings
    const courses = String(req.body.course || "").split(",").map(s => s.trim()).filter(Boolean);
    const newStudent = new Student({
      name: req.body.name,
      age: Number(req.body.age),
      dob: new Date(req.body.dob),
      course: courses,
      roll_no: String(req.body.roll_no).trim()
    });
    await newStudent.save();
    res.redirect("/");
  } catch (err) {
    if (err.code === 11000) {  // Duplicate roll_no
      console.error("Duplicate Roll No:", req.body.roll_no);
      const students = await Student.find();
      return res.render("index", { students, error: "❌ Roll No must be unique!" });
    } else {
      console.error("Error saving student:", err.message);
      const students = await Student.find();
      return res.render("index", { students, error: "❌ Error saving student." });
    }
  }
});

// ✏ Edit student form
app.get("/edit/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.redirect('/');
    res.render('edit', { student, error: null });
  } catch (err) {
    console.error('Error fetching student for edit:', err.message);
    res.status(500).send('Error fetching student.');
  }
});

// 🔄 Update student
app.post("/update/:id", async (req, res) => {
  try {
    const courses = String(req.body.course || "").split(",").map(s => s.trim()).filter(Boolean);
    await Student.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      age: Number(req.body.age),
      dob: new Date(req.body.dob),
      course: courses,
      roll_no: String(req.body.roll_no).trim()
    });
    res.redirect('/');
  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate Roll No:", req.body.roll_no);
      const student = await Student.findById(req.params.id);
      return res.render("edit", { student, error: "❌ Roll No must be unique!" });
    } else {
      console.error("Error updating student:", err.message);
      const student = await Student.findById(req.params.id);
      return res.render("edit", { student, error: "❌ Error updating student." });
    }
  }
});

// ❌ Delete student
app.get("/delete/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting student:", err.message);
    res.status(500).send("Error deleting student.");
  }
});

// DEBUG: return raw student JSON (temporary)
app.get('/debug/student/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
  } catch (err) {
    console.error('Debug error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
