const ADMIN_PASSWORD = "0910655667";
let isAdmin = false;
let selectedNodeId = null;
let rawChartData = null;

// ฟังก์ชันจำลองและแปลงข้อมูลเริ่มต้นตามโครงสร้างบอร์ดของแผนกคุณ
function generateDefaultLayers(treeData) {
    const layers = {};
    
    // ชั้น 1: หัวหน้า (ดึงจากไฟล์ data.json)
    layers[1] = [ { id: "l1_head", name: treeData.name || "หัวหน้าแผนก", title: treeData.title || "หัวหน้าแผนก", phone: treeData.phone || '-', photo: treeData.photo || '' } ];
    
    // ชั้น 2: รองหัวหน้า (1 คนถ้วน)
    layers[2] = [ { id: "l2_deputy", name: "รองหัวหน้า", title: "รองหัวหน้า", phone: "-", photo: "" } ];

    // ชั้น 3: นายทหาร (มี 6 คน)
    layers[3] = [
        { id: "l3_p1", name: "น.ต.อาทิตย์", title: "น.ทสส.บก.บน.2", phone: "-", photo: "" },
        { id: "l3_p2", name: "ร.อ.หญิง วิภาดา", title: "น.กำลังพล บก.บน.2", phone: "-", photo: "" },
        { id: "l3_p3", name: "ร.ท.หญิง อารียา", title: "สัสดี บก.บน.2", phone: "-", photo: "" },
        { id: "l3_p4", name: "ร.ต.ศักดิ์รินทร์", title: "น.กำลังพล", phone: "-", photo: "" },
        { id: "l3_p5", name: "ว่าง", title: "น.กำลังพล บก.บน.2", phone: "-", photo: "" },
        { id: "l3_p6", name: "ว่าง", title: "น.สัสดี บก.บน.2", phone: "-", photo: "" }
    ];

    // ชั้น 4: เจ้าหน้าที่ระดับกลาง (มี 5 คน)
    layers[4] = [
        { id: "l4_p1", name: "พ.อ.อ.วรนิตย์", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l4_p2", name: "พ.อ.อ.หญิง พรพิมล", title: "จนท.สัสดี", phone: "-", photo: "" },
        { id: "l4_p3", name: "พ.อ.ต.ปรัชญา", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l4_p4", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l4_p5", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" }
    ];

    // ชั้น 5: เจ้าหน้าที่ระดับล่าง (มี 6 คน)
    layers[5] = [
        { id: "l5_p1", name: "จ.อ.อภิสิทธิ์", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l5_p2", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l5_p3", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l5_p4", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l5_p5", name: "ว่าง", title: "จนท.กำลังพล", phone: "-", photo: "" },
        { id: "l5_p6", name: "ว่าง", title: "จนท.สัสดี", phone: "-", photo: "" }
    ];

    // ชั้น 6: พนักงานราชการ (ฐานล่างสุดมี 5 คน)
    layers[6] = [
        { id: "l6_p1", name: "นางนิตยา", title: "พนักงานธุรการ", phone: "-", photo: "" },
        { id: "l6_p2", name: "น.ส.ศศิ", title: "พนักงานธุรการ", phone: "-", photo: "" },
        { id: "l6_p3", name: "นายระเบียบ", title: "พนักงานธุรการ", phone: "-", photo: "" },
        { id: "l6_p4", name: "น.ส.นิภาพร", title: "พนักงานธุรการ", phone: "-", photo: "" },
        { id: "l6_p5", name: "น.ส.หญิงชัญญา", title: "พนักงานธุรการ", phone: "-", photo: "" }
    ];

    return Object.keys(layers).map(l => ({ layer: parseInt(l), people: layers[l] }));
}

function renderPyramidChart() {
    const savedData = localStorage.getItem("pyramid_chart_data");
    
    // หากเคยเซฟข้อมูลไว้ในเครื่องแล้ว ให้ดึงข้อมูลชุดนั้นขึ้นมาแสดงทันที
    if(savedData) {
        rawChartData = JSON.parse(savedData);
        buildHtmlDOM(rawChartData);
    } else {
        // หากเป็นการเปิดครั้งแรก ให้ไปดึงชื่อหัวหน้าจาก data.json มารวมกับแผนผังใหม่
        fetch("data.json")
        .then(res => res.json())
        .then(data => {
            rawChartData = generateDefaultLayers(data);
            localStorage.setItem("pyramid_chart_data", JSON.stringify(rawChartData));
            buildHtmlDOM(rawChartData);
        })
        .catch(err => {
            // กรณีไม่มีไฟล์ data.json หรือดึงค่าไม่สำเร็จ
            rawChartData = generateDefaultLayers({});
            localStorage.setItem("pyramid_chart_data", JSON.stringify(rawChartData));
            buildHtmlDOM(rawChartData);
        });
    }
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
            
            // คลิกเปิดดีเทลหรือฟอร์มแอดมินสำหรับแก้ไขข้อมูล
            card.onclick = () => {
                selectedNodeId = person.id; // ผูก ID การ์ดที่ถูกเลือกอย่างแม่นยำ
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

// ควบคุมการปิดหน้าต่างป๊อปอัป
document.querySelector(".close").onclick = () => {
    document.getElementById("detailModal").style.display = "none";
};
window.onclick = (e) => {
    if (e.target == document.getElementById("detailModal")) {
        document.getElementById("detailModal").style.display = "none";
    }
};

// ปุ่มระบบรหัสแอดมินเข้าสู่โหมดแก้ไข
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

// แก้ไขจุดบกพร่อง: ค้นหาและบันทึกข้อมูลกลับลง LocalStorage ตาม ID ที่ระบุไว้จริง
document.getElementById("saveChangeBtn").onclick = () => {
    if(!rawChartData) return;
    
    let isFoundAndUpdated = false;
    for (let layer of rawChartData) {
        let p = layer.people.find(person => person.id === selectedNodeId);
        if(p) {
            p.name = document.getElementById("inputName").value;
            p.title = document.getElementById("inputPosition").value;
            p.phone = document.getElementById("inputPhone").value;
            p.photo = document.getElementById("inputPhoto").value;
            isFoundAndUpdated = true;
            break;
        }
    }
    
    if(isFoundAndUpdated) {
        localStorage.setItem("pyramid_chart_data", JSON.stringify(rawChartData));
        alert("บันทึกข้อมูลและชื่อเรียบร้อยแล้วครับ");
        location.reload();
    } else {
        alert("เกิดข้อผิดพลาด: ไม่พบ ID บุคคลที่ต้องการแก้ไข");
    }
};

document.addEventListener("DOMContentLoaded", renderPyramidChart);
