function addCourse() {
  const tbody = document.querySelector("tbody");
  for (let i = 0; i < 3; i++) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>
            <input class="form-control courseName" type="text" placeholder="Course" />
        </td>
        <td>
            <input class="form-control creditHours" type="number" placeholder="Crdts" />
        </td>
        <td>
            <select class="form-control grade">
            <option>-</option>
            <option value="4.0">A</option>
            <option value="3.67">A-</option>
            <option value="3.33">B+</option>
            <option value="3.0">B</option>
            <option value="2.67">B-</option>
            <option value="2.33">C+</option>
            <option value="2.0">C</option>
            <option value="1.67">C-</option>
            <option value="1.0">D</option>
            <option value="0.0">F</option>
            </select>
        </td>
        <td>
            <button onclick="deleteCourse(this)" class="btn btn-secondary">
            <i class="fa-solid fa-x"></i>
            </button>
        </td>
    `;
    tbody.appendChild(newRow);
  }
}

function deleteCourse(button) {
  const rows = document.querySelectorAll("tbody tr");
  if (rows.length > 1) {
    const row = button.closest("tr");
    row.remove();
  }else{
    alert("Atleast one row must be present.");
  }
}

function calculateGPA() {
  const rows = document.querySelectorAll("tbody tr");
  let gpa = 0;
  let totalCrdts = 0;
  rows.forEach((row) => {
    const crdthrs = Number(row.querySelector(".creditHours").value);
    const grade = Number(row.querySelector(".grade").value);
    if (grade && crdthrs) {
      gpa += crdthrs * grade;
      totalCrdts += crdthrs;
    }
  });
  const sgpa = totalCrdts > 0 ? gpa / totalCrdts : 0;
  document.getElementById("gparesult").textContent = `GPA: ${sgpa.toFixed(2)}`;
}
