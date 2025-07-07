import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // To allow closing via an 'x' or cancel button
} from '@/components/ui/dialog'; // Assuming shadcn/ui Dialog
import { Button } from '@/components/ui/button';
import { CheckBadgeIcon } from '@heroicons/react/24/solid'; // Example, or use Lucide

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  benefits: string[];
  permissions: string[];
  onAuthorize: () => void;
  logo?: React.ReactNode;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  serviceName,
  benefits,
  permissions,
  onAuthorize,
  logo,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="items-center text-center">
          {logo && <div className="h-16 w-16 mb-3 flex items-center justify-center">{logo}</div>}
          <DialogTitle className="text-2xl font-semibold">Connect with {serviceName}</DialogTitle>
          <DialogDescription className="mt-1 text-muted-foreground">
            Authorize MaxiMost to access your {serviceName} data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1.5">Benefits of Connecting:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1.5">We will request the following permissions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {permissions.map((permission, index) => (
                <li key={index}>{permission}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground text-center pt-2">
            You can disconnect {serviceName} at any time from the Integrations page or your {serviceName} account settings. MaxiMost only requests read-only access.
          </p>
        </div>

        <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onAuthorize} className="bg-primary hover:bg-primary/90">
            Authorize with {serviceName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
