const ADMIN_PASSWORD = "0910655667";
let isAdmin = false;
let selectedNodeId = null;
let rawChartData = null;

// ปรับค่า URL ของ API หลังบ้าน (ถ้าเอาขึ้น Server จริงให้เปลี่ยน localhost เป็น IP หรือโดเมนของเซิร์ฟเวอร์)
const BACKEND_API_URL = "http://localhost:3000/api/chart-data";

function renderPyramidChart() {
    // ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์หลักเสมอ เพื่อให้ทุกคนเห็นข้อมูลตรงกัน
    fetch(BACKEND_API_URL)
    .then(res => res.json())
    .then(jsonData => {
        rawChartData = jsonData;
        buildHtmlDOM(rawChartData);
    })
    .catch(err => {
        console.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้:", err);
        alert("ตรวจพบข้อผิดพลาด: ไม่สามารถดึงข้อมูลจาก Server กลางได้ (คุณได้เปิดรันหลังบ้านหรือยัง?)");
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
                selectedNodeId = person.id;
                document.getElementById("personName").innerText = person.name;
                document.getElementById("personPosition").innerText = person.title;
                document.getElementById("personPhone").innerText = person.phone || '-';
                
                const modalImg = document.getElementById("personPhoto");
                modalImg.src = imgUrl;
                modalImg.onerror = function() { this.src = defaultImg; };
                
                if(isAdmin) {
                    document.getElementById("adminEditForm").style.display = "block";
                    document.getElementById("inputName").value = person.name;
                    document.getElementById("inputPosition").value = person.title;
                    document.getElementById("inputPhone").value = person.phone || '';
                    document.getElementById("inputPhoto").value = person.photo || '';
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

// ควบคุมหน้าต่าง Popup ปิด
document.querySelector(".close").onclick = () => {
    document.getElementById("detailModal").style.display = "none";
};
window.onclick = (e) => {
    if (e.target == document.getElementById("detailModal")) {
        document.getElementById("detailModal").style.display = "none";
    }
};

// ระบบโหมดแอดมิน
document.getElementById("adminBtn").addEventListener("click", () => {
    const pass = prompt("กรุณากรอกรหัสผ่านแอดมินเพื่อเปิดระบบแก้ไข:");
    if (pass === ADMIN_PASSWORD) {
        localStorage.setItem("admin_logged_in", "true");
        activateAdmin();
        alert("เข้าสู่โหมดแอดมินสำเร็จ!");
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

// จุดสำคัญ: ส่งข้อมูลที่แก้ไขยิงกลับไปบันทึกถาวรที่ระบบหลังบ้าน
document.getElementById("saveChangeBtn").onclick = () => {
    if(!rawChartData) return;
    
    let isFound = false;
    for (let layer of rawChartData) {
        let p = layer.people.find(person => person.id === selectedNodeId);
        if(p) {
            p.name = document.getElementById("inputName").value;
            p.title = document.getElementById("inputPosition").value;
            p.phone = document.getElementById("inputPhone").value;
            p.photo = document.getElementById("inputPhoto").value;
            isFound = true;
            break;
        }
    }
    
    if(isFound) {
        // ยิง API แบบ POST เพื่อไปอัปเดตไฟล์ข้อมูลตัวกลางบน Server
        fetch(BACKEND_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rawChartData)
        })
        .then(res => {
            if(res.ok) {
                alert("บันทึกข้อมูลเรียบร้อยแล้ว! ทุกคนที่เข้ามาดูจะเห็นข้อมูลล่าสุดทันทีครับ");
                location.reload();
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกลง Server หลังบ้าน");
            }
        })
        .catch(err => {
            console.error("เซฟไม่สำเร็จ:", err);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่อบันทึกข้อมูลได้");
        });
    }
};

document.addEventListener("DOMContentLoaded", renderPyramidChart);
