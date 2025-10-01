
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Blogs</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">About ServiceHub</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              Email: <a href="mailto:contact@servicehub.com" className="text-primary hover:underline">contact@servicehub.com</a>
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-6 h-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-6 h-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-6 h-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-6 h-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Youtube className="w-6 h-6" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
