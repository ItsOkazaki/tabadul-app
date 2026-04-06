#!/bin/bash

# 🚀 سكريبت النشر على GitHub Pages
# استخدام: ./deploy.sh "رسالة commit"

# التحقق من وجود Git
if ! command -v git &> /dev/null
then
    echo "❌ Git غير مثبت. يرجى تثبيت Git أولاً."
    exit 1
fi

# التحقق من وجود Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً."
    exit 1
fi

echo "🎯 بدء عملية النشر على GitHub Pages..."
echo ""

# 1. بناء المشروع
echo "📦 بناء المشروع..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ فشل البناء. يرجى إصلاح الأخطاء أولاً."
    exit 1
fi

echo "✅ البناء ناجح!"
echo ""

# 2. التحقق من وجود مستودع Git
if [ ! -d .git ]; then
    echo "🆕 تهيئة مستودع Git جديد..."
    git init
fi

# 3. إضافة جميع الملفات
echo "📝 إضافة الملفات..."
git add .

# 4. Commit
COMMIT_MSG="${1:-تحديث التطبيق}"
echo "💾 حفظ التغييرات: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 5. التحقق من remote
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "⚠️  لم يتم ربط مستودع GitHub بعد."
    echo ""
    echo "📝 اتبع الخطوات التالية:"
    echo "   1. أنشئ مستودع جديد على GitHub"
    echo "   2. انسخ رابط المستودع"
    echo "   3. نفذ الأمر التالي:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/tabadul.git"
    echo ""
    read -p "أدخل رابط المستودع: " REPO_URL
    git remote add origin "$REPO_URL"
fi

# 6. التأكد من الفرع الرئيسي
echo "🔄 التحويل إلى الفرع main..."
git branch -M main

# 7. الدفع إلى GitHub
echo "🚀 الرفع إلى GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅"
    echo "✅ النشر ناجح!"
    echo "✅ ✅ ✅"
    echo ""
    echo "🌐 رابط تطبيقك:"
    echo "   https://YOUR_USERNAME.github.io/tabadul/"
    echo ""
    echo "⏳ انتظر 1-3 دقائق ليتم البناء والنشر."
    echo ""
    echo "📱 شارك الرابط مع زملائك!"
    echo ""
else
    echo ""
    echo "❌ فشل الرفع. تأكد من:"
    echo "   - لديك صلاحيات الكتابة على المستودع"
    echo "   - اتصالك بالإنترنت يعمل"
    echo ""
fi
