'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDoc, useMemoFirebase } from '@/firebase';
import { db } from '@/firebase/config';
import { doc } from 'firebase/firestore';
import type { User, Provider } from '@/types';

export default function PublicProfilePage({ params }: { params: { uid: string } }) {
  const userRef = useMemoFirebase(() => doc(db, 'users', params.uid), [params.uid]);
  const { data: user } = useDoc<User | Provider>(userRef);

  if (!user) return <div className="container mx-auto px-4 py-10">Profile not found.</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={(user as any).avatarUrl} />
              <AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground">{(user as Provider).skills?.join(', ')}</div>
              <div className="text-sm">{user.location}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

