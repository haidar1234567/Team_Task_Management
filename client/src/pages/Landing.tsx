import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { ArrowRight, CheckCircle2, Circle, Clock, LayoutDashboard, LayoutList, MoreHorizontal } from 'lucide-react';

// Mock Data for the Showcase
const mockTasks = [
  { id: 1, title: 'Refactor Authentication Flow', status: 'In Progress', priority: 'High', date: 'Today' },
  { id: 2, title: 'Deploy Production Database', status: 'Done', priority: 'Critical', date: 'Yesterday' },
  { id: 3, title: 'Design System Update', status: 'To Do', priority: 'Medium', date: 'Tomorrow' },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground flex flex-col items-center justify-center bg-background">
      <AnimatedBackground />

      <main className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center text-center space-y-12 pt-16">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-medium text-muted-foreground shadow-sm"
        >
          Task.Nexus — Next Generation Productivity
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" as const }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Plan, build, and ship.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            A premium, structured task management platform designed for speed and clarity. Stop fighting your tools and start shipping.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full pt-4"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base group px-8">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="soft" size="lg" className="w-full text-base px-8">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Live Dashboard Preview Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" as const }}
          className="w-full max-w-5xl relative mt-16 perspective-[2000px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20 bottom-[-20px] pointer-events-none"></div>
          
          <div className="relative rounded-xl border border-white/10 bg-[#09090b] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row text-left">
            
            {/* Mock Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#09090b]/80 p-4 space-y-6">
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shadow-button-primary">
                  <span className="text-white text-[10px] font-bold">N</span>
                </div>
                <span className="text-sm font-semibold text-white">Task.Nexus</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-white/10 rounded-md">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
                  <LayoutList className="w-4 h-4" /> Active Projects
                </div>
              </div>
            </div>

            {/* Mock Main Area */}
            <div className="flex-1 p-6 md:p-8 bg-[#09090b] flex flex-col gap-8">
              
              {/* Header Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Active Tasks', value: '24', trend: '+12%' },
                  { label: 'Completed', value: '108', trend: '+5%' },
                  { label: 'Team Velocity', value: '92', trend: '+18%' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                    className="p-4 rounded-lg border border-white/5 bg-white/[0.02]"
                  >
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-white">{stat.value}</span>
                      <span className="text-xs text-emerald-400">{stat.trend}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mock Kanban/Task List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">Current Sprint</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
                </div>
                
                <div className="space-y-3">
                  {mockTasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + (i * 0.1) }}
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.04)' }}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {task.status === 'Done' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : task.status === 'In Progress' ? (
                          <Clock className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span>{task.date}</span>
                            <span>•</span>
                            <span className={
                              task.priority === 'Critical' ? 'text-red-400' :
                              task.priority === 'High' ? 'text-orange-400' : 'text-blue-400'
                            }>{task.priority}</span>
                          </div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
