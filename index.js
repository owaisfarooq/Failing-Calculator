function route (name) {
  if (window.location.href.includes("github")) {
    window.location.assign(`/Failing-Calculator/calculator.html?name=${encodeURIComponent(name)}`);
  } else {
    window.location.assign(`calculator.html?name=${encodeURIComponent(name)}`);
  }
}

let templates = JSON.parse(localStorage.getItem("templates"));
const newDate = new Date(2025, 0, 9, 10, 24, 0)
if (!templates || !templates.length || !localStorage.getItem("lastUpdated") || newDate < new Date(localStorage.getItem("lastUpdated"))) {
  localStorage.setItem("lastUpdated", newDate.toISOString());
  localStorage.setItem("templates", JSON.stringify([{
    "name": "Intro to Data Science",
    "Entries": [{
      "name": "Assignments",
      "weightage": 10,
      "Entries": [{
        "name": "Assignment-I",
        "obtainedMarks": 5,
        "totalMarks": 10
      }, {
        "name": "Assignment-II",
        "obtainedMarks": 5,
        "totalMarks": 10
      }, {
        "name": "Assignment-III",
        "obtainedMarks": 7,
        "totalMarks": 10
      }]
    }, {
      "name": "Mids",
      "weightage": 30,
      "Entries": [{
        "name": "Midterm Q.1",
        "obtainedMarks": 6,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.2",
        "obtainedMarks": 10,
        "totalMarks": 106
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 6,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 4,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 0.01,
        "totalMarks": 10
      }]
    }, {
      "name": "Project",
      "weightage": 10,
      "Entries": [{
        "name": "Project-I",
        "obtainedMarks": 9,
        "totalMarks": 10
      }]
    }, {
      "name": "Quizes",
      "weightage": 10,
      "Entries": [{
        "name": "Quiz-I",
        "obtainedMarks": 6,
        "totalMarks": 10
      }, {
        "name": "Quiz-II",
        "obtainedMarks": 9,
        "totalMarks": 10
      }, {
        "name": "Quiz-III",
        "obtainedMarks": 9,
        "totalMarks": 10
      }, {
        "name": "Quiz-IV",
        "obtainedMarks": 6,
        "totalMarks": 10
      }]
    }]
  }, {
    "name": "Calculus",
    "Entries": [{
      "name": "Assignments",
      "weightage": 15,
      "Entries": [{
        "name": "Assignment-I",
        "obtainedMarks": 10,
        "totalMarks": 15
      }, {
        "name": "Assignment-II",
        "obtainedMarks": 12,
        "totalMarks": 15
      }, {
        "name": "Assignment-III",
        "obtainedMarks": 10,
        "totalMarks": 15
      }]
    }, {
      "name": "Mids",
      "weightage": 25,
      "Entries": [{
        "name": "Midterm Q.1",
        "obtainedMarks": 5,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.2",
        "obtainedMarks": 22,
        "totalMarks": 30
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 9,
        "totalMarks": 10
      }]
    }, {
      "name": "Quizes",
      "weightage": 15,
      "Entries": [{
        "name": "Quiz-I",
        "obtainedMarks": 10,
        "totalMarks": 10
      }, {
        "name": "Quiz-II",
        "obtainedMarks": 7,
        "totalMarks": 10
      }, {
        "name": "Quiz-III",
        "obtainedMarks": 9,
        "totalMarks": 10
      }, {
        "name": "Quiz-IV",
        "obtainedMarks": 6,
        "totalMarks": 10
      }, {
        "name": "Quiz-V",
        "obtainedMarks": 7,
        "totalMarks": 10
      }]
    }]
  }, {
    "name": "Probality and Statistics",
    "Entries": [{
      "name": "Assignments",
      "weightage": 10,
      "Entries": [{
        "name": "Individual Activity-01",
        "obtainedMarks": 4.5,
        "totalMarks": 5
      }, {
        "name": "Individual Activity-02",
        "obtainedMarks": 10,
        "totalMarks": 10
      }, {
        "name": "Individual Activity-03",
        "obtainedMarks": 5,
        "totalMarks": 5
      }, {
        "name": "Individual Activity-04",
        "obtainedMarks": 0,
        "totalMarks": 5
      }, {
        "name": "Individual Activity-05",
        "obtainedMarks": 10,
        "totalMarks": 10
      }, {
        "name": "Individual Activity-06",
        "obtainedMarks": 10,
        "totalMarks": 10
      }]
    }, {
      "name": "Mids",
      "weightage": 25,
      "Entries": [{
        "name": "Midterm Q.1",
        "obtainedMarks": 6,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.2",
        "obtainedMarks": 10,
        "totalMarks": 15
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 9,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.4",
        "obtainedMarks": 10,
        "totalMarks": 15
      }]
    }, {
      "name": "Quizes",
      "weightage": 10,
      "Entries": [{
        "name": "Quiz-I",
        "obtainedMarks": 4.5,
        "totalMarks": 5
      }, {
        "name": "Quiz-II",
        "obtainedMarks": 5,
        "totalMarks": 20
      }, {
        "name": "Quiz-III",
        "obtainedMarks": 20,
        "totalMarks": 20
      }, {
        "name": "Quiz-IV",
        "obtainedMarks": 10,
        "totalMarks": 10
      }]
    }, {
      "name": "Projects",
      "weightage": 10,
      "Entries": [{
        "name": "Project-I",
        "obtainedMarks": 3,
        "totalMarks": 10
      }]
    }]
  }, {
    "name": "Computer Networks",
    "Entries": [{
      "name": "Assignments",
      "weightage": 10,
      "Entries": [{
        "name": "Assignment-I",
        "obtainedMarks": 7,
        "totalMarks": 10
      }, {
        "name": "Assignment-II",
        "obtainedMarks": 7,
        "totalMarks": 10
      }, {
        "name": "Assignment-III",
        "obtainedMarks": 5,
        "totalMarks": 10
      }]
    }, {
      "name": "Mids",
      "weightage": 25,
      "Entries": [{
        "name": "Midterm Q.1",
        "obtainedMarks": 7,
        "totalMarks": 10
      }, {
        "name": "Midterm Q.2",
        "obtainedMarks": 11,
        "totalMarks": 20
      }, {
        "name": "Midterm Q.3",
        "obtainedMarks": 11,
        "totalMarks": 20
      }]
    }, {
      "name": "Quizes",
      "weightage": 10,
      "Entries": [{
        "name": "Quiz-I",
        "obtainedMarks": 8,
        "totalMarks": 10
      }, {
        "name": "Quiz-II",
        "obtainedMarks": 6,
        "totalMarks": 10
      }]
    }, {
      "name": "Projects",
      "weightage": 10,
      "Entries": [{
        "name": "Project-I",
        "obtainedMarks": 12.5,
        "totalMarks": 20
      }]
    }]
  }]));

  templates = JSON.parse(localStorage.getItem("templates"));
}

const listBox = document.getElementById("ListBox");
let htmlToBeAdded = `<div class="row my-5">`;

templates.forEach((template, index) => {
  if (index % 3 === 0 && index !== 0) {
    htmlToBeAdded += `</div><div class="row my-5">`;
  }
  htmlToBeAdded += `
    <div class="col-12 col-md-4 mb-4">
      <div class="card mx-auto" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${template.name}</h5>
          <p class="card-text">Good Luck 🫡</p>
          <a onclick='route("${template.name}")' class="btn btn-primary">Go There</a>
        </div>
      </div>
    </div>
  `;
});
htmlToBeAdded += `
  </div>
`;
listBox.innerHTML = htmlToBeAdded;
