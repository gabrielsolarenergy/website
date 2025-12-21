import React, { useState } from 'react';
import { User, ThumbsUp, MessageSquare, Flag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
}

// Mock comments
const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Maria Popescu',
    content: 'Great article! Very informative. I learned a lot about solar panel efficiency and how it affects ROI.',
    date: '2024-02-08',
    likes: 12,
    replies: [
      {
        id: '1-1',
        author: 'Gabriel SOLAR ENERGY Team',
        content: 'Thank you Maria! We are glad you found it helpful. Feel free to reach out if you have any questions!',
        date: '2024-02-09',
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    author: 'Ion Ionescu',
    content: 'I was wondering about the maintenance costs mentioned. How often do panels need to be cleaned in Romania?',
    date: '2024-02-07',
    likes: 8,
    replies: [],
  },
  {
    id: '3',
    author: 'Ana Georgescu',
    content: 'This helped me make the decision to go solar. Thank you for the detailed explanation of the government subsidies!',
    date: '2024-02-05',
    likes: 15,
    replies: [],
  },
];

const BlogCommentSection = () => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Guest User',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast({
      title: "Comment posted",
      description: "Your comment has been added successfully.",
    });
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: 'Guest User',
      content: replyContent,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      replies: [],
    };

    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, reply] };
      }
      return c;
    }));

    setReplyingTo(null);
    setReplyContent('');
    toast({
      title: "Reply posted",
      description: "Your reply has been added successfully.",
    });
  };

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map(r => 
              r.id === commentId ? { ...r, likes: r.likes + 1 } : r
            ),
          };
        }
        return c;
      }));
    } else {
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ));
    }
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{comment.author}</span>
            {comment.author === 'Gabriel SOLAR ENERGY Team' && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                Official
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {new Date(comment.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-muted-foreground mb-3">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              {comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Reply
              </button>
            )}
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-4 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1"
              />
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  <Send className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply parentId={comment.id} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {/* New Comment Form */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h4 className="font-medium mb-4">Leave a Comment</h4>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="mb-4"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-card rounded-xl border border-border p-6">
            <CommentItem comment={comment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCommentSection;
