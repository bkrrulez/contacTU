
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types';

export function UserProfile({ user }: { user: Partial<User> | null }) {
  if (!user || !user.name) {
    return  <Avatar className="h-9 w-9">
        <AvatarFallback>??</AvatarFallback>
    </Avatar>;
  }

  return (
    <Avatar className="h-9 w-9">
        {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.name} data-ai-hint="person portrait" />}
        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
  )
}
