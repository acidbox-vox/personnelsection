const ADMIN_PASSWORD = "0910655667";
let isAdmin = false;
let selectedNodeId = null;
let rawChartData = null;

// ⚠️ ลิงก์ URL เว็บแอปจาก Apps Script ของคุณ
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzL8Vl6GS-vbaQBAR9F636X6Cqh4oHI9_AJzBTkz-b1Ro7ciW0C5WRT3lcR0mQEXj2u/exec";

function renderPyramidChart() {
    // ดึงข้อมูลออนไลน์จาก Google Sheets ล่าสุดเสมอ
    fetch(GOOGLE_APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(jsonData => {
        rawChartData = jsonData;
        buildHtmlDOM(rawChartData);
    })
    .catch(err => {
        console.error("ดาวน์โหลดข้อมูลล้มเหลว:", err);
        alert("ไม่สามารถดึงข้อมูลผังจาก Google Sheets ได้ กรุณาตรวจสอบอินเทอร์เน็ตหรือลิงก์เชื่อมต่อ");
    });
}

function buildHtmlDOM(layers) {
    const container = document.getElementById("chart-pyramid");
    container.innerHTML = '';
    const defaultImg = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

    layers.forEach(layerData => {
        const row = document.createElement("div");
        row.className = "layer-row";
        row.setAttribute("data-layer", layerData.layer);
        
        const cardsContainer = document.createElement("div");
        cardsContainer.className = "cards-container";
        
        layerData.people.forEach(person => {
            const card = document.createElement("div");
            card.className = `node-card ${person.name === 'ว่าง' ? 'vacant' : ''}`;
            
            const imgUrl = (person.photo && person.photo.trim() !== "") ? person.photo : defaultImg;
            
            card.innerHTML = `
                <img src="${imgUrl}" onerror="this.onerror=null; this.src='${defaultImg}';" alt="profile">
                <div class="name">${person.name}</div>
                <div class="title">${person.title}</div>
            `;
            
            card.onclick = () => {
                selectedNodeId = person.id; // เก็บ ID ไว้ใช้อัปเดตแถวใน Google Sheets
                document.getElementById("personName").innerText = person.name;
                document.getElementById("personPosition").innerText = person.title;
                document.getElementById("personPhone").innerText = person.phone || '-';
                
                // ดึงข้อความรายละเอียดเพิ่มเติมมาแสดงผลในป๊อปอัปโหมดคนดูทั่วไป
                document.getElementById("personDescription").innerText = person.description && person.description.trim() !== "" ? person.description : "ไม่มีรายละเอียดเพิ่มเติม";
                
                const modalImg = document.getElementById("personPhoto");
                modalImg.src = imgUrl;
                modalImg.onerror = function() { this.src = defaultImg; };
                
                if(isAdmin) {
                    document.getElementById("adminEditForm").style.display = "block";
                    document.getElementById("inputName").value = person.name;
                    document.getElementById("inputPosition").value = person.title;
                    document.getElementById("inputPhone").value = person.phone || '';
                    document.getElementById("inputPhoto").value = person.photo || '';
                    // ยัดค่ารายละเอียดเดิมลงช่องพิมพ์ข้อความของแอดมิน
                    document.getElementById("inputDescription").value = person.description || '';
                } else {
                    document.getElementById("adminEditForm").style.display = "none";
                }
                
                document.getElementById("detailModal").style.display = "block";
            };
            
            cardsContainer.appendChild(card);
        });
        
        row.appendChild(cardsContainer);
        container.appendChild(row);
    });

    if(localStorage.getItem("admin_logged_in") === "true") activateAdmin();
}

// ควบคุมหน้าต่างป๊อปอัปดีเทล
document.querySelector(".close").onclick = () => {
    document.getElementById("detailModal").style.display = "none";
};
window.onclick = (e) => {
    if (e.target == document.getElementById("detailModal")) {
        document.getElementById("detailModal").style.display = "none";
    }
};

// ปุ่มเปิดโหมดแอดมินบนหน้าเว็บ (ปุ่มเฟือง)
document.getElementById("adminBtn").addEventListener("click", () => {
    const pass = prompt("กรุณากรอกรหัสผ่านแอดมินเพื่อเปิดระบบแก้ไข:");
    if (pass === ADMIN_PASSWORD) {
        localStorage.setItem("admin_logged_in", "true");
        activateAdmin();
        alert("เข้าสู่โหมดแอดมินสำเร็จ! คลิกแก้ไขข้อมูลบนหน้าเว็บได้ทันทีครับ");
    } else if (pass !== null) {
        alert("รหัสผ่านไม่ถูกต้อง!");
    }
});

function activateAdmin() {
    isAdmin = true;
    document.getElementById("adminTools").style.display = "flex";
    document.getElementById("adminBtn").style.display = "none";
}

document.getElementById("logoutBtn").onclick = () => {
    localStorage.setItem("admin_logged_in", "false");
    location.reload();
};

// เมื่อแอดมินกดปุ่มบันทึกบนหน้าเว็บ ระบบจะยิงข้อมูลไปเขียนลงตาราง Google Sheets ให้อัตโนมัติ
document.getElementById("saveChangeBtn").onclick = () => {
    const updatePayload = {
        id: selectedNodeId,
        name: document.getElementById("inputName").value,
        title: document.getElementById("inputPosition").value,
        phone: document.getElementById("inputPhone").value,
        photo: document.getElementById("inputPhoto").value,
        description: document.getElementById("inputDescription").value // ส่งรายละเอียดเพิ่มเติมกลับไปบันทึก
    };

    const saveBtn = document.getElementById("saveChangeBtn");
    saveBtn.innerText = "SAVING... ⏳";
    saveBtn.disabled = true;

    // ยิงแบบ POST ส่งไปให้ Google Apps Script ปลายทางทำงาน
    fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // ใช้โหมดนี้เพื่อให้ส่งข้อมูลหาเซิร์ฟเวอร์ Google ได้โดยตรงไม่ติด CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
    })
    .then(() => {
        // รอระบบ Google อัปเดตข้อมูลลงชีตสักครู่ แล้วรีเฟรชหน้าเว็บดึงค่าใหม่
        setTimeout(() => {
            alert("บันทึกข้อมูลสำเร็จ! ซิงค์ขึ้น Google Sheets เรียบร้อยแล้ว คนอื่นจะเห็นข้อมูลล่าสุดทันทีครับ");
            location.reload();
        }, 1500);
    })
    .catch(err => {
        console.error("เซฟล้มเหลว:", err);
        alert("ไม่สามารถเชื่อมต่อเพื่อบันทึกข้อมูลออนไลน์ได้");
        saveBtn.innerText = "SAVE CHANGES";
        saveBtn.disabled = false;
    });
};

document.addEventListener("DOMContentLoaded", renderPyramidChart);
