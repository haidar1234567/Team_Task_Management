import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Spinner } from '../components/ui/spinner';
import { Badge } from '../components/ui/badge';
import { Plus, Users, Search } from 'lucide-react';
import api from '../api/axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: { _id: string; name: string };
  members: { _id: string; name: string }[];
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Project State
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

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and view your team's projects.</p>
        </div>
        {user?.role === 'Admin' && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex items-center justify-between border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length} Members</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal - A simple overlay for MVP */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-lg border-2">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Add a new project for your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Title</label>
                  <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading ? <Spinner className="mr-2" /> : null}
                    Create
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
