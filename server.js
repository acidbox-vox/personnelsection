const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// อนุญาตให้หน้าเว็บ (Frontend) ต่าง ๆ เรียกใช้ข้ามเซิร์ฟเวอร์ได้ และรองรับข้อมูลรูปแบบ JSON
app.use(cors());
app.use(express.json());

// ฟังก์ชันเซ็ตข้อมูลเริ่มต้น (กรณีที่เพิ่งเปิดรันครั้งแรกและยังไม่มีไฟล์ข้อมูล)
const defaultData = [
  { "layer": 1, "people": [{ "id": "l1_head", "name": "หัวหน้าแผนก", "title": "หัวหน้าแผนก", "phone": "-", "photo": "" }] },
  { "layer": 2, "people": [{ "id": "l2_deputy", "name": "รองหัวหน้า", "title": "รองหัวหน้า", "phone": "-", "photo": "" }] },
  { "layer": 3, "people": [
      { "id": "l3_p1", "name": "น.ต.อาทิตย์", "title": "น.ทสส.บก.บน.2", "phone": "-", "photo": "" },
      { "id": "l3_p2", "name": "ร.อ.หญิง วิภาดา", "title": "น.กำลังพล บก.บน.2", "phone": "-", "photo": "" },
      { "id": "l3_p3", "name": "ร.ท.หญิง อารียา", "title": "สัสดี บก.บน.2", "phone": "-", "photo": "" },
      { "id": "l3_p4", "name": "ร.ต.ศักดิ์รินทร์", "title": "น.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l3_p5", "name": "ว่าง", "title": "น.กำลังพล บก.บน.2", "phone": "-", "photo": "" },
      { "id": "l3_p6", "name": "ว่าง", "title": "น.สัสดี บก.บน.2", "phone": "-", "photo": "" }
  ]},
  { "layer": 4, "people": [
      { "id": "l4_p1", "name": "พ.อ.อ.วรนิตย์", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l4_p2", "name": "พ.อ.อ.หญิง พรพิมล", "title": "จนท.สัสดี", "phone": "-", "photo": "" },
      { "id": "l4_p3", "name": "พ.อ.ต.ปรัชญา", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l4_p4", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l4_p5", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" }
  ]},
  { "layer": 5, "people": [
      { "id": "l5_p1", "name": "จ.อ.อภิสิทธิ์", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l5_p2", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l5_p3", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l5_p4", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l5_p5", "name": "ว่าง", "title": "จนท.กำลังพล", "phone": "-", "photo": "" },
      { "id": "l5_p6", "name": "ว่าง", "title": "จนท.สัสดี", "phone": "-", "photo": "" }
  ]},
  { "layer": 6, "people": [
      { "id": "l6_p1", "name": "นางนิตยา", "title": "พนักงานธุรการ", "phone": "-", "photo": "" },
      { "id": "l6_p2", "name": "น.ส.ศศิ", "title": "พนักงานธุรการ", "phone": "-", "photo": "" },
      { "id": "l6_p3", "name": "นายระเบียบ", "title": "พนักงานธุรการ", "phone": "-", "photo": "" },
      { "id": "l6_p4", "name": "น.ส.นิภาพร", "title": "พนักงานธุรการ", "phone": "-", "photo": "" },
      { "id": "l6_p5", "name": "น.ส.หญิงชัญญา", "title": "พนักงานธุรการ", "phone": "-", "photo": "" }
  ]}
];

// 1. เส้นทางสำหรับหน้าเว็บเข้ามาดึงข้อความ (GET)
app.get('/api/chart-data', (req, res) => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// 2. เส้นทางสำหรับรับข้อมูลเวลาแอดมินกดเซฟบันทึก (POST)
app.post('/api/chart-data', (req, res) => {
    const updatedData = req.body;
    fs.writeFileSync(DB_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
    res.status(200).send({ message: "บันทึกเรียบร้อยลงข้อมูลระบบเรียบร้อย!" });
});

app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์ระบบหลังบ้านเปิดทำงานแล้วที่ http://localhost:${PORT}`);
});
