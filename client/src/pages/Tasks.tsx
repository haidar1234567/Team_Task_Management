import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Spinner } from '../components/ui/spinner';
import { Plus, Calendar } from 'lucide-react';
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

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
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

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track task progress.</p>
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
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden pb-4">
          {columns.map((col) => (
            <div key={col} className="flex flex-col rounded-lg bg-muted/50 p-4 h-full overflow-hidden">
              <h3 className="font-semibold mb-4 text-sm flex items-center justify-between">
                {col}
                <Badge variant="secondary">{tasks.filter(t => t.status === col).length}</Badge>
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {tasks
                  .filter((t) => t.status === col)
                  .map((task) => (
                    <Card key={task._id} className="cursor-grab hover:border-primary/50 transition-colors">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                          <Badge variant={getPriorityColor(task.priority) as any} className="text-[10px] px-1.5 py-0">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                          
                          <select 
                            className="text-xs border rounded px-1 py-0.5 bg-background"
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
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-lg border-2 max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-2">
              <h2 className="text-xl font-bold">Create New Task</h2>
            </div>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={priority} onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Project</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    <label className="text-sm font-medium">Assign To</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {projects.find(p => p._id === projectId)?.members.map(m => (
                        <option key={m._id} value={m._id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
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
        </div>
      )}
    </div>
  );
}
