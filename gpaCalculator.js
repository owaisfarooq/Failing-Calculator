function addCourse() {

}

function deleteCourse() {}

function calculateGPA() {
  const rows = document.querySelectorAll("tbody tr");
  let gpa = 0;
  let sgpa = 0;
  let totalCrdts = 0;
  rows.forEach((row) => {
    const crdthrs = row.querySelector("#creditHours").value;
    const grade = row.querySelector("#grade").value;
    gpa += crdthrs * grade;
    totalCrdts += crdthrs;
  });
  sgpa = gpa / totalCrdts;
  document.getElementById("gparesult").textContent = `GPA: ${sgpa.toFixed(2)}`;
}
