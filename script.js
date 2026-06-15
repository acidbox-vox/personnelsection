// โหลดข้อมูลมาสร้างผังองค์กร
fetch("data.json")
.then(res => res.json())
.then(data => {
    $('#chart-container').orgchart({
        data: data,
        pan: true,
        zoom: true,
        nodeContent: 'title'
    });
});

// ตรวจสอบสถานะแอดมินตอนเปิดหน้าเว็บขึ้นมาใหม่
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("isAdmin") === "true") {
        enableAdminMode();
    }
});

// แก้ไขให้รองรับการคลิกโหนดที่สร้างขึ้นมาใหม่ (Event Delegation)
$(document).on('click', '.node', function(){
    let nodeData = $(this).data('nodeData');
    
    document.getElementById("personName").innerText = nodeData.name || '';
    document.getElementById("personPosition").innerText = nodeData.title || '';
    document.getElementById("personPhoto").src = nodeData.photo || 'photos/default.png';
    document.getElementById("detailModal").style.display = "block";
});

// ปิด Modal รายละเอียด
document.querySelector(".close").onclick = () => {
    document.getElementById("detailModal").style.display = "none";
};

// ระบบรหัสผ่านแอดมิน
const ADMIN_PASSWORD = "0910655667";

document.getElementById("adminBtn").addEventListener("click", () => {
    const pass = prompt("กรอกรหัสแอดมิน");
    
    if (pass === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        alert("เข้าสู่โหมดแอดมินสำเร็จ");
        enableAdminMode();
    } else {
        alert("รหัสผ่านไม่ถูกต้อง");
    }
});

// รวมฟังก์ชัน enableAdminMode ไม่ให้ซ้ำซ้อน
function enableAdminMode() {
    // 1. ใส่คลาสที่ Body เผื่อใช้สไตล์ CSS ควบคุม
    document.body.classList.add("admin-mode");
    console.log("ADMIN MODE ACTIVATED");

    // 2. ตรวจสอบก่อนว่ามีปุ่มแก้ไขหรือยัง ถ้ายังไม่มีค่อยสร้าง (ป้องกันปุ่มงอกซ้ำซ้อน)
    if (!document.getElementById("editModeBtn")) {
        const editBtn = document.createElement("button");
        editBtn.id = "editModeBtn";
        editBtn.innerText = "🛠️ แก้ไขข้อมูลผัง";
        
        // ตกแต่งปุ่มแก้ไขเพิ่มเติมให้อยู่บนหน้าจอชัดเจน
        editBtn.style.position = "fixed";
        editBtn.style.right = "90px";
        editBtn.style.bottom = "20px";
        editBtn.style.padding = "10px 20px";
        editBtn.style.background = "#ef4444";
        editBtn.style.color = "white";
        editBtn.style.border = "none";
        editBtn.style.borderRadius = "5px";
        editBtn.style.cursor = "pointer";
        editBtn.style.zIndex = "9999";

        editBtn.onclick = () => {
            alert("เปิดหน้าแก้ไข (พัฒนาระบบแก้ไขเพิ่มเติมตรงนี้)");
        };

        document.body.appendChild(editBtn);
    }
}
