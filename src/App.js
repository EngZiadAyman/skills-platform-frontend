import React, { useState, createContext, useContext, useEffect } from 'react';
import { School, LogOut, Menu, X, BookOpen, Award, User } from 'lucide-react';

// Auth Context
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Landing Page
function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" dir="rtl">
      <nav className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <School className="w-8 h-8 text-white" />
              <span className="text-xl sm:text-2xl font-bold text-white">منصة المهارات</span>
            </div>
            <button
              onClick={onLogin}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-50 transition text-sm sm:text-base"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center text-white space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            طوّر مهارات
            <br />
            <span className="text-yellow-300">القرن 21</span>
          </h1>
          <p className="text-lg sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            منصة تعليمية ذكية لتقييم وتطوير مهارات الطلاب بتقنيات الذكاء الاصطناعي
          </p>
          <button
            onClick={onLogin}
            className="bg-yellow-400 text-gray-900 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold hover:bg-yellow-300 transition shadow-2xl"
          >
            ابدأ الآن مجانًا 🚀
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20">
          {[
            { icon: '📊', title: 'تحليل ذكي', desc: 'تقييم شامل لمهارات القرن 21 بالذكاء الاصطناعي' },
            { icon: '🎯', title: 'توصيات مخصصة', desc: 'خطط تطوير شخصية لكل طالب حسب نقاط قوته وضعفه' },
            { icon: '📈', title: 'متابعة التقدم', desc: 'رسوم بيانية تفاعلية لمتابعة تطور الأداء' }
          ].map((feature, i) => (
            <div key={i} className="bg-white bg-opacity-10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white border-opacity-20 hover:bg-opacity-20 transition">
              <div className="text-4xl sm:text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-100 text-sm sm:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard Layout
function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = user?.role === 'teacher' ? [
    { icon: BookOpen, label: 'الرئيسية', id: 'overview' },
    { icon: Award, label: 'المهام', id: 'tasks' },
    { icon: User, label: 'الطلاب', id: 'students' }
  ] : [
    { icon: BookOpen, label: 'الرئيسية', id: 'overview' },
    { icon: Award, label: 'مهامي', id: 'tasks' },
    { icon: User, label: 'نتائجي', id: 'performance' }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <School className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-lg sm:text-xl font-bold">منصة المهارات</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm sm:text-base">{user?.full_name || 'مستخدم'}</p>
              <p className="text-xs sm:text-sm text-blue-100">{user?.role === 'teacher' ? 'معلم' : 'طالب'}</p>
            </div>
            <button
              onClick={logout}
              className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:transform-none lg:relative lg:h-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="p-6 border-b lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">القائمة</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition mb-2 text-gray-700 hover:text-blue-600"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="lg:mr-64 min-h-screen">
        {children}
      </div>
    </div>
  );
}

// Student Dashboard
function SimpleStudentDashboard() {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">📊 لوحة تحكم الطالب</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي المهام', value: '15', color: 'blue', icon: '📚' },
            { label: 'تم الرفع', value: '12', color: 'green', icon: '✅' },
            { label: 'بانتظار الحل', value: '2', color: 'yellow', icon: '⏳' },
            { label: 'المتوسط', value: '85%', color: 'purple', icon: '🎯' }
          ].map((stat, i) => (
            <div key={i} className={`bg-${stat.color}-50 p-6 rounded-lg border-2 border-${stat.color}-200`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">📋 المهام الحالية</h3>
          <div className="space-y-3">
            {['مشروع بحثي عن الطاقة المتجددة', 'عرض تقديمي عن الذكاء الاصطناعي'].map((task, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border-r-4 border-blue-500">
                <h4 className="font-bold text-gray-800">{task}</h4>
                <p className="text-sm text-gray-600 mt-1">📅 التسليم: 2024-12-20</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                  رفع الحل
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Teacher Dashboard
function SimpleTeacherDashboard() {
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">👨‍🏫 لوحة تحكم المعلم</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي الطلاب', value: '120', color: 'blue', icon: '👥' },
            { label: 'المهام النشطة', value: '8', color: 'green', icon: '📋' },
            { label: 'بانتظار التقييم', value: '15', color: 'yellow', icon: '⏳' },
            { label: 'متوسط الدرجات', value: '78%', color: 'purple', icon: '📊' }
          ].map((stat, i) => (
            <div key={i} className={`bg-${stat.color}-50 p-6 rounded-lg border-2 border-${stat.color}-200`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-bold">📋 المهام الحالية</h3>
            <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              ➕ إنشاء مهمة جديدة
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'مشروع بحثي عن الطاقة المتجددة', submissions: '45/50' },
              { title: 'عرض تقديمي عن الذكاء الاصطناعي', submissions: '38/50' }
            ].map((task, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border-r-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">📊 الحلول: {task.submissions}</p>
                  </div>
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm">
                    عرض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Login Page
function LoginPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <School className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">تسجيل الدخول التجريبي</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => onLogin('student')}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition text-lg"
          >
            👨‍🎓 دخول كطالب
          </button>
          <button
            onClick={() => onLogin('teacher')}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold hover:bg-purple-700 transition text-lg"
          >
            👨‍🏫 دخول كمعلم
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user, setUser } = useAuth();

  const handleDemoLogin = (role) => {
    const demoUser = {
      id: '1',
      full_name: role === 'teacher' ? 'د. سارة أحمد' : 'أحمد محمد',
      email: role === 'teacher' ? 'teacher@school.com' : 'student@school.com',
      role: role,
      school: { name: 'مدرسة النور الثانوية' }
    };
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
    setCurrentPage('dashboard');
  };

  if (!user && currentPage === 'landing') {
    return <LandingPage onLogin={() => setCurrentPage('login')} />;
  }

  if (!user && currentPage === 'login') {
    return <LoginPage onLogin={handleDemoLogin} />;
  }

  return (
    <DashboardLayout>
      {user?.role === 'teacher' ? <SimpleTeacherDashboard /> : <SimpleStudentDashboard />}
    </DashboardLayout>
  );
}

// Root Component
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
