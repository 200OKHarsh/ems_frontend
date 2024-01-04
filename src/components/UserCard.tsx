import { cn } from '@/lib/utils';

import { Album } from './dummy_data/albums';
import { Link } from 'react-router-dom';

interface UserData {
  id: number;
  name: string;
  position: string;
  image: string;
}

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserData;
  aspectRatio?: 'portrait' | 'square';
  width?: number;
  height?: number;
}

const UserCard = ({
  user,
  aspectRatio = 'portrait',
  width,
  height,
  className,
  ...props
}: UserCardProps) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <Link to={`/user/${user.id}`}>
        <div className="overflow-hidden rounded-md">
          <img
            src={`https://ems-server-mocha.vercel.app/${user.image}`}
            alt={user.name}
            width={width}
            height={height}
            className={cn(
              'h-auto w-auto object-cover transition-all hover:scale-105',
              aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
            )}
          />
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.position}</p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
