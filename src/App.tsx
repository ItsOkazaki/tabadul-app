import { useState, useEffect } from 'react'

// Types
interface User {
  id: string
  name: string
  email: string
  password: string
  phone: string
  major: string
  level: string
  skillsKnown: string[]
  skillsWanted: string[]
  customSkillsKnown: string[]
  customSkillsWanted: string[]
  createdAt: string
}

interface Match {
  id: string
  user: User
  matchScore: number
  commonSkills: string[]
  exchangeOpportunity: string
}

// Predefined Skills List
const PREDEFINED_SKILLS = [
  // لغات
  'اللغة الإنجليزية',
  'اللغة الفرنسية',
  'اللغة الألمانية',
  'اللغة الإسبانية',
  'اللغة التركية',
  'اللغة الصينية',
  'اللغة اليابانية',
  'اللغة الكورية',
  'اللغة الإيطالية',
  'اللغة الروسية',
  
  // برمجة وتقنية
  'البرمجة العامة',
  'تطوير الويب',
  'تطوير التطبيقات',
  'بايثون',
  'جافا سكريبت',
  'جافا',
  'سي ++',
  'سي شارب',
  'HTML/CSS',
  'React',
  'Node.js',
  'قواعد البيانات',
  'الذكاء الاصطناعي',
  'التعلم الآلي',
  'الأمن السيبراني',
  'الشبكات',
  'لينكس',
  'Git',
  
  // تصميم
  'تصميم الجرافيك',
  'فوتوشوب',
  'إليستريتور',
  'فيجما',
  'تصميم واجهات',
  'تصميم شعارات',
  'مونتاج فيديو',
  'أنيميشن',
  'تصميم ثلاثي الأبعاد',
  
  // كتابة ومحتوى
  'الكتابة الإبداعية',
  'كتابة المحتوى',
  'التدقيق اللغوي',
  'الترجمة',
  'التعريب',
  'كتابة التقارير',
  'البحث العلمي',
  
  // تسويق وأعمال
  'التسويق الرقمي',
  'إدارة وسائل التواصل',
  'التسويق بالمحتوى',
  'إدارة المشاريع',
  'ريادة الأعمال',
  'المحاسبة',
  'الاقتصاد',
  'إدارة الأعمال',
  
  // تعليم
  'الرياضيات',
  'الفيزياء',
  'الكيمياء',
  'الأحياء',
  'التاريخ',
  'الجغرافيا',
  'الفلسفة',
  'علم النفس',
  'علم الاجتماع',
  'التدريس',
  'شرح المواد الدراسية',
  
  // فنون وموسيقى
  'العزف على الجيتار',
  'العزف على البيانو',
  'العزف على العود',
  'الغناء',
  'الرسم',
  'التصوير الفوتوغرافي',
  'الخط العربي',
  'الرسم الرقمي',
  
  // رياضة
  'كرة القدم',
  'كرة السلة',
  'السباحة',
  'اللياقة البدنية',
  'اليوجا',
  'الفنون القتالية',
  'الجري',
  'ركوب الدراجات',
  
  // مهارات حياتية
  'الطبخ',
  'الخياطة',
  'الإسعافات الأولية',
  'الإدارة المالية الشخصية',
  'التطوير الذاتي',
  'الخطابة',
  'التفاوض',
  'إدارة الوقت',
  'العمل الجماعي',
]

// Helper Functions
const generateId = () => Math.random().toString(36).substr(2, 9)

const getUsers = (): User[] => {
  const users = localStorage.getItem('tabadul_users')
  return users ? JSON.parse(users) : []
}

const saveUser = (user: User) => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem('tabadul_users', JSON.stringify(users))
}

const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem('tabadul_current_user')
  if (!userId) return null
  const users = getUsers()
  return users.find(u => u.id === userId) || null
}

const setCurrentUser = (userId: string) => {
  localStorage.setItem('tabadul_current_user', userId)
}

const logout = () => {
  localStorage.removeItem('tabadul_current_user')
}

// Match Algorithm
const calculateMatchScore = (currentUser: User, otherUser: User): { score: number; common: string[]; exchange: string } => {
  let score = 0
  const commonSkills: string[] = []
  
  // Check if their known skills match our wanted skills
  const theirKnownOurWanted = otherUser.skillsKnown.filter(s => 
    currentUser.skillsWanted.includes(s)
  )
  theirKnownOurWanted.forEach(s => {
    score += 25
    commonSkills.push(`يُتقن ${s}`)
  })
  
  // Check if their wanted skills match our known skills
  const theirWantedOurKnown = otherUser.skillsWanted.filter(s => 
    currentUser.skillsKnown.includes(s)
  )
  theirWantedOurKnown.forEach(s => {
    score += 25
    commonSkills.push(`يريد تعلم ${s}`)
  })
  
  // Custom skills matching
  const theirCustomKnownOurWanted = otherUser.customSkillsKnown.filter(s => 
    currentUser.customSkillsWanted.includes(s) || currentUser.skillsWanted.includes(s)
  )
  theirCustomKnownOurWanted.forEach(s => {
    score += 30
    commonSkills.push(`يُتقن ${s}`)
  })
  
  const theirCustomWantedOurKnown = otherUser.customSkillsWanted.filter(s => 
    currentUser.customSkillsKnown.includes(s) || currentUser.skillsKnown.includes(s)
  )
  theirCustomWantedOurKnown.forEach(s => {
    score += 30
    commonSkills.push(`يريد تعلم ${s}`)
  })
  
  // Same major bonus
  if (currentUser.major === otherUser.major && currentUser.major !== '') {
    score += 10
    commonSkills.push('نفس التخصص')
  }
  
  // Cap score at 100
  score = Math.min(score, 100)
  
  const exchange = theirKnownOurWanted.length > 0 
    ? `يمكنهم تعليمك: ${theirKnownOurWanted.join('، ')}`
    : `يمكنك تعليمهم: ${theirWantedOurKnown.join('، ')}`
  
  return { score, common: commonSkills, exchange }
}

const findMatches = (currentUser: User): Match[] => {
  const users = getUsers()
  const matches: Match[] = []
  
  users.forEach(user => {
    if (user.id === currentUser.id) return
    
    const { score, common, exchange } = calculateMatchScore(currentUser, user)
    
    if (score > 0) {
      matches.push({
        id: generateId(),
        user,
        matchScore: score,
        commonSkills: common,
        exchangeOpportunity: exchange,
      })
    }
  })
  
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

// Components
function PhonePCModeToggle({ mode, setMode }: { mode: 'phone' | 'pc'; setMode: (m: 'phone' | 'pc') => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => setMode('phone')}
        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
          mode === 'phone'
            ? 'bg-green-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        📱 هاتف
      </button>
      <button
        onClick={() => setMode('pc')}
        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
          mode === 'pc'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        💻 كمبيوتر
      </button>
    </div>
  )
}

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          تـبـادل
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          مهاراتك عندي.. ومهاراتي عندك
        </p>
        <p className="text-gray-500 mb-8">
          منصة تبادل المهارات بين الطلاب - مجاناً 100%
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-gray-800">تعلم</h3>
            <p className="text-sm text-gray-600">اكتسب مهارات جديدة</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-800">علّم</h3>
            <p className="text-sm text-gray-600">شارك معرفتك</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-gray-800">تبادل</h3>
            <p className="text-sm text-gray-600">بدون مقابل مادي</p>
          </div>
        </div>
        
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
        >
          ابدأ الآن - مجاني! 🚀
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          انضم لآلاف الطلاب الذين يتبادلون المهارات
        </p>
      </div>
    </div>
  )
}

function RegisterPage({ onComplete }: { onComplete: (user: Partial<User>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    major: '',
    level: '',
  })
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }
    
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    
    // Check if email exists
    const users = getUsers()
    if (users.find(u => u.email === formData.email)) {
      setError('هذا البريد الإلكتروني مسجل مسبقاً')
      return
    }
    
    onComplete(formData)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">👤</div>
          <h2 className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</h2>
          <p className="text-gray-600 text-sm">انضم لمنصة تبادل المهارات</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="محمد أحمد"
              dir="rtl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="example@university.edu.sa"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="******"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تأكيد كلمة المرور *
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="******"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الجوال
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="05xxxxxxxx"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              التخصص
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="علوم الحاسب"
              dir="rtl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المستوى الدراسي
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">اختر المستوى</option>
              <option value="1">المستوى الأول</option>
              <option value="2">المستوى الثاني</option>
              <option value="3">المستوى الثالث</option>
              <option value="4">المستوى الرابع</option>
              <option value="5">المستوى الخامس</option>
              <option value="6">المستوى السادس</option>
              <option value="7">المستوى السابع</option>
              <option value="8">المستوى الثامن</option>
              <option value="خريج">خريج</option>
              <option value="دراسات عليا">دراسات عليا</option>
            </select>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            إنشاء الحساب ➜
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          بالتسجيل، أنت توافق على شروط الاستخدام
        </p>
      </div>
    </div>
  )
}

function SkillsSelectionPage({
  onComplete,
}: {
  onComplete: (skillsKnown: string[], skillsWanted: string[], customKnown: string[], customWanted: string[]) => void
}) {
  const [selectedKnown, setSelectedKnown] = useState<string[]>([])
  const [selectedWanted, setSelectedWanted] = useState<string[]>([])
  const [customKnown, setCustomKnown] = useState('')
  const [customWanted, setCustomWanted] = useState('')
  const [customKnownList, setCustomKnownList] = useState<string[]>([])
  const [customWantedList, setCustomWantedList] = useState<string[]>([])
  const [searchKnown, setSearchKnown] = useState('')
  const [searchWanted, setSearchWanted] = useState('')
  const [step, setStep] = useState(1)
  
  const filteredSkillsKnown = PREDEFINED_SKILLS.filter(s =>
    s.toLowerCase().includes(searchKnown.toLowerCase())
  )
  
  const filteredSkillsWanted = PREDEFINED_SKILLS.filter(s =>
    s.toLowerCase().includes(searchWanted.toLowerCase())
  )
  
  const toggleKnown = (skill: string) => {
    if (selectedKnown.includes(skill)) {
      setSelectedKnown(selectedKnown.filter(s => s !== skill))
    } else {
      setSelectedKnown([...selectedKnown, skill])
    }
  }
  
  const toggleWanted = (skill: string) => {
    if (selectedWanted.includes(skill)) {
      setSelectedWanted(selectedWanted.filter(s => s !== skill))
    } else {
      setSelectedWanted([...selectedWanted, skill])
    }
  }
  
  const addCustomKnown = () => {
    if (customKnown.trim() && !customKnownList.includes(customKnown.trim())) {
      setCustomKnownList([...customKnownList, customKnown.trim()])
      setCustomKnown('')
    }
  }
  
  const addCustomWanted = () => {
    if (customWanted.trim() && !customWantedList.includes(customWanted.trim())) {
      setCustomWantedList([...customWantedList, customWanted.trim()])
      setCustomWanted('')
    }
  }
  
  const removeCustomKnown = (skill: string) => {
    setCustomKnownList(customKnownList.filter(s => s !== skill))
  }
  
  const removeCustomWanted = (skill: string) => {
    setCustomWantedList(customWantedList.filter(s => s !== skill))
  }
  
  const handleComplete = () => {
    if (selectedKnown.length === 0 && customKnownList.length === 0) {
      alert('الرجاء اختيار مهارة واحدة على الأقل تتقنها')
      return
    }
    if (selectedWanted.length === 0 && customWantedList.length === 0) {
      alert('الرجاء اختيار مهارة واحدة على الأقل تريد تعلمها')
      return
    }
    onComplete(selectedKnown, selectedWanted, customKnownList, customWantedList)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>المهارات التي أتقنها</span>
            <span>المهارات التي أريد تعلمها</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600 to-blue-600 transition-all"
              style={{ width: `${step === 1 ? 50 : 100}%` }}
            />
          </div>
        </div>
        
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">✨</div>
              <h2 className="text-2xl font-bold text-gray-800">ما المهارات التي تتقنها؟</h2>
              <p className="text-gray-600">اختر المهارات التي يمكنك تعليمها للآخرين</p>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={searchKnown}
                onChange={(e) => setSearchKnown(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                placeholder="🔍 ابحث عن مهارة..."
                dir="rtl"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6 max-h-64 overflow-y-auto p-2">
              {filteredSkillsKnown.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleKnown(skill)}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    selectedKnown.includes(skill)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">أو أضف مهارة مخصصة:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customKnown}
                  onChange={(e) => setCustomKnown(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomKnown()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="اكتب مهارة أخرى..."
                  dir="rtl"
                />
                <button
                  onClick={addCustomKnown}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                >
                  إضافة
                </button>
              </div>
              
              {customKnownList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {customKnownList.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button onClick={() => removeCustomKnown(skill)} className="hover:text-green-900">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="text-sm text-gray-600">
                تم اختيار: <span className="font-bold text-green-600">{selectedKnown.length + customKnownList.length}</span> مهارات
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={selectedKnown.length === 0 && customKnownList.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي ←
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎯</div>
              <h2 className="text-2xl font-bold text-gray-800">ما المهارات التي تريد تعلمها؟</h2>
              <p className="text-gray-600">اختر المهارات التي ترغب في إتقانها</p>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={searchWanted}
                onChange={(e) => setSearchWanted(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="🔍 ابحث عن مهارة..."
                dir="rtl"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6 max-h-64 overflow-y-auto p-2">
              {filteredSkillsWanted.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleWanted(skill)}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    selectedWanted.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">أو أضف مهارة مخصصة:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customWanted}
                  onChange={(e) => setCustomWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomWanted()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="اكتب مهارة أخرى..."
                  dir="rtl"
                />
                <button
                  onClick={addCustomWanted}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>
              
              {customWantedList.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {customWantedList.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button onClick={() => removeCustomWanted(skill)} className="hover:text-blue-900">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                → السابق
              </button>
              <div className="text-sm text-gray-600">
                تم اختيار: <span className="font-bold text-blue-600">{selectedWanted.length + customWantedList.length}</span> مهارات
              </div>
            </div>
            
            <button
              onClick={handleComplete}
              disabled={selectedWanted.length === 0 && customWantedList.length === 0}
              className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl text-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎉 اكتمل التسجيل - ابدأ المطابقة!
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'matches' | 'profile' | 'about'>('matches')
  const [matches, setMatches] = useState<Match[]>([])
  const [savedProfiles, setSavedProfiles] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filterMinScore, setFilterMinScore] = useState(0)
  
  useEffect(() => {
    const foundMatches = findMatches(user)
    setMatches(foundMatches)
    
    const saved = localStorage.getItem(`tabadul_saved_${user.id}`)
    if (saved) {
      setSavedProfiles(JSON.parse(saved))
    }
  }, [user])
  
  const toggleSave = (matchId: string) => {
    const newSaved = savedProfiles.includes(matchId)
      ? savedProfiles.filter(id => id !== matchId)
      : [...savedProfiles, matchId]
    setSavedProfiles(newSaved)
    localStorage.setItem(`tabadul_saved_${user.id}`, JSON.stringify(newSaved))
  }
  
  const filteredMatches = matches.filter(m => m.matchScore >= filterMinScore)
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 50) return 'text-blue-600 bg-blue-100'
    return 'text-orange-600 bg-orange-100'
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 pb-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">تـبـادل 🤝</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30"
          >
            تسجيل خروج
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-white/80">{user.major || 'طالب جامعي'}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center -mt-10 mb-4">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔍 المطابقات
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👤 حسابي
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ℹ️ عن المنصة
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 pb-8">
        {activeTab === 'matches' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  ⚙️ فلاتر المطابقة
                </button>
                <span className="text-sm text-gray-500">
                  {filteredMatches.length} مطابقة
                </span>
              </div>
              
              {showFilters && (
                <div className="pt-2">
                  <label className="text-sm text-gray-600">
                    الحد الأدنى لنسبة التطابق: {filterMinScore}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterMinScore}
                    onChange={(e) => setFilterMinScore(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              )}
            </div>
            
            {/* Matches List */}
            {filteredMatches.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مطابقات بعد</h3>
                <p className="text-gray-600">
                  كلما زاد عدد المستخدمين، زادت فرص المطابقة!
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  شارك الرابط مع زملائك لزيادة فرص المطابقة
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map(match => (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-2xl">
                          👤
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{match.user.name}</h3>
                          <p className="text-sm text-gray-500">{match.user.major || 'طالب جامعي'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(match.matchScore)}`}>
                          {match.matchScore}% تطابق
                        </span>
                        <button
                          onClick={() => toggleSave(match.id)}
                          className={`text-2xl transition-all ${
                            savedProfiles.includes(match.id)
                              ? 'text-red-500'
                              : 'text-gray-300 hover:text-red-400'
                          }`}
                        >
                          {savedProfiles.includes(match.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-sm text-gray-700 font-bold mb-2">نقاط التطابق:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.commonSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-3 mb-3">
                      <p className="text-sm text-blue-700 font-bold">
                        💡 {match.exchangeOpportunity}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-xl font-bold hover:shadow-lg">
                        📩 تواصل
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200">
                        👁️ الملف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">👤 معلومات حسابي</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">الاسم</label>
                <p className="font-bold text-gray-800">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">البريد الإلكتروني</label>
                <p className="font-bold text-gray-800" dir="ltr">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">التخصص</label>
                <p className="font-bold text-gray-800">{user.major || 'غير محدد'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">المستوى</label>
                <p className="font-bold text-gray-800">{user.level || 'غير محدد'}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-800 mb-3">✨ المهارات التي أتقنها:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsKnown.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {user.customSkillsKnown.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-800 mb-3">🎯 المهارات التي أريد تعلمها:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  {user.customSkillsWanted.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {savedProfiles.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-bold text-gray-800 mb-3">❤️ الملفات المحفوظة: {savedProfiles.length}</h3>
                  <p className="text-sm text-gray-500">
                    يمكنك الوصول للملفات المحفوظة من تبويب المطابقات
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">ℹ️ عن منصة تبادل</h2>
              <p className="text-gray-600 mb-4">
                منصة تبادل هي منصة جامعية تهدف لربط الطلاب لتبادل المهارات والمعارف 
                بدون مقابل مادي. الفكرة بسيطة: أنت تُعلّم ما تتقن، وتتعلم مما يتقنه الآخرون!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <p className="font-bold text-green-700">تعلم مجاناً</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="font-bold text-blue-700">شارك معرفتك</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-bold text-yellow-800 mb-2">💡 كيف يعمل؟</h3>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>سجّل حسابك واختر مهاراتك</li>
                  <li>النظام يجد لك طلاب متوافقين</li>
                  <li>تواصل وابدأ رحلة التعلم المتبادل</li>
                </ol>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 إحصائيات</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{getUsers().length}</p>
                  <p className="text-sm text-gray-500">مستخدم</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{matches.length}</p>
                  <p className="text-sm text-gray-500">مطابقة</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{savedProfiles.length}</p>
                  <p className="text-sm text-gray-500">محفوظ</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">🚀 ساعد في نشر المنصة!</h2>
              <p className="text-white/90 mb-4">
                شارك الرابط مع زملائك لزيادة فرص المطابقة
              </p>
              <div className="bg-white/20 rounded-xl p-3 font-mono text-sm break-all" dir="ltr">
                tabadul.github.io
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LoginPage({ onLogin, onRegister }: { onLogin: (user: User) => void; onRegister: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      return
    }
    
    setCurrentUser(user.id)
    onLogin(user)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🤝</div>
          <h2 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
          <p className="text-gray-600 text-sm">مرحباً بعودتك!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="example@university.edu.sa"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="******"
              dir="ltr"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            تسجيل الدخول
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <button
              onClick={onRegister}
              className="text-green-600 font-bold hover:underline"
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [mode, setMode] = useState<'phone' | 'pc'>('phone')
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'skills' | 'dashboard'>('landing')
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [pendingUserData, setPendingUserData] = useState<Partial<User>>({})
  
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setCurrentUserState(user)
      setCurrentPage('dashboard')
    }
  }, [])
  
  const handleStart = () => {
    setCurrentPage('login')
  }
  
  const handleRegisterStart = () => {
    setCurrentPage('register')
  }
  
  const handleRegisterComplete = (data: Partial<User>) => {
    setPendingUserData(data)
    setCurrentPage('skills')
  }
  
  const handleSkillsComplete = (
    skillsKnown: string[],
    skillsWanted: string[],
    customKnown: string[],
    customWanted: string[]
  ) => {
    const newUser: User = {
      id: generateId(),
      name: pendingUserData.name || '',
      email: pendingUserData.email || '',
      password: pendingUserData.password || '',
      phone: pendingUserData.phone || '',
      major: pendingUserData.major || '',
      level: pendingUserData.level || '',
      skillsKnown,
      skillsWanted,
      customSkillsKnown: customKnown,
      customSkillsWanted: customWanted,
      createdAt: new Date().toISOString(),
    }
    
    saveUser(newUser)
    setCurrentUser(newUser.id)
    setCurrentUserState(newUser)
    setCurrentPage('dashboard')
  }
  
  const handleLogin = (user: User) => {
    setCurrentUserState(user)
    setCurrentPage('dashboard')
  }
  
  const handleLogout = () => {
    logout()
    setCurrentUserState(null)
    setCurrentPage('landing')
  }
  
  return (
    <div className={mode === 'phone' ? 'max-w-md mx-auto' : ''} dir="rtl">
      <PhonePCModeToggle mode={mode} setMode={setMode} />
      
      {currentPage === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onRegister={handleRegisterStart} />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage onComplete={handleRegisterComplete} />
      )}
      
      {currentPage === 'skills' && (
        <SkillsSelectionPage onComplete={handleSkillsComplete} />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
