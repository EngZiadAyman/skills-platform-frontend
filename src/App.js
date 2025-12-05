import React, { useState, createContext, useContext, useEffect } from 'react';
import { School, LogOut, Menu, X, BookOpen, Award, User, TrendingUp, Target, Upload, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
        console.error('Error parsing user:', error);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// API Helper
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return response.json();
}

// Landing Page
function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" dir="rtl">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <School className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">منصة المهارات</span>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
          >
            تسجيل الدخول
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white space-y-8">
        <h1 className="text-6xl font-bold leading-tight">
          طوّر مهارات
          <br />
          <span className="text-yellow-300">القرن 21</span>
        </h1>
        <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
          منصة تعليمية ذكية لتقييم وتطوير مهارات الطلاب بتقنيات الذكاء الاصطناعي
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="bg-yellow-400 text-gray-900 px-12 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition shadow-2xl"
        >
          ابدأ الآن مجانًا 🚀
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { icon: '📊', title: 'تحليل ذكي', desc: 'تقييم شامل لمهارات القرن 21 بالذكاء الاصطناعي' },
            { icon: '🎯', title: 'توصيات مخصصة', desc: 'خطط تطوير شخصية لكل طالب حسب نقاط قوته وضعفه' },
            { icon: '📈', title: 'متابعة التقدم', desc: 'رسوم بيانية تفاعلية لمتابعة تطور الأداء' }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Login Page
function LoginPage({ onNavigate }) {
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
    school_code: ''
  });

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const data = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email })
        });
        
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        const data = await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      alert('حدث خطأ في تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <School className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'تسجيل الدخول' : 'حساب جديد'}
          </h2>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="student">طالب</option>
                <option value="teacher">معلم</option>
              </select>
              <input
                type="text"
                placeholder="كود المدرسة"
                value={formData.school_code}
                onChange={(e) => setFormData({...formData, school_code: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          
          {!isLogin && (
            <input
              type="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>
        </div>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-blue-600 hover:underline"
        >
          {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل الدخول'}
        </button>

        <button
          onClick={() => onNavigate('landing')}
          className="w-full mt-2 text-gray-600 hover:underline text-sm"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}

// Student Dashboard
function StudentDashboard({ activeTab }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, perfData] = await Promise.all([
        apiCall(`/tasks/student/${user.id}`),
        apiCall(`/performance/student/${user.id}`)
      ]);
      
      setTasks(tasksData.tasks || []);
      setPerformance(perfData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (taskId) => {
    const content = prompt('أدخل حلك للمهمة:');
    if (!content) return;

    try {
      await apiCall('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          task_id: taskId,
          student_id: user.id,
          content
        })
      });
      
      alert('تم رفع الحل بنجاح!');
      loadData();
    } catch (error) {
      alert('فشل رفع الحل');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">جاري التحميل...</div>;
  }

  const submittedTasks = tasks.filter(t => t.submission_status === 'submitted' || t.submission_status === 'graded').length;
  const pendingTasks = tasks.filter(t => t.submission_status === 'pending').length;

  // Overview Tab
  if (activeTab === 'overview') {
    const radarData = performance?.skills_performance?.map(s => ({
      skill: s.skill_ar,
      score: parseFloat(s.average)
    })) || [];

    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">مرحبًا {user.full_name} 👋</h2>
          <p className="text-gray-600">مدرسة: {user.schools?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي المهام', value: tasks.length, icon: BookOpen, color: 'blue' },
            { label: 'تم الرفع', value: submittedTasks, icon: CheckCircle, color: 'green' },
            { label: 'بانتظار الحل', value: pendingTasks, icon: Clock, color: 'yellow' },
            { label: 'المتوسط العام', value: `${performance?.overall_average || 0}%`, icon: TrendingUp, color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className={`bg-${stat.color}-50 p-6 rounded-lg border-2 border-${stat.color}-200`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}-600 mb-2`} />
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {radarData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🎯 مستوى مهارات القرن 21</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar name="المستوى" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  // Tasks Tab
  if (activeTab === 'tasks') {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">📋 المهام</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-right">المهمة</th>
                  <th className="p-4 text-right">المعلم</th>
                  <th className="p-4 text-right">تاريخ الإنشاء</th>
                  <th className="p-4 text-right">موعد التسليم</th>
                  <th className="p-4 text-right">الحالة</th>
                  <th className="p-4 text-right">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold">{task.title}</td>
                    <td className="p-4">{task.teacher?.full_name}</td>
                    <td className="p-4">{new Date(task.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="p-4">{new Date(task.due_date).toLocaleDateString('ar-EG')}</td>
                    <td className="p-4">
                      {task.status === 'cancelled' ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">ملغاة</span>
                      ) : task.submission_status === 'graded' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">مُقيّمة</span>
                      ) : task.submission_status === 'submitted' ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">تم الرفع</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">بانتظار الحل</span>
                      )}
                    </td>
                    <td className="p-4">
                      {task.status !== 'cancelled' && task.submission_status === 'pending' && (
                        <button
                          onClick={() => handleSubmit(task.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          رفع الحل
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Performance Tab
  if (activeTab === 'performance') {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">📊 نتائجي</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">💪 نقاط القوة</h3>
            {performance?.strengths?.map((s, i) => (
              <div key={i} className="mb-3 p-3 bg-green-50 rounded-lg">
                <p className="font-bold text-green-700">{s.skill_ar}</p>
                <p className="text-2xl font-bold text-green-600">{s.average}%</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">⚠️ نقاط الضعف</h3>
            {performance?.weaknesses?.map((s, i) => (
              <div key={i} className="mb-3 p-3 bg-red-50 rounded-lg">
                <p className="font-bold text-red-700">{s.skill_ar}</p>
                <p className="text-2xl font-bold text-red-600">{s.average}%</p>
              </div>
            ))}
          </div>
        </div>

        {performance?.performance_over_time?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">📈 الأداء عبر الزمن</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performance.performance_over_time}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="الدرجة" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Teacher Dashboard
function TeacherDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await apiCall(`/tasks/teacher/${user.id}`);
      setTasks(data.tasks || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    const title = prompt('عنوان المهمة:');
    if (!title) return;
    
    const description = prompt('وصف المهمة:');
    const due_date = prompt('موعد التسليم (YYYY-MM-DD):');

    try {
      await apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          teacher_id: user.id,
          title,
          description,
          questions: ['سؤال 1', 'سؤال 2'],
          due_date
        })
      });
      
      alert('تم إنشاء المهمة!');
      loadTasks();
    } catch (error) {
      alert('فشل إنشاء المهمة');
    }
  };

  const handleCancelTask = async (taskId) => {
    if (!confirm('هل تريد إلغاء هذه المهمة?')) return;

    try {
      await apiCall(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' })
      });
      alert('تم إلغاء المهمة');
      loadTasks();
    } catch (error) {
      alert('فشل إلغاء المهمة');
    }
  };

  if (loading) return <div className="p-6">جاري التحميل...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">👨‍🏫 لوحة تحكم المعلم</h2>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
        >
          ➕ إنشاء مهمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المهام', value: tasks.length, color: 'blue' },
          { label: 'الحلول المرفوعة', value: tasks.reduce((sum, t) => sum + t.total_submissions, 0), color: 'green' },
          { label: 'بانتظار التقييم', value: tasks.reduce((sum, t) => sum + t.pending, 0), color: 'yellow' },
          { label: 'تم التقييم', value: tasks.reduce((sum, t) => sum + t.graded, 0), color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className={`bg-${stat.color}-50 p-6 rounded-lg border-2 border-${stat.color}-200`}>
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-right">المهمة</th>
                <th className="p-4 text-right">تاريخ الإنشاء</th>
                <th className="p-4 text-right">التسليم</th>
                <th className="p-4 text-right">الحلول</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{task.title}</td>
                  <td className="p-4">{new Date(task.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">{new Date(task.due_date).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">{task.total_submissions} حل</td>
                  <td className="p-4">
                    {task.status === 'active' ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">نشطة</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">ملغاة</span>
                    )}
                  </td>
                  <td className="p-4">
                    {task.status === 'active' && (
                      <button
                        onClick={() => handleCancelTask(task.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        إلغاء
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Layout
function DashboardLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <School className="w-8 h-8" />
            <span className="text-xl font-bold">منصة المهارات</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold">{user?.full_name}</p>
              <p className="text-sm text-blue-100">{user?.role === 'teacher' ? 'معلم' : 'طالب'}</p>
            </div>
            <button onClick={logout} className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {user?.role === 'student' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto flex gap-4 p-4">
            {[
              { id: 'overview', label: 'الرئيسية', icon: BookOpen },
              { id: 'tasks', label: 'المهام', icon: Award },
              { id: 'performance', label: 'نتائجي', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {user?.role === 'student' ? (
          <StudentDashboard activeTab={activeTab} />
        ) : (
          <TeacherDashboard />
        )}
      </div>
    </div>
  );
}

// Main App
function App() {
  const [page, setPage] = useState('landing');
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (user) {
    return <DashboardLayout />;
  }

  if (page === 'landing') {
    return <LandingPage onNavigate={setPage} />;
  }

  if (page === 'login') {
    return <LoginPage onNavigate={setPage} />;
  }

  return <LandingPage onNavigate={setPage} />;
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
