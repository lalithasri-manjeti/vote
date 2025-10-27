import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import VoteResultsChart from '@/components/VoteResultsChart';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiService, Poll } from '@/services/apiService';

const PollDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await apiService.getPoll(id);
      setPoll(response.data.poll);
      
      if (user && response.data.poll.votedUsers.includes(user.id)) {
        setShowResults(true);
      }

      const isExpired = response.data.poll.expiresAt ? new Date(response.data.poll.expiresAt) < new Date() : false;
      if (isExpired) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to fetch poll:', error);
      toast({
        title: "Error",
        description: "Failed to load poll",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const hasVoted = user ? poll.votedUsers.includes(user.id) : false;
  const isExpired = poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;

  const handleVote = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to vote",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Select an option",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }

    if (hasVoted) {
      toast({
        title: "Already voted",
        description: "You have already voted on this poll",
        variant: "destructive",
      });
      return;
    }

    if (isExpired) {
      toast({
        title: "Poll expired",
        description: "This poll has expired",
        variant: "destructive",
      });
      return;
    }

    try {
      setVoting(true);
      const optionIndex = poll.options.findIndex(opt => opt.text === selectedOption);
      const response = await apiService.voteOnPoll(poll._id, optionIndex);
      
      setPoll(response.data.poll);
      setShowResults(true);

      toast({
        title: "Vote recorded!",
        description: "Thank you for voting",
      });
    } catch (error: any) {
      toast({
        title: "Vote failed",
        description: error.message || "Failed to record vote",
        variant: "destructive",
      });
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Polls
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <CardTitle className="text-3xl">{poll.question}</CardTitle>
              {isExpired && <Badge variant="destructive">Closed</Badge>}
              {hasVoted && !isExpired && <Badge variant="secondary">Voted</Badge>}
            </div>
            <CardDescription className="flex items-center gap-4 text-base">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {totalVotes} votes
              </span>
              {poll.expiresAt && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}`}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showResults && !isExpired ? (
              <>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {poll.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent transition-colors">
                      <RadioGroupItem value={option.text} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleVote} 
                    className="flex-1" 
                    size="lg"
                    disabled={voting || !selectedOption}
                  >
                    {voting ? 'Submitting Vote...' : 'Submit Vote'}
                  </Button>
                  {hasVoted && (
                    <Button onClick={() => setShowResults(true)} variant="outline" size="lg">
                      View Results
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Results</h3>
                  <VoteResultsChart data={poll.options} />
                </div>
                <div className="space-y-3">
                  {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : '0';
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{option.text}</span>
                          <span className="text-muted-foreground">{option.votes} votes ({percentage}%)</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-[hsl(291,64%,62%)] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {hasVoted && !isExpired && (
                  <Button onClick={() => setShowResults(false)} variant="outline" className="w-full">
                    Back to Poll
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PollDetails;
