export const th = {
  // App.tsx
  topicPlaceholder: "ป้อนหัวข้อ หรืออัปโหลดไฟล์...",
  startLearning: "สร้างคู่มือ",
  generating: "กำลังสร้าง...",
  errorTopic: "กรุณาใส่หัวข้อหรืออัปโหลดไฟล์เพื่อเริ่มต้น",
  errorUnknown: "เกิดข้อผิดพลาดที่ไม่รู้จัก กรุณาลองใหม่",
  errorQuiz: "สร้างแบบทดสอบไม่สำเร็จ AI อาจกำลังยุ่ง โปรดลองอีกครั้ง",
  errorBook: "สร้างหนังสือไม่สำเร็จ AI อาจกำลังยุ่ง โปรดลองอีกครั้ง",
  toggleTheme: "สลับธีม",
  selectLanguage: "เลือกภาษา",
  uploadFile: "อัปโหลดเอกสาร (PDF, TXT)",
  parsingFile: "กำลังวิเคราะห์ไฟล์...",
  errorFile: "ไฟล์ไม่รองรับ กรุณาอัปโหลด PDF หรือ .txt",
  clearFile: "ล้างไฟล์",

  // Welcome.tsx
  welcomeTitle: "ยินดีต้อนรับสู่ LEARNED",
  welcomeSubtitle: "ผู้ช่วยเรียนรู้ส่วนตัวพลัง AI ของคุณ เริ่มต้นโดยการป้อนหัวข้อหรืออัปโหลดเอกสารเพื่อสร้างคู่มือการเรียนรู้ที่ครอบคลุม",
  feature1Title: "คู่มือเรียนรู้แบบไดนามิก",
  feature1Desc: "สร้างคู่มือโดยละเอียดในทุกหัวข้อทันที พร้อมด้วยแนวคิดหลักและคำศัพท์สำคัญ",
  feature2Title: "แบบทดสอบเชิงโต้ตอบ",
  feature2Desc: "ทดสอบความเข้าใจของคุณด้วยแบบทดสอบที่สร้างขึ้นเองในระดับความยาก ง่าย ปานกลาง หรือยาก",
  feature3Title: "แชทกับ AI",
  feature3Desc: "ถามคำถามติดตามผลและเจาะลึกในหัวข้อต่างๆ กับติวเตอร์ AI ที่พร้อมสนทนากับคุณ",

  // Spinner.tsx
  spinnerMessage: "กำลังรังสรรค์คู่มือของคุณ...",

  // StudyGuideDisplay.tsx
  coreConcepts: "แนวคิดหลัก",
  keyTerms: "คำศัพท์สำคัญ",

  // BookView.tsx
  closeBook: "ปิด",
  bookAuthor: "เจาะลึกโดย LEARNED AI",
  tocTitle: "สารบัญ",
  introductionTitle: "บทนำ",
  glossaryTitle: "อภิธานศัพท์",
  theEnd: "จบ",
  finalMessage: "การเดินทางของคุณในหัวข้อนี้เพิ่งเริ่มต้น คู่มือนี้เป็นของคุณแล้ว กลับมาทบทวนได้ทุกเมื่อเพื่อทำความเข้าใจให้ลึกซึ้งและจุดประกายความอยากรู้ใหม่ๆ",
  allRightsReserved: "สงวนลิขสิทธิ์",
  exportToPdf: "ส่งออกเป็น PDF",
  exportingPdf: "กำลังส่งออก...",

  // Interactive Toolkit
  quizToolkitTitle: "แบบทดสอบเชิงโต้ตอบ",
  quizToolkitDescription: "ทดสอบความรู้ของคุณด้วยแบบทดสอบที่สร้างขึ้นเอง",
  difficulty: "ระดับความยาก",
  easy: "ง่าย",
  medium: "ปานกลาง",
  hard: "ยาก",
  generateQuiz: "สร้างแบบทดสอบ",
  generatingQuiz: "กำลังสร้างแบบทดสอบ...",
  bookTitle: "หนังสือคู่มือฉบับเต็ม",
  bookDescription: "ขยายคู่มือการเรียนของคุณให้เป็นหนังสือดิจิทัลหลายบทที่ครอบคลุม",
  generateBook: "สร้างหนังสือฉบับเต็ม",
  generatingBook: "กำลังเขียนหนังสือของคุณ...",

  // QuizDisplay.tsx
  quizTitle: "ตรวจสอบความรู้",
  questionProgress: (current: number, total: number) => `คำถาม ${current} จาก ${total}`,
  correct: "ถูกต้อง!",
  incorrect: "ไม่ถูกต้อง",
  previousQuestion: "คำถามก่อนหน้า",
  nextQuestion: "คำถามถัดไป",
  finishQuiz: "สิ้นสุดแบบทดสอบ",
  quizResultsTitle: "ทำแบบทดสอบเสร็จแล้ว!",
  quizResults: (score: number, total: number) => `คุณได้ ${score} จาก ${total} คะแนน`,
  quizExcellent: "ยอดเยี่ยมมาก!",
  quizGood: "ทำได้ดีมาก!",
  quizOkay: "พยายามได้ดีแล้ว ฝึกฝนต่อไปนะ!",
  tryAgain: "ลองทำแบบทดสอบใหม่",

  // ChatInterface.tsx
  chatHeader: "สนทนากับติวเตอร์ AI",
  chatPlaceholder: "ถามอะไรก็ได้เกี่ยวกับหัวข้อนี้...",
  chatWelcome: (topic: string) => `สวัสดี! ฉันได้เตรียมคู่มือการเรียนรู้เกี่ยวกับ ${topic} ไว้ให้คุณแล้ว ถามทุกอย่างเกี่ยวกับเรื่องนี้ได้เลย!`,
  chatError: "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
};