import { db } from '@/lib/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export async function UserProfile() {
  // In a real app, you'd fetch the current user based on session
  const currentUser = await db.query.users.findFirst();
  
  if (!currentUser) {
    return  <Avatar className="h-9 w-9">
        <AvatarFallback>??</AvatarFallback>
    </Avatar>;
  }

  return (
    <Avatar className="h-9 w-9">
        {currentUser.avatar && <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="person portrait" />}
        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}
