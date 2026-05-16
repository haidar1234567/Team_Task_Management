import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Plus, Users, Search, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: { _id: string; name: string };
  members: { _id: string; name: string }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/projects', { title, description });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and view your team's initiatives.</p>
        </div>
        {user?.role === 'Admin' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-9 bg-background border-white/10 focus-visible:border-white/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-sm text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <motion.div key={project._id} variants={itemVariants}>
              <Card className="flex flex-col h-full bg-black/40 hover:bg-black/60">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1.5">{project.description}</CardDescription>
                    </div>
                    {user?.role === 'Admin' && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteProject(project._id);
                        }} 
                        className="text-muted-foreground hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-400/10 shrink-0"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.members.length} Members</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    Active
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
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
              className="w-full max-w-md"
            >
              <Card className="shadow-2xl">
                <CardHeader>
                  <CardTitle>New Project</CardTitle>
                  <CardDescription>Create a new workspace for your team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Name</label>
                      <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Alpha" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <Input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the goals..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createLoading}>
                        {createLoading ? <Spinner className="mr-2" /> : null}
                        Create Project
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
