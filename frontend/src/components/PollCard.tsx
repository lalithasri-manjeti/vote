import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Poll } from '@/services/apiService';

interface PollCardProps {
  poll: Poll;
  currentUserId?: string;
}

const PollCard = ({ poll, currentUserId }: PollCardProps) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const hasVoted = currentUserId ? poll.votedUsers.includes(currentUserId) : false;
  const isExpired = poll.expiresAt ? new Date(poll.expiresAt) < new Date() : false;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{poll.question}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {totalVotes} votes
              </span>
              {poll.expiresAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {isExpired ? 'Expired' : `Expires ${formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}`}
                </span>
              )}
            </CardDescription>
          </div>
          {isExpired && <Badge variant="destructive">Closed</Badge>}
          {hasVoted && !isExpired && <Badge variant="secondary">Voted</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant={hasVoted || isExpired ? "outline" : "default"}>
          <Link to={`/poll/${poll._id}`}>
            {hasVoted || isExpired ? 'View Results' : 'Vote Now'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PollCard;
