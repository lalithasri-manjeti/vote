import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import PollCard from '@/components/PollCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vote } from 'lucide-react';
import { apiService, Poll } from '@/services/apiService';

const Index = () => {
  const { user, loading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPolls();
  }, [user, activeTab]);

  const fetchPolls = async () => {
    try {
      setLoadingPolls(true);
      const type = activeTab === 'mine' ? 'mine' : activeTab === 'active' ? 'active' : 'all';
      const response = await apiService.getAllPolls(type);
      setPolls(response.data.polls);
    } catch (error) {
      console.error('Failed to fetch polls:', error);
    } finally {
      setLoadingPolls(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Vote className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const activePolls = polls.filter(poll => 
    !poll.expiresAt || new Date(poll.expiresAt) > new Date()
  );

  const myPolls = polls.filter(poll => poll.createdBy._id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Vote className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-[hsl(291,64%,62%)] bg-clip-text text-transparent">
              PollVote
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create polls, gather opinions, and make decisions together
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="all">All Polls</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="mine">My Polls</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loadingPolls ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading polls...</p>
              </div>
            ) : polls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No polls yet. Create the first one!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {polls.map(poll => (
                  <PollCard key={poll._id} poll={poll} currentUserId={user?.id} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {loadingPolls ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading polls...</p>
              </div>
            ) : activePolls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No active polls</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activePolls.map(poll => (
                  <PollCard key={poll._id} poll={poll} currentUserId={user?.id} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mine" className="space-y-4">
            {loadingPolls ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Loading polls...</p>
              </div>
            ) : !user ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Please login to see your polls</p>
              </div>
            ) : myPolls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">You haven't created any polls yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myPolls.map(poll => (
                  <PollCard key={poll._id} poll={poll} currentUserId={user?.id} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
