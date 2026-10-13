# 🎬 CinemaScript Pro - Autonomous Studio Engine & MCP Architecture

**CinemaScript Pro** هو المنصة البرمجية الأولى والمحرك السينمائي المستقل لإدارة وكتابة السيناريو والحبكة الدرامية وفق معايير هوليوود القياسية، مع دمج خادم **Model Context Protocol (MCP)** للذكاء الاصطناعي المستقل.

---

## 🌟 المعمارية الهيكلية المحدثة (Atomic Architecture)

- **`src/context/reducers/`**: إدارة الحالة المركزية المقسمة (Script, Corkboard, Breakdown, Characters, Locations, AI Directives).
- **`src/mcp/`**: محرك خادم الـ MCP المخصص للتحكم التلقائي الذاتي عبر النموذج الذكي Gemini / Custom Tunnels.
- **`src/utils/screenplay/`**: الدوال الحسابية وتفكيك الحوارات والتصدير القياسي (Fountain, Final Draft FDX, PDF).
- **`src/components/organisms/`**: المكونات الذرية المفككة التي تلتزم بالحد الأقصى الصارم للسطور (< 150 سطر لكل مكون).
- **`src/hooks/`**: Custom Hooks لإدارة الاختصارات، التراجعات (Undo/Redo)، والحفظ التلقائي.

---

## 🛠️ تشغيل التطبيق محلياً

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. فحص الأنواع
npm run lint

# 3. تشغيل الخادم بيئة التطوير
npm run dev
```

---

## 🤖 أدوات الـ MCP المتاحة (MCP Tools Suite)

يحتوي النظام على أكثر من 20 أداة MCP قابلة للاستدعاء التلقائي المباشر بواسطة الـ AI لتنفيذ عمليات المحرر والسبورة والتصفح وموسوعة الشخصيات والمواقع التناظرية.
