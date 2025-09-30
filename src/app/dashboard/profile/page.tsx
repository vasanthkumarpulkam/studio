import { getCurrentUser, getProvider } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Star } from 'lucide-react';

export default function ProfilePage() {
  const user = getCurrentUser();
  const provider = user.role === 'provider' ? getProvider(user.id) : null;

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge variant={user.role === 'customer' ? 'secondary' : 'default'} className="mx-auto mt-2">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent className="mt-4">
            {provider && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-1 text-2xl font-bold">
                        <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                        {provider.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">({provider.reviews} reviews)</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <p className="text-sm text-muted-foreground">Verification</p>
                    {provider.isVerified ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck />
                            <span className="font-semibold">Verified</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                             <div className="flex items-center gap-2 text-amber-600">
                                <ShieldAlert />
                                <span className="font-semibold">Not Verified</span>
                            </div>
                            <Button size="sm" variant="outline" className="mt-1">Start Verification</Button>
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
             <div className="text-center mt-8">
                <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
