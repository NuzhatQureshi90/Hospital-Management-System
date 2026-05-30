const API = "";

function login() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  if (email && pass) {
    localStorage.setItem("user", email);
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "flex";
    showTable("patients");
  }
}

async function showTable(name) {
  const endpoints = {
    patients: "patients",
    doctors: "doctors",
    departments: "departments",
    nurses: "nurses",
    rooms: "rooms",
    appointments: "appointments",
    bills: "bills",
    payments: "payments",
    medicines: "medicines",
    labtests: "lab-tests",
    admissions: "admissions",
    emergency: "emergency-cases",
    inventory: "inventory",
    prescriptions: "prescriptions"
  };

  if (name === "overview") {
    loadGraph();
    return;
  }

  try {
    const res = await fetch(`${API}/${endpoints[name]}`);
    const data = await res.json();

    if (!data.length) {
      document.getElementById("tableData").innerHTML = "<p>No data found</p>";
      return;
    }

    // Table headers
    const headers = Object.keys(data[0]);
    let html = `<h2>${name.toUpperCase()}</h2>
    <table border="1" style="width:100%;border-collapse:collapse">
      <tr>${headers.map(h => `<th style="padding:8px;background:#2c3e50;color:white">${h}</th>`).join("")}</tr>`;

    data.forEach(row => {
      html += `<tr>${headers.map(h => `<td style="padding:8px">${row[h] ?? ""}</td>`).join("")}</tr>`;
    });

    html += "</table>";
    document.getElementById("tableData").innerHTML = html;

  } catch (err) {
    document.getElementById("tableData").innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
}

async function loadGraph() {
  try {
    const [p, d, b] = await Promise.all([
      fetch(`${API}/patients`).then(r => r.json()),
      fetch(`${API}/doctors`).then(r => r.json()),
      fetch(`${API}/bills`).then(r => r.json()),
    ]);

    new Chart(document.getElementById("chart"), {
      type: "bar",
      data: {
        labels: ["Patients", "Doctors", "Bills"],
        datasets: [{
          label: "Hospital Overview",
          data: [p.length, d.length, b.length],
          backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"]
        }]
      }
    });
  } catch (err) {
    console.log("Graph error:", err.message);
  }
}