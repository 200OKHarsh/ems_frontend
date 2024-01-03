import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Error {
  open: boolean;
  title: string;
  message?: string;
  isSubmit?: boolean;
  submitButton?: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: JSX.Element;
  bodyClass?: string;
}

const MainDialog = ({
  title,
  message,
  submitButton,
  open,
  onClose,
  onSubmit,
  children,
  bodyClass,
  isSubmit,
}: Error) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn('border', bodyClass)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
          {children}
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          {isSubmit && (
            <Button
              onClick={onSubmit}
              type="button"
              variant="outline"
              className="m-auto w-1/2"
            >
              {submitButton}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MainDialog;
