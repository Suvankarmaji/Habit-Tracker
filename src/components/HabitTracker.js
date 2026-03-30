import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function HabitTracker() {
  // State for all dashboard data
  const [habits, setHabits] = useState([]);

  const [notes, setNotes] = useState([]);

  const [priorities, setPriorities] = useState([]);

  const [tasks, setTasks] = useState([]);

  const [progressData, setProgressData] = useState({
    day: 0,
    week: 0,
    month: 0,
    quarter: 0,
    year: 0,
    life: 0
  });

  const [fitnessData, setFitnessData] = useState({
    waterIntake: 0,
    waterGoal: 8,
    workoutDuration: '',
    steps: '',
    stepGoal: 10000,
    activities: [
      { id: '1', name: 'Cardio', completed: false },
      { id: '2', name: 'Strength Training', completed: false },
      { id: '3', name: 'Flexibility/Yoga', completed: false },
    ]
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    name: '',
    status: 'not-started',
    category: 'personal',
    dueDate: new Date().toISOString().split('T')[0]
  });
  
  const [newHabit, setNewHabit] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [time, setTime] = useState(new Date());
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  
  const [moodData, setMoodData] = useState({ mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null });
  const [financeData, setFinanceData] = useState({
    income: 0,
    spent: { food: 0, transport: 0, shopping: 0 },
    budgetLimits: { food: 500, transport: 200, shopping: 300 }
  });
  const [financeInput, setFinanceInput] = useState({ description: '', amount: '', type: 'income', category: 'food' });
  const [pomodoro, setPomodoro] = useState({
    mode: 'focus', // focus, shortBreak, longBreak
    timeLeft: 25 * 60,
    isActive: false,
    taskName: '',
    sessionsCompleted: 0
  });
  
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userPrefix = currentUser.username ? `v2_${currentUser.username}_` : 'v2_';

    const storedHabits = localStorage.getItem(`${userPrefix}habits`);
    const storedNotes = localStorage.getItem(`${userPrefix}notes`);
    const storedPriorities = localStorage.getItem(`${userPrefix}priorities`);
    const storedTasks = localStorage.getItem(`${userPrefix}tasks`);
    const storedProgressData = localStorage.getItem(`${userPrefix}progressData`);
    const storedFitnessData = localStorage.getItem(`${userPrefix}fitnessData`);
    const storedMoodData = localStorage.getItem(`${userPrefix}moodData`);
    const storedFinanceData = localStorage.getItem(`${userPrefix}financeData`);
    const storedPomodoroData = localStorage.getItem(`${userPrefix}pomodoroData`);
    
    if (storedHabits) setHabits(JSON.parse(storedHabits));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
    if (storedPriorities) setPriorities(JSON.parse(storedPriorities));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedProgressData) setProgressData(JSON.parse(storedProgressData));
    if (storedFitnessData) setFitnessData(JSON.parse(storedFitnessData));
    if (storedMoodData) setMoodData(JSON.parse(storedMoodData));
    if (storedFinanceData) setFinanceData(JSON.parse(storedFinanceData));
    if (storedPomodoroData) {
      const parsed = JSON.parse(storedPomodoroData);
      setPomodoro(prev => ({ ...prev, sessionsCompleted: parsed.sessionsCompleted || 0, taskName: parsed.taskName || '' }));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userPrefix = currentUser.username ? `v2_${currentUser.username}_` : 'v2_';

    localStorage.setItem(`${userPrefix}habits`, JSON.stringify(habits));
    localStorage.setItem(`${userPrefix}notes`, JSON.stringify(notes));
    localStorage.setItem(`${userPrefix}priorities`, JSON.stringify(priorities));
    localStorage.setItem(`${userPrefix}tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${userPrefix}progressData`, JSON.stringify(progressData));
    localStorage.setItem(`${userPrefix}fitnessData`, JSON.stringify(fitnessData));
    localStorage.setItem(`${userPrefix}moodData`, JSON.stringify(moodData));
    localStorage.setItem(`${userPrefix}financeData`, JSON.stringify(financeData));
    localStorage.setItem(`${userPrefix}pomodoroData`, JSON.stringify({ sessionsCompleted: pomodoro.sessionsCompleted, taskName: pomodoro.taskName }));
  }, [habits, notes, priorities, tasks, progressData, fitnessData, moodData, financeData, pomodoro.sessionsCompleted, pomodoro.taskName]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;
    if (pomodoro.isActive && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoro.timeLeft === 0 && pomodoro.isActive) {
      clearInterval(interval);
      setPomodoro(prev => ({ 
        ...prev, 
        isActive: false, 
        sessionsCompleted: prev.mode === 'focus' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted 
      }));
    }
    return () => clearInterval(interval);
  }, [pomodoro.isActive, pomodoro.timeLeft, pomodoro.mode]);

  // Update clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(clockInterval);
  }, []);

  // Update clock hands
  useEffect(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const secondAngle = seconds * 6; // 360 degrees / 60 seconds = 6 degrees per second
    const minuteAngle = minutes * 6 + seconds * 0.1; // 360 degrees / 60 minutes = 6 degrees per minute + slight movement from seconds
    const hourAngle = (hours % 12) * 30 + minutes * 0.5; // 360 degrees / 12 hours = 30 degrees per hour + slight movement from minutes
    
    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `rotate(${secondAngle}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `rotate(${minuteAngle}deg)`;
    }
    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `rotate(${hourAngle}deg)`;
    }
  }, [time]);

  // Calculate progress based on habits completed
  const calculateProgress = () => {
    if (habits.length === 0) return;

    const totalDays = habits.length * 7;
    const completedDays = habits.reduce((total, habit) => {
      return total + habit.days.filter(Boolean).length;
    }, 0);
    
    const dayPercentage = Math.round((completedDays / totalDays) * 100);
    progressData.day=dayPercentage;
    setProgressData(prev => ({
      ...prev,
      day: dayPercentage
    }))
  };

  // Habit functions
  const addHabit = () => {
    if (newHabit.trim() === '') return;
    
    const newHabitItem = {
      id: Date.now().toString(),
      name: newHabit,
      days: Array(7).fill(false),
    };
    
    setHabits(prev => [...prev, newHabitItem]);
    setNewHabit('');
  };

  const toggleHabitDay = (habitId, dayIndex) => {
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === habitId) {
          const newDays = [...habit.days];
          newDays[dayIndex] = !newDays[dayIndex];
          return { ...habit, days: newDays };
        }
        return habit;
      })
    );
    
    // Update progress after changing habit status
    setTimeout(calculateProgress, 0);
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setTimeout(calculateProgress, 0);
  };

  // Note functions
  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const newNoteItem = {
      id: Date.now().toString(),
      text: newNote,
    };
    
    setNotes(prev => [...prev, newNoteItem]);
    setNewNote('');
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // Priority functions
  const addPriority = () => {
    if (newPriority.trim() === '') return;
    
    const newPriorityItem = {
      id: Date.now().toString(),
      text: newPriority,
      completed: false,
    };
    
    setPriorities(prev => [...prev, newPriorityItem]);
    setNewPriority('');
  };

  const togglePriority = (priorityId) => {
    setPriorities(prev => 
      prev.map(priority => {
        if (priority.id === priorityId) {
          return { ...priority, completed: !priority.completed };
        }
        return priority;
      })
    );
  };

  const deletePriority = (priorityId) => {
    setPriorities(prev => prev.filter(priority => priority.id !== priorityId));
  };

  // Task functions
  const addTask = () => {
    if (newTaskForm.name.trim() === '') return;
    
    const newTaskItem = {
      id: Date.now().toString(),
      name: newTaskForm.name,
      status: newTaskForm.status,
      category: newTaskForm.category,
      dueDate: newTaskForm.dueDate,
      completed: newTaskForm.status === 'done',
    };
    
    setTasks(prev => [...prev, newTaskItem]);
    
    // Reset form
    setNewTaskForm({
      name: '',
      status: 'not-started',
      category: 'personal',
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    // Close modal
    setShowTaskModal(false);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          const completed = !task.completed;
          const status = completed ? 'done' : 'not-started';
          return { ...task, completed, status };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Fitness functions
  const updateFitnessFields = (field, value) => {
    setFitnessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFitnessActivity = (activityId) => {
    setFitnessData(prev => ({
      ...prev,
      activities: prev.activities.map(act => 
        act.id === activityId ? { ...act, completed: !act.completed } : act
      )
    }));
  };

  const addWater = () => {
    setFitnessData(prev => ({ ...prev, waterIntake: prev.waterIntake + 1 }));
  };

  const removeWater = () => {
    setFitnessData(prev => ({ ...prev, waterIntake: Math.max(0, prev.waterIntake - 1) }));
  };

  const getFitnessProgress = () => {
    const waterPerc = Math.min(100, (fitnessData.waterIntake / fitnessData.waterGoal) * 100);
    const stepsPerc = fitnessData.steps ? Math.min(100, (Number(fitnessData.steps) / fitnessData.stepGoal) * 100) : 0;
    const completedActivities = fitnessData.activities.filter(a => a.completed).length;
    const activitiesPerc = (completedActivities / fitnessData.activities.length) * 100;
    
    return Math.round((waterPerc + stepsPerc + activitiesPerc) / 3);
  };

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysLeft = (dueDateString) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    
    // Reset time part to get accurate day difference
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const differenceMs = dueDate - today;
    return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'not-started':
        return 'Not started';
      case 'in-progress':
        return 'In progress';
      case 'done':
        return 'Done';
      default:
        return '';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'personal':
        return 'Personal';
      case 'work-school':
        return 'Work/School';
      case 'health-wellness':
        return 'Health & Wellness';
      default:
        return '';
    }
  };

  const getFormattedTime = () => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
    return `${hours12}:${minutesStr}:${secondsStr} ${ampm}`;
  };

  // Finance Functions
  const handleFinanceSubmit = () => {
    const amount = parseFloat(financeInput.amount);
    if (!amount || amount <= 0) return;

    setFinanceData(prev => {
      const next = { ...prev };
      if (financeInput.type === 'income') {
        next.income += amount;
      } else {
        next.spent = { ...prev.spent, [financeInput.category]: prev.spent[financeInput.category] + amount };
      }
      return next;
    });
    setFinanceInput({ ...financeInput, description: '', amount: '' });
  };

  const getTotalSpent = () => Object.values(financeData.spent).reduce((a, b) => a + b, 0);

  // Pomodoro Functions
  const togglePomodoro = () => setPomodoro(prev => ({ ...prev, isActive: !prev.isActive }));
  const resetPomodoro = () => setPomodoro(prev => ({ 
    ...prev, isActive: false, 
    timeLeft: prev.mode === 'focus' ? 25 * 60 : prev.mode === 'shortBreak' ? 5 * 60 : 15 * 60 
  }));
  const setPomodoroMode = (mode) => setPomodoro(prev => ({
    ...prev, mode, isActive: false, 
    timeLeft: mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
  }));
  const formatPomodoroTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setNewTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getActiveAlerts = () => {
    const newAlerts = [];
    
    // 1. Assignment/Task due tomorrow
    tasks.forEach(task => {
      if (!task.completed) {
        const daysLeft = getDaysLeft(task.dueDate);
        if (daysLeft === 1) {
          const alertId = `task-${task.id}-tomorrow`;
          if (!dismissedAlerts.includes(alertId)) {
            newAlerts.push({ id: alertId, type: 'warning', message: `Reminder: "${task.name}" is due tomorrow!` });
          }
        } else if (daysLeft < 0) {
          const alertId = `task-${task.id}-overdue`;
          if (!dismissedAlerts.includes(alertId)) {
            newAlerts.push({ id: alertId, type: 'danger', message: `Overdue: "${task.name}" is past its due date.` });
          }
        }
      }
    });

    // 2. Drink water reminder
    if (fitnessData.waterIntake < (fitnessData.waterGoal / 2)) {
      const alertId = 'water-reminder';
      if (!dismissedAlerts.includes(alertId)) {
        newAlerts.push({ id: alertId, type: 'info', message: `Drink water reminder: You are behind your daily hydration goal!` });
      }
    }

    // 3. Workout reminder
    if (!fitnessData.workoutDuration && fitnessData.steps < 5000) {
      const alertId = 'workout-reminder';
      if (!dismissedAlerts.includes(alertId)) {
        newAlerts.push({ id: alertId, type: 'info', message: `Workout reminder: Time to get moving and close your daily rings!` });
      }
    }

    return newAlerts;
  };

  const activeAlerts = getActiveAlerts();
  
  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  return (
    <>
      {/* Smart Alerts */}
      <div className="alerts-container">
        {activeAlerts.map(alert => (
          <div key={alert.id} className={`smart-alert smart-alert-${alert.type}`}>
            <div className="smart-alert-content">
              <span>{alert.message}</span>
            </div>
            <button className="smart-alert-close" onClick={() => dismissAlert(alert.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="wave-header">
      </div>
      
      <div className="container">
        <div className="dashboard-nav-top">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/Videos" className="nav-link">Videos</Link>
        </div>
        <h1 className="title">Simple Life Dashboard</h1>
        
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-column">
            {/* Habit Tracker */}
            <div className="card" id="habit-tracker">
              <div className="card-header">
                <h2>Habit Tracker</h2>
              </div>
              
              <div className="habit-table-container">
                <table id="habits-table">
                  <thead>
                    <tr>
                      <th className="habit-name">Habits</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                      <th>Sunday</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map(habit => (
                      <tr key={habit.id}>
                        <td className="habit-name">{habit.name}</td>
                        {habit.days.map((checked, dayIndex) => (
                          <td key={dayIndex}>
                            <input
                              type="checkbox"
                              className="checkbox-custom"
                              checked={checked}
                              onChange={() => toggleHabitDay(habit.id, dayIndex)}
                            />
                          </td>
                        ))}
                        <td>
                          <button
                            className="btn-del-habit"
                            onClick={() => deleteHabit(habit.id)}
                            title="Delete Habit"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Add new habit..."
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                />
                <button className="btn-add" onClick={addHabit}>Add habit</button>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="card" id="progress-bars">
              <div className="progress-container">
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Day:</span>
                    <span id="day-percent">{progressData.day}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.day}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Week:</span>
                    <span id="week-percent">{progressData.week}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.week}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Month:</span>
                    <span id="month-percent">{progressData.month}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.month}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Quarter:</span>
                    <span id="quarter-percent">{progressData.quarter}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.quarter}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Year:</span>
                    <span id="year-percent">{progressData.year}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.year}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Life:</span>
                    <span id="life-percent">{progressData.life}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{ width: `${progressData.life}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Priorities (Weekly) */}
            <div className="card" id="priorities">
              <div className="card-header">
                <h2>Priorities (Weekly)</h2>
              </div>
              
              <ul className="checklist">
                {priorities.map(priority => (
                  <li key={priority.id}>
                    <div className="checklist-item">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={priority.completed}
                        onChange={() => togglePriority(priority.id)}
                      />
                      <span className={`priority-label ${priority.completed ? 'completed' : ''}`}>
                        {priority.text}
                      </span>
                    </div>
                    <button className="delete-btn" onClick={() => deletePriority(priority.id)}>
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="input-group">
                <input
                  type="text"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="Add new priority..."
                  onKeyPress={(e) => e.key === 'Enter' && addPriority()}
                />
                <button className="btn-icon" onClick={addPriority}>+</button>
              </div>
            </div>

            {/* Fitness Tracker */}
            <div className="card" id="fitness-tracker">
              <div className="card-header">
                <h2>Fitness Tracker</h2>
              </div>
              
              <div className="progress-item" style={{ marginBottom: '16px' }}>
                <div className="progress-label">
                  <span>Daily Overview:</span>
                  <span>{getFitnessProgress()}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-value"
                    style={{ width: `${getFitnessProgress()}%`, backgroundColor: '#4caf50' }}
                  ></div>
                </div>
              </div>

              <div className="fitness-section">
                <div className="fitness-row">
                  <div className="fitness-label">Water Intake</div>
                  <div className="water-controls">
                    <button className="water-btn" onClick={removeWater}>-</button>
                    <span className="water-count">{fitnessData.waterIntake} / {fitnessData.waterGoal} glasses</span>
                    <button className="water-btn" onClick={addWater}>+</button>
                  </div>
                </div>

                <div className="fitness-row">
                  <div className="fitness-label">Workout Duration (mins)</div>
                  <input 
                    type="number" 
                    className="fitness-input" 
                    placeholder="0" 
                    value={fitnessData.workoutDuration}
                    onChange={(e) => updateFitnessFields('workoutDuration', e.target.value)}
                  />
                </div>

                <div className="fitness-row">
                  <div className="fitness-label">Steps Counter</div>
                  <input 
                    type="number" 
                    className="fitness-input" 
                    placeholder="10000" 
                    value={fitnessData.steps}
                    onChange={(e) => updateFitnessFields('steps', e.target.value)}
                  />
                </div>
              </div>

              <div className="section-label" style={{ marginTop: '16px' }}>Activities</div>
              <ul className="checklist">
                {fitnessData.activities.map(activity => (
                  <li key={activity.id}>
                    <div className="checklist-item">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={activity.completed}
                        onChange={() => toggleFitnessActivity(activity.id)}
                      />
                      <span className={`priority-label ${activity.completed ? 'completed' : ''}`}>
                        {activity.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="dashboard-column">
            {/* Important Notes */}
            <div className="card" id="important-notes">
              <div className="card-header">
                <h2>Important Notes</h2>
              </div>
              
              <ul className="bullet-list">
                {notes.map(note => (
                  <li key={note.id}>
                    {note.text}
                    <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="input-group">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add new note..."
                  onKeyPress={(e) => e.key === 'Enter' && addNote()}
                />
                <button className="btn-icon" onClick={addNote}>+</button>
              </div>
            </div>
            
            {/* Clock Widget */}
            <div className="card" id="clock-widget">
              <div className="clock-container">
                <div className="hand hour-hand" ref={hourHandRef}></div>
                <div className="hand minute-hand" ref={minuteHandRef}></div>
                <div className="hand second-hand" ref={secondHandRef}></div>
                <div className="center-dot"></div>
                {[...Array(12)].map((_, i) => {
                  const angle = i * 30;
                  const radian = (angle - 90) * (Math.PI / 180);
                  const x = 50 + 40 * Math.cos(radian);
                  const y = 50 + 40 * Math.sin(radian);
                  return (
                    <div 
                      key={i}
                      className="number"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`
                      }}
                    >
                      {i === 0 ? 12 : i}
                    </div>
                  );
                })}
              </div>
              <div className="digital-time">{getFormattedTime()}</div>
            </div>
            
            {/* Weekly Tasks */}
            <div className="card" id="weekly-tasks">
              <div className="card-header">
                <h2>Weekly Tasks</h2>
              </div>
              
              <div className="section-label">Main Focus</div>
              
              <div className="tasks-table-container">
                <table id="tasks-table">
                  <thead>
                    <tr>
                      <th>To-Item</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Due Date</th>
                      <th>Time Left</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <tr key={task.id}>
                        <td>
                          <div className={`task-name ${task.completed ? 'completed' : ''}`}>
                            <input
                              type="checkbox"
                              className="task-checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                            />
                            {task.name}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${task.status}`}>
                            {getStatusLabel(task.status)}
                          </span>
                        </td>
                        <td className={`category-${task.category}`}>
                          {getCategoryLabel(task.category)}
                        </td>
                        <td>{formatDate(task.dueDate)}</td>
                        <td>{getDaysLeft(task.dueDate)} days</td>
                        <td>
                          <button 
                            className="delete-task-btn" 
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="action-section">
                <button className="btn-add-sm" onClick={() => setShowTaskModal(true)}>
                  New task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Bottom Row */}
        <div className="dashboard-row">
          
          {/* Mood Tracker */}
          <div className="card widget-card">
            <div className="card-header">
              <h2>😊 Mood Tracker</h2>
            </div>
            <div className="mood-tracker">
              <div className="mood-week">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                  <div className="mood-day" key={day}>
                    <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</div>
                    <div className="emoji-picker">
                      {['great', 'good', 'okay', 'low', 'bad'].map(m => (
                        <span 
                          key={m} 
                          className={`emoji ${moodData[day] === m ? 'selected' : ''}`}
                          onClick={() => setMoodData(prev => ({ ...prev, [day]: m }))}
                        >
                          {m === 'great' ? '😄' : m === 'good' ? '🙂' : m === 'okay' ? '😐' : m === 'low' ? '😔' : '😫'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mood-legend">
                😄 Great &nbsp; 🙂 Good &nbsp; 😐 Okay &nbsp; 😔 Low &nbsp; 😫 Bad
              </div>
              
              <div className="mood-trend-section">
                <div className="section-label" style={{marginBottom: '5px'}}>This Week's Trend</div>
                <div className="mood-trend-bar">
                  {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                    const valMap = { 'great': 5, 'good': 4, 'okay': 3, 'low': 2, 'bad': 1 };
                    const val = moodData[day] ? valMap[moodData[day]] : 0;
                    const height = val > 0 ? `${(val / 5) * 100}%` : '0%';
                    const colors = { 5: '#2ecc71', 4: '#27ae60', 3: '#f1c40f', 2: '#e67e22', 1: '#e74c3c' };
                    return (
                      <div className="trend-col" key={`trend-${day}`}>
                        <div 
                          className="trend-fill" 
                          style={{ height, backgroundColor: val > 0 ? colors[val] : '#eee' }}
                        ></div>
                        <div className="trend-day">{day.charAt(0).toUpperCase()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Finance Tracker */}
          <div className="card widget-card">
            <div className="card-header">
              <h2>💰 Finance Tracker</h2>
            </div>
            
            <div className="finance-summary">
              <div className="finance-box income">
                <div className="f-label">INCOME</div>
                <div className="f-val">₹{financeData.income}</div>
              </div>
              <div className="finance-box spent">
                <div className="f-label">SPENT</div>
                <div className="f-val">₹{getTotalSpent()}</div>
              </div>
              <div className="finance-box balance">
                <div className="f-label">BALANCE</div>
                <div className="f-val">₹{financeData.income - getTotalSpent()}</div>
              </div>
            </div>

            <div className="finance-form">
              <input 
                type="text" 
                placeholder="Description" 
                value={financeInput.description}
                onChange={e => setFinanceInput({...financeInput, description: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Amount" 
                value={financeInput.amount}
                onChange={e => setFinanceInput({...financeInput, amount: e.target.value})}
              />
              <select 
                value={financeInput.type}
                onChange={e => setFinanceInput({...financeInput, type: e.target.value})}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {financeInput.type === 'expense' && (
                <select 
                  value={financeInput.category}
                  onChange={e => setFinanceInput({...financeInput, category: e.target.value})}
                  style={{marginLeft: '0'}}
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                </select>
              )}
              <button onClick={handleFinanceSubmit} className="btn-add-sm btn-f-add">Add</button>
            </div>

            <div className="finance-budgets">
              <div className="section-label">Budget Usage</div>
              {['food', 'transport', 'shopping'].map(cat => {
                const spent = financeData.spent[cat];
                const limit = financeData.budgetLimits[cat];
                const perc = Math.min(100, Math.round((spent / limit) * 100)) || 0;
                let colorClass = 'progress-good';
                if (perc > 75) colorClass = 'progress-warning';
                if (perc >= 100) colorClass = 'progress-danger';
                
                return (
                  <div className="budget-row" key={cat}>
                    <div className="budget-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                    <div className="budget-bar-bg">
                      <div className={`budget-bar-fill ${colorClass}`} style={{width: `${perc}%`}}></div>
                    </div>
                    <div className="budget-perc">{perc}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="card widget-card">
            <div className="card-header">
              <h2>🍅 Pomodoro Timer</h2>
            </div>
            
            <div className="pomodoro-controls">
              <button 
                className={`pomo-btn ${pomodoro.mode === 'focus' ? 'active' : ''}`}
                onClick={() => setPomodoroMode('focus')}
              >Focus</button>
              <button 
                className={`pomo-btn ${pomodoro.mode === 'shortBreak' ? 'active' : ''}`}
                onClick={() => setPomodoroMode('shortBreak')}
              >Short Break</button>
              <button 
                className={`pomo-btn ${pomodoro.mode === 'longBreak' ? 'active' : ''}`}
                onClick={() => setPomodoroMode('longBreak')}
              >Long Break</button>
            </div>

            <div className="pomodoro-display">
              <div className="pomo-circle">
                <div className="pomo-time">{formatPomodoroTime(pomodoro.timeLeft)}</div>
                <div className="pomo-mode-label">{pomodoro.mode === 'focus' ? 'FOCUS' : 'BREAK'}</div>
              </div>
            </div>

            <div className="pomodoro-task">
              <input 
                type="text" 
                placeholder="What are you working on?" 
                value={pomodoro.taskName}
                onChange={e => setPomodoro(prev => ({...prev, taskName: e.target.value}))}
              />
            </div>

            <div className="pomodoro-actions">
              <button className="pomo-action-btn start-btn" onClick={togglePomodoro}>
                {pomodoro.isActive ? 'Pause' : 'Resume'}
              </button>
              <button className="pomo-action-btn reset-btn" onClick={resetPomodoro}>
                Reset
              </button>
            </div>
            
            <div className="pomo-footer">
              Sessions today: <span className="pomo-count">{pomodoro.sessionsCompleted}</span>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="card video-card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <h2>🎥 Focused Learning Videos</h2>
          </div>
          <div className="habit-video-grid">
            <iframe
              src="https://www.youtube.com/embed/AETFvQonfV8"
              allowFullScreen
              title="video0"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/Wcs2PFz5q6g"
              allowFullScreen
              title="video1"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/fH7N9YRxMYc"
              allowFullScreen
              title="video2"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/Hu4Yvq-g7_Y"
              allowFullScreen
              title="video3"
            ></iframe>
          </div>
        </div>
      </div>
      
      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Task</h3>
              <span className="close-modal" onClick={() => setShowTaskModal(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="task-name">Task Name</label>
                <input
                  type="text"
                  id="task-name"
                  name="name"
                  value={newTaskForm.name}
                  onChange={handleTaskFormChange}
                  placeholder="Enter task name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status"
                  value={newTaskForm.status}
                  onChange={handleTaskFormChange}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-category">Category</label>
                <select
                  id="task-category"
                  name="category"
                  value={newTaskForm.category}
                  onChange={handleTaskFormChange}
                >
                  <option value="personal">Personal</option>
                  <option value="work-school">Work/School</option>
                  <option value="health-wellness">Health & Wellness</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-due-date">Due Date</label>
                <input
                  type="date"
                  id="task-due-date"
                  name="dueDate"
                  value={newTaskForm.dueDate}
                  onChange={handleTaskFormChange}
                />
              </div>
              <button className="btn-primary" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HabitTracker;
