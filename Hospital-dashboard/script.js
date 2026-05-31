const API = "";
let currentData = [];
let currentSection = 'overview';

// CLOCK
function updateTime() {
  const now = new Date();
  document.getElementById('topbar-time').textContent =
    now.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
}
setInterval(updateTime, 1000);
updateTime();

// LOGIN
function login() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;
  if (email && pass) {
    localStorage.setItem("user", email);
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    const name = email.split('@')[0];
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
    loadOverview();
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  location.reload();
}

// TOGGLE SIDEBAR
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('sidebar-hidden');
}

// REFRESH
function refreshPage() {
  loadSection(currentSection);
  if (currentSection === 'overview') loadOverview();
}

// SET ACTIVE
function setActive(btn, section) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const label = btn.querySelector('span') ? btn.querySelector('span').textContent : btn.textContent.trim();
  document.getElementById('page-title').textContent = label;
  document.getElementById('page-sub').textContent = 'Hospital Management System';
  currentSection = section;
  loadSection(section);
}

function setActiveByName(section) {
  const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b =>
    b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${section}'`)
  );
  if (btn) setActive(btn, section);
}

// ENDPOINTS
const endpoints = {
  patients:'patients', doctors:'doctors', departments:'departments',
  nurses:'nurses', rooms:'rooms', appointments:'appointments',
  bills:'bills', payments:'payments', medicines:'medicines',
  labtests:'lab-tests', admissions:'admissions', emergency:'emergency-cases',
  inventory:'inventory', prescriptions:'prescriptions'
};

// LOAD SECTION
async function loadSection(name) {
  if (name === 'overview') {
    document.getElementById('overview-section').style.display = '';
    document.getElementById('table-section').style.display = 'none';
    loadOverview();
    return;
  }
  document.getElementById('overview-section').style.display = 'none';
  document.getElementById('table-section').style.display = '';
  document.getElementById('add-btn').style.display = 'flex';

  try {
    const res = await fetch(`${API}/${endpoints[name]}`);
    const data = await res.json();
    currentData = data;
    renderTable(data, name);
    document.getElementById('table-title').innerHTML = `<i class="ti ti-table"></i> ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    document.getElementById('table-count').textContent = data.length + ' records';
  } catch(e) {
    document.getElementById('tbody').innerHTML =
      '<tr><td colspan="20" style="text-align:center;padding:3rem;color:#475569">Could not load data. Make sure server is running.</td></tr>';
  }
}

// RENDER TABLE
function renderTable(data, name) {
  if (!data.length) {
    document.getElementById('thead').innerHTML = '';
    document.getElementById('tbody').innerHTML =
      '<tr><td style="padding:3rem;color:#475569;text-align:center">No records found</td></tr>';
    return;
  }
  const headers = Object.keys(data[0]);
  document.getElementById('thead').innerHTML =
    '<tr>' + headers.map(h => `<th>${h.replace(/_/g,' ').toUpperCase()}</th>`).join('') + '<th>ACTIONS</th></tr>';

  document.getElementById('tbody').innerHTML = data.map((row, idx) =>
    '<tr>' + headers.map(h => {
      const val = row[h] ?? '';
      const key = String(h).toLowerCase();
      if (key.includes('status')) {
        const v = String(val).toLowerCase();
        const cls = v.includes('active') ? 's-active' : v.includes('pending') ? 's-pending' : v.includes('critical') ? 's-critical' : 's-done';
        return `<td><span class="status ${cls}">${val}</span></td>`;
      }
      return `<td>${val}</td>`;
    }).join('') +
    `<td>
      <button class="btn-edit" onclick="editRecord(${idx})"><i class="ti ti-edit"></i> Edit</button>
      <button class="btn-delete" onclick="deleteRecord(${idx})"><i class="ti ti-trash"></i></button>
    </td></tr>`
  ).join('');
}

// FILTER
function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = currentData.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(q))
  );
  renderTable(filtered, currentSection);
  document.getElementById('table-count').textContent = filtered.length + ' records';
}

// MODAL
function showAddModal() {
  if (!currentData.length) return;
  const headers = Object.keys(currentData[0]).filter(h => h !== 'id');
  document.getElementById('modal-title').textContent = 'Add New Record';
  document.getElementById('modal-body').innerHTML = headers.map(h =>
    `<div class="modal-field">
      <label>${h.replace(/_/g,' ').toUpperCase()}</label>
      <input type="text" id="field-${h}" placeholder="Enter ${h.replace(/_/g,' ')}">
    </div>`
  ).join('');
  document.getElementById('modal').style.display = 'flex';
}

function editRecord(idx) {
  const row = currentData[idx];
  const headers = Object.keys(row).filter(h => h !== 'id');
  document.getElementById('modal-title').textContent = 'Edit Record';
  document.getElementById('modal-body').innerHTML = headers.map(h =>
    `<div class="modal-field">
      <label>${h.replace(/_/g,' ').toUpperCase()}</label>
      <input type="text" id="field-${h}" value="${row[h] ?? ''}">
    </div>`
  ).join('');
  document.getElementById('modal').style.display = 'flex';
}

function deleteRecord(idx) {
  if (confirm('Are you sure you want to delete this record?')) {
    currentData.splice(idx, 1);
    renderTable(currentData, currentSection);
    document.getElementById('table-count').textContent = currentData.length + ' records';
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function saveRecord() {
  closeModal();
  alert('Saved! (Connect backend API to persist data)');
}

// OVERVIEW
async function loadOverview() {
  const tables = [
    {k:'patients', ep:'patients', bar:'b1', bv:'bv1', sc:'s-patients', cc:'c-patients'},
    {k:'doctors', ep:'doctors', bar:'b2', bv:'bv2', sc:'s-doctors', cc:'c-doctors'},
    {k:'nurses', ep:'nurses', bar:'b3', bv:'bv3', sc:'s-nurses'},
    {k:'rooms', ep:'rooms', bar:'b4', bv:'bv4', sc:'s-rooms'},
    {k:'appointments', ep:'appointments', bar:'b5', bv:'bv5', sc:'s-appointments', cc:'c-appointments'},
    {k:'bills', ep:'bills', bar:'b6', bv:'bv6', sc:'s-bills', cc:'c-bills'},
    {k:'emergency', ep:'emergency-cases', bar:'b7', bv:'bv7', sc:'s-emergency', cc:'c-emergency'},
    {k:'medicines', ep:'medicines', bar:'b8', bv:'bv8', sc:'s-medicines'},
    {k:'inventory', ep:'inventory', cc:'c-inventory'},
  ];

  const counts = [];
  for (let t of tables) {
    try {
      const r = await fetch(`${API}/${t.ep}`);
      const d = await r.json();
      const n = d.length;
      counts.push(n);
      if (t.sc) { const el = document.getElementById(t.sc); if(el) el.textContent = n; }
      if (t.cc) { const el = document.getElementById(t.cc); if(el) el.textContent = n; }
    } catch(e) { counts.push(0); }
  }

  const max = Math.max(...counts.slice(0,8), 1);
  tables.slice(0,8).forEach((t, i) => {
    const h = Math.max(Math.round((counts[i] / max) * 130), 4);
    const bar = document.getElementById(t.bar);
    const bv = document.getElementById(t.bv);
    if (bar) bar.style.height = h + 'px';
    if (bv) bv.textContent = counts[i];
  });
}