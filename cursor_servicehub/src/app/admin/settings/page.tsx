
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { jobCategories as initialCategories } from '@/lib/data';
import { PlusCircle, Trash2, List, Settings, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { addJobCategory, removeJobCategory } from '@/app/actions';

export default function AdminSettingsPage() {
  // This state is now just for the UI, the source of truth is the server data
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddCategory = () => {
    if (!newCategory) return;
    
    startTransition(async () => {
      const result = await addJobCategory(newCategory);
      if (result.success) {
        // Optimistically update UI
        setCategories(prev => [...prev, newCategory].sort());
        toast({
          title: 'Category Added',
          description: result.message,
        });
        setNewCategory('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    startTransition(async () => {
      // Optimistically update UI
      setCategories(prev => prev.filter((cat) => cat !== categoryToRemove));
      const result = await removeJobCategory(categoryToRemove);
      if (result.success) {
        toast({
          variant: 'destructive',
          title: 'Category Removed',
          description: result.message,
        });
      } else {
         // Revert on failure
        setCategories(initialCategories);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><Settings /> Admin Settings</h1>
      
      <Collapsible asChild defaultOpen>
        <Card>
          <div className="flex items-center justify-between pr-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><List /> Job Category Management</CardTitle>
              <CardDescription>Add, edit, or remove the job categories available for users and providers on the platform.</CardDescription>
            </CardHeader>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <CardContent className="space-y-6">
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="New category name..."
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        disabled={isPending}
                    />
                    <Button type="button" onClick={handleAddCategory} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Add Category
                    </Button>
                </div>

                <Alert>
                    <AlertTitle>Live Data</AlertTitle>
                    <AlertDescription>
                        Changes made here will permanently update the application's list of job categories.
                    </AlertDescription>
                </Alert>
                
                <div className="rounded-md border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center justify-between p-3 bg-card">
                                <span className="text-sm">{category}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemoveCategory(category)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete {category}</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
       <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Other global settings for the application will be available here in a future update.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2">
            <li>Branding (name, logo, contact info)</li>
            <li>Feature toggles (e.g., enable/disable AI suggestions)</li>
            <li>Usage limits (e.g., max bids per day)</li>
            <li>API Key Management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
