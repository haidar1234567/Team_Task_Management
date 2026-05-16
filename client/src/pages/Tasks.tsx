import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignedTo: { _id: string; name: string };
  project: { _id: string; title: string };
}

interface Project {
  _id: string;
  title: string;
  members: { _id: string; name: string }[];
}

const columnVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const taskVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks?limit=100');
      setTasks(data.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (user?.role === 'Admin') {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/tasks', {
        title,
        description,
        status,
        priority,
        dueDate,
        project: projectId,
        assignedTo: assignedTo || null,
      });
      setShowCreateModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Low': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
      default: return 'text-white border-white/10';
    }
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your active assignments.</p>
        </div>
        {user?.role === 'Admin' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden pb-4">
          {columns.map((col) => (
            <motion.div 
              key={col} 
              variants={columnVariants} 
              initial="hidden" 
              animate="show"
              className="flex flex-col rounded-xl bg-black/20 border border-white/5 p-3 h-full overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4 px-2 pt-1">
                <h3 className="font-medium text-sm text-white flex items-center gap-2">
                  {col}
                  <span className="text-xs bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === col).length}</span>
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 px-1 custom-scrollbar">
                <AnimatePresence>
                  {tasks
                    .filter((t) => t.status === col)
                    .map((task) => (
                      <motion.div key={task._id} variants={taskVariants} layoutId={task._id} exit={{ opacity: 0, scale: 0.95 }}>
                        <Card className="cursor-grab hover:border-white/20 hover:bg-white/[0.02] shadow-none">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-medium text-sm text-white leading-snug">{task.title}</h4>
                              {user?.role === 'Admin' && (
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteTask(task._id);
                                  }} 
                                  className="text-muted-foreground hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-400/10 shrink-0"
                                  title="Delete Task"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            
                            <div className="flex items-center justify-between pt-3">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getPriorityStyle(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <div className="flex items-center text-[11px] text-muted-foreground gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                              
                              <select 
                                className="text-[11px] font-medium border border-white/10 rounded px-1.5 py-0.5 bg-black text-muted-foreground hover:text-white transition-colors cursor-pointer outline-none"
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                              >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg"
            >
              <Card className="shadow-2xl border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="p-6 pb-2 border-b border-white/5">
                  <h2 className="text-xl font-semibold text-white">Create Task</h2>
                </div>
                <CardContent className="p-6">
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Title</label>
                      <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Priority</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-white/20 transition-colors"
                          value={priority} onChange={(e) => setPriority(e.target.value)}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Due Date</label>
                        <Input type="date" className="[&::-webkit-calendar-picker-indicator]:filter-[invert(0.7)]" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Project</label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-white/20 transition-colors"
                        required value={projectId} onChange={(e) => setProjectId(e.target.value)}
                      >
                        <option value="">Select a project</option>
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    {projectId && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Assignee</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-white/20 transition-colors"
                          value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {projects.find(p => p._id === projectId)?.members.map(m => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                      <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createLoading}>
                        {createLoading ? <Spinner className="mr-2" /> : null}
                        Create Task
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
