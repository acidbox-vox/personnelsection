const ADMIN_PASSWORD = "0910655667";
let isAdmin = false;
let selectedNodeId = null;
let rawChartData = null;

// ฟังก์ชันแปลงข้อมูลแบบเดิม (Tree Structure) ให้กลายเป็นแบบชั้นแถว (Layers) เพื่อนำไปจัดทรงสามเหลี่ยมคริสต์มาสอัตโนมัติ
function transformTreeToLayers(treeData) {
    const layers = {};
    
    // ใส่ข้อมูลจำลองรายชื่อตามกระดานจริงของคุณเพื่อจัดตำแหน่งเบื้องต้น
    // ชั้น 1: หัวหน้า
    layers[1] = [ { id: treeData.id, name: treeData.name, title: treeData.title, phone: treeData.phone || '-', photo: treeData.photo || '' } ];
    
    // ชั้น 2: รองหัวหน้า
    layers[2] = [];
    if(treeData.children) {
        treeData.children.forEach(c => {
            layers[2].push({ id: c.id, name: c.name, title: c.title, phone: c.phone || '-', photo: c.photo || '' });
        });
    }

    // ชั้น 3: นายทหาร (มี 6 คน)
    layers[3] = [
        { id: "r3_1", name: "น.ต.อาทิตย์", title: "น.ทสส.บก.บน.2", phone: "-" },
        { id: "r3_2", name: "ร.อ.หญิง วิภาดา", "title": "น.กำลังพล บก.บน.2", phone: "-" },
        { id: "r3_3", name: "ร.ท.หญิง อารียา", "title": "สัสดี บก.บน.2", phone: "-" },
        { id: "r3_4", name: "ร.ต.ศักดิ์รินทร์", "title": "น.กำลังพล", phone: "-" },
        { id: "r3_5", name: "ว่าง", "title": "น.กำลังพล บก.บน.2", phone: "-" },
        { id: "r3_6", name: "ว่าง", "title": "น.สัสดี บก.บน.2", phone: "-" }
    ];

    // ชั้น 4: เจ้าหน้าที่ระดับกลาง (มี 5 คน)
    layers[4] = [
        { id: "r4_1", name: "พ.อ.อ.วรนิตย์", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r4_2", name: "พ.อ.อ.หญิง พรพิมล", "title": "จนท.สัสดี", phone: "-" },
        { id: "r4_3", name: "พ.อ.ต.ปรัชญา", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r4_4", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r4_5", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" }
    ];

    // ชั้น 5: เจ้าหน้าที่ระดับล่าง (มี 6 คน)
    layers[5] = [
        { id: "r5_1", name: "จ.อ.อภิสิทธิ์", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r5_2", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r5_3", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r5_4", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r5_5", name: "ว่าง", "title": "จนท.กำลังพล", phone: "-" },
        { id: "r5_6", name: "ว่าง", "title": "จนท.สัสดี", phone: "-" }
    ];

    // ชั้น 6: พนักงานราชการ (มี 5 คน)
    layers[6] = [
        { id: "r6_1", name: "นางนิตยา", "title": "พนักงานธุรการ", phone: "-" },
        { id: "r6_2", name: "น.ส.ศศิ", "title": "พนักงานธุรการ", phone: "-" },
        { id: "r6_3", name: "นายระเบียบ", "title": "พนักงานธุรการ", phone: "-" },
        { id: "r6_4", name: "น.ส.นิภาพร", "title": "พนักงานธุรการ", phone: "-" },
        { id: "r6_5", name: "น.ส.หญิงชัญญา", "title": "พนักงานธุรการ", phone: "-" }
    ];

    return Object.keys(layers).map(l => ({ layer: parseInt(l), people: layers[l] }));
}

function renderPyramidChart() {
    const savedData = localStorage.getItem("pyramid_chart_data");
    
    if(savedData) {
        rawChartData = JSON.parse(savedData);
        buildHtmlDOM(rawChartData);
    } else {
        fetch("data.json")
        .then(res => res.json())
        .then(data => {
            rawChartData = transformTreeToLayers(data);
            localStorage.setItem("pyramid_chart_data", JSON.stringify(rawChartData));
            buildHtmlDOM(rawChartData);
        });
    }
}

function buildHtmlDOM(layers) {
    const container = document.getElementById("chart-pyramid");
    container.innerHTML = '';

    layers.forEach(layerData => {
        const row = document.createElement("div");
        row.className = "layer-row";
        row.setAttribute("data-layer", layerData.layer);
        
        const cardsContainer = document.createElement("div");
        cardsContainer.className = "cards-container";
        
        layerData.people.forEach(person => {
            const card = document.createElement("div");
            card.className = `node-card ${person.name === 'ว่าง' ? 'vacant' : ''}`;
            
            const imgUrl = person.photo ? person.photo : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            
            card.innerHTML = `
                <img src="${imgUrl}" alt="profile">
                <div class="name">${person.name}</div>
                <div class="title">${person.title}</div>
            `;
            
            // คลิกเปิดการ์ดแสดงผล/แก้ไขดีเทลแบบซูมเข้ากึ่งกลาง
            card.onclick = () => {
                selectedNodeId = person.id;
                document.getElementById("personName").innerText = person.name;
                document.getElementById("personPosition").innerText = person.title;
                document.getElementById("personPhone").innerText = person.phone || '-';
                document.getElementById("personPhoto").src = imgUrl;
                
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

// ควบคุมการปิดหน้าต่างดีเทล
document.querySelector(".close").onclick = () => {
    document.getElementById("detailModal").style.display = "none";
};
window.onclick = (e) => {
    if (e.target == document.getElementById("detailModal")) {
        document.getElementById("detailModal").style.display = "none";
    }
};

// ปุ่มระบบแอดมินและการบันทึกข้อมูลย้อนกลับ
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

// บันทึกข้อมูลและอัปเดตถาวรลงหน่วยความจำเบราว์เซอร์
document.getElementById("saveChangeBtn").onclick = () => {
    if(!rawChartData) return;
    
    for (let layer of rawChartData) {
        let p = layer.people.find(person => person.id === selectedNodeId);
        if(p) {
            p.name = document.getElementById("inputName").value;
            p.title = document.getElementById("inputPosition").value;
            p.phone = document.getElementById("inputPhone").value;
            p.photo = document.getElementById("inputPhoto").value;
            break;
        }
    }
    
    localStorage.setItem("pyramid_chart_data", JSON.stringify(rawChartData));
    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
    location.reload();
};

document.addEventListener("DOMContentLoaded", renderPyramidChart);
