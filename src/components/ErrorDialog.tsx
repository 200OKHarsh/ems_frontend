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

interface Error {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

const ErrorDialog = ({ title, message, open, onClose }: Error) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-red-500 text-red-500">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='text-red-500'>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button onClick={onClose} type="button" variant="destructive" className='m-auto w-1/2'>
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ErrorDialog