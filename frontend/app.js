const API_URL = "/api/computers";

const form = document.getElementById("computer-form");
const list = document.getElementById("computer-list");

async function loadComputers() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("ไม่สามารถโหลดข้อมูลได้");
    }

    const computers = await response.json();

    list.innerHTML = "";

    computers.forEach((computer) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${computer.id}</td>
        <td>${computer.asset_code}</td>
        <td>${computer.brand_model}</td>
        <td>${computer.cpu}</td>
        <td>${computer.ram_gb} GB</td>
        <td>${computer.room}</td>
        <td>${computer.status}</td>
        <td>
          <button class="primary" onclick="editComputer(${computer.id})">
            แก้ไข
          </button>

          <button class="danger" onclick="deleteComputer(${computer.id})">
            ลบ
          </button>
        </td>
      `;

      list.appendChild(row);
    });
  } catch (error) {
    alert(error.message);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("computer-id").value;

  const data = {
    asset_code: document.getElementById("asset_code").value,
    brand_model: document.getElementById("brand_model").value,
    cpu: document.getElementById("cpu").value,
    ram_gb: Number(document.getElementById("ram_gb").value),
    room: document.getElementById("room").value,
    status: document.getElementById("status").value,
  };

  try {
    const response = await fetch(
      id ? `${API_URL}/${id}` : API_URL,
      {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "เกิดข้อผิดพลาด");
    }

    alert(id ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ");

    resetForm();
    loadComputers();
  } catch (error) {
    alert(error.message);
  }
});

async function editComputer(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const computer = await response.json();

    document.getElementById("computer-id").value = computer.id;
    document.getElementById("asset_code").value = computer.asset_code;
    document.getElementById("brand_model").value = computer.brand_model;
    document.getElementById("cpu").value = computer.cpu;
    document.getElementById("ram_gb").value = computer.ram_gb;
    document.getElementById("room").value = computer.room;
    document.getElementById("status").value = computer.status;

    document.getElementById("form-title").textContent =
      "แก้ไขข้อมูลคอมพิวเตอร์";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    alert("ไม่สามารถโหลดข้อมูลได้");
  }
}

async function deleteComputer(id) {
  if (!confirm("ต้องการลบข้อมูลคอมพิวเตอร์นี้หรือไม่?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "ลบข้อมูลไม่สำเร็จ");
    }

    alert("ลบข้อมูลสำเร็จ");

    loadComputers();
  } catch (error) {
    alert(error.message);
  }
}

function resetForm() {
  form.reset();

  document.getElementById("computer-id").value = "";

  document.getElementById("form-title").textContent =
    "เพิ่มข้อมูลคอมพิวเตอร์";
}

loadComputers();