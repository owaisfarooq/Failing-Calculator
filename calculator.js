const templates = JSON.parse(localStorage.getItem("templates"));
const urlParams = new URLSearchParams(window.location.search);
const templateName = urlParams.get("name");
const template = templates.find((template) => template.name === templateName);

const MainBox = document.getElementById("MainBox");

function makeOverAllTable () {
    const overAllTable = document.getElementById("overAllTable");
    let finalWeightage = 100;
    let htmlToAdd = `
        <thead>
            <tr>
    `;

    const percentagesCouting = []
    let totalpercentagesCouting = 0;

    template.Entries.forEach((entry, index) => {
        let totalObtainedMarks = 0;
        let totalTotalMarks = 0;
        entry.Entries.forEach ( e => totalObtainedMarks += e.obtainedMarks )
        entry.Entries.forEach ( e => totalTotalMarks += e.totalMarks )

        finalWeightage -= entry.weightage;
        htmlToAdd += `
            <th scope="col">${entry.name} (${entry.weightage}%)</th>
        `;
        percentagesCouting.push((totalObtainedMarks/totalTotalMarks)*entry.weightage)
        totalpercentagesCouting += (totalObtainedMarks/totalTotalMarks)*entry.weightage;

    });

    htmlToAdd += `
        <th scope="col">Finals (${finalWeightage}%) (ignore)</th>
    `;

    htmlToAdd += ` </tr>
        </thead>
        <tbody>
            <tr>
    `;

    template.Entries.forEach((entry, index) => {
        htmlToAdd += `
            <td>${percentagesCouting[index]}</td>
        `;
    });

    htmlToAdd += `
                    <td>${40 - totalpercentagesCouting}</td>
                </tr>
            </tbody>
        </table>
    `;

    const minMarksNeededInFinals = (40 - totalpercentagesCouting) / (finalWeightage / 100);
    console.log("minMarksNeededInFinals: ", minMarksNeededInFinals);
    const result = document.getElementById("result");
    result.innerHTML = `Percentage Needed in Finals: ${Number(minMarksNeededInFinals).toFixed(6)} %`;

    overAllTable.innerHTML = htmlToAdd;

}

let htmlToBeAdded = `<div class="row">`;

template.Entries.forEach((entry, index) => {
    if (index % 2 === 0 && index !== 0) {
        htmlToBeAdded += `</div><div class="row my-5">`;
    }

    htmlToBeAdded += `
    <div class="col-6">
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Sr_No.</th>
                    <th scope="col">Name</th>
                    <th scope="col">Obtained Marks</th>
                    <th scope="col">Total Marks</th>
                    <th scope="col">%</th>
                </tr>
            </thead>
            <tbody>`;
    entry.Entries.forEach((subEntry, subIndex) => {
        htmlToBeAdded += `
            <tr>
                <th scope="row">${subIndex + 1}</th>
                <td>${subEntry.name}</td>
                <td><input class="form-control" value="${subEntry.obtainedMarks}" oninput="calculate()" type="number"></td>
                <td><input class="form-control" value="${subEntry.totalMarks}" oninput="calculate()" type="number"></td>
                <td>${((subEntry.obtainedMarks / subEntry.totalMarks) * 100).toFixed(2)} %</td>
            </tr>`;
    });
    htmlToBeAdded += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" class="text-end"><strong>Total:</strong></td>
                    <td class="obtained-total">0</td>
                    <td class="total-total">0</td>
                    <td class="total-percentage"></td>
                </tr>
            </tfoot>
        </table>
    </div>`;
});

htmlToBeAdded += `</div>`;
MainBox.innerHTML = htmlToBeAdded;

function calculate() {
    const data = {};
    // Iterate over each table to calculate totals
    let tIndex = 0;
    const tables = MainBox.querySelectorAll(".table");
    tables.forEach((table) => {
        const tBody = table.tBodies[0];
        const tFoot = table.tFoot;
        let obtainedTotal = 0;
        let totalMarksTotal = 0;
        // Calculate row-wise totals
        for (let i = 0; i < tBody.rows.length; i++) {
            const row = tBody.rows[i];
            const obtainedInput = row.cells[2].querySelector("input");
            const totalInput = row.cells[3].querySelector("input");

            const obtainedMarks = Number(obtainedInput.value) || 0;
            const totalMarks = Number(totalInput.value) || 0;
            template.Entries[tIndex].Entries[i].obtainedMarks = obtainedMarks;
            template.Entries[tIndex].Entries[i].totalMarks = totalMarks;

            // Update percentage
            const percentageCell = row.cells[4];
            percentageCell.textContent =
                totalMarks > 0 ? `${((obtainedMarks / totalMarks) * 100).toFixed(2)} %` : "N/A";
                
                // Accumulate totals
                obtainedTotal += obtainedMarks;
            totalMarksTotal += totalMarks;
        }
        // template.Entries[tIndex].Entries.forEach((subEntry, subIndex) => {
        
        tIndex++;
        // Update tfoot totals
        
        tFoot.querySelector(".obtained-total").textContent = obtainedTotal;
        tFoot.querySelector(".total-total").textContent = totalMarksTotal;
        tFoot.querySelector(".total-percentage").textContent = `${((obtainedTotal / totalMarksTotal) * 100).toFixed(2)} %`;
    });

    templates[templates.findIndex((template) => template.name === templateName)] = template;
    localStorage.setItem("templates", JSON.stringify(templates));
    makeOverAllTable()
}

// Initial calculation
calculate();
